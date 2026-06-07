import crypto from 'crypto';
import { AppError } from '@/shared/utils/utils.AppError';
import { Order } from '@/shared/models/model.order';
import { Payment, PaymentStatus } from '@/shared/models/model.payment';
import { PaymentEvent } from '@/shared/models/model.paymentEvent';
import { IdempotencyKey } from '@/shared/models/model.idempotencyKey';
import sequelize from '@/config/dbConfig';

interface CreateOrderInput {
  amount: number;
  currency?: string;
  reference?: string;
}

interface InitiatePaymentInput {
  orderId: number;
  idempotencyKey?: string;
}

interface DummyWebhookInput {
  paymentId: number;
  status: 'success' | 'failed';
  eventId?: string;
  failureReason?: string;
  payload?: Record<string, unknown>;
}

const getRequestHash = (userId: number, orderId: number): string => {
  return crypto
    .createHash('sha256')
    .update(`${userId}:${orderId}`)
    .digest('hex');
};

const getEventId = (): string => `evt_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;

export class PaymentService {
  async createOrder(userId: number, payload: CreateOrderInput) {
    if (!payload.amount || payload.amount <= 0) {
      throw new AppError('Amount must be greater than 0', 400);
    }

    const order = await Order.create({
      userId,
      amount: payload.amount,
      currency: payload.currency || 'INR',
      reference: payload.reference || null,
      status: 'created',
    });

    return order.toJSON();
  }

  async initiatePayment(userId: number, payload: InitiatePaymentInput) {
    const order = await Order.findByPk(payload.orderId);
    if (!order || order.userId !== userId) {
      throw new AppError('Order not found', 404);
    }

    const existingSuccessfulPayment = await Payment.findOne({
      where: {
        userId,
        orderId: order.id,
        status: 'success',
      },
      order: [['id', 'DESC']],
    });

    if (existingSuccessfulPayment) {
      return {
        reused: true,
        payment: existingSuccessfulPayment.toJSON(),
      };
    }

    const idempotencyKey = payload.idempotencyKey?.trim();
    const requestHash = getRequestHash(userId, order.id);

    if (idempotencyKey) {
      const existingIdempotency = await IdempotencyKey.findOne({
        where: { userId, idempotencyKey },
      });

      if (existingIdempotency) {
        if (existingIdempotency.requestHash !== requestHash) {
          throw new AppError('Idempotency key reused with different request', 409);
        }

        return {
          reused: true,
          ...(existingIdempotency.responseBody as Record<string, unknown>),
        };
      }
    }

    const result = await sequelize.transaction(async (transaction) => {
      const providerPaymentId = `dummy_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

      const payment = await Payment.create(
        {
          orderId: order.id,
          userId,
          provider: 'dummy',
          providerPaymentId,
          amount: order.amount,
          currency: order.currency,
          status: 'initiated',
          metadata: {
            gateway: 'dummy',
          },
        },
        { transaction }
      );

      await PaymentEvent.create(
        {
          paymentId: payment.id,
          eventType: 'payment.initiated',
          eventId: getEventId(),
          payload: {
            paymentId: payment.id,
            providerPaymentId,
            status: 'initiated',
          },
          processedAt: new Date(),
        },
        { transaction }
      );

      await order.update({ status: 'pending' }, { transaction });

      return {
        payment: payment.toJSON(),
      };
    });

    if (idempotencyKey) {
      await IdempotencyKey.create({
        userId,
        idempotencyKey,
        requestHash,
        responseBody: result,
        statusCode: 201,
      });
    }

    return {
      reused: false,
      ...result,
    };
  }

  async processDummyWebhook(userId: number, payload: DummyWebhookInput) {
    const payment = await Payment.findByPk(payload.paymentId);
    if (!payment || payment.userId !== userId) {
      throw new AppError('Payment not found', 404);
    }

    const order = await Order.findByPk(payment.orderId);
    if (!order) {
      throw new AppError('Order not found for payment', 404);
    }

    const eventId = payload.eventId?.trim() || getEventId();

    const alreadyProcessed = await PaymentEvent.findOne({
      where: {
        eventId,
      },
    });

    if (alreadyProcessed) {
      return {
        duplicate: true,
        payment: payment.toJSON(),
        order: order.toJSON(),
      };
    }

    const mappedStatus: PaymentStatus = payload.status === 'success' ? 'success' : 'failed';

    const updated = await sequelize.transaction(async (transaction) => {
      await payment.update(
        {
          status: mappedStatus,
          failureReason: payload.status === 'failed' ? payload.failureReason || 'Payment failed' : null,
          metadata: {
            ...(payment.metadata || {}),
            webhook: payload.payload || {},
          },
        },
        { transaction }
      );

      await order.update(
        {
          status: payload.status === 'success' ? 'paid' : 'failed',
        },
        { transaction }
      );

      await PaymentEvent.create(
        {
          paymentId: payment.id,
          eventType: payload.status === 'success' ? 'payment.success' : 'payment.failed',
          eventId,
          payload: payload.payload || {
            paymentId: payment.id,
            status: payload.status,
          },
          processedAt: new Date(),
        },
        { transaction }
      );

      return {
        payment: payment.toJSON(),
        order: order.toJSON(),
      };
    });

    return {
      duplicate: false,
      ...updated,
    };
  }

  async getPayment(userId: number, paymentId: number) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment || payment.userId !== userId) {
      throw new AppError('Payment not found', 404);
    }

    return payment.toJSON();
  }

  async getOrder(userId: number, orderId: number) {
    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== userId) {
      throw new AppError('Order not found', 404);
    }

    return order.toJSON();
  }
}

export const paymentService = new PaymentService();

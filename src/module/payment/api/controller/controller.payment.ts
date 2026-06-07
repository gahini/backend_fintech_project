import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/shared/utils/utils.asyncHandler';
import { AppError } from '@/shared/utils/utils.AppError';
import { AuthRequest } from '@/shared/middleware/middleware.auth';
import { paymentService } from '@/module/payment/api/service/service.payment';

const getUserIdFromRequest = (req: AuthRequest): number => {
  const id = req.user?.id;
  if (typeof id !== 'number') {
    throw new AppError('Invalid token payload: user id missing', 401);
  }
  return id;
};

export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserIdFromRequest(req as AuthRequest);
  const order = await paymentService.createOrder(userId, req.body);
  res.status(201).json({ order });
});

export const initiatePayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserIdFromRequest(req as AuthRequest);
  const idempotencyKeyHeader = req.headers['x-idempotency-key'];
  const idempotencyKey = typeof idempotencyKeyHeader === 'string' ? idempotencyKeyHeader : undefined;

  const result = await paymentService.initiatePayment(userId, {
    orderId: Number(req.body.orderId),
    idempotencyKey,
  });

  res.status(201).json(result);
});

export const processDummyWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserIdFromRequest(req as AuthRequest);
  const result = await paymentService.processDummyWebhook(userId, {
    paymentId: Number(req.body.paymentId),
    status: req.body.status,
    eventId: req.body.eventId,
    failureReason: req.body.failureReason,
    payload: req.body.payload,
  });

  res.status(200).json(result);
});

export const getPaymentById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserIdFromRequest(req as AuthRequest);
  const payment = await paymentService.getPayment(userId, Number(req.params.id));
  res.status(200).json({ payment });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserIdFromRequest(req as AuthRequest);
  const order = await paymentService.getOrder(userId, Number(req.params.id));
  res.status(200).json({ order });
});

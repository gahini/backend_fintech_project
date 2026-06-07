// PaymentEvent model (webhook/audit trail)
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@/config/dbConfig';
import { Payment } from '@/shared/models/model.payment';

export interface PaymentEventAttributes {
  id: number;
  paymentId: number;
  eventType: string; // payment.created, payment.success, payment.failed
  eventId: string;   // unique event id to prevent replay duplication
  payload: Record<string, unknown>;
  processedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PaymentEventCreationAttributes = Optional<
  PaymentEventAttributes,
  'id' | 'processedAt' | 'createdAt' | 'updatedAt'
>;

export class PaymentEvent
  extends Model<PaymentEventAttributes, PaymentEventCreationAttributes>
  implements PaymentEventAttributes {
  public id!: number;
  public paymentId!: number;
  public eventType!: string;
  public eventId!: string;
  public payload!: Record<string, unknown>;
  public processedAt!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

    public static associate() {
    PaymentEvent.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });
    }
}

PaymentEvent.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    paymentId: { type: DataTypes.INTEGER, allowNull: false },
    eventType: { type: DataTypes.STRING, allowNull: false },
    eventId: { type: DataTypes.STRING, allowNull: false, unique: true },
    payload: { type: DataTypes.JSONB, allowNull: false },
    processedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'PaymentEvent',
    tableName: 'payment_events',
  }
);


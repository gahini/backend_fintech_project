// Payment model
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@/config/dbConfig';
import { Order } from '@/shared/models/model.order';
import { User } from '@/shared/models/models.user';

export type PaymentStatus = 'initiated' | 'pending' | 'success' | 'failed' | 'refunded';
export type PaymentProvider = 'dummy';

export interface PaymentAttributes {
  id: number;
  orderId: number;
  userId: number;
  provider: PaymentProvider;
  providerPaymentId: string; // fake id from dummy provider
  amount: number;
  currency: string;
  status: PaymentStatus;
  failureReason?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PaymentCreationAttributes = Optional<
  PaymentAttributes,
  'id' | 'status' | 'failureReason' | 'metadata' | 'createdAt' | 'updatedAt'
>;

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public orderId!: number;
  public userId!: number;
  public provider!: PaymentProvider;
  public providerPaymentId!: string;
  public amount!: number;
  public currency!: string;
  public status!: PaymentStatus;
  public failureReason!: string | null;
  public metadata!: Record<string, unknown> | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

    public static associate() {
    Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
    Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });  

}       
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    provider: { type: DataTypes.ENUM('dummy'), allowNull: false, defaultValue: 'dummy' },
    providerPaymentId: { type: DataTypes.STRING, allowNull: false, unique: true },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'INR' },
    status: {
      type: DataTypes.ENUM('initiated', 'pending', 'success', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'initiated',
    },
    failureReason: { type: DataTypes.STRING, allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
  }
);


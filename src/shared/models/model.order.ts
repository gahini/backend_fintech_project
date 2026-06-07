import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@/config/dbConfig';
import { User } from '@/shared/models/models.user';

export type OrderStatus = 'created' | 'pending' | 'paid' | 'failed' | 'cancelled';

export interface OrderAttributes {
  id: number;
  userId: number;
  amount: number; // store in smallest unit, e.g. paise/cents
  currency: string; // INR, USD
  status: OrderStatus;
  reference?: string | null; // your own order reference
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderCreationAttributes = Optional<OrderAttributes, 'id' | 'status' | 'reference' | 'createdAt' | 'updatedAt'>;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public currency!: string;
  public status!: OrderStatus;
  public reference!: string | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate() {
    Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  }
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'INR' },
    status: {
      type: DataTypes.ENUM('created', 'pending', 'paid', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'created',
    },
    reference: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  }
);


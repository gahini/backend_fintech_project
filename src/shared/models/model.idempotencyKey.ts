// IdempotencyKey model (recommended for safe retries)
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@/config/dbConfig';
import { User } from '@/shared/models/models.user';

export interface IdempotencyKeyAttributes {
  id: number;
  userId: number;
  idempotencyKey: string;
  requestHash: string;
  responseBody: Record<string, unknown>;
  statusCode: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IdempotencyKeyCreationAttributes = Optional<IdempotencyKeyAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class IdempotencyKey
  extends Model<IdempotencyKeyAttributes, IdempotencyKeyCreationAttributes>
  implements IdempotencyKeyAttributes {
  public id!: number;
  public userId!: number;
  public idempotencyKey!: string;
  public requestHash!: string;
  public responseBody!: Record<string, unknown>;
  public statusCode!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

IdempotencyKey.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    idempotencyKey: { type: DataTypes.STRING, allowNull: false },
    requestHash: { type: DataTypes.STRING, allowNull: false },
    responseBody: { type: DataTypes.JSONB, allowNull: false },
    statusCode: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: 'IdempotencyKey',
    tableName: 'idempotency_keys',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'idempotencyKey'],
      },
    ],
  }
);

IdempotencyKey.belongsTo(User, { foreignKey: 'userId', as: 'user' });
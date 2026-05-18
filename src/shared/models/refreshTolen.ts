import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/dbConfig';
import { User } from '@/shared/models/models.user'; // Import User model

export class RefreshToken extends Model {
  public id!: number;
  public token!: string;
  public userId!: number;
  public expiresAt!: Date;
}

RefreshToken.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    token: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: false,
  }
);

// Association: Each RefreshToken belongs to a User
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// Optionally, in your User model: User.hasMany(RefreshToken, { foreignKey: 'userId' });

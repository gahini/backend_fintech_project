import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/dbConfig';
import { Role } from '@/shared/models/models.role';
import { RefreshToken } from '@/shared/models/refreshTolen';

import {
  UserAttributes,
  UserCreationAttributes
} from '@/shared/types/types.user';

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {

  public id!: number;
  public email!: string;
  public password!: string;
  public roleId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

   public static associate() {
    User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
    User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  }
);


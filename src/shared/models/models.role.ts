import { Model, DataTypes } from 'sequelize';
import sequelize from '@/config/dbConfig';

export class Role extends Model {
	public id!: number;
	public name!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Role.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		modelName: 'Role',
		tableName: 'roles',
	}
);

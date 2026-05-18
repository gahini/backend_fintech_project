export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  roleId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Partial<UserAttributes> {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
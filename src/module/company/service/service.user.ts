import { User } from '@/shared/models/models.user';
import { UserAttributes, UserCreationAttributes } from '@/shared/types/types.user';
import { AppError } from '@/shared/utils/utils.AppError';
import bcrypt from 'bcrypt';
import { signJwtToken } from '@/shared/utils/utils.jwt';

import crypto from 'crypto';
import { RefreshToken } from '@/shared/models/refreshTolen';


export class UserService {
  async createUser(data: UserCreationAttributes): Promise<UserAttributes> {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await User.create(data);
    if (!user) throw new AppError('Failed to create user', 400);
    const userObj = user.toJSON();
    (userObj as Partial<UserAttributes>).password = undefined;
    return userObj;
  }

  async loginUser(email: string, password: string): Promise<{ token: string; refreshToken: string; user: UserAttributes }> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError('Invalid email or password', 401);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);
    const token = signJwtToken({ id: user.id, email: user.email, roleId: user.roleId });
    const refreshToken = await generateRefreshToken(user.id);
    const userObj = user.toJSON();
    (userObj as Partial<UserAttributes>).password = undefined;
    return { token, refreshToken, user: userObj };
  }

  async getAllUsers(): Promise<UserAttributes[]> {
    const users = await User.findAll();
    return users.map(u => u.toJSON());
  }

  async getUser(id: number): Promise<UserAttributes | null> {
    const user = await User.findByPk(id);
    return user ? user.toJSON() : null;
  }

  async updateUser(id: number, data: Partial<UserCreationAttributes>): Promise<UserAttributes | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data);
    return user.toJSON();
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }
}

// Utility to generate and store refresh token
export async function generateRefreshToken(userId: number): Promise<string> {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await RefreshToken.create({ token, userId, expiresAt });
  return token;
}

export const userService = new UserService();
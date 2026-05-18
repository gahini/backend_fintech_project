import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/shared/utils/utils.asyncHandler';
import { AppError } from '@/shared/utils/utils.AppError';
import { userService, generateRefreshToken } from '../service/service.user';
import { RefreshToken } from '@/shared/models/refreshTolen';
import { signJwtToken } from '@/shared/utils/utils.jwt';

// Create User
export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ user });
});

// Login User
export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }
  const { token, refreshToken, user } = await userService.loginUser(email, password);
  res.status(200).json({ token, refreshToken, user });
});

// Refresh token endpoint
export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token is required' });
    return;
  }
  const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
    return;
  }
  const userId = storedToken.userId;
  const accessToken = signJwtToken({ id: userId });
  res.json({ token: accessToken });
});

// Get All Users
export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ users });
});

// Get Single User
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await userService.getUser(Number(req.params.id));
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({ user });
});

// Update User
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const updatedUser = await userService.updateUser(Number(req.params.id), req.body);
  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({ user: updatedUser });
});

// Delete User
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const deleted = await userService.deleteUser(Number(req.params.id));
  if (!deleted) {
    return next(new AppError('User not found', 404));
  }
  res.status(204).send();
});
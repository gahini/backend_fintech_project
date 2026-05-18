import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from '@/shared/env';

// Extend Express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}

export const verifyJwtToken = (token: string): JwtPayload => {
  if (!JWT_PUBLIC_KEY?.trim()) {
    throw new Error('JWT public key is not configured.');
  }

  try {
    const options: jwt.VerifyOptions = {
      algorithms: ['RS256'],
    };
    return jwt.verify(token, JWT_PUBLIC_KEY, options) as JwtPayload;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw new Error('Invalid or expired authentication token.');
  }
};

export const signJwtToken = (payload: object): string => {
  if (!JWT_PRIVATE_KEY?.trim()) {
    throw new Error('JWT private key is not configured.');
  }

  try {
    const options: jwt.SignOptions = {
      algorithm: 'RS256',
      expiresIn: '8h',
    };
    return jwt.sign(payload, JWT_PRIVATE_KEY, options);
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Failed to generate authentication token.');
  }
};

// Express middleware to protect routes
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyJwtToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}   
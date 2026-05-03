import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { IUser } from '../models/User.js';

export interface AccessPayload {
  userId: string;
  role: string;
}

export function signAccessToken(user: IUser): string {
  const payload = { userId: user._id.toString(), role: user.role };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function signRefreshToken(user: IUser): string {
  const payload = { userId: user._id.toString() };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): { userId: string } {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId?: string };
  if (!decoded.userId) throw new Error('Invalid refresh token');
  return { userId: decoded.userId };
}

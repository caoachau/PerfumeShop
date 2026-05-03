import { Request, Response } from 'express';
import User, { type IAddress } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwtTokens.js';

const REFRESH_COOKIE = 'refresh_token';

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

async function sanitizeUser(doc: InstanceType<typeof User>) {
  const u = doc.toJSON();
  delete (u as { password?: string }).password;
  delete (u as { refreshToken?: string }).refreshToken;
  return u;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body as {
    name: string;
    email: string;
    phone?: string;
    password: string;
  };

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError(409, 'Email already registered');

  const user = await User.create({ name, email, phone, password });
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());

  res.status(201).json({
    success: true,
    accessToken,
    user: await sanitizeUser(user),
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new AppError(401, 'Invalid credentials');

  const ok = await user.comparePassword(password);
  if (!ok) throw new AppError(401, 'Invalid credentials');
  if (!user.isActive) throw new AppError(403, 'Account disabled');

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());

  res.json({
    success: true,
    accessToken,
    user: await sanitizeUser(user),
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token =
    typeof req.cookies?.[REFRESH_COOKIE] === 'string' ? req.cookies[REFRESH_COOKIE] : null;

  if (!token) throw new AppError(401, 'Refresh token missing');

  let userId: string;
  try {
    ({ userId } = verifyRefreshToken(token));
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(userId);
  if (!user?.isActive) throw new AppError(401, 'User not found');

  const accessToken = signAccessToken(user);
  res.json({
    success: true,
    accessToken,
    user: await sanitizeUser(user),
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
  res.json({ success: true, message: 'Logged out' });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const u = req.user as InstanceType<typeof User>;
  res.json({ success: true, user: await sanitizeUser(u) });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as InstanceType<typeof User>;
  const { name, phone, avatar, addresses } = req.body as {
    name?: string;
    phone?: string | null;
    avatar?: string | null;
    addresses?: Array<{
      label: string;
      street: string;
      ward: string;
      district: string;
      province: string;
      isDefault?: boolean;
    }>;
  };

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone ?? undefined;
  if (avatar !== undefined) user.avatar = avatar ?? undefined;
  if (addresses !== undefined) {
    user.addresses = addresses.map(
      (a): IAddress => ({
        label: a.label,
        street: a.street,
        ward: a.ward,
        district: a.district,
        province: a.province,
        isDefault: a.isDefault ?? false,
      }),
    );
  }

  await user.save();

  res.json({ success: true, user: await sanitizeUser(user) });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword: string;
    newPassword: string;
  };

  const user = await User.findById((req.user as InstanceType<typeof User>)._id).select('+password');
  if (!user) throw new AppError(404, 'User not found');

  const ok = await user.comparePassword(currentPassword);
  if (!ok) throw new AppError(401, 'Current password incorrect');

  user.password = newPassword;
  await user.save();

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());

  res.json({
    success: true,
    accessToken,
    user: await sanitizeUser(user),
  });
});

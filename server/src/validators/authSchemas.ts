import { z } from 'zod';

const addressSchema = z.object({
  label: z.string().min(1).max(100),
  street: z.string().min(1).max(200),
  ward: z.string().min(1).max(100),
  district: z.string().min(1).max(100),
  province: z.string().min(1).max(100),
  isDefault: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  avatar: z.string().max(2048).optional().nullable(),
  addresses: z.array(addressSchema).max(10).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100),
});

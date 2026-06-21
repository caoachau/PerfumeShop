import { z } from 'zod';

const shippingAddressSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(20),
  email: z
    .union([z.string().trim().email(), z.literal('')])
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : v)),
  street: z.string().trim().min(1).max(300),
  ward: z.string().trim().min(1).max(120),
  district: z.string().trim().min(1).max(120),
  province: z.string().trim().min(1).max(120),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  /** VND — mặc định server 30k; tối đa 2tr (quá sẽ clamp) */
  shippingFee: z.number().min(0).max(2_000_000).optional(),
  paymentMethod: z.enum(['cod', 'bank_transfer']),
  note: z.string().trim().max(500).optional().transform((s) => (s === '' ? undefined : s)),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;

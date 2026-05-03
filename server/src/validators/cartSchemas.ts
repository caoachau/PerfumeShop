import { z } from 'zod';
import mongoose from 'mongoose';

export const addCartItemSchema = z.object({
  variantId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  qty: z.number().int().min(1),
  engravingText: z.string().max(30).optional().nullable(),
});

export const updateCartItemSchema = z.object({
  qty: z.number().int().min(1),
  engravingText: z.string().max(30).optional().nullable(),
});

export const syncCartSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
      qty: z.number().int().min(1),
      engravingText: z.string().max(30).optional().nullable(),
    }),
  ),
});

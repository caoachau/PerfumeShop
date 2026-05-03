import { z } from 'zod';
import mongoose from 'mongoose';

export const createReviewSchema = z.object({
  productId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  variantId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  images: z.array(z.string().url()).max(6).optional().default([]),
});

import { z } from 'zod';
import mongoose from 'mongoose';

export const adminProductVariantInput = z.object({
  sku: z.string().min(1).max(64),
  size: z.string().min(1).max(32),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional().nullable(),
  stock: z.number().min(0).default(0),
  isActive: z.boolean().optional(),
});

export const adminCreateProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(240).optional(),
  brandId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  categoryId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id)),
  fragranceFamily: z.enum([
    'Floral',
    'Woody',
    'Fresh',
    'Oriental',
    'Gourmand',
    'Citrus',
    'Aquatic',
    'Aromatic',
  ]),
  concentration: z.enum(['EDT', 'EDP', 'EDP Intense', 'Parfum', 'EDC']),
  gender: z.enum(['male', 'female', 'unisex']).optional(),
  season: z
    .array(z.enum(['spring', 'summer', 'autumn', 'winter', 'all']))
    .optional()
    .default([]),
  images: z.array(z.string().url()).max(20).optional().default([]),
  topNotes: z.array(z.string()).optional().default([]),
  heartNotes: z.array(z.string()).optional().default([]),
  baseNotes: z.array(z.string()).optional().default([]),
  description: z.string().max(5000).optional().default(''),
  isEngravable: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  variants: z.array(adminProductVariantInput).min(1),
});

export const adminUpdateProductSchema = adminCreateProductSchema.partial().omit({ variants: true });

export const adminAddVariantSchema = adminProductVariantInput;

export const adminUpdateVariantSchema = adminProductVariantInput.partial();

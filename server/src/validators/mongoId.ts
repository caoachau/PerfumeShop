import { z } from 'zod';
import mongoose from 'mongoose';

export const objectIdSchema = z.string().refine(
  (s) => mongoose.Types.ObjectId.isValid(s),
  'Invalid ObjectId',
);

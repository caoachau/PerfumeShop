import { Request, Response } from 'express';
import Brand from '../models/Brand.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listBrands = asyncHandler(async (_req: Request, res: Response) => {
  const data = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();
  res.json({ success: true, data });
});

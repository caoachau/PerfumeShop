import { Request, Response } from 'express';
import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
  const roots = rows.filter((c: { parentCategory?: unknown }) => !c.parentCategory);
  const childrenOf = (parentId: string) =>
    rows.filter(
      (c: { parentCategory?: { toString: () => string } }) =>
        c.parentCategory && String(c.parentCategory) === parentId,
    );

  const tree = roots.map((r) => ({
    ...r,
    children: childrenOf(String(r._id)),
  }));

  res.json({ success: true, data: tree });
});

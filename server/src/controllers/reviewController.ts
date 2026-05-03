import { Request, Response } from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Variant from '../models/Variant.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const { productId, variantId, rating, comment, images } = req.body as {
    productId: string;
    variantId: string;
    rating: number;
    comment?: string;
    images?: string[];
  };

  const product = await Product.findById(productId);
  if (!product?.isActive) throw new AppError(404, 'Product not found');

  const variant = await Variant.findById(variantId);
  if (!variant?.isActive || String(variant.product) !== productId) {
    throw new AppError(400, 'Invalid variant for product');
  }

  const exists = await Review.findOne({ product: productId, user: userId });
  if (exists) throw new AppError(409, 'You already reviewed this product');

  const review = await Review.create({
    product: productId,
    user: userId,
    variant: variantId,
    rating,
    comment,
    images: images ?? [],
    isApproved: false,
  });

  await review.populate('product', 'name slug images');
  res.status(201).json({ success: true, data: review });
});

export const listMyReviews = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const rows = await Review.find({ user: userId })
    .populate('product', 'name slug images')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data: rows });
});

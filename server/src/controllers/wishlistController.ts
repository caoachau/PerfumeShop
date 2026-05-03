import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import mongoose from 'mongoose';
import { routeParam } from '../utils/routeParam.js';

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;

  let list = await Wishlist.findOne({ user: userId }).populate({
    path: 'products.product',
    populate: [{ path: 'brand' }],
  });

  if (!list) list = await Wishlist.create({ user: userId, products: [] });

  const sorted = [...(list.products as any[])].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );

  res.json({
    success: true,
    data: sorted.map((p) => p.product),
  });
});

export const addWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const productId = routeParam(req.params.productId);
  if (!mongoose.Types.ObjectId.isValid(productId)) throw new AppError(400, 'Invalid product id');

  const product = await Product.findById(productId);
  if (!product?.isActive) throw new AppError(404, 'Product not found');

  let list = await Wishlist.findOne({ user: userId });
  if (!list) list = await Wishlist.create({ user: userId, products: [] });

  const exists = (list.products as any[]).some((row) => String(row.product) === productId);

  if (!exists) list.products.push({ product: product._id as never, addedAt: new Date() } as never);
  list.markModified('products');

  await list.save();
  await list.populate({ path: 'products.product', populate: [{ path: 'brand' }] });

  const sorted = [...(list.products as any[])].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );

  res.json({
    success: true,
    data: sorted.map((p) => p.product),
  });
});

export const removeWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const productId = routeParam(req.params.productId);

  let list = await Wishlist.findOne({ user: userId });
  if (!list) list = await Wishlist.create({ user: userId, products: [] });

  list.products = (list.products as any[]).filter((row) => String(row.product) !== productId) as never[];
  list.markModified('products');
  await list.save();

  await list.populate({ path: 'products.product', populate: [{ path: 'brand' }] });

  const sorted = [...(list.products as any[])].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );

  res.json({
    success: true,
    data: sorted.map((p) => p.product),
  });
});

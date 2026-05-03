import { Request, Response } from 'express';
import { routeParam } from '../utils/routeParam.js';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Variant from '../models/Variant.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

async function getVariantWithProduct(variantId: string) {
  const variant = await Variant.findById(variantId).populate('product').exec();
  if (!variant?.product) throw new AppError(404, 'Variant not found');
  return variant as typeof variant & {
    product: InstanceType<typeof Product>;
  };
}

function enrichCart(items: mongoose.Types.ArraySubdocument[]) {
  return items.map((line: any) => {
    const v = line.variant;
    const product = v?.product;
    return {
      _id: line._id,
      variantId: v?._id,
      qty: line.qty,
      engravingText: line.engravingText ?? undefined,
      variant: v,
      product,
    };
  });
}

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.variant',
    populate: { path: 'product', populate: ['brand'] },
  });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  res.json({
    success: true,
    data: { items: enrichCart(cart.items as unknown as mongoose.Types.ArraySubdocument[]) },
  });
});

export const addCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const body = req.body as {
    variantId?: unknown;
    qty?: unknown;
    engravingText?: string | null;
  };
  const variantId = routeParam(body.variantId);
  const qty = Number(body.qty);
  const engravingRaw = body.engravingText;

  if (!variantId) throw new AppError(400, 'variantId required');
  if (!Number.isFinite(qty) || qty < 1) throw new AppError(400, 'Invalid qty');

  const variant = await getVariantWithProduct(variantId);
  if (!variant.isActive) throw new AppError(400, 'Variant not available');
  const product = variant.product;
  if (!product.isActive) throw new AppError(400, 'Product not available');
  if (qty > variant.stock) throw new AppError(400, 'Not enough stock');
  let et =
    engravingRaw !== null && engravingRaw !== undefined
      ? String(engravingRaw).trim().slice(0, 30)
      : '';
  if (et.length > 0 && !product.isEngravable) throw new AppError(400, 'Engraving not available for this product');

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const sid = variant._id.toString();
  const idx = cart.items.findIndex((i: any) => String(i.variant) === sid);

  if (idx >= 0) {
    const existing = cart.items[idx]!;
    const nextQty = Math.min(existing.qty + qty, variant.stock);
    existing.qty = nextQty;
    if (product.isEngravable) existing.engravingText = et || existing.engravingText;
    cart.markModified('items');
  } else {
    cart.items.push({
      variant: variant._id as never,
      qty,
      engravingText: product.isEngravable && et ? et : undefined,
    } as never);
  }

  await cart.save();
  const fresh = await Cart.findById(cart._id).populate({
    path: 'items.variant',
    populate: { path: 'product', populate: ['brand'] },
  });
  res.status(200).json({
    success: true,
    data: { items: enrichCart(fresh!.items as unknown as mongoose.Types.ArraySubdocument[]) },
  });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const variantId = routeParam(req.params.variantId);
  const { qty, engravingText } = req.body as { qty?: number; engravingText?: string | null };

  const variant = await getVariantWithProduct(variantId);
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const sid = variant._id.toString();
  const idx = cart.items.findIndex((i: any) => String(i.variant) === sid);
  if (idx < 0) throw new AppError(404, 'Cart line not found');

  const q = qty ?? (cart.items[idx] as any).qty;
  if (q < 1) throw new AppError(400, 'Invalid quantity');
  if (q > variant.stock) throw new AppError(400, 'Not enough stock');

  (cart.items[idx] as any).qty = q;
  if (engravingText !== undefined && variant.product.isEngravable) {
    const et = (engravingText ?? '').toString().trim().slice(0, 30);
    (cart.items[idx] as any).engravingText = et || undefined;
  }
  cart.markModified('items');
  await cart.save();

  const fresh = await Cart.findById(cart._id).populate({
    path: 'items.variant',
    populate: { path: 'product', populate: ['brand'] },
  });
  res.json({
    success: true,
    data: { items: enrichCart(fresh!.items as unknown as mongoose.Types.ArraySubdocument[]) },
  });
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const variantId = routeParam(req.params.variantId);
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  cart.items = cart.items.filter((i: any) => String(i.variant) !== variantId);
  cart.markModified('items');
  await cart.save();

  const fresh = await Cart.findById(cart._id).populate({
    path: 'items.variant',
    populate: { path: 'product', populate: ['brand'] },
  });
  res.json({
    success: true,
    data: { items: enrichCart(fresh!.items as unknown as mongoose.Types.ArraySubdocument[]) },
  });
});

export const syncCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const incoming = req.body.items as Array<{
    variantId: string;
    qty: number;
    engravingText?: string | null;
  }>;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const mergedMap = new Map<string, { variantId: string; qty: number; engravingText?: string }>();

  for (const existing of cart.items as any[]) {
    const vid = String(existing.variant);
    const cur =
      mergedMap.get(vid) ?? { variantId: vid, qty: 0, engravingText: existing.engravingText };
    cur.qty = Math.max(cur.qty, existing.qty);
    if (!cur.engravingText && existing.engravingText) cur.engravingText = existing.engravingText;
    mergedMap.set(vid, cur);
  }

  for (const item of incoming) {
    const cur = mergedMap.get(item.variantId) ?? {
      variantId: item.variantId,
      qty: 0,
      engravingText: item.engravingText ?? undefined,
    };
    cur.qty = Math.max(cur.qty, item.qty);
    if (!cur.engravingText && item.engravingText) cur.engravingText = item.engravingText ?? undefined;
    mergedMap.set(item.variantId, cur);
  }

  const lines: Array<{ variant: mongoose.Types.ObjectId; qty: number; engravingText?: string }> = [];

  for (const [, line] of mergedMap) {
    const variant = await getVariantWithProduct(line.variantId);
    const q = Math.min(line.qty, variant.stock);
    if (q < 1) continue;
    const product = variant.product;
    let et = (line.engravingText ?? '').trim().slice(0, 30);
    lines.push({
      variant: variant._id,
      qty: q,
      engravingText: product.isEngravable && et ? et : undefined,
    });
  }

  cart.items = lines as any;
  cart.markModified('items');
  await cart.save();

  const fresh = await Cart.findById(cart._id).populate({
    path: 'items.variant',
    populate: { path: 'product', populate: ['brand'] },
  });
  res.json({
    success: true,
    data: { items: enrichCart(fresh!.items as unknown as mongoose.Types.ArraySubdocument[]) },
  });
});

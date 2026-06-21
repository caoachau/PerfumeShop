import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Variant from '../models/Variant.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { routeParam } from '../utils/routeParam.js';
import type { CreateOrderBody } from '../validators/orderSchemas.js';

const DEFAULT_SHIPPING_FEE_VND = 30_000;
const MAX_ORDER_SHIPPING_VND = 2_000_000;

function unitPrice(variant: { price: number; salePrice?: number | null }): number {
  if (variant.salePrice != null && variant.salePrice > 0 && variant.salePrice < variant.price) {
    return variant.salePrice;
  }
  return variant.price;
}

function sanitizeShipping(addr: CreateOrderBody['shippingAddress']) {
  return {
    name: addr.name.trim(),
    phone: addr.phone.trim(),
    ...(addr.email ? { email: addr.email.trim() } : {}),
    street: addr.street.trim(),
    ward: addr.ward.trim(),
    district: addr.district.trim(),
    province: addr.province.trim(),
  };
}

/** Tạo đơn từ giỏ Mongo + thanh toán pending. Cần replica set (Atlas M0 ok). */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const body = req.body as CreateOrderBody;

  const shippingFee = Math.min(
    body.shippingFee ?? DEFAULT_SHIPPING_FEE_VND,
    MAX_ORDER_SHIPPING_VND,
  );

  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.variant',
    populate: { path: 'product', model: Product },
  });
  const rawItems = cart?.items as unknown as Array<{
    qty: number;
    engravingText?: string | null;
    variant?: InstanceType<typeof Variant> & { product?: InstanceType<typeof Product> };
  }> | undefined;

  if (!cart || !rawItems?.length) {
    throw new AppError(400, 'Cart is empty');
  }

  const orderLines: Array<{
    variant: mongoose.Types.ObjectId;
    productName: string;
    variantSize: string;
    qty: number;
    unitPrice: number;
    engravingText?: string;
  }> = [];

  for (const line of rawItems) {
    const v = line.variant;
    const product = v?.product;
    if (!v || !product) {
      throw new AppError(400, 'Cart contains invalid variant');
    }
    if (!v.isActive || !product.isActive) {
      throw new AppError(400, `Unavailable: ${product.name}`);
    }
    if (line.qty < 1 || line.qty > v.stock) {
      throw new AppError(
        400,
        `Insufficient stock for ${product.name} (${v.size}). Available: ${v.stock}`,
      );
    }

    let et = (line.engravingText ?? '').toString().trim().slice(0, 30);
    if (et && !product.isEngravable) {
      throw new AppError(400, 'Engraving not allowed for cart line');
    }

    orderLines.push({
      variant: v._id,
      productName: product.name,
      variantSize: v.size,
      qty: line.qty,
      unitPrice: unitPrice(v),
      ...(et ? { engravingText: et } : {}),
    });
  }

  const subtotal = orderLines.reduce((s, line) => s + line.unitPrice * line.qty, 0);
  const discount = 0;
  const finalTotal = subtotal - discount + shippingFee;

  if (finalTotal < 0) {
    throw new AppError(400, 'Invalid totals');
  }

  const shippingAddress = sanitizeShipping(body.shippingAddress);
  const session = await mongoose.startSession();
  let committed = false;

  try {
    session.startTransaction();

    for (const line of orderLines) {
      const updated = await Variant.findOneAndUpdate(
        {
          _id: line.variant,
          isActive: true,
          stock: { $gte: line.qty },
        },
        { $inc: { stock: -line.qty } },
        { session, new: true },
      );
      if (!updated) {
        throw new AppError(
          409,
          `Could not reserve stock for variant ${line.variant.toString()} (race or insufficient stock)`,
        );
      }
    }

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: orderLines,
          shippingAddress,
          shippingFee,
          subtotal,
          discount,
          finalTotal,
          orderStatus: 'pending',
          note: body.note ?? undefined,
        },
      ],
      { session },
    );

    await Payment.create(
      [
        {
          order: order!._id,
          method: body.paymentMethod,
          status: 'pending',
          amount: finalTotal,
        },
      ],
      { session },
    );

    cart.items = [];
    cart.markModified('items');
    await cart.save({ session });

    await session.commitTransaction();
    committed = true;

    await order!.populate([
      { path: 'items.variant', select: 'sku price salePrice stock' },
      { path: 'user', select: 'name email' },
    ]);

    const payment = await Payment.findOne({ order: order!._id }).lean();

    res.status(201).json({
      success: true,
      data: {
        order: order!.toJSON(),
        payment,
      },
    });
  } catch (err) {
    if (!committed) {
      await session.abortTransaction().catch(() => undefined);
    }
    throw err;
  } finally {
    await session.endSession();
  }
});

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('items orderStatus finalTotal shippingFee createdAt')
      .lean(),
    Order.countDocuments({ user: userId }),
  ]);

  res.json({
    success: true,
    data: orders,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getMyOrderById = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as InstanceType<typeof User>)._id;
  const id = routeParam(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid order id');
  }

  const order = await Order.findOne({ _id: id, user: userId })
    .populate({ path: 'items.variant', select: 'sku' })
    .lean();

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  const payment = await Payment.findOne({ order: order._id }).lean();

  res.json({
    success: true,
    data: { ...order, payment },
  });
});

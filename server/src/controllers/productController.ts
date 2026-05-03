import { FilterQuery } from 'mongoose';
import slugify from 'slugify';
import { Request, Response } from 'express';
import Product from '../models/Product.js';
import Variant from '../models/Variant.js';
import Review from '../models/Review.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getEffectivePrice } from '../utils/price.js';
import { isValidObjectId } from '../utils/mongooseId.js';
import {
  adminAddVariantSchema,
  adminCreateProductSchema,
  adminUpdateProductSchema,
  adminUpdateVariantSchema,
} from '../validators/productSchemas.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import mongoose from 'mongoose';
import { routeParam } from '../utils/routeParam.js';

const listQuerySchema = (q: Record<string, unknown>) => ({
  page: Math.max(1, Number(q.page) || 1),
  limit: Math.min(50, Math.max(1, Number(q.limit) || 12)),
  category: typeof q.category === 'string' ? q.category : undefined,
  brand: typeof q.brand === 'string' ? q.brand : undefined,
  fragranceFamily: typeof q.fragranceFamily === 'string' ? q.fragranceFamily : undefined,
  gender: typeof q.gender === 'string' ? q.gender : undefined,
  minPrice: q.minPrice !== undefined && q.minPrice !== '' ? Number(q.minPrice) : undefined,
  maxPrice: q.maxPrice !== undefined && q.maxPrice !== '' ? Number(q.maxPrice) : undefined,
  sort: ['newest', 'price_asc', 'price_desc', 'rating'].includes(String(q.sort))
    ? (q.sort as string)
    : 'newest',
  q: typeof q.q === 'string' && q.q.trim() ? q.q.trim() : undefined,
});

async function productIdsInPriceRange(
  minP?: number,
  maxP?: number,
): Promise<string[] | null> {
  if (minP === undefined && maxP === undefined) return null;
  const variants = await Variant.find({ isActive: true }).select('product price salePrice').lean();
  const ids = new Set<string>();
  for (const v of variants) {
    const ep = getEffectivePrice(v.price, v.salePrice);
    if (minP !== undefined && ep < minP) continue;
    if (maxP !== undefined && ep > maxP) continue;
    ids.add(String(v.product));
  }
  return [...ids];
}

function minEffectivePriceForVariants(
  variants: Array<{ price: number; salePrice?: number | null }>,
): number {
  if (!variants.length) return 0;
  return Math.min(...variants.map((v) => getEffectivePrice(v.price, v.salePrice)));
}

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const params = listQuerySchema(req.query as Record<string, unknown>);
  const filter: FilterQuery<typeof Product> = { isActive: true };

  if (params.category && isValidObjectId(params.category)) {
    filter.category = params.category;
  }
  if (params.brand && isValidObjectId(params.brand)) {
    filter.brand = params.brand;
  }
  if (params.fragranceFamily) {
    filter.fragranceFamily = params.fragranceFamily;
  }
  if (params.gender) {
    filter.gender = params.gender;
  }
  if (params.q) {
    filter.$text = { $search: params.q };
  }

  const priceIds = await productIdsInPriceRange(params.minPrice, params.maxPrice);
  if (priceIds && priceIds.length === 0) {
    res.json({
      success: true,
      data: [],
      meta: { page: params.page, limit: params.limit, total: 0, totalPages: 0 },
    });
    return;
  }
  if (priceIds) {
    filter._id = { $in: priceIds };
  }

  const total = await Product.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  const skip = (params.page - 1) * params.limit;

  let sortKey: Record<string, 1 | -1> = { createdAt: -1 };
  if (params.sort === 'rating') sortKey = { avgRating: -1, reviewCount: -1 };
  if (params.sort === 'newest') sortKey = { createdAt: -1 };

  let products = await Product.find(filter)
    .populate('brand', 'name slug logo')
    .populate('category', 'name slug')
    .sort(sortKey)
    .skip(skip)
    .limit(params.limit * 3)
    .lean();

  const productIds = products.map((p) => p._id);
  const variants = await Variant.find({
    product: { $in: productIds },
    isActive: true,
  }).lean();

  const byProduct = new Map<string, typeof variants>();
  for (const v of variants) {
    const key = String(v.product);
    const arr = byProduct.get(key) ?? [];
    arr.push(v);
    byProduct.set(key, arr);
  }

  const withMin = products.map((p) => {
    const vs = byProduct.get(String(p._id)) ?? [];
    return { ...p, variants: vs, _minPrice: minEffectivePriceForVariants(vs) };
  });

  if (params.sort === 'price_asc' || params.sort === 'price_desc') {
    withMin.sort((a, b) =>
      params.sort === 'price_asc' ? a._minPrice - b._minPrice : b._minPrice - a._minPrice,
    );
  }

  const sliced = withMin.slice(0, params.limit);

  const data = sliced.map((p) => {
    const { _minPrice, ...rest } = p;
    void _minPrice;
    return rest;
  });

  res.json({
    success: true,
    data,
    meta: { page: params.page, limit: params.limit, total, totalPages },
  });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = routeParam(req.params.slug);
  const product = await Product.findOne({ slug, isActive: true })
    .populate('brand', 'name slug logo country')
    .populate('category', 'name slug')
    .lean();

  if (!product) throw new AppError(404, 'Product not found');

  const variants = await Variant.find({ product: product._id, isActive: true }).lean();

  const related = await Product.find({
    isActive: true,
    _id: { $ne: product._id },
    $or: [{ brand: product.brand }, { category: product.category }],
  })
    .populate('brand', 'name slug')
    .limit(8)
    .lean();

  res.json({ success: true, data: { ...product, variants, relatedProducts: related } });
});

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId = routeParam(req.params.productId);
  if (!isValidObjectId(productId)) throw new AppError(400, 'Invalid product id');

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = { product: productId, isApproved: true };
  const total = await Review.countDocuments(filter);
  const rows = await Review.find(filter)
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({
    success: true,
    data: rows,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const createProductAdmin = asyncHandler(async (req: Request, res: Response) => {
  const body = adminCreateProductSchema.parse(req.body);
  const rawSlug = body.slug?.trim();
  const slug =
    rawSlug && rawSlug.length > 0
      ? slugify(rawSlug, { lower: true, strict: true })
      : slugify(body.name, { lower: true, strict: true });

  const dup = await Product.findOne({ slug });
  if (dup) throw new AppError(409, 'Slug already exists');

  const category = await Category.findById(body.categoryId);
  if (!category) throw new AppError(400, 'Invalid category');

  const brand = await Brand.findById(body.brandId);
  if (!brand) throw new AppError(400, 'Invalid brand');

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [productDoc] = await Product.create(
      [
        {
          name: body.name,
          slug,
          brand: body.brandId,
          category: body.categoryId,
          fragranceFamily: body.fragranceFamily,
          concentration: body.concentration,
          gender: body.gender ?? 'unisex',
          season: body.season ?? [],
          images: body.images ?? [],
          topNotes: body.topNotes ?? [],
          heartNotes: body.heartNotes ?? [],
          baseNotes: body.baseNotes ?? [],
          description: body.description ?? '',
          isEngravable: body.isEngravable ?? false,
          isActive: body.isActive ?? true,
        },
      ],
      { session },
    );

    const variantDocs = body.variants.map((v) => ({
      product: productDoc._id,
      sku: v.sku.toUpperCase(),
      size: v.size,
      price: v.price,
      salePrice: v.salePrice ?? undefined,
      stock: v.stock,
      isActive: v.isActive ?? true,
    }));

    await Variant.insertMany(variantDocs, { session });
    await session.commitTransaction();
    const full = await Product.findById(productDoc._id)
      .populate('brand category')
      .lean();
    const vars = await Variant.find({ product: productDoc._id }).lean();
    res.status(201).json({ success: true, data: { ...full, variants: vars } });
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    session.endSession();
  }
});

export const updateProductAdmin = asyncHandler(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  if (!isValidObjectId(id)) throw new AppError(400, 'Invalid product id');
  const body = adminUpdateProductSchema.parse(req.body);

  const product = await Product.findById(id);
  if (!product) throw new AppError(404, 'Product not found');

  if (body.name !== undefined) product.name = body.name;
  if (body.slug !== undefined) product.slug = slugify(body.slug, { lower: true, strict: true });
  if (body.brandId !== undefined) product.brand = body.brandId as unknown as typeof product.brand;
  if (body.categoryId !== undefined)
    product.category = body.categoryId as unknown as typeof product.category;
  if (body.fragranceFamily !== undefined) product.fragranceFamily = body.fragranceFamily;
  if (body.concentration !== undefined) product.concentration = body.concentration;
  if (body.gender !== undefined) product.gender = body.gender;
  if (body.season !== undefined) product.season = body.season;
  if (body.images !== undefined) product.images = body.images;
  if (body.topNotes !== undefined) product.topNotes = body.topNotes;
  if (body.heartNotes !== undefined) product.heartNotes = body.heartNotes;
  if (body.baseNotes !== undefined) product.baseNotes = body.baseNotes;
  if (body.description !== undefined) product.description = body.description ?? '';
  if (body.isEngravable !== undefined) product.isEngravable = body.isEngravable;
  if (body.isActive !== undefined) product.isActive = body.isActive;

  await product.save();
  const full = await Product.findById(product._id).populate('brand category').lean();
  const vars = await Variant.find({ product: product._id }).lean();
  res.json({ success: true, data: { ...full, variants: vars } });
});

export const deleteProductAdmin = asyncHandler(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  if (!isValidObjectId(id)) throw new AppError(400, 'Invalid product id');
  const product = await Product.findById(id);
  if (!product) throw new AppError(404, 'Product not found');
  product.isActive = false;
  await product.save();
  res.json({ success: true, message: 'Product deactivated' });
});

export const addVariantAdmin = asyncHandler(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  if (!isValidObjectId(id)) throw new AppError(400, 'Invalid product id');
  const parsed = adminAddVariantSchema.parse(req.body);
  const product = await Product.findById(id);
  if (!product) throw new AppError(404, 'Product not found');

  await Variant.create({
    product: id,
    sku: parsed.sku.toUpperCase(),
    size: parsed.size,
    price: parsed.price,
    salePrice: parsed.salePrice ?? undefined,
    stock: parsed.stock,
    isActive: parsed.isActive ?? true,
  });
  const vars = await Variant.find({ product: id }).lean();
  res.status(201).json({ success: true, data: vars });
});

export const updateVariantAdmin = asyncHandler(async (req: Request, res: Response) => {
  const variantId = routeParam(req.params.variantId);
  if (!isValidObjectId(variantId)) throw new AppError(400, 'Invalid variant id');
  const parsed = adminUpdateVariantSchema.parse(req.body);
  const v = await Variant.findById(variantId);
  if (!v) throw new AppError(404, 'Variant not found');
  if (parsed.sku !== undefined) v.sku = parsed.sku.toUpperCase();
  if (parsed.size !== undefined) v.size = parsed.size;
  if (parsed.price !== undefined) v.price = parsed.price;
  if (parsed.salePrice !== undefined) v.salePrice = parsed.salePrice ?? undefined;
  if (parsed.stock !== undefined) v.stock = parsed.stock;
  if (parsed.isActive !== undefined) v.isActive = parsed.isActive;
  await v.save();
  res.json({ success: true, data: v });
});

export const deleteVariantAdmin = asyncHandler(async (req: Request, res: Response) => {
  const variantId = routeParam(req.params.variantId);
  if (!isValidObjectId(variantId)) throw new AppError(400, 'Invalid variant id');
  const v = await Variant.findById(variantId);
  if (!v) throw new AppError(404, 'Variant not found');
  v.isActive = false;
  await v.save();
  res.json({ success: true, message: 'Variant deactivated' });
});

export const listProductsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  const filter: FilterQuery<typeof Product> = {};
  if (q) {
    filter.$or = [{ name: new RegExp(q, 'i') }, { slug: new RegExp(q, 'i') }];
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('brand', 'name')
    .populate('category', 'name')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const ids = products.map((p) => p._id);
  const variants = await Variant.find({ product: { $in: ids } }).lean();
  const byProduct = new Map<string, typeof variants>();
  for (const v of variants) {
    const k = String(v.product);
    const arr = byProduct.get(k) ?? [];
    arr.push(v);
    byProduct.set(k, arr);
  }

  const data = products.map((p) => ({
    ...p,
    variants: byProduct.get(String(p._id)) ?? [],
    totalStock: (byProduct.get(String(p._id)) ?? []).reduce((s, v) => s + v.stock, 0),
  }));

  res.json({
    success: true,
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

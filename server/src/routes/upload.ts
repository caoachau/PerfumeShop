import { Router } from 'express';
import type { UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import { z } from 'zod';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

const PRODUCT_FOLDER = 'perfumeshop/products';

const cloudinaryUploadOpts = {
  folder: PRODUCT_FOLDER,
  resource_type: 'image' as const,
  use_filename: true,
  unique_filename: true,
  overwrite: false,
};

function uploadBufferToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(cloudinaryUploadOpts, (error, result) => {
      if (error || !result) reject(error ?? new Error('Upload failed'));
      else resolve(result);
    });
    stream.end(buffer);
  });
}

/** Only allow deleting assets under our app prefix (Cloudinary public_id). */
function assertDeletablePublicId(publicId: string): void {
  const normalized = publicId.replace(/^\/+/, '');
  if (!normalized.startsWith('perfumeshop/')) {
    throw new AppError(400, 'Only perfumeshop/* assets can be deleted');
  }
}

/**
 * Delivery URLs may include transformations, e.g.
 * .../image/upload/q_auto,f_auto/perfumeshop/products/foo
 */
function publicIdFromDeliveryUrl(urlStr: string): string | null {
  try {
    const u = new URL(urlStr);
    if (!u.hostname.includes('cloudinary.com')) return null;
    const path = u.pathname;
    const marker = '/perfumeshop/';
    const mi = path.indexOf(marker);
    if (mi === -1) return null;
    let rest = path.slice(mi + 1);
    rest = rest.replace(/\.(jpg|jpeg|png|webp|gif|avif|svg|bmp)$/i, '');
    return rest || null;
  } catch {
    return null;
  }
}

const destroyBodySchema = z
  .object({
    publicId: z.string().min(1).optional(),
    url: z.string().url().optional(),
  })
  .refine((d) => Boolean(d.publicId || d.url), { message: 'publicId or url is required' });

function handleMulterImageError(err: unknown, next: (e?: unknown) => void) {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    next(new AppError(400, 'File too large (max 12MB per image)'));
    return;
  }
  next(err);
}

router.post(
  '/destroy',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const parsed = destroyBodySchema.parse(req.body);
    let publicId = parsed.publicId?.trim();
    if (!publicId && parsed.url) {
      publicId = publicIdFromDeliveryUrl(parsed.url) ?? undefined;
    }
    if (!publicId) throw new AppError(400, 'Could not resolve Cloudinary public_id from url');
    assertDeletablePublicId(publicId);

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    res.json({ success: true, result });
  }),
);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        handleMulterImageError(err, next);
        return;
      }
      next();
    });
  },
  asyncHandler(async (req, res) => {
    if (!req.file?.buffer) {
      throw new AppError(400, 'Missing file: use form field name "image"');
    }

    const uploaded = await uploadBufferToCloudinary(req.file.buffer);

    res.status(201).json({
      success: true,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    });
  }),
);

router.post(
  '/multiple',
  authenticate,
  authorize('admin'),
  (req, res, next) => {
    upload.array('images', 15)(req, res, (err) => {
      if (err) {
        handleMulterImageError(err, next);
        return;
      }
      next();
    });
  },
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      throw new AppError(400, 'Missing files: use form field name "images" (multipart)');
    }

    const results: { url: string; publicId: string }[] = [];
    for (const file of files) {
      if (!file.buffer?.length) continue;
      const uploaded = await uploadBufferToCloudinary(file.buffer);
      results.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
    }

    if (!results.length) {
      throw new AppError(400, 'No valid image buffers received');
    }

    res.status(201).json({ success: true, files: results });
  }),
);

export default router;

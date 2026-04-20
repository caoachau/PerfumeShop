import { Router } from 'express';
import type { UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post(
  '/',
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          next(new AppError(400, 'File too large (max 5MB)'));
          return;
        }
        next(err);
        return;
      }
      next();
    });
  },
  asyncHandler(async (req, res) => {
    if (!req.file?.buffer) {
      throw new AppError(400, 'Missing file: use form field name "image"');
    }

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'perfumeshop' },
        (error, result) => {
          if (error || !result) reject(error ?? new Error('Upload failed'));
          else resolve(result);
        },
      );
      stream.end(req.file!.buffer);
    });

    res.status(201).json({
      success: true,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    });
  }),
);

export default router;

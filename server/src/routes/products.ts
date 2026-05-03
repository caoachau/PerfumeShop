import { Router } from 'express';
import {
  getProductBySlug,
  getProductReviews,
  listProducts,
} from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:productId/reviews', getProductReviews);

export default router;

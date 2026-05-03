import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  addVariantAdmin,
  createProductAdmin,
  deleteProductAdmin,
  deleteVariantAdmin,
  getProductAdminById,
  listProductsAdmin,
  updateProductAdmin,
  updateVariantAdmin,
} from '../controllers/productController.js';
import {
  adminAddVariantSchema,
  adminCreateProductSchema,
  adminUpdateProductSchema,
} from '../validators/productSchemas.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.put('/variants/:variantId', updateVariantAdmin);
router.delete('/variants/:variantId', deleteVariantAdmin);

router.get('/', listProductsAdmin);
router.get('/:id', getProductAdminById);

router.post('/', validate(adminCreateProductSchema), createProductAdmin);
router.put('/:id', validate(adminUpdateProductSchema), updateProductAdmin);
router.delete('/:id', deleteProductAdmin);
router.post('/:id/variants', validate(adminAddVariantSchema), addVariantAdmin);

export default router;

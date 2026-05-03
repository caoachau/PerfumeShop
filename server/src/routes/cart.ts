import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { addCartItemSchema, syncCartSchema, updateCartItemSchema } from '../validators/cartSchemas.js';
import {
  addCartItem,
  getCart,
  removeCartItem,
  syncCart,
  updateCartItem,
} from '../controllers/cartController.js';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/items', validate(addCartItemSchema), addCartItem);
router.put('/items/:variantId', validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:variantId', removeCartItem);
router.post('/sync', validate(syncCartSchema), syncCart);

export default router;

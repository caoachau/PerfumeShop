import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { addWishlist, getWishlist, removeWishlist } from '../controllers/wishlistController.js';

const router = Router();

router.use(authenticate);

router.get('/', getWishlist);
router.post('/:productId', addWishlist);
router.delete('/:productId', removeWishlist);

export default router;

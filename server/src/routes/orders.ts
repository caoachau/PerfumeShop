import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/orderSchemas.js';
import { createOrder, getMyOrderById, listMyOrders } from '../controllers/orderController.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createOrderSchema), createOrder);
router.get('/me', listMyOrders);
router.get('/me/:id', getMyOrderById);

export default router;

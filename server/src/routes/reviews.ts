import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReviewSchema } from '../validators/reviewSchemas.js';
import { createReview, listMyReviews } from '../controllers/reviewController.js';

const router = Router();

router.post('/', authenticate, validate(createReviewSchema), createReview);
router.get('/my', authenticate, listMyReviews);

export default router;

import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  changePasswordSchema,
  loginSchema,
  profileUpdateSchema,
  registerSchema,
} from '../validators/authSchemas.js';
import {
  changePassword,
  login,
  logout,
  me,
  refresh,
  register,
  updateProfile,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);
router.put('/profile', authenticate, validate(profileUpdateSchema), updateProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;

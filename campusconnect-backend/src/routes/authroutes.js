import express from 'express';
import { signup, login } from '../controllers/authController.js';
import {
  signupValidationRules,
  loginValidationRules,
  handleValidationErrors,
} from '../validators/authValidator.js';

import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';


const router = express.Router();

router.post('/signup', signupValidationRules, handleValidationErrors, signup);
router.post('/login', loginValidationRules, handleValidationErrors, login);

router.get('/test-protected', protect, restrictTo('student'), (req, res) => {
  res.json({ message: `Hello ${req.user.full_name}, you are a verified student!` });
});

export default router;
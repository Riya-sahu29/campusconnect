import express from 'express';
import { createJob, getMyJobs, listJobs, getJobByIdHandler } from '../controllers/jobController.js';
import {
  createJobValidationRules,
  handleValidationErrors,
} from '../validators/jobValidators.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();


router.get('/', protect, listJobs);


router.get('/my-jobs', protect, restrictTo(ROLES.RECRUITER), getMyJobs);


router.get('/:id', protect, getJobByIdHandler);

router.post(
  '/',
  protect,
  restrictTo(ROLES.RECRUITER),
  createJobValidationRules,
  handleValidationErrors,
  createJob
);

export default router;
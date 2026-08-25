import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJobHandler,
  updateApplicationStatusHandler,
} from '../controllers/applicationController.js';
import {
  updateStatusValidationRules,
  handleValidationErrors,
} from '../validators/applicationValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.post('/:jobId', protect, restrictTo(ROLES.STUDENT), applyToJob);
router.get('/my-applications', protect, restrictTo(ROLES.STUDENT), getMyApplications);


router.get('/job/:jobId', protect, restrictTo(ROLES.RECRUITER), getApplicantsForJobHandler);
router.patch(
  '/:applicationId/status',
  protect,
  restrictTo(ROLES.RECRUITER),
  updateStatusValidationRules,
  handleValidationErrors,
  updateApplicationStatusHandler
);

export default router;
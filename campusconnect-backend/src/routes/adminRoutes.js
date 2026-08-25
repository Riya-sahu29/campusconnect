import express from 'express';
import {
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect, restrictTo(ROLES.ADMIN));

router.get('/recruiters/pending', getPendingRecruiters);
router.patch('/recruiters/:userId/approve', approveRecruiter);
router.patch('/recruiters/:userId/reject', rejectRecruiter);

export default router;
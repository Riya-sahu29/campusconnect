import express from 'express';
import { getMyProfile, uploadResume } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { uploadResumeMiddleware } from '../middleware/uploadMiddleware.js';
import { getStudentProfile } from '../model/studentModel.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect, restrictTo(ROLES.STUDENT));

router.get('/me', getMyProfile);

router.post('/resume', uploadResumeMiddleware, uploadResume);

// Resume proxy — fetches from Cloudinary server-side so browser never hits Cloudinary directly
router.get('/resume/view', async (req, res) => {
  try {
    const profile = await getStudentProfile(req.user.id);
    if (!profile?.resume_url) {
      return res.status(404).json({ message: 'No resume found' });
    }

    const response = await fetch(profile.resume_url);
    if (!response.ok) {
      return res.status(502).json({ message: 'Could not fetch resume from storage' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Resume proxy error:', err.message);
    res.status(500).json({ message: 'Failed to fetch resume' });
  }
});

export default router;
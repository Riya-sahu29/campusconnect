import {
  getStudentProfile,
  updateStudentResume,
  getCurrentResumePublicId,
} from '../model/studentModel.js';
import {
  uploadResumeToCloudinary,
  deleteResumeFromCloudinary,
} from '../services/cloudinaryService.js';

// GET /api/students/me — view own profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await getStudentProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    return res.status(200).json({ profile });
  } catch (err) {
    console.error('Get profile error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// POST /api/students/resume — upload or replace resume
export const uploadResume = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file provided' });
    }

    const oldPublicId = await getCurrentResumePublicId(req.user.id);

 
    const uploadResult = await uploadResumeToCloudinary(
      req.file.buffer, 
      req.file.originalname
    );

    console.log(uploadResult);

    const updated = await updateStudentResume(
      req.user.id,
      uploadResult.secure_url,
      uploadResult.public_id
    );

    if (oldPublicId) {
      await deleteResumeFromCloudinary(oldPublicId);
    }

    return res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeUrl: updated.resume_url,
    });
  } catch (err) {
    console.error('Resume upload error:', err.message);
    return res.status(500).json({ message: 'Failed to upload resume' });
  }
};
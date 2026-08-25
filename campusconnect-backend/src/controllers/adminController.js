import {
  getRecruitersByStatus,
  getRecruiterByUserId,
  updateRecruiterStatus,
} from '../model/recruiterModel.js';
import { createNotification } from '../services/notificationService.js';
import { RECRUITER_STATUS } from '../constants/roles.js';

export const getPendingRecruiters = async (req, res) => {
  try {
    const recruiters = await getRecruitersByStatus(RECRUITER_STATUS.PENDING);
    return res.status(200).json({ count: recruiters.length, recruiters });
  } catch (err) {
    console.error('Get pending recruiters error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch pending recruiters' });
  }
};

export const approveRecruiter = async (req, res) => {
  const { userId } = req.params;

  try {
    const recruiter = await getRecruiterByUserId(userId);
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }
    if (recruiter.status === RECRUITER_STATUS.APPROVED) {
      return res.status(409).json({ message: 'Recruiter is already approved' });
    }

    const updated = await updateRecruiterStatus(userId, RECRUITER_STATUS.APPROVED, req.user.id);

    await createNotification({
      userId,
      type: 'recruiter_approved',
      message: `Your recruiter account for ${updated.company_name} has been approved.`,
      io: req.app.get('io'),
    });

    return res.status(200).json({ message: 'Recruiter approved', recruiter: updated });
  } catch (err) {
    console.error('Approve recruiter error:', err.message);
    return res.status(500).json({ message: 'Failed to approve recruiter' });
  }
};

export const rejectRecruiter = async (req, res) => {
  const { userId } = req.params;

  try {
    const recruiter = await getRecruiterByUserId(userId);
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    const updated = await updateRecruiterStatus(userId, RECRUITER_STATUS.REJECTED, req.user.id);

    await createNotification({
      userId,
      type: 'recruiter_rejected',
      message: `Your recruiter account application for ${updated.company_name} was not approved.`,
      io: req.app.get('io'),
    });

    return res.status(200).json({ message: 'Recruiter rejected', recruiter: updated });
  } catch (err) {
    console.error('Reject recruiter error:', err.message);
    return res.status(500).json({ message: 'Failed to reject recruiter' });
  }
};
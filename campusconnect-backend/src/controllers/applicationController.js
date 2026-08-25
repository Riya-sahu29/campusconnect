import {
  createApplication,
  findApplication,
  getApplicationsByStudent,
  getApplicantsForJob,
  updateApplicationStatus,
  getApplicationById,
} from '../model/applicationModel.js';
import { getJobById } from '../model/jobModel.js';
import { getStudentProfile } from '../model/studentModel.js';
import { createNotification } from '../services/notificationService.js';
import pool from '../config/db.js';

export const applyToJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    
    const studentProfile = await getStudentProfile(req.user.id);
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    if (!studentProfile.resume_url) {
      return res.status(400).json({
        message: 'Please upload a resume to your profile before applying to jobs',
      });
    }

    
    // if (parseFloat(studentProfile.cgpa) < parseFloat(job.min_cgpa)) {
    //   return res.status(403).json({
    //     message: `This job requires a minimum CGPA of ${job.min_cgpa}. Your CGPA does not meet this requirement.`,
    //   });
    // }

    
    if (job.min_passing_year && studentProfile.passing_year < job.min_passing_year) {
      return res.status(403).json({ message: 'Your passing year does not meet this job\'s eligibility' });
    }
    if (job.max_passing_year && studentProfile.passing_year > job.max_passing_year) {
      return res.status(403).json({ message: 'Your passing year does not meet this job\'s eligibility' });
    }

    
    const branchCheck = await pool.query(
      `SELECT
         NOT EXISTS (SELECT 1 FROM job_eligible_branches WHERE job_id = $1) AS open_to_all,
         EXISTS (
           SELECT 1 FROM job_eligible_branches WHERE job_id = $1 AND branch = $2
         ) AS branch_matches`,
      [jobId, studentProfile.branch]
    );
    const { open_to_all, branch_matches } = branchCheck.rows[0];
    if (!open_to_all && !branch_matches) {
      return res.status(403).json({
        message: `This job is not open to your branch (${studentProfile.branch})`,
      });
    }

    
    const existing = await findApplication(jobId, req.user.id);
    if (existing) {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }

    
    const application = await createApplication({
      jobId,
      studentId: req.user.id,
      resumeUrl: studentProfile.resume_url,
    });

    
    await createNotification({
      userId: job.recruiter_id,
      type: 'new_application',
      message: `${req.user.full_name} applied to your job: ${job.title}`,
      metadata: { jobId: job.id, applicationId: application.id },
      io: req.app.get('io'),
    });

    return res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {

    if (err.code === '23505') {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }
    console.error('Apply to job error:', err.message);
    return res.status(500).json({ message: 'Failed to submit application' });
  }
};


export const getMyApplications = async (req, res) => {
  try {
    const applications = await getApplicationsByStudent(req.user.id);
    return res.status(200).json({ count: applications.length, applications });
  } catch (err) {
    console.error('Get my applications error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch applications' });
  }
};


export const getApplicantsForJobHandler = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only view applicants for your own job postings' });
    }

    const applicants = await getApplicantsForJob(jobId);
    return res.status(200).json({ count: applicants.length, applicants });
  } catch (err) {
    console.error('Get applicants error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch applicants' });
  }
};


export const updateApplicationStatusHandler = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    const application = await getApplicationById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (application.recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only update applications for your own job postings' });
    }

    const updated = await updateApplicationStatus(applicationId, status);

    await createNotification({
      userId: application.student_id,
      type: 'status_change',
      message: `Your application status was updated to: ${status}`,
      metadata: { applicationId },
      io: req.app.get('io'),
    });

    return res.status(200).json({ message: 'Application status updated', application: updated });
  } catch (err) {
    console.error('Update application status error:', err.message);
    return res.status(500).json({ message: 'Failed to update application status' });
  }
};
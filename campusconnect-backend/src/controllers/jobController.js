import { createJob as createJobInDb, getJobsByRecruiter, searchJobs, getJobById } from '../model/jobModel.js';
import { getRecruiterByUserId } from '../model/recruiterModel.js';
import { RECRUITER_STATUS } from '../constants/roles.js';
import { getPaginationParams, buildPaginationMeta } from '../utils/pagination.js';

export const createJob = async (req, res) => {
  try {
    const recruiterProfile = await getRecruiterByUserId(req.user.id);

    if (!recruiterProfile) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }

    if (recruiterProfile.status !== RECRUITER_STATUS.APPROVED) {
      
      return res.status(403).json({
        message: `Your recruiter account is currently '${recruiterProfile.status}'. You must be approved by an admin before posting jobs.`,
      });
    }

    const {
      title, description, location, jobType,
      minCgpa, minPassingYear, maxPassingYear, ctcLpa,
      applicationDeadline, eligibleBranches,
    } = req.body;

    const job = await createJobInDb({
      recruiterId: req.user.id,
      title,
      description,
      location,
      jobType,
      minCgpa,
      minPassingYear,
      maxPassingYear,
      ctcLpa,
      applicationDeadline,
      eligibleBranches,
    });

    return res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err) {
    console.error('Create job error:', err.message);
    return res.status(500).json({ message: 'Failed to create job' });
  }
};


export const getMyJobs = async (req, res) => {
  try {
    const jobs = await getJobsByRecruiter(req.user.id);
    return res.status(200).json({ count: jobs.length, jobs });
  } catch (err) {
    console.error('Get my jobs error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

export const listJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, minCgpa, branch } = req.query;
    const { page, limit, offset } = getPaginationParams(req.query);

    const { jobs, totalCount } = await searchJobs({
      keyword,
      location,
      jobType,
      minCgpa: minCgpa !== undefined ? parseFloat(minCgpa) : undefined,
      branch,
      limit,
      offset,
    });

    return res.status(200).json({
      jobs,
      pagination: buildPaginationMeta(totalCount, page, limit),
    });
  } catch (err) {
    console.error('List jobs error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

export const getJobByIdHandler = async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found'});
    }
    return res.status(200).json({ job });
  } catch (err) {
    console.error('Get job by id error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch job'});
  }
};
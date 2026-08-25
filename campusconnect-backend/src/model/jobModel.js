import pool from '../config/db.js';

export const createJob = async ({
  recruiterId,
  title,
  description,
  location,
  jobType,
  minCgpa,
  minPassingYear,
  maxPassingYear,
  ctcLpa,
  applicationDeadline,
  eligibleBranches = [],

}) => {

    const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const jobResult = await client.query(
      `INSERT INTO jobs
         (recruiter_id, title, description, location, job_type,
          min_cgpa, min_passing_year, max_passing_year, ctc_lpa, application_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        recruiterId, title, description, location, jobType,
        minCgpa, minPassingYear, maxPassingYear, ctcLpa, applicationDeadline,
      ]
    );

    const job = jobResult.rows[0];


    if (eligibleBranches.length > 0) {
      const values = eligibleBranches.map((_, i) => `($1, $${i + 2})`).join(', ');
      await client.query(
        `INSERT INTO job_eligible_branches (job_id, branch) VALUES ${values}`,
        [job.id, ...eligibleBranches]
      );
    }

    await client.query('COMMIT');
    return { ...job, eligibleBranches };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const getJobById = async (jobId) => {
  const result = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [jobId]);
  return result.rows[0] || null;
};

export const getJobsByRecruiter = async (recruiterId) => {
  const result = await pool.query(
    `SELECT * FROM jobs WHERE recruiter_id = $1 ORDER BY created_at DESC`,
    [recruiterId]
  );
  return result.rows;
};


export const searchJobs = async ({
  keyword,
  location,
  jobType,
  minCgpa,
  branch,
  limit,
  offset,
}) => {
  
  const conditions = [`j.status = 'open'`];
  const values = [];
  let paramIndex = 1;

  if (keyword) {
    
    conditions.push(
      `to_tsvector('english', j.title || ' ' || j.description) @@ to_tsquery('english', $${paramIndex})`
    );
    
    values.push(keyword.trim().split(/\s+/).join(' & '));
    paramIndex++;
  }

  if (location) {
    conditions.push(`j.location ILIKE $${paramIndex}`);
    values.push(`%${location}%`);
    paramIndex++;
  }

  if (jobType) {
    conditions.push(`j.job_type = $${paramIndex}`);
    values.push(jobType);
    paramIndex++;
  }

  if (minCgpa !== undefined) {
   
    conditions.push(`j.min_cgpa <= $${paramIndex}`);
    values.push(minCgpa);
    paramIndex++;
  }

  if (branch) {
    conditions.push(`(
      NOT EXISTS (SELECT 1 FROM job_eligible_branches jeb WHERE jeb.job_id = j.id)
      OR EXISTS (
        SELECT 1 FROM job_eligible_branches jeb
        WHERE jeb.job_id = j.id AND jeb.branch = $${paramIndex}
      )
    )`);
    values.push(branch);
    paramIndex++;
  }

  const whereClause = conditions.join(' AND ');

  
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM jobs j WHERE ${whereClause}`,
    values
  );
  const totalCount = parseInt(countResult.rows[0].count, 10);

  
  values.push(limit, offset);
  const jobsResult = await pool.query(
    `SELECT j.*,
       u.full_name AS recruiter_name,
       rp.company_name
     FROM jobs j
     JOIN users u ON u.id = j.recruiter_id
     JOIN recruiter_profiles rp ON rp.user_id = j.recruiter_id
     WHERE ${whereClause}
     ORDER BY j.created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    values
  );

  return { jobs: jobsResult.rows, totalCount };
};
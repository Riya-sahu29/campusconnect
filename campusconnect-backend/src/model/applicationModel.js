import pool from '../config/db.js';

export const createApplication = async ({ jobId, studentId, resumeUrl }) => {
  const result = await pool.query(
    `INSERT INTO applications (job_id, student_id, resume_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [jobId, studentId, resumeUrl]
  );
  return result.rows[0];
};

export const findApplication = async (jobId, studentId) => {
  const result = await pool.query(
    `SELECT id FROM applications WHERE job_id = $1 AND student_id = $2`,
    [jobId, studentId]
  );
  return result.rows[0] || null;
};


export const getApplicationsByStudent = async (studentId) => {
  const result = await pool.query(
    `SELECT
       a.id, a.status, a.resume_url, a.applied_at,
       j.id AS job_id, j.title, j.location, j.job_type, j.ctc_lpa,
       rp.company_name
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     JOIN recruiter_profiles rp ON rp.user_id = j.recruiter_id
     WHERE a.student_id = $1
     ORDER BY a.applied_at DESC`,
    [studentId]
  );
  return result.rows;
};


export const getApplicantsForJob = async (jobId) => {
  const result = await pool.query(
    `SELECT
       a.id, a.status, a.resume_url, a.applied_at,
       u.id AS student_id, u.full_name, u.email,
       sp.branch, sp.passing_year, sp.cgpa
     FROM applications a
     JOIN users u ON u.id = a.student_id
     JOIN student_profiles sp ON sp.user_id = a.student_id
     WHERE a.job_id = $1
     ORDER BY a.applied_at DESC`,
    [jobId]
  );
  return result.rows;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const result = await pool.query(
    `UPDATE applications SET status = $1 WHERE id = $2 RETURNING *`,
    [status, applicationId]
  );
  return result.rows[0] || null;
};

export const getApplicationById = async (applicationId) => {
  const result = await pool.query(
    `SELECT a.*, j.recruiter_id
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.id = $1`,
    [applicationId]
  );
  return result.rows[0] || null;
};
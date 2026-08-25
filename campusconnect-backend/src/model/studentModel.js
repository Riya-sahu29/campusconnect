import pool from '../config/db.js';

export const getStudentProfile = async (userId) => {
  const result = await pool.query(
    `SELECT sp.*, u.email, u.full_name
     FROM student_profiles sp
     JOIN users u ON u.id = sp.user_id
     WHERE sp.user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
};


export const updateStudentResume = async (userId, resumeUrl, resumePublicId) => {
  const result = await pool.query(
    `UPDATE student_profiles
     SET resume_url = $1, resume_public_id = $2
     WHERE user_id = $3
     RETURNING user_id, resume_url, resume_public_id`,
    [resumeUrl, resumePublicId, userId]
  );
  return result.rows[0] || null;
};

export const getCurrentResumePublicId = async (userId) => {
  const result = await pool.query(
    `SELECT resume_public_id FROM student_profiles WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0]?.resume_public_id || null;
};
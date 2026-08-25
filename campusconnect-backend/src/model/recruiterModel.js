import pool from '../config/db.js';

export const getRecruitersByStatus = async (status) => {
    const result = await pool.query(
        `SELECT 
            u.id AS user_id,
            u.email,
            u.full_name,
            rp.company_name,
            rp.company_website,
            rp.designation,
            rp.status,
            rp.approved_at
        FROM recruiter_profiles rp
        JOIN users u ON u.id = rp.user_id
        WHERE rp.status = $1
        ORDER BY u.created_at DESC`,
        [status]
    );
    
    return result.rows;
};

export const getRecruiterByUserId = async (userId) =>{
    const result = await pool.query(
        `SELECT user_id, company_name, status FROM recruiter_profiles WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0] || null;
};

export const updateRecruiterStatus = async (userId, status, adminId) => {
    const result = await pool.query(
        `UPDATE recruiter_profiles
        SET status = $1,
            approved_by = $2,
            approved_at = now()
        WHERE user_id = $3
        RETURNING user_id, company_name, status, approved_at`,
        [status, adminId, userId]
    );
    return result.rows[0] || null;
};
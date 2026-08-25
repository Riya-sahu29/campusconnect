import pool from '../config/db.js';

export const createUser = async ({ email, passwordHash, role, fullName }) => {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, role, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, role, full_name, created_at`,
    [email, passwordHash, role, fullName]
  );
  return result.rows[0];
};


export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, email, password_hash, role, full_name, is_active
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};


export const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, email, role, full_name, is_active
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};
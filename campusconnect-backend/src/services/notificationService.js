import pool from '../config/db.js';
import { emitNotificationToUser } from '../sockets/notificationSocket.js';


export const createNotification = async ({ userId, type, message, metadata = null, io = null }) => {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, type, message, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, type, message, is_read, created_at`,
    [userId, type, message, metadata]
  );

  const notification = result.rows[0];

  if (io) {
    emitNotificationToUser(io, userId, notification);
  }

  return notification;
}; 

export const getUserNotifications = async (userId) => {
  const result = await pool.query(
    `SELECT id, type, message, is_read, metadata, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId]
  );
  return result.rows;
}; 
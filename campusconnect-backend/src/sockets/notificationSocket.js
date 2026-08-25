import jwt from 'jsonwebtoken';
import { findUserById } from '../model/userModel.js';

export const initializeSocket = (io) => {
 
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error: no token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await findUserById(decoded.id);

      if (!user || !user.is_active) {
        return next(new Error('Authentication error: invalid user'));
      }

   
      socket.userId = user.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: invalid or expired token'));
    }
  });

  
  io.on('connection', (socket) => {
    console.log(` Socket connected: user ${socket.userId}`);


    socket.join(socket.userId);

    socket.on('disconnect', () => {
      console.log(` Socket disconnected: user ${socket.userId}`);
    });
  });
};

export const emitNotificationToUser = (io, userId, notification) => {
  io.to(userId).emit('new_notification', notification);
};
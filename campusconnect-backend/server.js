import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

import pool from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import applicationRoutes from './src/routes/applicationRoutes.js';
import { initializeSocket } from './src/sockets/notificationSocket.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(helmet());                 
app.use(cors());                 
app.use(express.json());          
app.use(morgan('dev'));            


app.get('/', (req, res) => {
  res.send('CampusConnect API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/applications', applicationRoutes);


const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],  
  },
});

app.set('io', io);

httpServer.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});



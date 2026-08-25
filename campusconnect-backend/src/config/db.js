import pg, { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const {Pool} = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.connect()
    .then((client) => {
        console.log("PostgreSQL connecteed successfully");
        client.release();
    })
    .catch((err) =>{
        console.log('PostgreSQL connection failed:', err.message);
    });

export default pool;
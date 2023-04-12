import mysql from 'mysql';
import * as dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    debug: false,
    connectionLimit: 10
});

export const poolConnection = (res, cb) => {
    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json(err);

        cb(connection);
    });
};

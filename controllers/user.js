import { db } from '../db.js';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

export const getUsers = (req, res) => {
    const query = 'SELECT `username`, `email`, `img` FROM users';

    db.query(query, [], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data);
    });
};

export const getUser = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT `username`, `email`, `img` FROM users WHERE id = ?';

    db.query(query, [id], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data[0]);
    });
};

export const addUser = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Not authenticated.')

    jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid.');

        const query = 'INSERT INTO blog.posts (`title`, `desc`, `img`, `cate`, `date`, `uid`) VALUES (?)';
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cate,
            req.body.date,
            userInfo.id
        ];

        db.query(query, [values], (err, date) => {
            if (err) return res.status(500).json(err);

            return res.json('Post has been created.')
        });
    });
};

export const deleteUser = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Not authenticated.')

    jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid.');

        const { id } = req.params;
        const query = 'DELETE FROM users WHERE `id` = ?';

        db.query(query, [id], (err, data) => {
            if (err || data.affectedRows === 0) return res.status(403).json('You can only delete your own account.');

            return res.status(200).json('User has been deleted.');
        });
    });
};

export const updateUser = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Not authenticated.')

    jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid.');

        const query = 'UPDATE users SET `username` = ?, `email` = ?, `img` = ? WHERE `id` = ?';
        const values = [
            req.body.username,
            req.body.email,
            req.body.img,
            userInfo.id
        ];

        db.query(query, values, (err, date) => {
            if (err) return res.status(500).json(err);

            return res.json('User has been updated.')
        });
    });
};
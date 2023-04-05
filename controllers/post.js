import { db } from '../db.js';
import jwt from 'jsonwebtoken';

export const getPosts = (req, res) => {
    const params = req.query.cate;
    const query = params ?
    'SELECT * FROM posts WHERE cate = ?':
    'SELECT * FROM posts';

    db.query(query, [params], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data);
    });
};

export const getPost = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cate`, `date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?';

    db.query(query, [id], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data[0]);
    });
};

export const addPost = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Not authenticated.')

    jwt.verify(token, 'jwtSecretKey', (err, userInfo) => {
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

export const deletePost = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Not authenticated.')

    jwt.verify(token, 'jwtSecretKey', (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid.');

        const { id } = req.params;
        const query = 'DELETE FROM posts WHERE `id` = ? AND `uid` = ?';

        db.query(query, [id, userInfo.id], (err, data) => {
            if (err || data.affectedRows === 0) return res.status(403).json('You can only delete your own post.');

            return res.status(200).json('Post has been deleted.');
        });
    });
};

export const updatePost = (req, res) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Not authenticated.')

    jwt.verify(token, 'jwtSecretKey', (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid.');

        const query = 'UPDATE posts SET `title` = ?, `desc` = ?, `img` = ?, `cate` = ? WHERE `id` = ? AND `uid` = ?';
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cate,
            req.params.id,
            userInfo.id
        ];

        db.query(query, values, (err, date) => {
            if (err) return res.status(500).json(err);

            return res.json('Post has been updated.')
        });
    });
};
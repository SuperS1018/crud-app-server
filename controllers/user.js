import { poolConnection } from '../db.js';
import { verifyAuth } from './utils.js';

export const getUsers = (req, res) => {
    poolConnection(res, (connection) => {
        const query = 'SELECT `username`, `email`, `img` FROM users';
    
        connection.query(query, [], (err, data) => {
            connection.release();
            if (err) return res.status(500).json(err);
    
            return res.status(200).json(data);
        });
    });
};

export const getUser = (req, res) => {
    const { id } = req.params;
    poolConnection(res, (connection) => {
        const query = 'SELECT `username`, `email`, `img` FROM users WHERE id = ?';
    
        connection.query(query, [id], (err, data) => {
            connection.release();
            if (err) return res.status(500).json(err);
    
            return res.status(200).json(data[0]);
        });
    });
};

export const addUser = (req, res) => {
    verifyAuth(req, res, (userInfo) => {
        poolConnection(res, (connection) => {
            const query = 'INSERT INTO blog.posts (`title`, `desc`, `img`, `cate`, `date`, `uid`) VALUES (?)';
            const values = [
                req.body.title,
                req.body.desc,
                req.body.img,
                req.body.cate,
                req.body.date,
                userInfo.id
            ];
    
            connection.query(query, [values], (err, date) => {
                connection.release();
                if (err) return res.status(500).json(err);
    
                return res.json('Post has been created.')
            });
        });
    });
};

export const deleteUser = (req, res) => {
    verifyAuth(req, res, (userInfo) => {
        const { id } = req.params;
        poolConnection(res, (connection) => {
            const query = 'DELETE FROM users WHERE `id` = ?';
    
            connection.query(query, [id], (err, data) => {
                connection.release();
                if (err || data.affectedRows === 0) return res.status(403).json('You can only delete your own account.');
    
                return res.status(200).json('User has been deleted.');
            });
        });
    });
};

export const updateUser = (req, res) => {
    verifyAuth(req, res, (userInfo) => {
        poolConnection(res, (connection) => {
            const query = 'UPDATE users SET `username` = ?, `email` = ?, `img` = ? WHERE `id` = ?';
            const values = [
                req.body.username,
                req.body.email,
                req.body.img,
                userInfo.id
            ];
    
            connection.query(query, values, (err, date) => {
                connection.release();
                if (err) return res.status(500).json(err);
    
                return res.json('User has been updated.')
            });
        });
    });
};
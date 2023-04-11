import { db, handleDisconnect } from '../db.js';
import { verifyAuth, getUserInfoFromToken } from './utils.js';

export const getPosts = async (req, res) => {
    const params = req.query.cate;
    const userInfo = await getUserInfoFromToken(req); 

    // handleDisconnect();

    if (userInfo) {
        const query = params ?
        'SELECT * FROM posts WHERE cate = ?':
        'SELECT * FROM posts';
    
        db.query(query, [params], (err, data) => {
            if (err) return res.status(500).json(err);
    
            return res.status(200).json(data);
        });
    } else {
        const query = params ?
        'SELECT * FROM posts WHERE cate = ? AND status = ?':
        'SELECT * FROM posts WHERE status = ?'

        const values = params ? 
        [params, 'publish']:
        ['publish']
    
        db.query(query, values, (err, data) => {
            if (err) return res.status(500).json(err);
    
            return res.status(200).json(data);
        });
    }
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
    verifyAuth(req, (userInfo) => {
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
    verifyAuth(req, (userInfo) => {
        const { id } = req.params;
        const query = 'DELETE FROM posts WHERE `id` = ? AND `uid` = ?';

        db.query(query, [id, userInfo.id], (err, data) => {
            if (err || data.affectedRows === 0) return res.status(403).json('You can only delete your own post.');

            return res.status(200).json('Post has been deleted.');
        });
    });
};

export const updatePost = (req, res) => {
    verifyAuth(req, (userInfo) => {
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
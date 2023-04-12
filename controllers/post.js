import { poolConnection } from '../db.js';
import { verifyAuth, getUserInfoFromToken } from './utils.js';

export const getPosts = async (req, res) => {
    const params = req.query.cate;
    const userInfo = await getUserInfoFromToken(req); 

    if (userInfo) {
        poolConnection(res, (connection) => {
            const query = params ?
            'SELECT * FROM posts WHERE cate = ?':
            'SELECT * FROM posts';
        
            connection.query(query, [params], (err, data) => {
                connection.release();
                if (err) return res.status(500).json(err);
        
                return res.status(200).json(data);
            });
        });
    } else {
        poolConnection(res, (connection) => {
            const query = params ?
            'SELECT * FROM posts WHERE cate = ? AND status = ?':
            'SELECT * FROM posts WHERE status = ?'
    
            const values = params ? 
            [params, 'publish']:
            ['publish']
        
            connection.query(query, values, (err, data) => {
                connection.release();
                if (err) return res.status(500).json(err);
        
                return res.status(200).json(data);
            });
        });
    }
};

export const getPost = (req, res) => {
    const { id } = req.params;

    poolConnection(res, (connection) => {
        const query = 'SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cate`, `status`, `date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?';
    
        connection.query(query, [id], (err, data) => {
            connection.release();
            if (err) return res.status(500).json(err);
    
            return res.status(200).json(data[0]);
        });
    });
};

export const addPost = (req, res) => {
    verifyAuth(req, res, (userInfo) => {
        poolConnection(res, (connection) => {
            const query = 'INSERT INTO blog.posts (`title`, `desc`, `img`, `cate`, `status`, `date`, `uid`) VALUES (?)';
            const values = [
                req.body.title,
                req.body.desc,
                req.body.img,
                req.body.cate,
                req.body.status,
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

export const deletePost = (req, res) => {
    verifyAuth(req, res, (userInfo) => {
        const { id } = req.params;
        poolConnection(res, (connection) => {
            const query = 'DELETE FROM posts WHERE `id` = ? AND `uid` = ?';
    
            connection.query(query, [id, userInfo.id], (err, data) => {
                connection.release();
                if (err || data.affectedRows === 0) return res.status(403).json('You can only delete your own post.');
    
                return res.status(200).json('Post has been deleted.');
            });
        });
    });
};

export const updatePost = (req, res) => {
    verifyAuth(req, res, (userInfo) => {
        poolConnection(res, (connection) => {
            const query = 'UPDATE posts SET `title` = ?, `desc` = ?, `img` = ?, `cate` = ?, `status` = ? WHERE `id` = ? AND `uid` = ?';
            const values = [
                req.body.title,
                req.body.desc,
                req.body.img,
                req.body.cate,
                req.body.status,
                req.params.id,
                userInfo.id
            ];
    
            connection.query(query, values, (err, date) => {
                connection.release();
                if (err) return res.status(500).json(err);
    
                return res.json('Post has been updated.')
            });
        });
    });
};
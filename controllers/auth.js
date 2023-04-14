import { poolConnection } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { JWT_SECRET_KEY } = process.env;


export const register = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email | !username | !password ) return;

    poolConnection(res, (connection) => {
        const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
        connection.query(query, [email, username], (err, data) => {
            if (err) return res.json(err);
            if (data.length) return res.status(409).json('User already exists');
    
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
    
            const query = 'INSERT INTO users(`username`, `email`, `password`) VALUES (?)';
            const values = [
                username,
                email,
                hash
            ]
            connection.query(query, [values], (err, data) => {
                connection.release();
                if (err) return res.json(err);
    
                return res.status(200).json('User has been created');
            });
        });
    });
};

export const login = (req, res) => {
    poolConnection(res, (connection) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        connection.query(query, [req.body.username], (err, data) => {
            connection.release();
            if (err) return res.json(err);
            if (data.length === 0) return res.status(404).json('User not found');
    
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    
            if (!isPasswordCorrect) return res.status(400).json('Wrong username or password');
    
            const token = jwt.sign({ id: data[0].id }, JWT_SECRET_KEY);
    
            const { password, ...other } = data[0];
            res.cookie('access_token', token, {
                httpOnly: true
            }).status(200).json(other);
        });
    });
};

export const logout = (req, res) => {
    res.clearCookie('access_token', {
        sameSite: 'none',
        secure: true
    }).status(200).json('User has been logged out.');
};
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

export const verifyAuth = (req, cb) => {
    const token = req.cookies.access_token;
    
    if (!token) return res.status(401).json('Not authenticated.')

    jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid.');
        cb(userInfo);
    });
};

export const getUserInfoFromToken = (req) => {
    return new Promise((res, rej) => {
        const token = req.cookies.access_token;

        if (token) {
            return jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
                if (err) rej('Token is not valid.')
                res(userInfo);
            });
        } else {
            res(false);
        }
    });
    
};
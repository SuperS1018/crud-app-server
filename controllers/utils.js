import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

export const verifyAuth = (req, res, cb) => {
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
        
        console.log('token :', token);
        console.log('JWT_SECRET_KEY :', JWT_SECRET_KEY);

        if (token) {
            return jwt.verify(token, JWT_SECRET_KEY, (err, userInfo) => {
                console.log('verify: ', userInfo, err);
                res(userInfo ?? false);
            });
        } else {
            res(false);
        }
    });
    
};
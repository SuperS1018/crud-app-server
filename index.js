import express from "express";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import cookieParser from "cookie-parser";
import multer from "multer";
import * as dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env || '3000';

console.log('env: ', process.env);

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${process.env.APP_URL || '../client/public'}/uploads/`)
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).json(req.file.filename);
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Connected to server with port ${PORT}`);
});
import express from "express";
import fileupload from 'express-fileupload';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import cookieParser from "cookie-parser";
import { upload } from "./controllers/upload.js";

const { PORT } = process.env || '3000';

const app = express();

app.use(fileupload());

app.use(express.json());
app.use(cookieParser());

app.post('/api/upload', upload);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Connected to server with port ${PORT}`);
});
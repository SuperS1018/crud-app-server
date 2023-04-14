import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    endpoint: "https://sfo3.digitaloceanspaces.com",
    forcePathStyle: false,
    region: "sfo3",
    credentials: {
      accessKeyId: "DO00RFYLG6JMDKTAXKKB",
      secretAccessKey: process.env.SPACES_SECRET
    }
});


export const upload = async (req, res) => {
  const filename = `${Date.now()}_${req.files.file.name}`;
  const params = {
    Bucket: "cdn-buckets",
    Key: `avatar-images/${filename}`,
    Body: req.files.file.data
  };
  
  try {
    await s3Client.send(new PutObjectCommand(params));
    res.status(200).json(filename);
  } catch (err) {
    req.status(500).json(err);
  }
};


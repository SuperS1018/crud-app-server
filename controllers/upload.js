import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    endpoint: process.env.SPACES_ENDPOINT,
    forcePathStyle: false,
    region: "sfo3",
    credentials: {
      accessKeyId: process.env.SPACES_KEY_ID,
      secretAccessKey: process.env.SPACES_SECRET_KEY
    }
});


export const upload = async (req, res) => {
  const filename = `${Date.now()}_${req.files.file.name}`;
  const params = {
    Bucket: "cdn-buckets",
    Key: `${filename}`,
    Body: req.files.file.data,
    ACL: 'public-read'
  };
  
  try {
    await s3Client.send(new PutObjectCommand(params));
    res.status(200).json(filename);
  } catch (err) {
    req.status(500).json(err);
  }
};


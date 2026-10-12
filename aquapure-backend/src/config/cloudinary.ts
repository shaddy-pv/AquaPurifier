import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env from root and relative paths
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const configureCloudinary = (): boolean => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    return true;
  }
  return false;
};

// Run initial configuration
configureCloudinary();

export const isCloudinaryConfigured = (): boolean => {
  return configureCloudinary();
};

export default cloudinary;

import express from 'express';
import multer from 'multer';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Configure Multer with memory storage (5MB max file size, image only)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed.'));
    }
  }
});

/**
 * Helper to upload buffer to Cloudinary
 */
const uploadBufferToCloudinary = (buffer: Buffer, folder = 'aquapure/products'): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload to Cloudinary failed'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
      }
    );
    uploadStream.end(buffer);
  });
};

// POST /api/upload/image (Multipart Form-Data) - Admin only
router.post('/image', authenticate, isAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary credentials are not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Please attach an image file with key "image".'
      });
    }

    const folder = (req.body.folder as string) || 'aquapure/products';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image to Cloudinary',
      error: error.message
    });
  }
});

// POST /api/upload/base64 (Base64 data URL) - Admin only
router.post('/base64', authenticate, isAdmin, async (req: AuthRequest, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary credentials are not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.'
      });
    }

    const { data, folder } = req.body;
    if (!data || typeof data !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid base64 data string.'
      });
    }

    const uploadResult = await cloudinary.uploader.upload(data, {
      folder: folder || 'aquapure/products',
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });
  } catch (error: any) {
    console.error('Cloudinary base64 upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image to Cloudinary',
      error: error.message
    });
  }
});

// GET /api/upload/status - Check if Cloudinary is configured
router.get('/status', authenticate, isAdmin, (_req, res) => {
  res.json({
    configured: isCloudinaryConfigured(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? `${process.env.CLOUDINARY_CLOUD_NAME.slice(0, 3)}***` : null
  });
});

export default router;

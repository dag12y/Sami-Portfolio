import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

export async function uploadVideoBuffer(buffer: Buffer, originalName: string) {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
  }

  const safeName = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');

  return new Promise<{ secureUrl: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 've-portfolio/videos',
        public_id: `${Date.now()}-${safeName}`,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

export async function uploadImageBuffer(buffer: Buffer, originalName: string) {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.');
  }

  const safeName = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');

  return new Promise<{ secureUrl: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 've-portfolio/thumbnails',
        public_id: `${Date.now()}-${safeName}`,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

export async function deleteCloudinaryVideo(publicId: string) {
  if (!isCloudinaryConfigured()) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
}

export async function deleteCloudinaryImage(publicId: string) {
  if (!isCloudinaryConfigured()) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

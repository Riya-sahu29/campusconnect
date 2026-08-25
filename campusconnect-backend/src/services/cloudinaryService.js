import cloudinary from '../config/cloudinary.js';

export const uploadResumeToCloudinary = (fileBuffer, originalFilename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'campusconnect/resumes',
        resource_type: 'image',
        format: 'pdf',
        type: 'upload',
        access_mode: 'public',
        public_id: `${Date.now()}-${originalFilename.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteResumeFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.error('Failed to delete old resume from Cloudinary:', err.message);
  }
};
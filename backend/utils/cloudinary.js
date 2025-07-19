require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


// Set up storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'sspinterest',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique public_id
  }),
});


module.exports = {
  cloudinary,
  storage,
};

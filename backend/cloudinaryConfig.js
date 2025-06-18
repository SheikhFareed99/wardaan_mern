const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dswff96z5',   
  api_key: '874951846429992',         
  api_secret: 'IGOQ4Fz7g6ql1dPlw1L10lxUuTg',   
  secure: true                     
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
                 // Optional folder name
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

module.exports = { cloudinary, storage };
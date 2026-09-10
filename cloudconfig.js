const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer=require('multer');
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let title = req.body.contributor.title || "file";
    title = title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
    return {
      folder: 'studyadda_DEV',
      resource_type: 'raw',       
      allowedFormats: ['pdf'],
      public_id: title,          
      overwrite: true,        
    };
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 200MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

module.exports = { cloudinary, storage, upload };


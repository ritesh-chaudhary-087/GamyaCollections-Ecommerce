const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Video storage for testimonials
const testimonialVideoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "getTrendy/testimonials/videos",
    allowed_formats: ["mp4", "webm", "mov", "avi", "mkv"],
    resource_type: "video",
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname
        .split(".")[0]
        .replace(/[^a-zA-Z0-9]/g, "_");
      return `testimonial_${timestamp}_${originalName}`;
    },
  },
});

const testimonialVideoUpload = multer({
  storage: testimonialVideoStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

module.exports = { testimonialVideoUpload };

const express = require("express");
const router = express.Router();
const {
  testimonialVideoUpload,
} = require("../middleware/testimonialVideoMulter");
const {
  uploadTestimonialVideo,
} = require("../controller/testimonialUploadController");

// POST /api/upload/testimonial-video
router.post(
  "/testimonial-video",
  testimonialVideoUpload.single("file"),
  uploadTestimonialVideo
);

module.exports = router;

const express = require("express");
const router = express.Router();
const testimonialController = require("../controller/testimonialController");

// Add testimonial video
router.post("/", testimonialController.addTestimonial);

// Get all testimonial videos
router.get("/", testimonialController.getTestimonials);

// Delete testimonial video
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;

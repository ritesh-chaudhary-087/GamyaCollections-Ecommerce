const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Testimonial", testimonialSchema);

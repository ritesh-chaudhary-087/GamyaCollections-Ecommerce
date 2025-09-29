const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", VideoSchema);



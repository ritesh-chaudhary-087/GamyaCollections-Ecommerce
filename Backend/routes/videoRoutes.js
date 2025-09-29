const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");

// Add video
router.post("/", videoController.addVideo);

// Get all videos
router.get("/", videoController.getVideos);

// Delete video
router.delete("/:id", videoController.deleteVideo);

module.exports = router;



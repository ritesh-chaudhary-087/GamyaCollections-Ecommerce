const Video = require("../models/Video");

exports.addVideo = async (req, res) => {
  try {
    const { videoUrl, description } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ success: false, message: "videoUrl is required" });
    }
    const video = new Video({ videoUrl, description });
    await video.save();
    res.status(201).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



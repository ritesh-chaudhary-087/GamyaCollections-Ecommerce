// Controller for uploading testimonial videos
const uploadTestimonialVideo = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No video file uploaded" });
    }
    res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: {
        url: file.path,
        public_id: file.filename,
        secure_url: file.path.replace("http://", "https://"),
      },
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error uploading video",
        error: error.message,
      });
  }
};

module.exports = { uploadTestimonialVideo };

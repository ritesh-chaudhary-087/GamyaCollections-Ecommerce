import React, { useEffect, useState } from "react";
import ApiService from "../components/API/api-service";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");
      const resp = await ApiService.getVideos();
      const list =
        resp?.data?.videos ||
        resp?.data?.data?.videos ||
        resp?.data?.data ||
        [];
      setVideos(list);
    } catch (e) {
      setError("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="container- m-auto py-14 flex flex-col justify-center items-center h-auto px-9 md:px-8 lg:px-16 overflow-hidden gap-4">
      <h2 className="text-4xl font-serif text-amber-900 mb-3">Video</h2>
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 max-w-7xl flex-wrap justify-center">
          {videos.length === 0 ? (
            <div className="text-gray-600">No videos found.</div>
          ) : (
            videos.map((v) => (
              <div key={v._id} className="flex justify-center px-10 sm:px-0">
                <video
                  src={v.videoUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full md:w-full h-[400px] rounded-lg "
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Video;

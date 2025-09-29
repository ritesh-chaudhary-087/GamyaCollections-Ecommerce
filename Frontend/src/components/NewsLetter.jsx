import aboutbanner from '/assets/Images/banner/newsletter.png';

const NewsLetter = () => {
  return (
    <div className="relative h-[400px]">
      <img
        src={aboutbanner}
        alt="Newsletter Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Content Section */}
      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="bg-opacity-80 p-4 rounded-lg gap-3 flex flex-col items-center">
          <h1 className="text-3xl text-center font-bold text-white">Subscribe to our Newsletter</h1>
          <p className="text-center text-white">Get the latest news and updates from us</p>
          <div className="flex justify-between items-center gap-4 bg-white w-[300px]">
            <input
              type="text"
              placeholder="Enter your email address"
              className=" p-2 rounded-lg focus:outline-none"
            />
            <button className="bg-[#a67c52] text-white p-2 px-4 w-40">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;

import React from "react";

const Showcase = () => {
  const images = {
    banner1: "/assets/Images/banner/banner1.png",
    banner2: "/assets/Images/banner/banner2.png",
    banner3: "/assets/Images/banner/banner3.png",
  };

  return (
    <div className="container-fluid py-14 flex justify-center h-auto px-4 md:px-8 lg:px-16 ">
      <div className="flex flex-col md:flex-row gap-4 max-w-7xl">
        <div className="flex justify-center  px-10 sm:px-0">
          <img src={images.banner1} alt="Banner 1" className="w-full  md:w-full h-[400px] rounded-lg shadow-md" />
        </div>
        <div className="flex justify-center ">
          <img src={images.banner2} alt="Banner 2" className="w-full sm:h-[400px] h-rounded-lg shadow-md" />
        </div>
        <div className="flex justify-center  px-10 sm:px-0">
          <img src={images.banner3} alt="Banner 3" className="w-full md:w-full sm:h-[400px] rounded-lg shadow-md " />
        </div>
      </div>
    </div>
  );
};

export default Showcase;
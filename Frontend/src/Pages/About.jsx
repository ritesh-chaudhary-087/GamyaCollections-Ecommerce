import Banner from "@/components/Banner";
import React from "react";
import banner from "/assets/Images/banner/aboutbanner.png";


import FeaturesSection from "@/components/features-section";
import FAQSection from "@/components/faq-section";
import AboutSection from "@/components/about-section";

const About = () => {
  return (
    <>
    
    <div className="container-fluid overflow-hidden">
      <Banner src={banner} />
      <div class="flex flex-col items-center text-center py-10">
        <div class="mb-4">
          <svg
            class="w-12 h-12 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          ></svg>
        </div>
        <h1 class="text-4xl font-serif font-bold mb-6">Where It All Began</h1>
        <p class="max-w-4xl text-gray-600 px-4 text-justify sm:text-center">
          Gamya Collections was founded by two cousin sisters who share a deep
          love for jewelry. Over the years, we built our own extensive
          collections, cherishing each piece as a reflection of our passion. One
          day, we decided to turn this shared love into something bigger—our
          very own business.
        </p>
        <p class="max-w-4xl text-gray-600 mt-5 px-4 text-justify sm:text-center"> 
          The name Gamya holds a special meaning for us, symbolizing both
          "beauty" and "destiny." What started as a simple idea has now grown
          into a dream we are determined to pursue. With your support, we hope
          to take this small venture to new heights and bring you carefully
          curated jewelry that you’ll love as much as we do.
        </p>
      </div>
      <FeaturesSection />
      <AboutSection />
      <FAQSection />
    </div>
    </>
  );
};

export default About;

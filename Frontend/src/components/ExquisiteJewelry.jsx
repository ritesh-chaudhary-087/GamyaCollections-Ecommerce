// ExquisiteJewelry.jsx

import React from 'react';

const ExquisiteJewelry = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-off-white">
      {/* Left Section */}
      <div className="relative flex-1">
        <div className="absolute left-0 top-0 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-4xl font-bold transform rotate-[-15deg]">
            A Touch Of Glamour, A Lifetime Of Memory
          </h1>
        </div>
        <img 
          src="path/to/your/image.jpg" 
          alt="Jewelry model" 
          className="rounded-full w-3/4 md:w-1/2 shadow-2xl"
        />
        <div className="absolute bottom-0 left-0 right-0 text-center mt-4">
          <button className="bg-indigo-500 text-white py-2 px-4 rounded-full">
            KNOW MORE
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 mt-8 md:mt-0 md:pl-10">
        <h2 className="text-2xl font-bold">About Us</h2>
        <p className="mt-4 text-gray-700">
          Celebrate Life’s Moments With Exquisite Jewelry. Nunc In Arcu Et Nunc
          Scelerisque Dignissim. Aliquam Enim Nunc, Volutpat Eget Ipsum Id,
          Varius Sodales Mi. Vestibulum Ante Ipsum Primis In Faucibus Orci 
          Luctus Et Ultrices Posuere Cubilia Curae. Viverra Vivamus Ultricies
          Sed Erat Et Egestas. Phasellus Ut Ex Lacus.
        </p>
        
        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-indigo-100 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold">20+</h3>
            <p>Worldwide Branch</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold">300+</h3>
            <p>Unique Designs</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold">2K</h3>
            <p>User Reviews</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold">100K</h3>
            <p>Happy Clients</p>
          </div>
        </div>

        <blockquote className="mt-8 text-gray-600 italic">
          “Maecenas Porta Id Nibh Quis Imperdiet. Quisque Hendrerit, Justo 
          Egestas Fermentum Pulvinar”
        </blockquote>

        <div className="mt-6">
          <button className="bg-indigo-500 text-white py-2 px-4 rounded-full">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExquisiteJewelry;
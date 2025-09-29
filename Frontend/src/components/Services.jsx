import React from 'react';

const Services = () => {
  const icons = [
    {
      icon: "assets/Images/icon/free_shipping.png",
      title: "Free Shipping",
      description: "Free shipping on all orders",
    },
    {
      icon: "assets/Images/icon/support247.png",
      title: "SUPPORT 24/7",
      description: "Support 24 hours a day",
    },
    {
      icon: "assets/Images/icon/money_back.png",
      title: "Money Return",
      description: "30 days for free return",
    },
    {
      icon: "assets/Images/icon/promotions.png",
      title: "ORDER DISCOUNT",
      description: "On every order over ₹499",
    },
  ];

  return (
    <div className="container-fluid py-14 flex justify-center items-center">
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center max-w-7xl">
        {icons.map((icon, index) => (
          <div className="flex items-center gap-4 text-center md:text-left" key={index}>
            <div className="w-12 h-12 flex-shrink-0">
              <img src={icon.icon} alt="service" className="w-full h-full object-contain" />
            </div>
            <div className="service-content">
              <h4 className="font-bold text-lg">{icon.title}</h4>
              <p className="text-sm text-gray-500">{icon.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;

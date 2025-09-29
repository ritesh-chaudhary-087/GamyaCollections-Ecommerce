import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * WhatsAppEnquiryButton Component
 * This component generates a WhatsApp enquiry button that sends a message
 * including the product details and a link to the current page.
 *
 * @param {string} productName - The name of the product.
 * @param {number} productPrice - The price of the product.
 * @param {string} productUrl - The URL of the product page.
 * @param {number} quantity - The quantity of the product the user wants to inquire about.
 * @param {string} phoneNumber - The phone number to send the enquiry to (without `+` or `-`).
 */
const WhatsAppEnquiryButton = ({ productName, productPrice, productUrl, quantity, phoneNumber }) => {
  // Construct the message for WhatsApp
  const message = `
    Hello, I am looking for the product "${productName}" which is priced at ₹${productPrice.toFixed(2)}.
  I would like to buy ${quantity} piece(s).
  You can find the product details here: ${productUrl}
  `;
 


  // Encode the message to ensure proper formatting for WhatsApp
  const encodedMessage = encodeURIComponent(message);

  // Construct the WhatsApp URL with the message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-amber-600 text-white py-3 px-4 rounded-md flex items-center justify-center font-medium hover:bg-amber-700 transition-colors w-full"
    >
      {/* WhatsApp Icon */}
      <FaWhatsapp size={24} className="mr-2" />
      Enquiry on WhatsApp
    </a>
  );
};

export default WhatsAppEnquiryButton;

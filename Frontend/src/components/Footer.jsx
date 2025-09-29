import { FacebookIcon, InstagramIcon, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";



const SocialIcons = ({ className }) => (
  <div className={`flex space-x-4 ${className}`}>
    <a
      href="https://www.instagram.com/gamya_collections/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-900 hover:text-[#A63C15] transition duration-300"
    >
      <InstagramIcon className="h-6 w-6" />
    </a>
    <a
      href="https://www.facebook.com/people/GamyaCollections/61566820012535"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-900 hover:text-[#A63C15] transition duration-300"
    >
      <FacebookIcon className="h-6 w-6" />
    </a>
    {/* <a
      href=""
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-900 hover:text-[#A63C15] transition duration-300"
    >
      <MessageCircle className="h-6 w-6" />
    </a> */}
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#f8f4e3] text-[#7d5a45] px-4 md:px-8 lg:px-16 pt-8 pb-4 m-auto">
      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <img
          src="/assets/Images/logo/gamya.png"
          alt="Gamya Collections"
          className="h-24"
        />
      </div>

      {/* Main Footer Content */}
      <div className="container-fluid m-auto flex justify-start sm:justify-center ">

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pb-8 md:max-w-6xl ">
        {/* Newsletter Section */}
        <div className="">
          <h3 className="text-2xl font-semibold mb-4">About</h3>
          <p className="mb-4">
            Be the first to know about sales, new product launches, and
            exclusive offers!
          </p>
          <div className="flex gap-2">
            <SocialIcons className="mb-4 md:mb-0" />
          </div>
        </div>

        {/* Company Section */}
        <div className="sm:mx-auto">
          
          <h3 className="text-2xl font-semibold mb-4">Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/about"
                className="hover:underline hover:text-[#A63C15] transition duration-300"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:underline hover:text-[#A63C15] transition duration-300"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/necklaces"
                className="hover:underline hover:text-[#A63C15] transition duration-300"
              >
                Necklaces
              </Link>
            </li>
            <li>
              <Link
                to="/earrings"
                className="hover:underline hover:text-[#A63C15] transition duration-300"
              >
                Earrings
              </Link>
            </li>
          </ul>
        </div>

        {/* Policy Section */}
        <div className="sm:mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Policy</h3>
          <ul className="space-y-2">
          <li>
              <Link
                to="/policys/terms"
                className="hover:underline hover:text-[#A63C15] transition duration-300"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                 to="/policys/shipping"
                className="hover:underline hover:text-[#A63C15] transition duration-300"
              >
                Shipping and Delivery
              </Link>
            </li>
            <li>
              <Link
                 to="/policys/returns"
                className="hover:underline hover:text-[#A63C15] transition duration-300"
              >
                Return Policy
              </Link>
            </li>
            
            
            <li>
              <Link
                to="/policys/privacy"
                className="hover:underline hover:text-[#A63C15] transition duration-300"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Details Section */}
        <div className="sm:mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Support Details</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Phone/Whatsapp</p>
              <p>+91 91377 42517</p>
            </div>
            <div>
              <p className="font-medium">Contact us at</p>
              <p>gamya.gc@gmail.com</p>
            </div>
            {/* <div>
              <p className="font-medium">Call & Chat Support</p>
              <p>Mon - Sat (10 AM - 7 PM)</p>
            </div> */}
          </div>
        </div>
      </div>
      </div>
      {/* Divider */}
      <div className="border-t border-[#7d5a45] my-6"></div>

      {/* Bottom Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Social Media Links */}

        {/* Copyright */}
        <div className="text-center mb-4 md:m-auto">
          <p className="text-sm">
            Copyright © 2025 <span className="text-[#A63C15] font-semibold ">Gamya Collections
              </span> All rights reserved. Design and developed
            by <a href="https://arisecommunications.co/"  target="_blank" rel="noopener noreferrer" className="text-[#A63C15] font-semibold ">Arise Communications.</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

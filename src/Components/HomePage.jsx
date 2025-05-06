import React from 'react';
import { FaLinkedin } from "react-icons/fa";
import { FaBehance } from "react-icons/fa";
import { Link } from 'react-router-dom'; 
import ChateoLogo from './ChateoLogo.png'

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#FFFFFF] rounded-xl">
      <div className="max-w-md">
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-6">
          <img src={ChateoLogo}
          alt="Chateo Logo" 
          />
        </div>

        {/* Description */}
        <p className='text-justify'>
          Chateo has been created to help designers for
          your next project. This UI kit is completely free 
          for personal or commercial purposes.
          If you have any feedback, reach me out on Linkedin.
        </p>

        {/* Divider */}
        <div className="border-t bg-primary my-8"></div>

        {/* Author */}
        <div className="text-gray-800">
          <p className="font-semibold mb-2">by Johnnysky</p>
          <p className="mb-4">
            You can <a href="https://buymeacoffee.com/24hourspent" className="text-indigo-600 underline">buy me a coffee</a> or <a href="https://trakteer.id/24hourspent" className="text-indigo-600 underline">milo</a>
            <span className="ml-1">👋</span>
          </p>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a href="https://linkedin.com/in/johnnysky" className="flex items-center text-gray-700 hover:text-indigo-600 underline gap-1 text-sm">
              <div className="text-2xl">
                <FaLinkedin />
              </div>
              @Johnnysky
            </a>
            <Link
              to="/WalkThrough"
              className="flex items-center text-gray-700 hover:text-indigo-600 gap-1 text-sm py-4">
              <div className="text-2xl">
                <FaBehance />
              </div>
              visit the Behance Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

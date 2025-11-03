import React from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import JohnnyskyLogo from '../Assets/Images/JohnnyskyLogo.png'

const Help = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: "Help Center", path: "/help-center" },
    { title: "Terms and Privacy Policy", path: "/terms" },
    { title: "Channel reports", path: "/channel-reports" },
    { title: "Licenses", path: "/licenses" },
  ];

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-black text-black dark:text-white flex flex-col justify-between text-sm">
      {/* Header */}
      <div className="relative flex items-center px-4 py-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800">
        <button onClick={() => navigate(-1)} className="text-xl text-black dark:text-white z-10">
          <MdChevronLeft />
        </button>

        {/* Centered Title */}
        <div className="absolute left-0 right-0 flex flex-col items-center">
          <h1 className="text-base font-semibold">Chateo</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Version 2.25.7.77</p>
        </div>
      </div>

      {/* Icon */}
      <div className="flex-grow flex items-center justify-center px-4 py-6">
        <img
          src={JohnnyskyLogo} // Replace with your actual path
          alt="Chateo Logo"
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* Menu */}
      <div className="px-4">
        <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden divide-y divide-gray-200 dark:divide-gray-700 mb-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full text-left px-4 py-3 text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              {item.title}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 pb-6">© 2025 Oluwaseyi Johnson</p>
      </div>
    </div>
  );
};

export default Help;

import React from 'react';
import { Link } from 'react-router-dom'; 
import illustrationLight from '../Assets/Images/Illustration.png';
import illustrationDark from '../Assets/Images/Illustration-dark.png';

const WalkThrough = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-8 py-12 bg-white text-black dark:bg-black dark:text-white">
      
      {/* Top Image */}
      <div className="flex-1 flex items-center justify-center">
        {/* Light mode image */}
        <img 
          src={illustrationLight}
          alt="Messaging Illustration Light" 
          className="max-h-80 object-contain block dark:hidden"
        />
        {/* Dark mode image */}
        <img 
          src={illustrationDark}
          alt="Messaging Illustration Dark" 
          className="max-h-80 object-contain hidden dark:block"
        />
      </div>

      {/* Text */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Connect easily with <br /> your family and friends <br /> over countries
        </h2>
      </div>

      {/* Terms */}
      <div className="text-center text-base mb-8 pt-28">
        Terms & Privacy Policy
      </div>

      {/* Start Messaging Button */}
      <div className="w-full">
        <Link to="/VerifyPage" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-4 rounded-full">
          Start Messaging
        </Link>
      </div>

    </div>
  );
};

export default WalkThrough;

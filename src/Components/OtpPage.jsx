import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IoBackspaceOutline } from "react-icons/io5";
import { MdChevronLeft } from "react-icons/md";


export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone } = location.state || {}; // receiving phone number from VerifyPage

  const [otp, setOtp] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);

  const keypadNumbers = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
         '0', 'backspace'
  ];

  const handleInput = (value) => {
    if (value === 'backspace') {
      setOtp(otp.slice(0, -1));
    } else {
      setOtp((prev) => prev + value);
    }
  };

  const handleBack = () => {
    navigate('/VerifyPage'); 
  };

  const handleResend = () => {
    navigate('/VerifyPage'); 
  };

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white relative">
      <div>
        <button onClick={handleBack} className="text-2xl mb-6"><MdChevronLeft /></button>

        <div className="flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold mb-4">Enter OTP</h1>
          <p className="text-gray-500 mb-6 text-center">We sent an OTP to <br /> <span className="font-semibold">{phone}</span></p>

          {/* OTP display input */}
          <input
            type="text"
            value={otp}
            onFocus={() => setShowKeypad(true)}
            readOnly
            className="text-center border-b-2 text-2xl tracking-widest focus:outline-none focus:border-blue-500 mb-6"
            placeholder="Enter OTP"
          />
        </div>

        <button
          onClick={handleResend}
          className="w-full text-primary py-3 text-sm hover:bg-blue-700 transition mb-8"
        >
          Resend Code
        </button>
      </div>

      {/* Keypad */}
      {showKeypad && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7FC] shadow-2xl">
          <div className="grid grid-cols-3 gap-6 text-2xl text-center">
            {keypadNumbers.map((key, idx) => (
              <button
                key={idx}
                onClick={() => handleInput(key)}
                className="py-4 rounded-md bg-[#F7F7FC] hover:bg-gray-200"
              >
                {key === 'backspace' ? (
                  <IoBackspaceOutline />
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

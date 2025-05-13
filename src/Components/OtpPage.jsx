import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoBackspaceOutline } from "react-icons/io5";
import { MdChevronLeft } from "react-icons/md";

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone } = location.state || {};

  const [otp, setOtp] = useState('');
  const [showKeypad, setShowKeypad] = useState(true);

  const keypadNumbers = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '', '0', 'backspace'
  ];

  const handleInput = (value) => {
    if (value === 'backspace') {
      setOtp((prev) => prev.slice(0, -1));
    } else if (otp.length < 4) {
      const newOtp = otp + value;
      setOtp(newOtp);

      if (newOtp.length === 4) {
        // Save verified phone number to localStorage
        localStorage.setItem('registeredPhone', phone);

        // Simulate short delay before navigating
        setTimeout(() => navigate('/ProfileAcc'), 300);
      }
    }
  };

  const handleBack = () => navigate('/VerifyPage');
  const handleResend = () => setOtp('');

  useEffect(() => {
    setShowKeypad(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white relative text-black">
      <div>
        <button onClick={handleBack} className="text-2xl mb-6 pb-8"><MdChevronLeft /></button>

        <div className="flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold mb-2">Enter Code</h1>
          <p className="text-gray-500 mb-4 text-sm text-center">
            We have sent you an SMS with the code to <br />
            <span className="font-semibold">{phone}</span>
          </p>

          {/* OTP Circles */}
          <div className="flex gap-4 mb-6 pb-6 pt-6">
            {[0, 1, 2, 3].map((index) => {
              const char = otp[index] || '';
              return (
                <div
                  key={index}
                  className={`w-6 h-6 flex items-center justify-center text-xl font-semibold
                    ${char ? '' : 'rounded-full border-2 border-[#EDEDED] bg-[#EDEDED]'}`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleResend}
          className="w-full text-primary py-3 text-sm transition mb-8"
        >
          Resend Code
        </button>
      </div>

      {/* Keypad */}
      {showKeypad && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7FC] shadow-2xl text-black">
          <div className="grid grid-cols-3 gap-4 text-2xl text-center p-2">
            {keypadNumbers.map((key, idx) => (
              <button
                key={idx}
                onClick={() => key && handleInput(key)}
                className="py-2 bg-[#F7F7FC] hover:bg-gray-200"
              >
                {key === 'backspace' ? <IoBackspaceOutline className='ml-10' /> : key}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
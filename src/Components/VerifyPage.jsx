import { useState } from 'react';

export default function VerifyPage() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleInput = (value) => {
    if (value === 'backspace') {
      setPhoneNumber(phoneNumber.slice(0, -1));
    } else {
      setPhoneNumber((prev) => prev + value);
    }
  };

  const handleContinue = () => {
    // Handle continue action
    console.log('Phone Number:', `+62${phoneNumber}`);
  };

  const keypadNumbers = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '0', 'backspace'
  ];

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white">
      <div>
        <button className="text-2xl mb-6">&#8592;</button> {/* Back button */}
        <h1 className="text-2xl font-bold mb-2">Enter Your Phone Number</h1>
        <p className="text-gray-500 mb-6">Please confirm your country code and enter your phone number</p>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1 bg-gray-100 p-2 rounded-md">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg" 
              alt="Indonesia Flag"
              className="w-5 h-5 rounded-sm"
            />
            <span className="text-gray-700 font-medium">+62</span>
          </div>
          <input
            type="text"
            value={phoneNumber}
            className="flex-1 border-b-2 focus:outline-none focus:border-blue-500 text-lg"
            placeholder="Phone Number"
            readOnly
          />
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition mb-8"
        >
          Continue
        </button>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-6 text-2xl text-center mb-4">
        {keypadNumbers.map((key, idx) => (
          <button
            key={idx}
            onClick={() => handleInput(key)}
            className="py-4 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            {key === 'backspace' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 mx-auto"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4l1.41 1.41L6.83 12l6.58 6.59L12 20l-8-8z" />
              </svg>
            ) : (
              key
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { IoBackspaceOutline } from "react-icons/io5";
import { MdChevronLeft } from "react-icons/md";

const countries = [
  { name: 'Indonesia', code: '+62', flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg' },
  { name: 'United States', code: '+1', flag: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg' },
  { name: 'United Kingdom', code: '+44', flag: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg' },
];

export default function VerifyPage() {
  const navigate = useNavigate(); 

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

  const handleInput = (value) => {
    if (value === 'backspace') {
      setPhoneNumber(phoneNumber.slice(0, -1));
    } else {
      setPhoneNumber((prev) => prev + value);
    }
  };

  const keypadNumbers = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
         '0', 'backspace'
  ];

  const handleContinue = () => {
    if (phoneNumber.length < 7) {
      alert('Please enter a valid phone number.');
      return;
    }
    
    const fullPhoneNumber = selectedCountry.code + phoneNumber;
    console.log('Full phone number:', fullPhoneNumber);
  
    navigate('/OtpPage', { state: { phone: fullPhoneNumber } }); // navigate to OTP page with phone number
  };
  
  const handleBack = () => {
    navigate('/WalkThrough'); 
  };

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white relative">
      <div>
        <button onClick={handleBack} className="text-2xl mb-6"><MdChevronLeft /></button> 
        
        <h1 className="text-2xl font-bold mb-2">Enter Your Phone Number</h1>
        <p className="text-gray-500 mb-6 text-center">Please confirm your country code and enter your phone number</p>

        {/* Country code and phone number input */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setShowCountryModal(true)}
            className="flex items-center gap-1 bg-gray-100 p-2 rounded-md"
          >
            <img src={selectedCountry.flag} alt="flag" className="w-5 h-5 rounded-sm" />
            <span className="text-gray-700 font-medium">{selectedCountry.code}</span>
          </button>

          <input
            type="text"
            value={phoneNumber}
            onFocus={() => setShowKeypad(true)}
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
      {showKeypad && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7FC] p-1 shadow-2xl">
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

      {/* Country Modal */}
      {showCountryModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-80 max-h-[400px] overflow-y-auto p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Select Country</h2>
            {countries.map((country, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedCountry(country);
                  setShowCountryModal(false);
                }}
                className="flex items-center w-full gap-3 p-2 hover:bg-gray-100 rounded-md"
              >
                <img src={country.flag} alt="flag" className="w-6 h-6 rounded-sm" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{country.name}</span>
                  <span className="text-xs text-gray-500">{country.code}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

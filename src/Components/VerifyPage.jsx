import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { MdChevronLeft } from "react-icons/md";
import { IoBackspaceOutline } from "react-icons/io5";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function VerifyPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);

  const handleInput = (value) => {
    if (value === 'backspace') {
      setPhoneNumber((prev) => prev.slice(0, -1));
    } else {
      setPhoneNumber((prev) => prev + value);
    }
  };

  const handleContinue = () => {
    if (phoneNumber.length < 7) {
      alert('Please enter a valid phone number.');
      return;
    }

    const fullPhoneNumber = '+' + phoneNumber;
    navigate('/OtpPage', { state: { phone: fullPhoneNumber } });
  };

  const handleBack = () => navigate('/WalkThrough');

  const keypadNumbers = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '', '0', 'backspace'
  ];

  return (
    <div className="flex flex-col min-h-screen justify-between p-6 bg-white dark:bg-black text-black dark:text-white">
      <div>
        <button onClick={handleBack} className="text-2xl mb-6">
          <MdChevronLeft />
        </button>

        <h1 className="text-2xl pt-12 font-bold mb-2">Enter Your Phone Number</h1>
        <p className="mb-6 text-center">Please confirm your country code and enter your phone number</p>

        <div className="mb-6 pt-4 pb-8" onClick={() => setShowKeypad(true)}>
          <PhoneInput
            country={'id'}
            value={phoneNumber}
            onChange={setPhoneNumber}
            inputProps={{
              name: 'phone',
              required: true,
              readOnly: true,
              onFocus: () => setShowKeypad(true),
            }}
            placeholder="Phone Number"
            containerStyle={{
              width: '100%',
              backgroundColor: '#F7F7FC',
            }}
            inputStyle={{
              width: '100%',
              borderBottom: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: 0,
              fontSize: '1rem',
              backgroundColor: '#F7F7FC',
              color: 'inherit',
            }}
            buttonStyle={{
              backgroundColor: '#F7F7FC',
            }}
            dropdownStyle={{
              color: 'black',
            }}
            enableSearch
          />
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-full text-[16px] hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>

      {showKeypad && (
        <div className="grid grid-cols-3 gap-4 text-2xl text-center mt-6 bg-[#F7F7FC] dark:bg-black p-2 absolute bottom-0 w-full left-0">
          {keypadNumbers.map((key, idx) => (
            <button
              key={idx}
              onClick={() => key && handleInput(key)}
              className="py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-black dark:text-white"
            >
              {key === 'backspace' ? <IoBackspaceOutline className="mx-auto" /> : key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
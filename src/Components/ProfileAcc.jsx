import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RiUserLine } from "react-icons/ri";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdChevronLeft } from "react-icons/md";
import { IoBackspaceOutline } from "react-icons/io5";

export default function ProfileAcc() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [focusedField, setFocusedField] = useState('first');

  const handleBack = () => {
    navigate('/OtpPage');
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      alert('First Name is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (response.ok) {
        navigate('/ContactPage');
      } else {
        alert('Failed to save profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error');
    }
  };

  const alphabetKeys = [
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'backspace',
  ];

  const handleInput = (key) => {
    if (focusedField === 'first') {
      setFirstName((prev) =>
        key === 'backspace' ? prev.slice(0, -1) : prev + key
      );
    } else {
      setLastName((prev) =>
        key === 'backspace' ? prev.slice(0, -1) : prev + key
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-white pb-32 relative text-black dark:bg-black dark:text-white">
      <button onClick={handleBack} className="text-lg mb-4 text-left flex items-center gap-1">
        <MdChevronLeft className="text-xl" /> Your Profile
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-600">
            <RiUserLine />
          </div>
          <div className="absolute bottom-0 right-0">
            <AiFillPlusCircle className="text-2xl" />
          </div>
        </div>
      </div>

      <input
        type="text"
        value={firstName}
        onFocus={() => setFocusedField('first')}
        readOnly
        className={`border p-3 rounded-md mb-4 w-full text-sm focus:outline-none ${focusedField === 'first' ? 'ring-2 ring-blue-500' : ''}`}
        placeholder="First Name (Required)"
      />

      <input
        type="text"
        value={lastName}
        onFocus={() => setFocusedField('last')}
        readOnly
        className={`border p-3 rounded-md mb-6 w-full text-sm focus:outline-none ${focusedField === 'last' ? 'ring-2 ring-blue-500' : ''}`}
        placeholder="Last Name (Optional)"
      />

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-[#F7F7FC] py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
      >
        Save
      </button>

      {/* Alphabet Keyboard */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7FC] shadow-2xl">
        <div className="grid grid-cols-6 gap-3 text-center text-lg p-2">
          {alphabetKeys.map((key, idx) => (
            <button
              key={idx}
              onClick={() => handleInput(key)}
              className="py-2 px-4 hover:bg-gray-200"
            >
              {key === 'backspace' ? <IoBackspaceOutline className="mx-auto" /> : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

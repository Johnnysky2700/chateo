import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RiUserLine } from "react-icons/ri";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdChevronLeft } from "react-icons/md";

export default function ProfileAcc() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleBack = () => {
    navigate('/OtpPage');
  };

  const handleSave = async () => {
    if (!firstName.trim() || !middleName.trim() || !lastName.trim()) {
      alert('First name, Middle name, and Last name are all required.');
      return;
    }

    const phoneNumber = localStorage.getItem('registeredPhone');

    try {
      const response = await fetch('http://127.0.0.1:5000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, middleName, lastName, phone: phoneNumber }),
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

  return (
    <div className="flex flex-col min-h-screen p-6 bg-white pb-32 relative text-black dark:bg-black dark:text-white">
      <button onClick={handleBack} className="text-lg mb-4 text-left flex items-center gap-1">
        <MdChevronLeft className="text-xl" /> Your Profile
      </button>

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-[#F7F7FC] rounded-full flex items-center justify-center text-4xl text-gray-600">
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
        onChange={(e) => setFirstName(e.target.value)}
        className="border p-2 rounded-md mb-4 w-full bg-[#F7F7FC] text-sm focus:outline-none"
        placeholder="First Name (Required)"
      />

      <input
        type="text"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
        className="border p-2 rounded-md mb-4 w-full bg-[#F7F7FC] text-sm focus:outline-none"
        placeholder="Middle Name (Required)"
      />

      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border p-2 rounded-md mb-6 w-full bg-[#F7F7FC] text-sm focus:outline-none"
        placeholder="Last Name (Required)"
      />

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-[#F7F7FC] py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
      >
        Save
      </button>
    </div>
  );
}
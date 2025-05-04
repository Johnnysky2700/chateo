import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { RiGroupLine } from "react-icons/ri";
import { CgPlayListCheck } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";
import Icon from "./Icon.png"

export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:8000/contacts');
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };

    fetchContacts();
  }, []);

  const recentContacts = contacts.slice(0, 3); // top 3 shown in story circle

  return (
    <div className="min-h-screen bg-white p-4 pb-24 text-black dark:bg-black dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 py-4">
        <h1 className="text-xl">Chats</h1>
        <div className="flex items-center space-x-2 text-2xl">
          <img
          src={Icon}
          alt="icon"
          className='bg-white'
         />
          <button><CgPlayListCheck /></button>
        </div>
      </div>

      {/* Story Circles */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#F7F7FC] border border-[#ADB5BD] text-3xl">
            <FaPlus className='w-4 h-4 text-sm text-[#ADB5BD]'/>
          </div>
          <p className="text-xs mt-1">Your Story</p>
        </div>

        {recentContacts.map((contact) => (
          <div key={contact.id} className="flex flex-col items-center">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="rounded-2xl border-2 border-blue-500 object-cover"
              />
            ) : (
              <div className="rounded-2xl bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                {contact.initials}
              </div>
            )}
            <p className="text-xs mt-1 truncate w-16 text-center">{contact.name.split(' ')[0]}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Placeholder"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Chat list */}
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id} className="flex items-center justify-between py-4 border-b">
            <div className="flex gap-3">
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="bg-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-semibold">
                  {contact.initials}
                </div>
              )}
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-gray-400 text-sm">Sample message here</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{contact.online ? 'Today' : '17/6'}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">
                1
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-6 text-black dark:bg-black dark:text-white">
        <button onClick={() => navigate('/ContactPage')} className="text-2xl">
          <RiGroupLine />
        </button>
        <button className="text-center text-sm">
          Chats
        </button>
        <button className="text-center text-sm"
          onClick={() => navigate('/MorePage')}>
          <span className="block text-2xl"><FiMoreHorizontal /></span>
        </button>
      </div>
    </div>
  );
}

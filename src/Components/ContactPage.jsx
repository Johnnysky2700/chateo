import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { HiPlus } from 'react-icons/hi';
import { RiChat3Line } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:8000/contacts');
        const data = await res.json();
        setContacts(data);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 pb-24 relative text-black dark:bg-black dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 py-4">
        <h1 className="text-xl">Contacts</h1>
        <button className="text-2xl">
          <HiPlus />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md"
          placeholder="Search"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Contact List */}
      <ul>
        {filteredContacts.map((contact) => (
          <li key={contact.id} className="flex items-center gap-3 py-3 border-b">
            {contact.avatar ? (
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
            ) : (
              <div className="relative bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold">
                {contact.initials}
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
            )}

            <div>
              <p className="font-medium">{contact.name}</p>
              <p className={`text-sm ${contact.online ? 'text-green-500' : 'text-gray-400'}`}>
                {contact.status}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-6 text-black dark:bg-black dark:text-white">
        <button className="text-sm">Contacts</button>

        <button
          className="text-center text-sm"
          onClick={() => navigate('/ChatPage')}
        >
          <span className="block text-2xl">
            <RiChat3Line />
          </span>
        </button>

        <button className="text-center text-sm"
          onClick={() => navigate('/MorePage')}>
          <span className="block text-2xl"><FiMoreHorizontal /></span>
        </button>
      </div>
    </div>
  );
}

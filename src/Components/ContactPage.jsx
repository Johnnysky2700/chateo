import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import BottomNav from './BottomNav'; // adjust path as needed

const contactsData = [
  {
    id: 1,
    name: 'Athalia Putri',
    avatar: '/avatars/athalia.jpg',
    status: 'Last seen yesterday',
    online: false,
  },
  {
    id: 2,
    name: 'Erlan Sadewa',
    avatar: '/avatars/erlan.jpg',
    status: 'Online',
    online: true,
  },
  {
    id: 3,
    name: 'Midala Huera',
    avatar: '/avatars/midala.jpg',
    status: 'Last seen 3 hours ago',
    online: false,
  },
  {
    id: 4,
    name: 'Nafisa Gitari',
    avatar: '/avatars/nafisa.jpg',
    status: 'Online',
    online: true,
  },
  {
    id: 5,
    name: 'Raki Devon',
    avatar: null,
    initials: 'RD',
    status: 'Online',
    online: true,
  },
  {
    id: 6,
    name: 'Salsabila Akira',
    avatar: null,
    initials: 'SA',
    status: 'Last seen 30 minutes ago',
    online: false,
  },
];

export default function ContactPage() {
  const [search, setSearch] = useState('');

  const filteredContacts = contactsData.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Contacts</h1>

        <div className="relative mb-6">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7FC] rounded-md focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-4">
              {contact.avatar ? (
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
              ) : (
                <div className="relative w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {contact.initials}
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
              )}
              <div>
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

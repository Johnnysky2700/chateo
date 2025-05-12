import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CgPlayListCheck } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";
import { RiChatNewLine } from "react-icons/ri";
import Footer from "./Footer";

export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch contacts from localStorage or API
  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      fetchContacts(); // Fetch from API if not found in localStorage
    }
  }, []);

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:8000/contacts");
      const data = await res.json();

      setContacts(data);
      // Save the fetched contacts to localStorage
      localStorage.setItem('contacts', JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  const toggleChatSelection = (id) => {
    setSelectedChats((prev) =>
      prev.includes(id) ? prev.filter((chatId) => chatId !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    const updatedContacts = contacts.filter((c) => !selectedChats.includes(c.id));
    setContacts(updatedContacts);

    // Update localStorage with the updated contacts
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));

    setSelectedChats([]);
    setSelectMode(false);
  };

  const handleReadAll = () => {
    alert("All selected chats marked as read (mock action)");
  };

  const handleArchive = () => {
    alert("Selected chats archived (mock action)");
  };

  const recentContacts = contacts.slice(0, 3);

  const filteredContacts = contacts.filter((contact) =>
    (contact.name || "Unknown").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 pb-24 text-black dark:bg-black dark:text-white relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 py-4">
        <h1 className="text-xl">Chats</h1>
        <div className="flex items-center space-x-2 text-xl">
          <button onClick={() => setShowModal(true)}>
            <RiChatNewLine />
          </button>
          <button onClick={() => setSelectMode(!selectMode)}>
            <CgPlayListCheck className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Story Circles */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-4">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowStoryModal(true)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#F7F7FC] border border-[#ADB5BD] text-3xl"
          >
            <FaPlus className="w-4 h-4 text-sm text-[#ADB5BD]" />
          </button>
          <p className="text-xs mt-1">Your Story</p>
        </div>

        {recentContacts.map((contact) => (
          <div key={contact.id} className="flex flex-col items-center">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="rounded-2xl border-2 border-blue-500 object-cover w-12 h-12"
              />
            ) : (
              <div className="rounded-2xl bg-blue-500 flex items-center justify-center text-white font-semibold text-sm w-12 h-12">
                {contact.initials}
              </div>
            )}
            <p className="text-xs mt-1 truncate w-16 text-center">
              {contact.name.split(" ")[0]}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Chat Actions */}
      {selectMode && selectedChats.length > 0 && (
        <div className="fixed bottom-16 left-4 right-4 z-40 flex justify-around items-center py-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <button onClick={handleArchive} className="text-sm text-blue-600">Archive</button>
          <button onClick={handleReadAll} className="text-sm text-green-600">Read All</button>
          <button onClick={handleDelete} className="text-sm text-red-600">Delete</button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="placeholder"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Chat list */}
      <ul>
        {filteredContacts.map((contact) => (
          <li
            key={contact.id}
            className="flex items-center justify-between py-4 border-b transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div
              className="flex gap-3 items-center cursor-pointer w-full"
              onClick={() => {
                if (selectMode) {
                  toggleChatSelection(contact.id);
                } else {
                  navigate(`/ChatDetails/${contact.id}`);
                }
              }}
            >
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selectedChats.includes(contact.id)}
                  onChange={() => toggleChatSelection(contact.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="rounded-xl object-cover w-12 h-12"
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
              <p className="text-xs text-gray-500">{contact.online ? "Today" : "17/6"}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">
                1
              </span>
            </div>
          </li>
        ))}
      </ul>

      <Footer />

      {/* Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-80 text-black dark:text-white">
            <h2 className="text-lg font-semibold mb-4">Add New Story</h2>
            <input type="file" accept="image/*,video/*" className="mb-4" />
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => setShowStoryModal(false)}
            >
              Upload
            </button>
            <button
              className="mt-2 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              onClick={() => setShowStoryModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Start Chat Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-80 max-h-[80vh] overflow-y-auto text-black dark:text-white">
            <h2 className="text-lg font-semibold mb-4">Start New Chat</h2>
            <ul>
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  onClick={() => {
                    setShowModal(false);
                    navigate(`/ChatDetails/${contact.id}`);
                  }}
                >
                  {contact.avatar ? (
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-sm font-semibold">
                      {contact.initials}
                    </div>
                  )}
                  <div>
                    <p>{contact.name}</p>
                    <p className="text-xs text-gray-400">{contact.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { useContacts } from "../ContactContext";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CgPlayListCheck } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";
import { RiChatNewLine } from "react-icons/ri";
import Footer from "./Footer";

export default function ChatPage() {
  const { contacts, setContacts } = useContacts();
  const [selectedChats, setSelectedChats] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [search, setSearch] = useState("");
  const [modalSearch, setModalSearch] = useState("");
  const navigate = useNavigate();

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  }, [setContacts]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const toggleChatSelection = (id) => {
    setSelectedChats((prev) =>
      prev.includes(id) ? prev.filter((chatId) => chatId !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedChats.map((id) =>
          fetch(`http://localhost:8000/contacts/${id}`, {
            method: "DELETE",
          })
        )
      );
      fetchContacts();
      setSelectedChats([]);
      setSelectMode(false);
    } catch (err) {
      console.error("Failed to delete contacts:", err);
    }
  };

  const handleReadAll = () => {
    alert("All selected chats marked as read (mock action)");
    setSelectedChats([]);
  };

  const handleArchive = () => {
    alert("Selected chats archived (mock action)");
    setSelectedChats([]);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.lastMessage &&
      (contact.name || "Unknown").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 pb-24 text-black dark:bg-black dark:text-white relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 py-4">
        <h1 className="text-xl font-semibold">Chats</h1>
        <div className="flex items-center space-x-2 text-xl">
          <button onClick={() => setShowModal(true)}>
            <RiChatNewLine />
          </button>
          <button onClick={() => setSelectMode(!selectMode)}>
            <CgPlayListCheck className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Stories */}
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
        {contacts.slice(0, 3).map((contact) => (
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

      {/* Bulk Chat Actions */}
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
          placeholder="Search chats"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md"
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      {/* Chat List */}
      <ul>
        {filteredContacts.map((contact) => (
          <li
            key={contact.id}
            className="flex items-center justify-between py-4 border-b transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div
              className="flex gap-3 items-center cursor-pointer w-full"
              onClick={() =>
                selectMode
                  ? toggleChatSelection(contact.id)
                  : navigate(`/ChatDetails/${contact.id}`)
              }
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
                <p className="text-gray-400 text-sm">
                  {contact.lastMessage || "Started chat"}
                </p>
              </div>
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
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 max-h-[90vh] overflow-hidden text-black dark:text-white">
            <h2 className="text-lg font-semibold mb-2">Start New Chat</h2>
            <input
              type="text"
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              placeholder="Search contacts"
              className="w-full px-3 py-2 mb-3 bg-gray-100 dark:bg-gray-800 rounded-md"
            />

            <ul className="overflow-y-auto max-h-[60vh] pr-2">
              {contacts
                .filter((c) =>
                  (c.name || "").toLowerCase().includes(modalSearch.toLowerCase())
                )
                .map((contact) => (
                  <li
                    key={contact.id}
                    className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={async () => {
                      try {
                        // Optional: fetch messages if needed
                        const res = await fetch(
                          `http://localhost:8000/messages?contactId=${contact.id}`
                        );
                        const messages = await res.json();
                        const lastMsgText = messages.length
                          ? messages[messages.length - 1].text
                          : "";

                        await fetch(`http://localhost:8000/contacts/${contact.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            lastMessage: lastMsgText,
                          }),
                        });

                        await fetchContacts();
                        setShowModal(false);
                        navigate(`/ChatDetails/${contact.id}`);
                      } catch (err) {
                        console.error("Failed to start chat:", err);
                      }
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

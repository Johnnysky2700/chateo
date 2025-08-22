import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";

const InviteFriends = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const letterRefs = useRef({});

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:8000/contacts");
        const data = await res.json();
        setContacts(data || []);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
        setContacts([]);
      }
    };
    fetchContacts();
  }, []);

  // ✅ Safe filter (prevents undefined errors)
  const filteredContacts = contacts.filter(
    (c) =>
      c?.name &&
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Group by first letter safely
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    if (!contact?.name) return acc;
    const firstLetter = contact.name[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {});

  const scrollToLetter = (letter) => {
    const el = letterRefs.current[letter];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="relative min-h-screen bg-gray-300 dark:bg-black text-black dark:text-white text-sm">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800 fixed top-0 left-0 w-full p-2 z-10">
        <MdChevronLeft
          onClick={() => navigate(-1)}
          className="text-2xl absolute cursor-pointer"
        />
        <h2 className="text-base font-semibold w-full text-center -ml-6">
          Invite a friend
        </h2>
      </div>

      {/* Search Box */}
      <div className="px-4 py-3 bg-white dark:bg-neutral-800 mt-14 fixed w-full top-0 left-0 z-10">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-300 dark:bg-neutral-700 text-black dark:text-white focus:outline-none"
        />
      </div>

      {/* Share Link */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer mt-28">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
          <FiShare2 className="text-lg" />
        </div>
        <div>
          <p className="font-medium">Share invite link</p>
        </div>
      </div>

      {/* Contact List */}
      <div className="mt-2 pb-20">
        {Object.keys(groupedContacts)
          .sort()
          .map((letter) => (
            <div key={letter} ref={(el) => (letterRefs.current[letter] = el)}>
              <div className="px-4 py-1 bg-gray-200 dark:bg-neutral-700 font-semibold text-xs">
                {letter}
              </div>
              {groupedContacts[letter].map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-4 px-4 py-2 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <RiUserLine className="text-gray-500 text-xl" />
                    )}
                  </div>
                  <p className="font-medium">{contact.name}</p>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Alphabet Scroll */}
      <div className="fixed right-2 top-32 flex flex-col items-center space-y-1 text-xs font-medium text-gray-600 dark:text-gray-400">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => scrollToLetter(letter)}
            className="hover:text-green-500"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InviteFriends;

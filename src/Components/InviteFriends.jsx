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
      const res = await fetch("http://localhost:8000/contacts");
      const data = await res.json();
      setContacts(data);
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedContacts = filteredContacts.reduce((acc, contact) => {
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
      <div className="flex items-center px-4 py-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800">
      <MdChevronLeft
          onClick={() => navigate(-1)}
          className="text-2xl absolute cursor-pointer"
        />
        <h2 className="text-base font-semibold w-full text-center -ml-6">Invite a friend</h2>
      </div>

      {/* Search Box */}
      <div className="px-4 py-3 bg-white dark:bg-neutral-800">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-300 dark:bg-neutral-700 text-black dark:text-white focus:outline-none"
        />
      </div>

      {/* Share Link */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <div className="bg-gray-300 dark:bg-neutral-700 p-2 rounded-full">
          <FiShare2 className="text-black dark:text-white" />
        </div>
        <span className="text-green-600 dark:text-green-400 font-medium">Share invite link</span>
      </div>

      {/* Contact List */}
      <div className="divide-y divide-gray-300 dark:divide-gray-700 overflow-y-auto pb-20 pr-8">
        {Object.keys(groupedContacts)
          .sort()
          .map((letter) => (
            <div key={letter} ref={(el) => (letterRefs.current[letter] = el)}>
              <div className="px-4 py-2 bg-gray-300 dark:bg-neutral-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
                {letter}
              </div>
              {groupedContacts[letter].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-3 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <div className="w-10 h-10 bg-gray-300 dark:bg-neutral-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm font-bold">
                    <RiUserLine />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-gray-500 text-xs">{contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Alphabet Scroll */}
      <div className="fixed top-24 right-2 flex flex-col items-center text-xs space-y-1">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => scrollToLetter(letter)}
            className="text-green-600 dark:text-green-400 hover:scale-110 transition"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InviteFriends;

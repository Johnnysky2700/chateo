import React, { createContext, useContext, useState, useEffect } from "react";

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Load contacts and currentUser from localStorage or API
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setCurrentUser(storedUser);

    // Simulate fetching contacts
    const fetchContacts = async () => {
      const res = await fetch("http://localhost:8000/contacts");
      const data = await res.json();
      setContacts(data);
    };
    fetchContacts();
  }, []);

  return (
    <ContactContext.Provider
      value={{ contacts, setContacts, currentUser, setCurrentUser }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => useContext(ContactContext);

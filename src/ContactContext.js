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
      const storedToken = localStorage.getItem('token');
      const API_BASE = process.env.REACT_APP_API_BASE || "https://chat-backend-chi-virid.vercel.app";

      const res = await fetch(`${API_BASE}/api/users`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
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

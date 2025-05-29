// ContactContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const ContactContext = createContext();

// Provider component to wrap the application
export function ContactProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user as contact with id 1
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch("http://localhost:8000/contacts");
        const data = await res.json();
        setContacts(data);

        const user = data.find((c) => c.id === 1);
        if (user) {
          setCurrentUser(user);
        } else {
          console.warn("Contact with id 1 not found");
        }
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <ContactContext.Provider value={{ contacts, setContacts, currentUser, setCurrentUser }}>
      {children}
    </ContactContext.Provider>
  );
}

// Custom hook to use the contact context
export function useContacts() {
  return useContext(ContactContext);
}

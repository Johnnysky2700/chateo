// ContactContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create the context
const ContactContext = createContext();

// Provider component to wrap the application
export function ContactProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Optional: track the current logged-in user

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

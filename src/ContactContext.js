import React, { createContext, useState, useContext } from "react";

// Create Context
const ContactContext = createContext();

// Custom hook to use contact context
export const useContacts = () => useContext(ContactContext);

// Provider component to wrap the application
export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  return (
    <ContactContext.Provider value={{ contacts, setContacts }}>
      {children}
    </ContactContext.Provider>
  );
};

// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import WalkThrough from "./Components/WalkThrough";
import VerifyPage from "./Components/VerifyPage";
import OtpPage from "./Components/OtpPage";
import ProfileAcc from "./Components/ProfileAcc";
import ContactPage from "./Components/ContactPage";
import ChatPage from "./Components/ChatPage";
import MorePage from "./Components/MorePage";
import ChatDetails from "./Components/ChatDetails";
import { ThemeProvider } from "./context/ThemeContext";
import { ContactProvider, useContacts } from "./ContactContext";
import Account from './Components/Account';
import Appearance from './Components/Appearance';
import StoryPage from './Components/StoryPage';

// Create a wrapper component to access context
function AppWithContext() {
  const { setCurrentUser } = useContacts();

  useEffect(() => {
    // Simulate logged-in user from localStorage or API
    const loggedInContact = {
      id: 1,
      name: "John Doe",
      avatar: "/avatar.jpg",
      phone: "+1234567890",
      initials: "JD",
    };
    setCurrentUser(loggedInContact);
  }, [setCurrentUser]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/WalkThrough" element={<WalkThrough />} />
          <Route path="/VerifyPage" element={<VerifyPage />} />
          <Route path="/OtpPage" element={<OtpPage />} />
          <Route path="/ProfileAcc" element={<ProfileAcc />} />
          <Route path="/ContactPage" element={<ContactPage />} />
          <Route path="/ChatPage" element={<ChatPage />} />
          <Route path="/MorePage" element={<MorePage />} />
          <Route path="/ChatDetails/:id" element={<ChatDetails />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Appearance" element={<Appearance />} />
          <Route path="/story/:contactId" element={<StoryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ContactProvider>
        <AppWithContext />
      </ContactProvider>
    </ThemeProvider>
  );
}

export default App;

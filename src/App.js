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
import Chats from './Components/Chats';
import Notification from './Components/Notification';
import NotificationSound from "./Components/NotificationSound";
import Privacy from "./Components/Privacy";
import DataUsage from "./Components/DataUsage";
import Help from "./Components/Help";
import InviteFriends from "./Components/InviteFriends";
import NewsFeed from "./Components/NewsFeed";
import PrivateRoute from './Components/PrivateRoute';

// Create a wrapper component to access context
function AppWithContext() {
  const { setCurrentUser } = useContacts();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
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
          <Route path="/ContactPage" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
          <Route path="/ChatPage" element={<ChatPage />} />
          <Route path="/MorePage" element={<MorePage />} />
          <Route path="/ChatDetails/:id" element={<ChatDetails />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Appearance" element={<Appearance />} />
          <Route path="/Chats" element={<Chats />} />
          <Route path="/Notification" element={<Notification />} />
          <Route path="/notification-sound" element={<NotificationSound />} />
          <Route path="/story/:userId" element={<StoryPage />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/DataUsage" element={<DataUsage />} />
          <Route path="/help" element={<Help />} />
          <Route path="/InviteFriends" element={<InviteFriends />} />
          <Route path="/NewsFeed" element={<NewsFeed />} />
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

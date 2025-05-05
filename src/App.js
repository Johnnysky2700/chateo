import React from "react";
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

function App() {
  return (
    <ThemeProvider>
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
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

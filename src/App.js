import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import WalkThrough from './Components/WalkThrough';
import VerifyPage from './Components/VerifyPage';
import OtpPage from './Components/OtpPage';
import ProfileAcc from './Components/ProfileAcc';
import ContactPage from './Components/ContactPage';
import ChatPage from './Components/ChatPage';

function App() {
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import WalkThrough from './Components/WalkThrough';
import VerifyPage from './Components/VerifyPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/WalkThrough" element={<WalkThrough />} /> 
          <Route path="/VerifyPage" element={<VerifyPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;

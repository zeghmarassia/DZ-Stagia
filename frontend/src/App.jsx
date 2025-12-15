import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Redirect generic /signup to the student route by default */}
        <Route path="/signup" element={<Navigate to="/student/signup" replace />} />
        
        {/* UPDATED ROUTES to match Backend */}
        <Route path="/student/signup" element={<SignupPage type="student" />} />
        <Route path="/company/signup" element={<SignupPage type="company" />} />
      </Routes>
    </Router>
  );
}

export default App;
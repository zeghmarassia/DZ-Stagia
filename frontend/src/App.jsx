import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import './i18n';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOtp from './pages/VerifyOtp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
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
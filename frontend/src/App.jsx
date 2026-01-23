import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import './i18n';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOtp from './pages/VerifyOtp';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyOffers from './pages/CompanyOffers';
import CompanyApplications from './pages/CompanyApplications';
import CompanyProfile from './pages/CompanyProfile';
import VerifyEmail from './pages/VerifyEmail';
import AccountPending from './pages/AccountPending';
import Offers from './pages/Offers';
import PostOffer from './pages/PostOffer';
import CompanyCandidatures from './pages/CompanyCandidatures';  
import CandidateDetails from './pages/CandidateDetails';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        
        {/* Redirect generic /signup to the student route by default */}
        <Route path="/signup" element={<Navigate to="/student/signup" replace />} />
        
        {/* Email Verification Page (receives email and userType from location state) */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* Account Pending Approval Page (receives email and userType from location state) */}
        <Route path="/account-pending" element={<AccountPending />} />

        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/offers" element={<CompanyOffers />} />
        <Route path="/company/applications" element={<CompanyApplications />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/post-offer" element={<PostOffer />} />
        <Route path="/company/offers/:id/candidatures" element={<CompanyCandidatures />} />
        <Route path="/company/applications/:id" element={<CandidateDetails />} />
        
        {/* UPDATED ROUTES to match Backend */}
        <Route path="/student/signup" element={<SignupPage type="student" />} />
        <Route path="/company/signup" element={<SignupPage type="company" />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOtp from './pages/VerifyOtp';
import VerifyEmail from './pages/VerifyEmail';
import AccountPending from './pages/AccountPending';
import Offers from './pages/Offers';

import CompanyDashboard from './pages/CompanyDashboard';
import CompanyOffers from './pages/CompanyOffers';
import CompanyApplications from './pages/CompanyApplications';
import CompanyProfile from './pages/CompanyProfile';
import PostOffer from './pages/PostOffer';
import CompanyCandidatures from './pages/CompanyCandidatures';  
import CandidateDetails from './pages/CandidateDetails';

import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import OfferDetailsPage from './pages/OfferDetailsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminOffers from './pages/Admin/AdminOffers';
import Enterprise from './pages/Admin/Enterprise';
import Etudiants from './pages/Admin/Etudiants';
import UserValidation from './pages/Admin/UserValidation';

import './i18n';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar */}
        <Route path="/" element={<Layout><Homepage /></Layout>} />
        <Route path="/offers" element={<Layout><Offers /></Layout>} />
        <Route path="/companies" element={<Layout><div>Companies Page</div></Layout>} />
        <Route path="/about" element={<Layout><div>About Page</div></Layout>} />
        
        {/* Auth Routes without Navbar */}
        <Route path="/login" element={<Layout showNavbar={false}><Login /></Layout>} />
        <Route path="/auth/admin/login" element={<Layout showNavbar={false}><AdminLoginPage /></Layout>} />

        <Route path="/forgot-password" element={<Layout showNavbar={false}><ForgotPassword /></Layout>} />
        <Route path="/reset-password" element={<Layout showNavbar={false}><ResetPassword /></Layout>} />
        <Route path="/verify-otp" element={<Layout showNavbar={false}><VerifyOtp /></Layout>} />
        <Route path="/verify-email" element={<Layout showNavbar={false}><VerifyEmail /></Layout>} />
        <Route path="/account-pending" element={<Layout showNavbar={false}><AccountPending /></Layout>} />
        
        {/* Signup Routes */}
        <Route path="/signup" element={<Navigate to="/student/signup" replace />} />
        <Route path="/student/signup" element={<Layout showNavbar={false}><SignupPage type="student" /></Layout>} />
        <Route path="/company/signup" element={<Layout showNavbar={false}><SignupPage type="company" /></Layout>} />

        {/* Student Routes - Remove individual navbars from these pages */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><StudentDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><StudentProfile /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/student/offers/:id" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><OfferDetailsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/student/my-applications" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout><MyApplicationsPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Company Routes */}
        <Route path="/company/dashboard" element={
          <ProtectedRoute allowedRoles={['company']}>
            <Layout><CompanyDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/company/offers" element={
          <ProtectedRoute allowedRoles={['company']}>
            <Layout><CompanyOffers /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/company/applications" element={
          <ProtectedRoute allowedRoles={['company']}>
            <Layout><CompanyApplications /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/company/profile" element={
          <ProtectedRoute allowedRoles={['company']}>
            <Layout><CompanyProfile /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/company/post-offer" element={
          <ProtectedRoute allowedRoles={['company']}>
            <Layout><PostOffer /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/company/offers/:id/candidatures" element={
          <ProtectedRoute allowedRoles={['company']}>
            <Layout><CompanyCandidatures /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/company/applications/:id" element={
          <ProtectedRoute allowedRoles={['company']}>
            <Layout><CandidateDetails /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout showNavbar={false}><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/offers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout showNavbar={false}><AdminOffers /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/entreprises" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout showNavbar={false}><Enterprise /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/etudiants" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout showNavbar={false}><Etudiants /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/user-validation" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout showNavbar={false}><UserValidation /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
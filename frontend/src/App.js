import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; 
// Import pages
import VerifPage from './pages/VerifPage';
import EvalPage from './pages/EvalPage';
import DashboardPage from './pages/DashboardPage';
import MyApplicationsPage from './pages/MyApplicationsPage'; 
import OffresPage from './pages/OffresPage'; 
import OfferDetailsPage from './pages/OfferDetailsPage'; 
import CreateProfilePage from './pages/CreateProfilePage';
import AdminDashboard from './pages/Admin/AdminDashboard'; 
import UserValidation from './pages/Admin/UserValidation';
import Etudiants from './pages/Admin/Etudiants'; 
import Enterprise from './pages/Admin/Enterprise'; 
import AdminOffers from './pages/Admin/AdminOffers'; // Import the new Offers page

function App() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Logic for Verification */}
          <Route 
            path="/" 
            element={
              !isVerified ? (
                <VerifPage onVerified={() => setIsVerified(true)} />
              ) : (
                <EvalPage />
              )
            } 
          />

          {/* Navigation Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<MyApplicationsPage />} />
          <Route path="/offres" element={<OffresPage />} /> 
          <Route path="/offres/:id" element={<OfferDetailsPage />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserValidation />} />
          <Route path="/admin/students" element={<Etudiants />} /> 
          <Route path="/admin/companies" element={<Enterprise />} />
          <Route path="/admin/offers" element={<AdminOffers />} /> {/* Admin Offers route added */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
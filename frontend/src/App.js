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
          <Route path="/create-profile" element={<CreateProfilePage />} /> {/* Added inside Routes */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
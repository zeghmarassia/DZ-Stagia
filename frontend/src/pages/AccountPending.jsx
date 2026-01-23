import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Clock, LogOut } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AccountPending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const userType = location.state?.userType;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Redirect to signup if no email or userType
    if (!email || !userType) {
      navigate('/student/signup');
    }
  }, [email, userType, navigate]);

  // Dynamic content based on user type
  const displayRole = userType === 'company' ? 'Entreprise' : 'Étudiant';

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(`${API_URL}/auth/logout`);
      // Clear any stored auth data if needed
      localStorage.clear();
      // Redirect to home or login page
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* --- TOP HEADER --- */}
      <header className="bg-white px-8 py-4 flex justify-between items-center shadow-sm">
        {/* Logo */}
        <div className="text-2xl font-black tracking-widest uppercase text-slate-900">
          STAGIA
        </div>

        {/* User Profile Snippet (Top Right) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Avatar Placeholder */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User size={20} />
            </div>
            {/* Name & Role */}
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900 leading-tight">
                {email || 'User'}
              </span>
              <span className="text-xs text-slate-500">
                {displayRole}
              </span>
            </div>
          </div>
          
          {/* Logout / Exit Icon */}
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-gray-400 hover:text-slate-900 transition ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center">
          
          {/* Central Icon: User with Clock Badge */}
          <div className="relative mb-6">
            <User size={64} className="text-black" fill="black" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <Clock size={24} className="text-black fill-black text-white" /> 
              {/* Note: In lucide, 'fill' fills the svg content. 
                  To match exact design (solid black icon with white clock hands), 
                  we stick to simple black stroke/fill or use specific SVG paths. 
                  Below is a close approximation using standard Lucide icons: */}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            Nous évaluons votre profil
          </h1>

          {/* Description Text */}
          <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
            Votre compte est en attente d'être approuvé par notre équipe 
            d'administration dans un délai de 24 heures.
            <br />
            Vous serez informé(e) par e-mail une fois votre compte 
            approuvé, puis vous pourrez accéder à la plateforme.
          </p>

        </div>
      </main>
    </div>
  );
};

export default AccountPending;
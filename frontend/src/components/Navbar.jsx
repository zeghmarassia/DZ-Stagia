import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Bell } from 'lucide-react';
import HomeNavbar from './HomeNavbar';

const Navbar = () => {
  const { isAuthenticated, userType } = useSelector((state) => state.auth);

  // Public Navbar (Not Authenticated)
  if (!isAuthenticated) {
    return (
      // <nav className="w-full bg-white border-b border-gray-200 px-8 py-4">
      //   <div className="max-w-7xl mx-auto flex justify-between items-center">
        
      //     <Link to="/" className="text-2xl font-black text-slate-900">
      //       STAGIA
      //     </Link>

         
      //     <div className="flex items-center space-x-8">
      //       <Link to="/offers" className="text-slate-600 hover:text-slate-900 font-semibold">
      //         Offres
      //       </Link>
      //       <Link to="/companies" className="text-slate-600 hover:text-slate-900 font-semibold">
      //         Entreprises
      //       </Link>
      //       <Link to="/about" className="text-slate-600 hover:text-slate-900 font-semibold">
      //         À Propos
      //       </Link>
      //     </div>

       
      //     <div className="flex items-center space-x-4">
      //       <Link 
      //         to="/student/signup" 
      //         className="px-6 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition"
      //       >
      //         S'Inscrire
      //       </Link>
      //       <Link 
      //         to="/login" 
      //         className="px-6 py-2 text-slate-700 font-semibold hover:text-slate-900 transition"
      //       >
      //         Connexion
      //       </Link>
      //     </div>
      //   </div>
      // </nav>
      <HomeNavbar/>
    );
  }

  // Student Navbar (Authenticated as Student)
  if (userType === 'student') {
    return (
      <nav className="w-full bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/student/dashboard" className="text-2xl font-black text-slate-900">
            STAGIA
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/student/dashboard" className="text-slate-600 hover:text-slate-900 font-semibold">
              Tableau de Bord
            </Link>
            <Link to="/offers" className="text-teal-500 font-bold border-b-2 border-teal-500 pb-1">
              Offres
            </Link>
            <Link to="/student/my-applications" className="text-slate-600 hover:text-slate-900 font-semibold">
              Mes Candidatures
            </Link>
          </div>

          {/* Right Side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-6">
            <button className="text-slate-500 hover:text-slate-700">
              <Search size={20} />
            </button>
            <button className="text-slate-500 hover:text-slate-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/student/profile" className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Aïcha Belaïd</p>
                <p className="text-xs text-slate-500">Étudiant</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <img src="/profile.png" alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Company Navbar (Authenticated as Company)
  if (userType === 'company') {
    return (
      <nav className="w-full bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/company/dashboard" className="text-2xl font-black text-slate-900">
            STAGIA
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/company/dashboard" className="text-slate-600 hover:text-slate-900 font-semibold">
              Tableau de Bord
            </Link>
            <Link to="/company/offers" className="text-slate-600 hover:text-slate-900 font-semibold">
              Mes Offres
            </Link>
            <Link to="/company/applications" className="text-slate-600 hover:text-slate-900 font-semibold">
              Candidatures
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            <button className="text-slate-500 hover:text-slate-700">
              <Search size={20} />
            </button>
            <button className="text-slate-500 hover:text-slate-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/company/profile" className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">SONATRACH</p>
                <p className="text-xs text-slate-500">Entreprise</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <img src="/company-logo.png" alt="Company" className="w-full h-full rounded-full object-cover" />
              </div>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Admin Navbar
  if (userType === 'admin') {
    return (
      <nav className="w-full bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/admin/dashboard" className="text-2xl font-black text-slate-900">
            STAGIA
          </Link>
          <div className="flex items-center space-x-8">
            <Link to="/admin/dashboard" className="text-slate-600 hover:text-slate-900 font-semibold">
              Dashboard
            </Link>
            <Link to="/admin/students" className="text-slate-600 hover:text-slate-900 font-semibold">
              Étudiants
            </Link>
            <Link to="/admin/companies" className="text-slate-600 hover:text-slate-900 font-semibold">
              Entreprises
            </Link>
            <Link to="/admin/offers" className="text-slate-600 hover:text-slate-900 font-semibold">
              Offres
            </Link>
          </div>
          <Link to="/admin/profile">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-bold">AD</span>
            </div>
          </Link>
        </div>
      </nav>
    );
  }

  return null;
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from '../config/api';

const CompanyNavbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('Chargement...');
  
  // Check if on candidatures page
  const isCandidaturesPage = location.pathname.includes('/candidatures');

  // Fetch company name on mount
  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/company/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCompanyName(response.data.name || 'Mon Entreprise');
      } catch (err) {
        console.error('Failed to fetch company name:', err);
        setCompanyName('Mon Entreprise');
      }
    };

    fetchCompanyName();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      navigate('/');
    }
  };
  
  // Helper to determine active language style
  const getLangClass = (langCode) => {
    return i18n.language === langCode ? 'text-emerald-600' : '';
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Shared classes for links
  const navLinkClasses = ({ isActive }) => 
    `h-16 flex items-center px-1 border-b-2 font-medium transition-colors ${
      isActive 
        ? 'border-emerald-500 text-slate-900' 
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Logo & Links */}
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black tracking-tighter">LOGO</span>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex gap-6 h-16">
              <NavLink to="/company/dashboard" className={navLinkClasses}>
                {t('company_nav.dashboard')}
              </NavLink>
              
              <NavLink to="/company/offers" className={navLinkClasses}>
                {t('company_nav.offers')}
              </NavLink>
              
              {isCandidaturesPage && (
                <NavLink to="/company/applications" className={navLinkClasses}>
                  {t('company_nav.applications')}
                </NavLink>
              )}
            </div>
          </div>

          {/* Right: Actions, Language & Profile */}
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
            <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            {/* Language Switcher */}
            <div className="flex gap-2 text-xs font-bold text-slate-400">
              <button onClick={() => changeLanguage('fr')} className={getLangClass('fr')}>FR</button>
              <button onClick={() => changeLanguage('en')} className={getLangClass('en')}>EN</button>
              <button onClick={() => changeLanguage('ar')} className={getLangClass('ar')}>AR</button>
            </div>

            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            {/* User Profile */}
            <Link to="/company/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition group">
              <img 
                 src={`https://ui-avatars.com/api/?name=${companyName}&background=random&color=fff`}
                 alt={companyName} 
                 className="w-10 h-10 rounded-full object-contain bg-white border border-gray-200"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 group-hover:text-[#4AA59C] transition">{companyName}</span>
                <span className="text-xs text-slate-500">Entreprise</span>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <LogOut size={20} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar;
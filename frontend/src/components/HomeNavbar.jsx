import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher'; // Ensure path is correct relative to this file
import { 
  Search, Menu, X, Briefcase, Building2, 
  HelpCircle, Phone, User, LogIn, ChevronRight 
} from 'lucide-react';

const HomeNavbar = () => {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
     <nav className="bg-white py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4 relative">
          
          {/* Left Side: Logo & Links */}
          <div className="flex items-center gap-8 md:gap-12">
            {/* Logo */}
            <Link to="/" className="text-2xl font-black text-slate-900">
            STAGIA
          </Link>

            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-bold text-slate-900">
              <Link to="/offers" className="hover:text-blue-600 transition">{t('nav.offers')}</Link>
              <a href="#" className="hover:text-blue-600 transition">{t('nav.companies')}</a>
              <a href="#" className="hover:text-blue-600 transition">{t('nav.about')}</a>
            </div>
          </div>

          {/* Right Side: Search, Auth & Language */}
          <div className="flex items-center gap-4 ml-auto">
            
            {/* EXPANDABLE SEARCH BAR */}
            <div className="hidden md:flex items-center relative transition-all duration-300">
              {/* The Input Field (Hidden by default, expands when open) */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center
                  ${isSearchOpen ? 'w-64 opacity-100 mr-2' : 'w-0 opacity-0'}
                `}
              >
                <input 
                  type="text" 
                  placeholder={t('nav.search_placeholder')}
                  className="w-full py-2 px-4 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* The Search Icon Button */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 text-slate-600 transition"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            {/* Language Switcher Component */}
            <div className="hidden md:block">
               <LanguageSwitcher />
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/signup"> 
                <button className="px-5 py-2.5 bg-[#5B8C9D] text-white text-sm font-bold rounded-lg hover:bg-[#4a7280] transition shadow-sm">
                  {t('nav.signup')}
                </button>
              </Link>
              <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition">
                {t('nav.login')}
              </Link>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <Menu className="w-6 h-6 text-slate-900" />
            </div>
          </div>
        </div>
      </nav>
  );
};

export default HomeNavbar;
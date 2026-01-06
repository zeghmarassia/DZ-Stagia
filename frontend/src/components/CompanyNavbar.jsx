import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CompanyNavbar = () => {
  const { t, i18n } = useTranslation();
  
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
              
              <NavLink to="/company/applications" className={navLinkClasses}>
                {t('company_nav.applications')}
              </NavLink>
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 text-xs font-bold">S</span>
              </div>
              <div className="hidden lg:block text-sm">
                <p className="font-bold text-slate-900 leading-none">SONATRACH</p>
                <p className="text-slate-400 text-xs mt-0.5">Entreprise</p>
              </div>
              <LogOut className="w-4 h-4 text-slate-400 ml-2 cursor-pointer hover:text-red-500" />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar;
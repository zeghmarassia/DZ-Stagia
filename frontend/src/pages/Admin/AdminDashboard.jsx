import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/authService';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students_count: 0,
    students_change: 0,
    companies_count: 0,
    companies_change: 0,
    active_offers_count: 0,
    active_offers_change: 0,
    applications_count: 0,
    applications_change: 0,
  });

  // Mock Data
  const MOCK_STATS = {
    students_count: 1250,
    students_change: 0.12,
    companies_count: 45,
    companies_change: 0.05,
    active_offers_count: 89,
    active_offers_change: -0.02,
    applications_count: 340,
    applications_change: 0.25,
  };

  const location = useLocation();

  const isCollapsed = location.pathname !== '/admin';

  useEffect(() => {
    // Commented out API call
    /*
    getAdminStats()
      .then(data => setStats(data))
      .catch(err => console.error("Syncing with backend...", err));
    */
    setStats(MOCK_STATS);
  }, []);

  return (
    <div className="flex min-h-screen bg-white font-sans text-[#1A1D1F]">
      {/* Sidebar - Fixed to screen height with 100% height */}
      {/* <Navbar/> */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen sticky top-0 border-r border-[#E8E8E8] flex flex-col transition-all duration-300 ease-in-out`}>
        
        {/* Logo Section */}
        <div className={`p-6 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <h1 className="text-[20px] font-[900] text-black tracking-[-1px]">
            {isCollapsed ? 'S' : 'STAGIA'}
          </h1>
        </div>
        
        {/* 1. Upper Block (Navigation Icons) - Increased to ~60% height by adding spacing */}
        <nav className={`${isCollapsed ? 'px-2' : 'px-4'} space-y-8 flex-none`}>
          <NavItem icon={<HomeIcon />} label="Tableau de Bord" to="/admin/admin/stats" active={location.pathname === '/admin'} collapsed={isCollapsed} />
          <NavItem icon={<UsersIcon />} label="Admins" to="/admin/admin/admins" active={location.pathname === '/admin/users'} collapsed={isCollapsed} />
          <NavItem icon={<StudentIcon />} label="Étudiants" to="/admin/admin/students" active={location.pathname === '/admin/students'} collapsed={isCollapsed} />
          <NavItem icon={<BuildingIcon />} label="Entreprises" to="/admin/admin/companies" active={location.pathname === '/admin/companies'} collapsed={isCollapsed} />
          <NavItem icon={<BriefcaseIcon />} label="Offres" to="/admin/admin/offers" active={location.pathname === '/admin/offers'} collapsed={isCollapsed} />
        </nav>

        {/* 2. Middle Section (Negative Space) - Remaining space */}
        <div className="flex-1"></div>

        {/* 3. Bottom Block (Settings Icon) */}
        <div className={`p-6 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <NavItem icon={<SettingsIcon />} label="Paramètres" to="/admin/settings" active={location.pathname === '/admin/settings'} collapsed={isCollapsed} />
        </div>
      </aside>

      {/* Main Content - No changes here */}
      <main className="flex-1 bg-[#F4F4F4]/50 px-10 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-8">
            <button className="text-[#6F767E] hover:text-black scale-90"><SearchIcon /></button>
            <button className="text-[#6F767E] relative scale-90">
              <BellIcon />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF6A55] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-[13px] font-[700] text-[#1A1D1F]">Hiba Kara</p>
                <p className="text-[11px] text-[#6F767E] font-[500]">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FFBC99] flex items-center justify-center border border-white shadow-sm">
                <span className="text-white font-[700] text-[12px]">HK</span>
              </div>
              <button className="text-[#6F767E] hover:text-black scale-90"><LogoutIcon /></button>
            </div>
          </div>
        </div>

        {location.pathname === '/admin' && (
          <>
            <div className="mb-8">
              <h2 className="text-[26px] font-[700] tracking-[-0.5px]">Tableau de Bord</h2>
              <p className="text-[#6F767E] text-[13px] mt-0.5">Suivez les statistiques et les nombres de votre plateforme en temps réel.</p>
            </div>

            <div className="grid grid-cols-4 gap-5 mb-8">
              <StatCard label="Étudiants Inscrits" value={stats.students_count.toLocaleString()} change={`${(stats.students_change * 100).toFixed(0)}%`} icon={<StudentIcon />} iconColor="text-[#2A85FF]" bgColor="bg-[#EAF2FF]" isNegative={stats.students_change < 0} />
              <StatCard label="Entreprises registrées" value={stats.companies_count.toLocaleString()} change={`${(stats.companies_change * 100).toFixed(0)}%`} icon={<BuildingIcon />} iconColor="text-[#8E59FF]" bgColor="bg-[#F3EFFF]" isNegative={stats.companies_change < 0} />
              <StatCard label="Offres actives" value={stats.active_offers_count.toLocaleString()} change={`${(stats.active_offers_change * 100).toFixed(0)}%`} icon={<BriefcaseIcon />} iconColor="text-[#FFBC99]" bgColor="bg-[#FFF4EE]" isNegative={stats.active_offers_change < 0} />
              <StatCard label="Total d'applications" value={stats.applications_count.toLocaleString()} change={`${(stats.applications_change * 100).toFixed(0)}%`} icon={<ChartIcon />} iconColor="text-[#2A85FF]" bgColor="bg-[#EAF2FF]" isNegative={stats.applications_change < 0} />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white p-6 rounded-[24px] border border-[#ECECEC] shadow-sm">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-[16px] font-[700] text-[#11142D]">Soumissions d'Applications</h3>
                      <p className="text-[12px] text-[#9A9FA5] mt-0.5">Vue d'ensemble des application des étudiants</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[28px] font-[700] text-[#11142D]">1,240</span>
                      <span className="text-[12px] text-[#27AE60] font-[700] bg-[#EAFAE5] px-2 py-0.5 rounded-md">+15%</span>
                    </div>
                  </div>
                  
                  <div className="relative h-48 w-full">
                    <svg viewBox="0 0 1000 300" className="w-full h-full">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2A85FF" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#2A85FF" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,200 C100,50 200,300 300,100 C400,50 500,250 600,150 C700,100 800,50 900,150 L1000,100 L1000,300 L0,300 Z" fill="url(#chartGradient)" />
                      <path d="M0,200 C100,50 200,300 300,100 C400,50 500,250 600,150 C700,100 800,50 900,150 L1000,100" fill="none" stroke="#2A85FF" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <div className="flex justify-between mt-4 px-1 text-[#9A9FA5] text-[11px] font-[600]">
                      <span>Sem 1</span><span>Sem 2</span><span>Sem 3</span><span>Sem 4</span><span>Sem 5</span><span>Sem 6</span>
                    </div>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-[#ECECEC] shadow-sm flex flex-col justify-between">
                <h3 className="text-[16px] font-[700] text-[#11142D] mb-2">Distribution</h3>
                <div className="relative flex items-center justify-center my-4">
                  <svg width="140" height="140" viewBox="0 0 100 100" className="rotate-[-90deg]">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F4F4F4" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2A85FF" strokeWidth="10" strokeDasharray="233.7 251.2" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#D3DEE8" strokeWidth="10" strokeDasharray="17.5 251.2" strokeDashoffset="-233.7" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-[22px] font-[800] text-[#11142D] leading-none">13,3k</p>
                    <p className="text-[11px] text-[#6F767E] font-[600] mt-0.5">Total</p>
                  </div>
                </div>
                <div className="w-full space-y-3 mt-2">
                  <DistItem color="bg-[#2A85FF]" label="Étudiants" value="12,450 (93%)" />
                  <DistItem color="bg-[#D3DEE8]" label="Entreprises" value="850 (7%)" />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, to = "#", collapsed = false }) => (
  <Link 
    to={to} 
    className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg cursor-pointer transition-all ${
      active 
        ? 'bg-[#27AE60] text-white shadow-md font-[700]' 
        : 'text-[#6F767E] hover:bg-[#F4F4F4] font-[600]'
    }`}
    title={collapsed ? label : ""}
  >
    <span className="flex-shrink-0 scale-90">{icon}</span>
    {!collapsed && <span className="text-[13px] whitespace-nowrap">{label}</span>}
  </Link>
);

const StatCard = ({ label, value, change, icon, iconColor, bgColor, isNegative }) => (
  <div className="bg-white p-5 rounded-[24px] border border-[#ECECEC]">
    <div className="flex justify-between items-start mb-5">
      <div className={`p-3 rounded-[12px] ${bgColor} ${iconColor} scale-90`}>{icon}</div>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-[700] border ${isNegative ? 'bg-[#FFF2F0] text-[#FF6A55] border-[#FFD8D3]' : 'bg-[#EAF2FF] text-[#2A85FF] border-[#D1E4FF]'}`}>
        {change}
      </span>
    </div>
    <p className="text-[#6F767E] text-[10px] font-[600] uppercase tracking-wider">{label}</p>
    <p className="text-[22px] font-[700] mt-1">{value}</p>
  </div>
);

const DistItem = ({ color, label, value }) => (
  <div className="flex justify-between items-center w-full">
    <div className="flex items-center space-x-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
      <span className="text-[#6F767E] text-[12px] font-[600]">{label}</span>
    </div>
    <span className="text-[13px] font-[700] text-[#11142D]">{value}</span>
  </div>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21v-8h6v8"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const StudentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10L12 5L2 10l10 5l10-5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="4" width="14" height="16" rx="2" />
    <line x1="9" y1="4" x2="9" y2="20" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-3 3"/>
  </svg>
);

export default AdminDashboard;
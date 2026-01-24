import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCog, 
  GraduationCap, 
  Building2, 
  BriefcaseBusiness 
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  // Navigation items based on your specific routes
  const navItems = [
    { name: 'Dashboard', path: '/admin/admin/stats', icon: <LayoutDashboard size={20} /> },
    { name: 'Admins', path: '/admin/admin/admins', icon: <UserCog size={20} /> },
    { name: 'Étudiants', path: '/admin/admin/students', icon: <GraduationCap size={20} /> },
    { name: 'Entreprises', path: '/admin/admin/companies', icon: <Building2 size={20} /> },
    { name: 'Offres', path: '/admin/admin/offers', icon: <BriefcaseBusiness size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0">
      {/* Sidebar Header (Optional Logo space) */}
      <div className="p-8">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">STAGIA <span className="text-teal-500">.</span></h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-teal-50 text-teal-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-900'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info (Optional) */}
      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Système de Gestion v1.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
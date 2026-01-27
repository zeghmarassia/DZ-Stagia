import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: ShieldCheck, label: "Admins", path: "/admin/admins" },
    { icon: GraduationCap, label: "Étudiants", path: "/admin/students" },
    { icon: Building2, label: "Entreprises", path: "/admin/companies" },
    { icon: Briefcase, label: "Offres", path: "/admin/offers" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 h-full z-10">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <div className="flex items-center gap-2 text-slate-900 font-black text-2xl">
          <span className="text-emerald-600">STAGIA</span>
          <span className="text-xs bg-slate-900 text-white px-2 py-1 rounded ml-2">ADMIN</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 font-bold shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      
    </aside>
  );
};

export default Sidebar;
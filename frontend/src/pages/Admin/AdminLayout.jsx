import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Navbar from '../components/Navbar'; // Your top navbar

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 1. Left Sidebar */}
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 2. Top Navbar (Already handles Admin profile view logic) */}
        <Navbar />

        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* This is where AdminDashboard, Enterprise, etc. will appear */}
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
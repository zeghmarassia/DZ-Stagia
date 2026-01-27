import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAdmins } from '../../services/AdminService';
import { Mail, Calendar, User, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/Sidebar.jsx';

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [adminData, setAdminData] = useState(user);
  const [loading, setLoading] = useState(false);

  // Optional: Refresh admin data from API
  const refreshAdminData = async () => {
    setLoading(true);
    try {
      const response = await getAdmins({ skip: 0, limit: 100 });
      // Find current admin by email
      const currentAdmin = response.data.find(admin => admin.email === user?.email);
      if (currentAdmin) {
        setAdminData(currentAdmin);
      }
    } catch (error) {
      console.error('Error refreshing admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="ml-64 p-8 bg-slate-50 min-h-screen">
        <Sidebar />
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Mon Profil</h1>
          <p className="text-slate-500">Informations de votre compte administrateur</p>
        </div>
        <button
          onClick={refreshAdminData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section with Picture */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-32"></div>
          
          <div className="px-8 pb-8">
            {/* Profile Picture */}
            <div className="flex items-end -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {adminData?.picture ? (
                  <img 
                    src={adminData.picture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-black text-slate-400">
                    {adminData?.first_name?.[0]}{adminData?.last_name?.[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Admin Info */}
            <div className="space-y-6">
              {/* Name Section */}
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  {adminData?.first_name} {adminData?.last_name}
                </h2>
                <p className="text-teal-600 font-bold text-sm mt-1">Administrateur</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                {/* Email */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Mail size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {adminData?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Admin ID */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <User size={20} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">ID Admin</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      #{adminData?.admin_id || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* First Name */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Prénom</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {adminData?.first_name || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Last Name */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Nom</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {adminData?.last_name || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Membre depuis</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {formatDate(adminData?.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Informations importantes</h3>
              <p className="text-sm text-slate-600">
                Votre compte administrateur vous donne un accès complet à la plateforme. 
                Utilisez vos privilèges de manière responsable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
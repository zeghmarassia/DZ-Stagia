import React, {useEffect, useState} from 'react';
import { getAdminStats } from '../../services/AdminService';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  ArrowUpRight,
  MoreHorizontal,
  GraduationCap
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState();
  // Mock Data for the Stats Cards
  // const stats = [
  //   { 
  //     title: "Étudiants Inscrits", 
  //     value: "2,543", 
  //     change: "+120 ce mois", 
  //     icon: Users, 
  //     color: "bg-blue-50 text-blue-600" 
  //   },
  //   { 
  //     title: "Entreprises", 
  //     value: "85", 
  //     change: "+5 en attente", 
  //     icon: Building2, 
  //     color: "bg-purple-50 text-purple-600" 
  //   },
  //   { 
  //     title: "Offres Publiées", 
  //     value: "342", 
  //     change: "+24 cette semaine", 
  //     icon: Briefcase, 
  //     color: "bg-emerald-50 text-emerald-600" 
  //   },
  //   { 
  //     title: "Candidatures Totales", 
  //     value: "12,800", 
  //     change: "+15% vs mois dernier", 
  //     icon: FileText, 
  //     color: "bg-orange-50 text-orange-600" 
  //   },
  // ];
  useEffect(()=>{
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        console.log(response.data);
        // console.log(response.data.students);
        setStats(response.data);
      } catch (err) {
        console.log('error:', err);
      }
    }
    fetchStats();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar/>

      {/* 2. Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h1>
            <p className="text-slate-500 mt-1">Bienvenue sur le panneau d'administration.</p>
          </div>
          <div className="text-sm text-slate-400 font-medium">
             Dernière mise à jour : Aujourd'hui, 14:30
          </div>
        </div>

        {/* Stats Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* students stats */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl`}>
                  <GraduationCap size={24} className="text-blue-600" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} className="mr-1" />
                  +5
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stats.students.total}</h3>
              <p className="text-slate-500 font-medium text-sm">Etudiants Inscrit</p>
            </div>
          {/* companies stats */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl`}>
                  <Building2 size={24} className="text-blue-600" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} className="mr-1" />
                  +10
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stats.companies.total}</h3>
              <p className="text-slate-500 font-medium text-sm">Entreprises Registrées</p>
            </div>
          {/* offers stats */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl`}>
                  <Briefcase size={24} className="text-blue-600" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} className="mr-1" />
                  +15
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stats.offers.total}</h3>
              <p className="text-slate-500 font-medium text-sm">Offres Actives</p>
            </div>
          {/* applications stats */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl`}>
                  <FileText size={24} className="text-blue-600" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} className="mr-1" />
                  +15
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-1">10</h3>
              <p className="text-slate-500 font-medium text-sm">Total d'Applications</p>
            </div>
         
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
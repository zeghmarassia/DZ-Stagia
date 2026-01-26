import React from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock Data for the Stats Cards
  const stats = [
    { 
      title: "Étudiants Inscrits", 
      value: "2,543", 
      change: "+120 ce mois", 
      icon: Users, 
      color: "bg-blue-50 text-blue-600" 
    },
    { 
      title: "Entreprises", 
      value: "85", 
      change: "+5 en attente", 
      icon: Building2, 
      color: "bg-purple-50 text-purple-600" 
    },
    { 
      title: "Offres Publiées", 
      value: "342", 
      change: "+24 cette semaine", 
      icon: Briefcase, 
      color: "bg-emerald-50 text-emerald-600" 
    },
    { 
      title: "Candidatures Totales", 
      value: "12,800", 
      change: "+15% vs mois dernier", 
      icon: FileText, 
      color: "bg-orange-50 text-orange-600" 
    },
  ];

  // Mock Data for "Recent Activity" to fill the page content
  const recentActivities = [
    { id: 1, type: "company", text: "Nouvelle entreprise inscrite : Tech Solutions", date: "Il y a 10 min", status: "En attente" },
    { id: 2, type: "student", text: "Nouvel étudiant : Karim Meharzi", date: "Il y a 30 min", status: "Vérifié" },
    { id: 3, type: "offer", text: "Offre signalée : Stage Marketing", date: "Il y a 2h", status: "À revoir" },
    { id: 4, type: "company", text: "Entreprise validée : Sonatrach", date: "Hier", status: "Validé" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

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
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} className="mr-1" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-slate-500 font-medium text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity Section (To make the dashboard look complete) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Activité Récente</h2>
            <button className="text-emerald-600 text-sm font-bold hover:underline">Voir le journal</button>
          </div>
          
          <div className="divide-y divide-gray-50">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-slate-50 transition flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'company' ? 'bg-purple-500' : 
                    activity.type === 'student' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}></div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm">{activity.text}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{activity.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold 
                    ${activity.status === 'En attente' ? 'bg-orange-100 text-orange-600' : 
                      activity.status === 'Validé' || activity.status === 'Vérifié' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                    {activity.status}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Trash2, 
  Edit,
  ShieldCheck 
} from 'lucide-react';
import { getAdmins } from '../../services/AdminService.js';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data based on your model
//   const MOCK_ADMINS = [
//     {
//       id: 1,
//       first_name: "Amine",
//       last_name: "Benali",
//       email: "amine.benali@stagia.dz",
//       picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amine",
//       role: "Super Admin",
//       status: "Active"
//     },
//     {
//       id: 2,
//       first_name: "Sarah",
//       last_name: "Kadi",
//       email: "sarah.kadi@stagia.dz",
//       picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
//       role: "Admin",
//       status: "Active"
//     },
//     {
//       id: 3,
//       first_name: "Mohamed",
//       last_name: "Cherif",
//       email: "mohamed.cherif@stagia.dz",
//       picture: "", // No picture test
//       role: "Modérateur",
//       status: "Inactive"
//     }
//   ];

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        // --- REAL BACKEND CONNECTION ---
        const response = await getAdmins();
        setAdmins(response.data);

        // --- MOCK DATA ---
        // setTimeout(() => {
        //   setAdmins(MOCK_ADMINS);
        //   setLoading(false);
        // }, 600);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin => 
    admin.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* 2. Main Content */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des Administrateurs</h1>
            <p className="text-slate-500 mt-1">Gérez les accès et les rôles de l'équipe.</p>
          </div>
          
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-slate-900/20">
            <UserPlus size={18} />
            Ajouter un admin
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un administrateur..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Total: <span className="text-slate-900 font-bold">{filteredAdmins.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Administrateur</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  // Loading Skeleton
                  [1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse"></div></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Name & Picture */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                            {admin.picture ? (
                              <img src={admin.picture} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-500 font-bold text-sm">
                                {admin.first_name[0]}{admin.last_name[0]}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {admin.first_name} {admin.last_name}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">ID: #{admin.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <Mail size={16} className="text-slate-400" />
                          {admin.email}
                        </div>
                      </td>

                      {/* Role (Hardcoded or from future API) */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                          <ShieldCheck size={12} />
                          {admin.role || "Admin"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          admin.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${admin.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {admin.status || "Inconnu"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                            <Trash2 size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      Aucun administrateur trouvé pour "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer (Static for now) */}
          <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
            <span>Affichage de 1 à {filteredAdmins.length} sur {filteredAdmins.length} résultats</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-50" disabled>Précédent</button>
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-50" disabled>Suivant</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Admins;
import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { getAdmins } from '../../services/AdminService.js';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await getAdmins();
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
  

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des Administrateurs</h1>
            <p className="text-slate-500 mt-1">Liste des administrateurs enregistrés.</p>
          </div>
          
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-slate-900/20">
            <UserPlus size={18} />
            Ajouter un admin
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Prénom</th>
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  // Loading Skeleton
                  [1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div></td>
                      <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-100 rounded animate-pulse"></div></td>
                    </tr>
                  ))
                ) : admins.length > 0 ? (
                  admins.map((admin, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-medium">
                        {admin.first_name}
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-medium">
                        {admin.last_name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {admin.email}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                      Aucun administrateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Admins;
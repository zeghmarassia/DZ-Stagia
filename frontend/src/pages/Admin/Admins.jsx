import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { getAdmins } from '../../services/AdminService.js';
import Sidebar from '../../components/Sidebar.jsx';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await getAdmins({
        skip: 0,      // Optional: start from first record
        limit: 100    // Optional: get 100 records
      });
      
      console.log('Admins:', response.data);
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  // const formatDate = (dateString) => {
  //   if (!dateString) return 'N/A';
  //   return new Date(dateString).toLocaleDateString('fr-FR', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      <Sidebar/>
      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des Administrateurs</h1>
            <p className="text-slate-500 mt-1">Liste des administrateurs enregistrés.</p>
          </div>
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
                  <th className='px-6 py-4'>Photo</th>
                  {/* <th className='px-6 py-4'>A rejoint le</th> */}
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
                      <td className="px-6 py-4 text-slate-600">
                        <img 
                          src={admin.picture}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      {/* <td className="px-6 py-4 text-slate-600">
                        <span className="text-sm text-slate-600">
                        {formatDate(admin.created_at)}
                        </span>
                      </td> */}
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
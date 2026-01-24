import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added for navigation
import axiosInstance from '../config/axios';

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/student/applications'); // Assuming this is the correct endpoint
        setApplications(response.data.applications || []);
        setError('');
      } catch (err) {
        setError('Impossible de charger vos candidatures.');
        console.error('Error fetching applications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Helper to get status colors, can be expanded
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'entretien prévu':
      case 'acceptée':
        return { statusColor: 'text-green-600 bg-green-50', dotColor: 'bg-green-500' };
      case 'en cours d\'étude':
        return { statusColor: 'text-blue-600 bg-blue-50', dotColor: 'bg-blue-500' };
      case 'refusée':
        return { statusColor: 'text-red-600 bg-red-50', dotColor: 'bg-red-500' };
      case 'reçue':
      default:
        return { statusColor: 'text-gray-500 bg-gray-100', dotColor: 'bg-gray-400' };
    }
  };
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-[#111827]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>


      <main className="flex-grow w-full max-w-[1200px] mx-auto px-8 py-12">
        <section className="mb-10">
          <h1 className="text-[28px] font-[800] text-[#111827] tracking-tight">Mes Candidatures</h1>
          <p className="text-gray-500 text-[15px] mt-1 font-medium">Suivez l'évolution de toutes vos demandes de stages et d'emploi en temps réel.</p>
        </section>

        <div className="bg-white rounded-[20px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div className="flex items-center space-x-3">
              <span className="text-[13px] text-gray-500 font-bold">Trier par:</span>
              <select className="bg-gray-50 border border-gray-200 text-[13px] font-bold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-[#4fa797] outline-none">
                <option>Les plus récents</option>
                <option>Anciens</option>
              </select>
            </div>
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-[13px] focus:ring-2 focus:ring-[#4fa797]/20 focus:border-[#4fa797] outline-none font-medium transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9FAFB] text-gray-400 text-[11px] font-[800] uppercase tracking-[1px] border-b border-gray-100">
                  <th className="px-8 py-4">Entreprise</th>
                  <th className="px-8 py-4">Poste</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Statut</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan="5" className="text-center py-10 font-bold">Chargement...</td></tr>
                ) : error ? (
                  <tr><td colSpan="5" className="text-center py-10 font-bold text-red-500">{error}</td></tr>
                ) : applications.length > 0 ? (
                  applications.map(app => {
                    const { statusColor, dotColor } = getStatusStyles(app.status);
                    return (
                      <ApplicationRow 
                        key={app.id}
                        logo={app.offer.company.logoUrl || '/placeholder-logo.png'}
                        company={app.offer.company.name}
                        position={app.offer.title}
                        date={`Postulée le ${new Date(app.applicationDate).toLocaleDateString()}`}
                        type={app.offer.type}
                        typeColor="text-blue-600 bg-blue-50" // Placeholder color
                        status={app.status}
                        statusColor={statusColor}
                        dotColor={dotColor}
                      />
                    );
                  })
                ) : (
                  <tr><td colSpan="5" className="text-center py-10 font-bold text-gray-500">Vous n'avez aucune candidature pour le moment.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white">
            <button className="px-6 py-2 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all">Précédent</button>
            <div className="flex space-x-2">
               <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#4fa797] text-white text-[13px] font-bold">1</button>
               <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 text-[13px] font-bold hover:bg-gray-50">2</button>
            </div>
            <button className="px-6 py-2 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all">Suivant</button>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Row Component --- */
const ApplicationRow = ({ logo, company, position, date, type, typeColor, status, statusColor, dotColor }) => (
  <tr className="hover:bg-gray-50/50 transition-all group border-b border-gray-50 last:border-0">
    <td className="px-8 py-5 flex items-center space-x-4 min-w-[200px]">
      <div className="w-10 h-10 min-w-[40px] rounded-full border border-gray-200 bg-white flex items-center justify-center overflow-hidden shadow-sm shrink-0">
        <img 
          src={logo} 
          alt={company} 
          className="w-full h-full object-cover block" 
        />
      </div>
      <span className="font-[800] text-[14px] text-gray-800 whitespace-nowrap">{company}</span>
    </td>
    <td className="px-8 py-5">
      <p className="font-[800] text-[14px] text-gray-900 leading-tight">{position}</p>
      <p className="text-[11px] text-gray-400 font-bold mt-1.5">{date}</p>
    </td>
    <td className="px-8 py-5">
      <span className={`${typeColor} px-4 py-1.5 rounded-full font-[800] text-[10px] whitespace-nowrap inline-block text-center`}>
        {type}
      </span>
    </td>
    <td className="px-8 py-5">
      <span className={`${statusColor} px-4 py-1.5 rounded-full font-[800] text-[10px] flex items-center w-fit whitespace-nowrap`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-2`}></span>
        {status}
      </span>
    </td>
    <td className="px-8 py-5 text-right">
      <button className="text-gray-300 hover:text-gray-600 transition-colors">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </button>
    </td>
  </tr>
);

export default MyApplicationsPage;
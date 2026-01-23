import React, { useState, useEffect } from 'react';
import { Edit3, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from '../config/api';
import CompanyNavbar from '../components/CompanyNavbar';

// Status Badge Component
const Badge = ({ status }) => {
  const statusMap = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
    accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepté' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' }
  };
  
  const config = statusMap[status] || statusMap.pending;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const StatusPill = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
      active 
        ? 'bg-emerald-600 text-white shadow-md' 
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    {label} ({count})
  </button>
);

const CompanyApplications = () => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Fetch all applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/applications/company/all?page=${currentPage}&page_size=10`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setApplications(response.data.applications || []);
      } catch (err) {
        setError('Erreur lors du chargement des candidatures');
        console.error('Applications fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentPage]);

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <CompanyNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <span className="hover:text-emerald-600 cursor-pointer">Mes offres</span>
          <ChevronRight size={14} className="rtl:rotate-180" />
          <span className="text-emerald-600 font-medium">Toutes les candidatures</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Toutes les candidatures</h1>
            <p className="text-slate-500 text-sm">Gérez toutes vos candidatures reçues</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-hide">
            <StatusPill 
              label="Tous" 
              count={statusCounts.all} 
              active={filter === 'all'} 
              onClick={() => setFilter('all')} 
            />
            <StatusPill 
              label="En attente" 
              count={statusCounts.pending} 
              active={filter === 'pending'} 
              onClick={() => setFilter('pending')} 
            />
            <StatusPill 
              label="Acceptés" 
              count={statusCounts.accepted} 
              active={filter === 'accepted'} 
              onClick={() => setFilter('accepted')} 
            />
            <StatusPill 
              label="Rejetés" 
              count={statusCounts.rejected} 
              active={filter === 'rejected'} 
              onClick={() => setFilter('rejected')} 
            />
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-3 rtl:left-auto" size={18} />
            <input
              type="text"
              placeholder="Rechercher ..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none rtl:pr-10 rtl:pl-4"
            />
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Candidat</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Offre</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Statut</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      Chargement...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      Aucune candidature trouvée
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${app.student?.first_name || ''}+${app.student?.last_name || ''}&background=random&color=fff`}
                            alt="" 
                            className="w-10 h-10 rounded-full border border-slate-100" 
                          />
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{app.student?.first_name} {app.student?.last_name}</p>
                            <p className="text-xs text-slate-400">{app.student?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-700">{app.offer?.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{new Date(app.application_date).toLocaleDateString('fr-FR')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors rtl:rotate-180" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="px-4 py-2 text-sm font-medium text-slate-600">
              Page {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyApplications;

import React, { useState, useEffect } from 'react';
import { Edit3, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CompanyNavbar from '../components/CompanyNavbar';

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

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const candidates = [
    { id: 1, name: "Amine Benali", email: "amine.benali@usthb.dz", school: "USTHB", location: "Bab Ezzouar", field: "Informatique (Master 2)", subField: "Génie Logiciel", status: "received", avatar: "https://i.pravatar.cc/150?u=amine" },
    { id: 2, name: "Sarah Kaci", email: "s_kaci@esi.dz", school: "ESI Alger", location: "Oued Smar", field: "Ingénieur d'État", subField: "Systèmes d'Information", status: "under_review", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 3, name: "Yasmine Belkacem", email: "yasmine.bel@enp.edu.dz", school: "ENP Oran", location: "Oran", field: "Génie Électrique", subField: "Automatisme", status: "shortlisted", interviewDate: "15 Oct à 10:00", avatar: "https://i.pravatar.cc/150?u=yasmine" },
    { id: 4, name: "Karim Ouali", email: "k.ouali@ummto.dz", school: "UMMTO", location: "Tizi Ouzou", field: "Informatique", subField: "Réseaux et Sécurité", status: "accepted", avatar: "https://i.pravatar.cc/150?u=karim" },
    { id: 5, name: "Mohamed Derkaoui", email: "m.derkaoui@univ-constantine2.dz", school: "Univ. Constantine 2", location: "Constantine", field: "Informatique", subField: "Développement Web", status: "refused", avatar: "https://i.pravatar.cc/150?u=mohamed" },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      received: "bg-blue-100 text-blue-700",
      under_review: "bg-amber-100 text-amber-700",
      shortlisted: "bg-purple-100 text-purple-700",
      accepted: "bg-emerald-100 text-emerald-700",
      refused: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <CompanyNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <span className="hover:text-emerald-600 cursor-pointer">Mes offres</span>
          <ChevronRight size={14} className="rtl:rotate-180" />
          <span className="text-emerald-600 font-medium">Candidatures</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Ingénieur DevOps Junior</h1>
            <p className="text-slate-500 text-sm">Publiée le 25 décembre 2025</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
            <Edit3 size={16} />
            {t('applications.modify_offer')}
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-hide">
            <StatusPill label={t('applications.stats.all')} count={86} active={filter === 'all'} onClick={() => setFilter('all')} />
            <StatusPill label={t('applications.stats.received')} count={42} active={filter === 'received'} onClick={() => setFilter('received')} />
            <StatusPill label={t('applications.stats.under_review')} count={15} active={filter === 'under_review'} onClick={() => setFilter('under_review')} />
            <StatusPill label={t('applications.stats.shortlisted')} count={5} active={filter === 'shortlisted'} onClick={() => setFilter('shortlisted')} />
            <StatusPill label={t('applications.stats.accepted')} count={1} active={filter === 'accepted'} onClick={() => setFilter('accepted')} />
            <StatusPill label={t('applications.stats.refused')} count={3} active={filter === 'refused'} onClick={() => setFilter('refused')} />
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
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t('applications.table.headers.name')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t('applications.table.headers.university')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t('applications.table.headers.field')}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t('applications.table.headers.status')}</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={candidate.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-100" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{candidate.name}</p>
                          <p className="text-xs text-slate-400">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{candidate.school}</p>
                      <p className="text-xs text-slate-400">{candidate.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{candidate.field}</p>
                      <p className="text-xs text-slate-400">{candidate.subField}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${getStatusStyle(candidate.status)}`}>
                          {t(`applications.stats.${candidate.status}`)}
                        </span>
                        {candidate.interviewDate && (
                          <span className="text-[10px] text-purple-600 font-bold">{candidate.interviewDate}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right rtl:text-left">
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors rtl:rotate-180" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
              Précédent
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
              Suivant
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyApplications;
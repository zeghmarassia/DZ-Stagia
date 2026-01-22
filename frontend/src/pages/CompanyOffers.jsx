import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Globe, 
  Target, 
  Edit2, 
  Archive, 
  ChevronDown 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CompanyNavbar from '../components/CompanyNavbar';

// --- Sub-Components ---

const Badge = ({ type, text }) => {
  const styles = {
    yellow: "bg-amber-100 text-amber-700", // Premier Emploi
    blue: "bg-sky-100 text-sky-700",       // PFE
    green: "bg-emerald-100 text-emerald-700", // Stage & Active Status
    gray: "bg-slate-200 text-slate-500"      // Archived
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[type] || styles.gray}`}>
      {text}
    </span>
  );
};

// --- Main Component ---

const CompanyOffers = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');

  // Handle RTL for Arabic
  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Mock Data
  const offersData = [
    {
      id: 1,
      title: "Ingénieur DevOps Junior",
      date: "25 décembre 2025",
      typeText: "Premier Emploi", // Ideally use translation keys here in a real app
      typeColor: "yellow",
      visibility: "public",
      status: "active",
      candidates: 86
    },
    {
      id: 2,
      title: "Assistant Ressources Humaines",
      date: "25 décembre 2025",
      typeText: "Projet de Fin d'Etudes",
      typeColor: "blue",
      visibility: "targeted",
      status: "active",
      candidates: 23
    },
    {
      id: 3,
      title: "Développeur Full Stack React/Node",
      date: "25 décembre 2025",
      typeText: "Stage",
      typeColor: "green",
      visibility: "public",
      status: "active",
      candidates: 40
    },
    {
      id: 4,
      title: "Designer UI/UX",
      date: "25 décembre 2025",
      typeText: "Stage",
      typeColor: "green",
      visibility: "public",
      status: "archived",
      candidates: 72
    },
    {
      id: 5,
      title: "Assistant Ressources Humaines",
      date: "25 décembre 2025",
      typeText: "Projet de Fin d'Etudes",
      typeColor: "blue",
      visibility: "targeted",
      status: "active",
      candidates: 23
    },
    {
      id: 6,
      title: "Designer UI/UX",
      date: "25 décembre 2025",
      typeText: "Stage",
      typeColor: "green",
      visibility: "public",
      status: "archived",
      candidates: 72
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <CompanyNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t('offers.title')}
          </h1>
          <p className="text-slate-500">
            {t('offers.subtitle')}
          </p>
        </div>

        {/* Action Bar: Tabs & Publish Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-0 mb-6">
          
          {/* Tabs */}
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'all' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t('offers.tabs.all')}
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'active' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t('offers.tabs.active')}
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'archived' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t('offers.tabs.archived')}
            </button>
          </div>

          {/* CTA Button */}
          <div className="pb-2 md:pb-4">
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              {t('offers.btn_publish')}
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          
          {/* Filters Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{t('offers.sort.label')}</span>
              <div className="relative inline-block text-left w-full md:w-48">
                <button className="flex items-center justify-between w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {t('offers.sort.recent')}
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto" />
              <input 
                type="text" 
                placeholder={t('offers.search_placeholder')}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full rtl:pl-4 rtl:pr-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">{t('offers.table.headers.title')}</th>
                  <th className="px-6 py-4">{t('offers.table.headers.type')}</th>
                  <th className="px-6 py-4">{t('offers.table.headers.visibility')}</th>
                  <th className="px-6 py-4">{t('offers.table.headers.status')}</th>
                  <th className="px-6 py-4 text-center">{t('offers.table.headers.candidates')}</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offersData.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50 transition-colors group">
                    
                    {/* Title & Date */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{offer.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Publiée le {offer.date}
                      </p>
                    </td>

                    {/* Type Badge */}
                    <td className="px-6 py-4">
                      <Badge type={offer.typeColor} text={offer.typeText} />
                    </td>

                    {/* Visibility */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                        {offer.visibility === 'public' ? (
                          <Globe className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Target className="w-4 h-4 text-slate-500" />
                        )}
                        {t(`offers.table.visibility.${offer.visibility}`)}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <Badge 
                        type={offer.status === 'active' ? 'green' : 'gray'} 
                        text={t(`table.badges.${offer.status}`)} // Reusing badges from dashboard or generic translation
                      />
                    </td>

                    {/* Candidate Count */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-slate-800 leading-none">{offer.candidates}</span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">Candidats</span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:shadow-md disabled:opacity-50">
               {t('offers.pagination.prev')}
             </button>
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:shadow-md">
               {t('offers.pagination.next')}
             </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CompanyOffers;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import axiosInstance from '../config/axios';
import { API_URL } from '../config/api';
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Handle RTL for Arabic
  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Fetch offers from backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/v1/offers/my-offers`);
        
        // Map backend response to component state
        const offers = (response.data.offers || response.data || []).map(offer => ({
          id: offer.id,
          title: offer.title,
          date: new Date(offer.created_at).toLocaleDateString('fr-FR'),
          typeColor: offer.offer_type === 'Stage' ? 'green' : offer.offer_type === 'PFE' ? 'blue' : 'yellow',
          typeText: offer.offer_type || 'N/A',
          visibility: offer.is_targeted ? 'targeted' : 'public',
          status: offer.is_active ? 'active' : 'archived',
          candidates: offer.applications_count || 0,
          is_active: offer.is_active
        }));
        
        setOffersData(offers);
      } catch (err) {
        setError('Erreur lors du chargement des offres');
        console.error('Offers fetch error:', err);
        setOffersData([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Filter offers based on active tab
  const filteredOffers = activeTab === 'all' 
    ? offersData 
    : offersData.filter(offer => 
        activeTab === 'active' ? offer.is_active : !offer.is_active
      );

  // Handle offer row click to navigate to candidatures
  const handleOfferClick = (offerId) => {
    navigate(`/company/offers/${offerId}/candidatures`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
     

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t('offers.title') || "Mes Offres"}
          </h1>
          <p className="text-slate-500">
            {t('offers.subtitle') || "Gérez vos offres de stage et d'emploi."}
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
              {t('offers.tabs.all') || "Toutes"}
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'active' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t('offers.tabs.active') || "Actives"}
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'archived' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {t('offers.tabs.archived') || "Archivées"}
            </button>
          </div>

          {/* CTA Button - CORRECTED LINK STRUCTURE */}
          <div className="pb-2 md:pb-4">
            <Link to="/company/post-offer">
              <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                {t('offers.btn_publish') || "Publier une offre"}
              </button>
            </Link>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {/* Filters Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{t('offers.sort.label') || "Trier par :"}</span>
              <div className="relative inline-block text-left w-full md:w-48">
                <button className="flex items-center justify-between w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {t('offers.sort.recent') || "Plus récents"}
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto" />
              <input 
                type="text" 
                placeholder={t('offers.search_placeholder') || "Rechercher..."}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full rtl:pl-4 rtl:pr-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">{t('offers.table.headers.title') || "Titre"}</th>
                  <th className="px-6 py-4">{t('offers.table.headers.type') || "Type"}</th>
                  <th className="px-6 py-4">{t('offers.table.headers.visibility') || "Visibilité"}</th>
                  <th className="px-6 py-4">{t('offers.table.headers.status') || "Statut"}</th>
                  <th className="px-6 py-4 text-center">{t('offers.table.headers.candidates') || "Candidats"}</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      Chargement des offres...
                    </td>
                  </tr>
                ) : filteredOffers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      Aucune offre trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredOffers.map((offer) => (
                    <tr 
                      key={offer.id} 
                      onClick={() => handleOfferClick(offer.id)}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      
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
                          {t(`offers.table.visibility.${offer.visibility}`) || offer.visibility}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <Badge 
                          type={offer.status === 'active' ? 'green' : 'gray'} 
                          text={t(`table.badges.${offer.status}`) || offer.status} 
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:shadow-md disabled:opacity-50">
               {t('offers.pagination.prev') || "Précédent"}
             </button>
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:shadow-md">
               {t('offers.pagination.next') || "Suivant"}
             </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CompanyOffers;
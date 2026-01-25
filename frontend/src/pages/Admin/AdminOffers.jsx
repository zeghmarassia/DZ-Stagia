import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOffers, deleteOffer } from '../../services/offerService';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock Data
  const MOCK_OFFERS = [
    {
      id: 1,
      title: "Développeur React Native",
      company_name: "TechInnovate",
      created_at: "2024-01-24T10:00:00Z",
      offer_type: "Stage",
      applications_count: 15
    },
    {
      id: 2,
      title: "Designer UI/UX",
      company_name: "Creative Studio",
      created_at: "2024-01-22T14:30:00Z",
      offer_type: "PFE",
      applications_count: 8
    },
    {
      id: 3,
      title: "Data Analyst",
      company_name: "Data Corp",
      created_at: "2024-01-20T09:15:00Z",
      offer_type: "Emploi",
      applications_count: 22
    }
  ];

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        // Commented out API call
        /*
        const response = await getOffers();
        setOffers(response.data.offers || []);
        */
        
        // Use Mock Data
        setOffers(MOCK_OFFERS);

      } catch (err) {
        setError('Failed to fetch offers.');
        console.error('Fetch offers error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Commented out API call
      /*
      await deleteOffer(selectedId);
      */
      
      // Update local state
      setOffers(offers.filter((o) => o.id !== selectedId));
      setShowModal(false);
    } catch (err) {
      setError('Failed to delete offer.');
      console.error('Delete offer error:', err);
      setShowModal(false);
    }
  };

  // Helper to get badge styles based on offer type
  const getTypeStyles = (type) => {
    switch (type) {
      case 'Stage':
        return 'bg-[#E7F6F2] text-[#42A487]';
      case 'Premier Emploi':
        return 'bg-[#FFF8E5] text-[#FFC107]';
      case 'Projet de Fin d\'Etudes':
        return 'bg-[#EBF2FF] text-[#3F8CFF]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-[#1A1D1F] relative">
      
      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="bg-white rounded-[20px] shadow-2xl p-8 w-[450px] flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-[3px] border-[#1A1D1F] flex items-center justify-center mb-6">
              <span className="text-[#1A1D1F] text-4xl font-bold">!</span>
            </div>
            <h3 className="text-[18px] font-[700] mb-8 text-center">Êtes-vous sûr de vouloir supprimer cette offre ?</h3>
            <div className="flex space-x-5">
              <button onClick={() => setShowModal(false)} className="px-8 py-3 rounded-[10px] border border-[#E8E8E8] text-[#6F767E] text-[12px] font-[800] uppercase">Annuler</button>
              <button onClick={confirmDelete} className="px-8 py-3 rounded-[10px] bg-[#42A487] text-white text-[12px] font-[800] uppercase shadow-sm">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-20 border-r border-[#F0F0F0] flex flex-col items-center py-8 bg-white z-10">
        <div className="mb-12 font-[900] text-[18px]">STAGIA</div>
        <nav className="flex-1 space-y-8">
          <SideIcon icon={<HomeIcon />} to="/admin" />
          <SideIcon icon={<UsersIcon />} to="/admin/users" />
          <SideIcon icon={<StudentIcon />} to="/admin/students" />
          <SideIcon icon={<BuildingIcon />} to="/admin/companies" />
          <SideIcon icon={<BriefcaseIcon />} to="/admin/offers" active />
        </nav>
        <div className="pt-8 border-t border-[#F0F0F0] w-full flex justify-center">
          <SideIcon icon={<SettingsIcon />} to="/admin/settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F4F4F4]/30 px-12 py-8">
        {/* Header */}
        <div className="flex justify-end items-center mb-10 space-x-8">
          <button className="text-[#6F767E]"><SearchIcon /></button>
          <button className="text-[#6F767E]"><BellIcon /></button>
          <div className="flex items-center space-x-3 pl-4 border-l border-[#F0F0F0]">
            <div className="text-right">
              <p className="text-[14px] font-[700]">Hiba Kara</p>
              <p className="text-[11px] text-[#6F767E]">Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FFBC99] flex items-center justify-center text-white font-bold text-xs border-2 border-white">HK</div>
            <button className="text-[#6F767E] ml-2"><LogoutIcon /></button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-[28px] font-[700]">Offres</h2>
          <p className="text-[#6F767E] text-[13px]">Gérez toutes les offres postées dans la plateforme.</p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm">
          <div className="p-5 flex justify-between items-center border-b border-[#F0F0F0]">
            <div className="flex items-center space-x-2">
              <span className="text-[#6F767E] text-xs font-medium">Trier par:</span>
              <select className="bg-[#F4F4F4] border-none rounded-lg px-3 py-1.5 text-xs font-[700] outline-none">
                <option>Les plus récents</option>
              </select>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F767E]"><SearchIcon size={14} /></span>
              <input type="text" placeholder="Rechercher ..." className="bg-[#F4F4F4] border-none rounded-lg pl-9 pr-4 py-2 text-xs w-64 outline-none" />
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[#6F767E] text-[10px] font-[700] uppercase tracking-widest border-b border-[#F0F0F0]">
                <th className="px-6 py-4">Nom de l'offre</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Candidatures</th>
                <th className="px-6 py-4">Postée le</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F4]">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="text-center py-10 text-red-500">{error}</td></tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-[#F4F4F4]/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-[700] text-[#1A1D1F]">{offer.title}</span>
                        <span className="text-[11px] text-[#6F767E]">{offer.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[11px] font-[700] ${getTypeStyles(offer.type)}`}>
                        {offer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-[12px] font-[600] text-[#1A1D1F]">
                        <UsersIcon size={14} className="mr-2 text-[#6F767E]" />
                        {offer.candidates} candidats
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[12px] font-[600] text-[#1A1D1F]">{new Date(offer.date).toLocaleString('fr-FR')}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteClick(offer.id)} className="text-[#6F767E] hover:text-red-500 transition-colors">
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-4 flex justify-between items-center">
            <button className="px-4 py-1.5 border border-[#E8E8E8] rounded-lg text-[#6F767E] text-xs font-bold opacity-50">Précédent</button>
            <button className="px-4 py-1.5 border border-[#E8E8E8] rounded-lg text-[#1A1D1F] text-xs font-bold">Suivant</button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components & SVGs
const SideIcon = ({ icon, to, active = false }) => (
  <Link to={to} className={`p-3 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-[#F4F4F4] text-[#27AE60] border border-[#E8E8E8] shadow-sm' : 'text-[#6F767E] hover:text-black'}`}>
    {icon}
  </Link>
);

const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = ({ size = 20, className = "" }) => <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
const StudentIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10L12 5L2 10L12 15L22 10Z"/><path d="M6 12.5V16.5L12 19.5L18 16.5V12.5"/></svg>;
const BuildingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/></svg>;
const BriefcaseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09"/></svg>;
const SearchIcon = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const BellIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const LogoutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

export default Offers;
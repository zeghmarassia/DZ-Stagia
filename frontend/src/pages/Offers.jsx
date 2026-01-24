import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { Search, MapPin, Clock, Briefcase, Filter, ChevronDown, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { getPublicOffers } from '../services/mainService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Offers = () => {
  const navigate = useNavigate();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Les plus récents");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8;

  // Handler to navigate to offer details
  const handleViewOffer = (offerId) => {
    navigate(`/offers/${offerId}`);
  };

  // Fetch offers from backend
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const response = await getPublicOffers({
          page: currentPage,
          page_size: pageSize,
          keyword: null,
        });
        console.log('Offers response:', response.data);
        setOffers(response.data.offers || []);
        setTotalPages(response.data.total_pages || 0);
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [currentPage]);

  // Filter Categories
  const filters = [
    { title: "Type d'offre", options: ["Stage", "Projet de Fin d'Études", "Premier Emploi", "Alternance"] },
    { title: "Localisation", options: ["Alger", "Béjaïa", "Constantine", "Sétif", "Jijel", "Tizi Ouzou"] },
    { title: "Spécialité", options: ["Intelligence Artificielle", "Marketing", "Software Engineering", "Finance", "Génie Civil", "Ressources Humaines"] },
    { title: "Mode de travail", options: ["Présentiel", "Télétravail", "Hybride"] },
    { title: "Durée", options: ["Moins de 3 mois", "3 à 6 mois", "Plus de 6 mois", "CDI", "CDD"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-r from-[#4AA59C] to-[#2D7A75] px-4 py-12 md:py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trouvez l'opportunité idéale.
        </h1>
        <p className="text-white/90 text-lg mb-8 max-w-2xl">
          Explorez des centaines d'offres de stages, PFE et premiers emplois adaptés à votre profil
        </p>
        
        {/* Search Bar */}
        <div className="bg-white p-1 rounded-lg flex items-center w-full max-w-2xl shadow-lg">
          <div className="pl-4 text-gray-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Intitulé du poste, mots clés, entreprise, location, ..." 
            className="flex-1 px-4 py-3 outline-none text-slate-700 placeholder-slate-400"
          />
          <button className="bg-[#1E4C6E] hover:bg-[#163a54] text-white px-6 py-2.5 rounded-md font-medium transition">
            Rechercher
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Filter size={20} className="text-[#4AA59C]" />
                <span>Filtres</span>
              </div>
              <button className="text-xs text-[#4AA59C] font-semibold hover:underline">Réinitialiser</button>
            </div>

            <div className="space-y-6">
              {filters.map((category, idx) => (
                <div key={idx}>
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">{category.title}</h4>
                  <div className="space-y-2">
                    {category.options.map((option, optIdx) => (
                      <label key={optIdx} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="peer w-4 h-4 border-2 border-slate-300 rounded checked:bg-[#1E4C6E] checked:border-[#1E4C6E] transition appearance-none cursor-pointer" />
                          <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                             <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="text-slate-600 text-sm group-hover:text-slate-900 transition">{option}</span>
                        <span className="ml-auto text-xs text-slate-400 font-mono">(12)</span>
                      </label>
                    ))}
                  </div>
                  {/* "Afficher Plus" placeholder if needed */}
                  {category.options.length > 4 && (
                     <button className="text-xs text-[#4AA59C] font-bold mt-2 flex items-center gap-1">
                       AFFICHER PLUS <ChevronDown size={12} />
                     </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* JOB LISTINGS */}
        <main className="flex-1">
          
          {/* Sorting Header */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2 relative">
              <span className="text-slate-500 text-sm">Trier par:</span>
              
              {/* Dropdown Button */}
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-2 shadow-sm hover:border-[#4AA59C] transition min-w-[180px] justify-between"
              >
                {sortOption}
                <ChevronDown size={16} className={`transition ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu (from choices.png) */}
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-xl z-20 py-1 animate-in fade-in slide-in-from-top-2">
                  {["Les plus récents", "Les plus anciens", "Les plus consultés", "Les plus pertinents"].map((opt) => (
                    <button 
                      key={opt}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-gray-50 hover:text-[#4AA59C] transition"
                      onClick={() => {
                        setSortOption(opt);
                        setIsSortOpen(false);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {loading ? (
              <p className="col-span-2 text-center text-slate-500">Chargement des offres...</p>
            ) : offers.length === 0 ? (
              <p className="col-span-2 text-center text-slate-500">Aucune offre disponible</p>
            ) : (
              offers.map((offer) => (
                <JobCard 
                  key={offer.offer_id} 
                  offer={offer}
                  onViewClick={handleViewOffer}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm font-medium px-3 py-2 disabled:opacity-50"
              >
                <ArrowLeft size={16} /> Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition ${
                    currentPage === page 
                      ? 'bg-[#1E4C6E] text-white shadow-md' 
                      : 'text-slate-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && <span className="text-slate-400">...</span>}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm font-medium px-3 py-2 disabled:opacity-50"
              >
                Suivant <ArrowRight size={16} />
              </button>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

// Reusable Job Card Component matching the design
const JobCard = ({ offer, onViewClick }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Il y a 1 jour';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full relative group">
      
      {/* Header: Badge & Date */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-[#FFF8C5] text-[#8B6E00] text-xs font-bold px-3 py-1 rounded-full">
          {offer.offer_type || 'Offre'}
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {formatDate(offer.created_at)}
        </span>
      </div>

      {/* Content */}
      <div className="flex gap-4 mb-4">
        {/* Logo Placeholder */}
        <div className="w-12 h-12 bg-gradient-to-br from-[#4AA59C] to-[#2D7A75] rounded-md shrink-0 flex items-center justify-center text-white font-bold">
          {offer.company?.company_name?.charAt(0) || 'E'}
        </div>
        
        <div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 group-hover:text-[#4AA59C] transition">
            {offer.title}
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            {offer.company?.company_name || 'Entreprise'}
          </p>
        </div>
      </div>

      <p className="text-slate-500 text-sm mb-6 line-clamp-2">
        {offer.description || 'Pas de description disponible'}
      </p>

      {/* Footer Icons & Button */}
      <div className="mt-auto flex items-end justify-between">
        <div className="space-y-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#4AA59C]" /> {offer.location || 'Non spécifié'}
          </div>
          <div className="flex items-center gap-2">
             <Clock size={14} className="text-[#4AA59C]" /> {offer.duration || 'Durée non spécifiée'}
          </div>
          <div className="flex items-center gap-2">
             <Briefcase size={14} className="text-[#4AA59C]" /> {offer.location_mode || 'Mode non spécifié'}
          </div>
        </div>

        <button 
          className="bg-[#56Bca0] hover:bg-[#4aa58b] text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wide transition shadow-sm" 
          onClick={() => onViewClick && onViewClick(offer.offer_id)}
        >
          Voir Plus
        </button>
      </div>
    </div>
  );
};

export default Offers;
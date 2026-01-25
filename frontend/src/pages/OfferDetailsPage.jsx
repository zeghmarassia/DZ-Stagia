import React, { useState, useEffect } from 'react'; // Added useState
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPublicOfferDetails } from '../services/mainService';
import axiosInstance from '../config/axios';

const OfferDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data
 const MOCK_OFFER_DETAILS = {
  offer_id: id,
  title: "Développeur Full Stack",
  description: "Nous recherchons un développeur Full Stack...",
  location: "Alger, Hydra",
  offer_type: "Emploi",
  duration: "CDI",
  created_at: "2024-01-25T10:00:00Z",

  missions: [
    "Développer des applications web modernes",
    "Collaborer avec l'équipe produit",
    "Maintenir et améliorer le code existant"
  ],

  requirements: [
    "React",
    "Node.js",
    "SQL"
  ],

  whatWeOffer: [
    "Environnement de travail dynamique",
    "Opportunités d'évolution",
    "Salaire compétitif"
  ],

  company: {
    name: "Tech Solutions",
    logoUrl: "/company-logo.png",
    industry: "Technologie",
    description: "Entreprise innovante spécialisée en solutions digitales"
  }
};


  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setIsLoading(true);
        // Commented out API call
        /*
        const response = await getPublicOfferDetails(id);
        setOffer(response.data);
        */
        
        // Use Mock Data
        setOffer(MOCK_OFFER_DETAILS);
        
        setError('');
      } catch (err) {
        setError('Impossible de charger les détails de l\'offre.');
        console.error('Error fetching offer details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOffer();
    }
  }, [id]);

  const handleApply = async () => {
    try {
      // Check if user is authenticated (has token)
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Veuillez vous connecter pour postuler à cette offre.');
        navigate('/login');
        return;
      }

      // Commented out API call
      /*
      // Assuming the endpoint to apply is /offers/:id/apply
      const response = await axiosInstance.post(`/offers/${id}/apply`);
      */
     
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      
      alert('Candidature envoyée avec succès !');
      setIsModalOpen(false);
      // Optionally, redirect the user to their applications page
      navigate('/student/my-applications');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Une erreur est survenue lors de la candidature.');
      }
      console.error('Error applying for offer:', err);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-[#111827]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white rounded-[24px] p-10 max-w-[500px] w-full mx-4 relative z-10 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#111827] flex items-center justify-center mb-6">
              <span className="text-[32px] font-bold text-[#111827]">!</span>
            </div>
            
            <h3 className="text-[18px] font-[800] mb-8">
              Êtes-vous sûr de vouloir postuler à cet offre ?
            </h3>
            
            <div className="flex space-x-4 w-full">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-[12px] border border-gray-200 text-gray-500 font-[800] text-[14px] hover:bg-gray-50 transition-colors uppercase"
              >
                Annuler
              </button>
              <button 
                onClick={handleApply}
                className="flex-1 px-6 py-3 rounded-[12px] bg-[#4fa797] text-white font-[800] text-[14px] hover:bg-[#3d8b7d] transition-colors uppercase"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {/* <header className="w-full bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-12">
          <div className="text-[22px] font-[800] tracking-tighter text-[#111827]">LOGO</div>
          <nav className="hidden md:flex space-x-8 text-[14px] font-bold">
            <Link to="/dashboard" className="text-gray-400 hover:text-[#111827] transition-colors">Tableau de Bord</Link>
            <Link to="/offres" className="text-[#4fa797] border-b-2 border-[#4fa797] pb-1">Offres</Link>
            <Link to="/applications" className="text-gray-400 hover:text-[#111827] transition-colors">Mes Candidatures</Link>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 border-r border-gray-100 pr-6 text-gray-400">
            <button className="hover:text-[#4fa797] transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <button className="hover:text-[#4fa797] transition-colors relative">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-[13px] font-[800]">Aicha Belaid</p>
              <p className="text-[11px] text-gray-400 font-bold">Étudiant</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-gray-200 bg-white overflow-hidden shrink-0 shadow-sm">
                <img src="/profile.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors ml-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </header> */}

      <main className="max-w-[1200px] mx-auto w-full px-8 py-8">
        {isLoading && <p className="text-center font-bold">Chargement de l'offre...</p>}
        {error && <p className="text-center font-bold text-red-500">{error}</p>}
        {offer && !isLoading && !error && (
        <>
          {/* Back Button */}
          <Link to="/offers" className="flex items-center text-[#4fa797] text-[14px] font-bold mb-8 hover:opacity-80 transition-opacity">
            <svg className="mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            Retour
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (Left) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header Card */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-[#F3FBF9] rounded-[20px] flex items-center justify-center border border-[#E8F5F2]">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 18L22 12L16 6" stroke="#4fa797" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6L2 12L8 18" stroke="#4fa797" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-[24px] font-[800] text-[#111827]">{offer.title}</h1>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-[#4fa797] text-[14px] font-bold">{offer.company.name}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400 text-[13px] font-medium flex items-center">
                          <svg className="mr-1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          {offer.location}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400 text-[13px] font-medium italic text-nowrap">{new Date(offer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-[#4fa797]/10 text-[#4fa797] px-4 py-1.5 rounded-full text-[11px] font-[800]">{offer.type}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <InfoBadge 
                    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>} 
                    label={offer.duration} 
                  />
                  <InfoBadge 
                    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M9 22V12h6v10" /></svg>} 
                    label={offer.workMode} 
                  />
                  <InfoBadge 
                    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5z" stroke="#4fa797" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>} 
                    label={offer.educationLevel} 
                  />
                  <InfoBadge 
                    icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8v8" /><path d="M9 10h4.5a1.5 1.5 0 010 3H9h4.5a1.5 1.5 0 010 3H9" /></svg>} 
                    label={offer.isPaid ? 'Rémunéré' : 'Non Rémunéré'} 
                  />
                </div>
              </div>

              {/* Content Body */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm space-y-8">
                <section>
                  <h2 className="text-[18px] font-[800] mb-4">Description du poste</h2>
                  <p className="text-gray-500 leading-relaxed text-[15px] font-medium">
                    {offer.description}
                  </p>
                </section>

                <section>
                  <h2 className="text-[18px] font-[800] mb-4">Vos missions</h2>
                  <ul className="space-y-3 text-gray-500 text-[15px] font-medium">
                    {offer.missions.map((mission, index) => <ListItem key={index} text={mission} />)}
                  </ul>
                </section>

                <section>
                  <h2 className="text-[18px] font-[800] mb-4">Prérequis</h2>
                  <ul className="space-y-3 text-gray-500 text-[15px] font-medium">
                    {offer.requirements.map((req, index) => <ListItem key={index} text={req} />)}
                  </ul>
                </section>

                <section>
                  <h2 className="text-[18px] font-[800] mb-4">Ce que nous offrons</h2>
                  <ul className="space-y-3 text-gray-500 text-[15px] font-medium">
                    {offer.whatWeOffer.map((item, index) => <ListItem key={index} text={item} />)}
                  </ul>
                </section>
              </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-[16px] font-[800] mb-2">Intéressé(e) par ce stage ?</h3>
                <p className="text-gray-400 text-[13px] font-medium mb-6">Ne manquez pas cette opportunité de booster votre carrière. Postulez dès maintenant !</p>
                <button 
                  onClick={() => setIsModalOpen(true)} // Open modal on click
                  className="w-full bg-[#4fa797] text-white py-3.5 rounded-[12px] font-[800] text-[15px] hover:bg-[#3d8b7d] transition-colors flex items-center justify-center mb-3 group"
                >
                  Postuler maintenant
                  <svg className="ml-2 group-hover:translate-x-1 transition-transform" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
                <button className="w-full bg-white border border-gray-200 text-gray-600 py-3.5 rounded-[12px] font-[800] text-[14px] hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <svg className="mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  Sauvegarder l'offre
                </button>
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-[11px] font-[800] text-gray-400 uppercase tracking-widest mb-6">À propos de l'entreprise</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-gray-400 border border-gray-100"><img src={offer.company.logoUrl} alt={`${offer.company.name} logo`} className="w-full h-full object-contain"/></div>
                  <div>
                    <h4 className="font-[800] text-[15px]">{offer.company.name}</h4>
                    <p className="text-[12px] text-gray-400 font-bold">{offer.company.industry}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-[13px] font-medium leading-relaxed mb-6">
                  {offer.company.description}
                </p>
                <Link to="#" className="text-[#4fa797] text-[13px] font-[800] hover:underline flex items-center">
                  Voir le profil de l'entreprise
                  <svg className="ml-1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </Link>
              </div>

              {/* Similar Offers */}
              <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-[11px] font-[800] text-gray-400 uppercase tracking-widest mb-6">Offres similaires</h3>
                <div className="space-y-6">
                  <SimilarOffer 
                    title="Junior Data Analyst" 
                    company="Danone Algérie" 
                    location="Akbou" 
                    color="bg-[#F3FBF9]"
                    icon={
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="#4fa797" strokeWidth="2"/>
                        <path d="M12 6C15.3137 6 18 8.68629 18 12" stroke="#4fa797" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3"/>
                      </svg>
                    }
                  />
                  <SimilarOffer 
                    title="Marketing Digital" 
                    company="Cevital" 
                    location="Alger" 
                    color="bg-[#FFFBEB]"
                    icon={<svg width="18" height="18" fill="none" stroke="#F59E0B" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>}
                  />
                  <SimilarOffer 
                    title="Dev. Applications Mobiles" 
                    company="InnoEra" 
                    location="Oran" 
                    color="bg-[#F5F3FF]"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </main>
    </div>
  );
};

/* --- Components --- */
const InfoBadge = ({ icon, label }) => (
  <div className="flex items-center space-x-2 bg-[#F9FAFB] rounded-xl px-4 py-3 border border-gray-50">
    <span className="text-gray-400">{icon}</span>
    <span className="text-[13px] font-[700] text-[#4B5563]">{label}</span>
  </div>
);

const ListItem = ({ text }) => (
  <li className="flex items-start">
    <span className="w-1.5 h-1.5 rounded-full bg-[#4fa797] mt-2 mr-3 shrink-0"></span>
    {text}
  </li>
);

const SimilarOffer = ({ title, company, location, color, icon }) => (
  <div className="flex items-center space-x-4 group cursor-pointer">
    <div className={`w-11 h-11 rounded-xl ${color} shrink-0 flex items-center justify-center border border-white/50 shadow-sm transition-transform group-hover:scale-105`}>
      {icon}
    </div>
    <div>
      <h4 className="text-[14px] font-[800] text-[#111827] group-hover:text-[#4fa797] transition-colors">{title}</h4>
      <p className="text-[12px] text-gray-400 font-bold">{company} • {location}</p>
    </div>
  </div>
);

export default OfferDetailsPage;
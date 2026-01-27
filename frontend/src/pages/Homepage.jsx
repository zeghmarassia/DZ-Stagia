import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CompanyCard from '../components/CompanyCard';
import JobCard from '../components/JobCard';
import FeatureCard from '../components/FeatureCard';
import { getPublicCompanies } from '../services/mainService';
import { getPublicOffers } from '../services/mainService';
import HomeNavbar from '../components/HomeNavbar'; // Import the new component


import { 
  Search, MapPin, Briefcase, GraduationCap, Building2, Handshake,
  Check, ArrowRight, Facebook, Linkedin, Twitter, Instagram,
  Clock, Code2, BarChart3, TrendingUp, Smartphone
  // Removed: Menu, X, LogIn (moved to Navbar)
} from 'lucide-react';

const Homepage = () => {
  const { t } = useTranslation();
  // Removed: isSearchOpen state (moved to Navbar)
  const navigate = useNavigate();
  
  const [offers, setOffers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handler to navigate to offer details
  const handleViewOffer = (offerId) => {
    navigate(`/offers/${offerId}`);
  };

  // Fetch recent offers and companies on mount - Limited to 4 items for homepage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Commented out API calls
        
        // Fetch recent offers (4 items only for homepage)
        const offersResponse = await getPublicOffers({ page: 1, page_size: 4 });
        setOffers(offersResponse.data.offers || []);

        // Fetch companies (4 items only for homepage)
        const companiesResponse = await getPublicCompanies({ page: 1, page_size: 6 });
        setCompanies(companiesResponse.data.companies || []);
        
       
        // Use Mock Data
        // setOffers(MOCK_RECENT_OFFERS);
        // setCompanies(MOCK_COMPANIES);

      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Navbar Component Call */}
      {/* <HomeNavbar /> */}

      {/* --- HERO SECTION --- */}
      <header id='hero' className="bg-gray-50/50 pt-20 pb-24 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
            {t('hero.title')}
          </h1>
          
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button className="px-8 py-3.5 bg-[#5B8C9D] text-white font-bold rounded-lg shadow-md hover:bg-[#4a7280] transition" onClick={() => navigate('/offers')}>
              {t('hero.btn_browse')}
            </button>
            <button className="px-8 py-3.5 bg-white border border-gray-300 text-slate-700 font-bold rounded-lg hover:bg-gray-50 transition shadow-sm" onClick={() => navigate('/company/post-offer')}>
              {t('hero.btn_post')}
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section id='features' className="relative py-24 bg-gradient-to-r from-teal-600 to-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
              STAGIA est une plateforme complète pour votre parcours professionnel.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard 
              icon={<GraduationCap className="w-6 h-6" />}
              title="POUR LES ETUDIANTS"
              description="Créez votre profil, postulez aux offres en un clic, et suivez vos candidatures en temps réel."
              items={['CV en ligne personnalisé.', 'Notifications instantannées.', 'Suivi des candidatures.']}
            />
            <FeatureCard 
              icon={<Building2 className="w-6 h-6" />}
              title="POUR LES ENTREPRISES"
              description="Publiez vos offres, gérez vos candidatures et trouvez les meilleurs talents."
              items={['Ciblage par université.', 'Gestion des candidats.', 'Statistiques détaillées.']}
            />
            <FeatureCard 
              icon={<Handshake className="w-6 h-6" />}
              title="MATCHING INTELLIGENT"
              description="Notre algorithme connecte automatiquement les profils compatibles."
              items={['Recommandations personnalisées.', 'Filtrage intelligent.', 'Matching par compétences.']}
            />
          </div>
        </div>
      </section>

      {/* --- TOP COMPANIES --- */}
      <section id='companies' className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Postulez pour les meilleures entreprises</h2>

          <a href="#" className="text-blue-600 text-sm font-medium hover:underline flex items-center" onClick={() => navigate('/companies')}>
            Voir tout <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-slate-500">Chargement des entreprises...</p>
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <CompanyCard 
                key={company.company_id}
                id={company.company_id}
                name={company.company_name} 
                location={company.address} 
                logo={company.logo_url || 'https://via.placeholder.com/150'}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-slate-500">Aucune entreprise disponible</p>
          )}
        </div>
      </section>

      {/* --- RECENT OFFERS --- */}
      <section id='offers' className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Offres Récentes</h2>
            <p className="text-slate-500">Découvrez les dernières opportunités disponibles</p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-slate-500 py-8">Chargement des offres...</p>
            ) : offers.length > 0 ? (
              offers.map((offer) => (
                <JobCard 
                  key={offer.offer_id}
                  offerId={offer.offer_id}
                  title={offer.title}
                  company={offer.company?.company_name || 'Entreprise'}
                  location={offer.location}
                  duration={offer.duration}
                  type={offer.offer_type}
                  badgeColor="bg-emerald-100 text-emerald-600"
                  logo={<Briefcase size={28} className="text-blue-600" />}
                  logoBg="bg-blue-100"
                  onViewClick={handleViewOffer}
                />
              ))
            ) : (
              <p className="text-center text-slate-500 py-8">Aucune offre disponible</p>
            )}
          </div>

          <div className="mt-10 text-center">
            <button className="px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition shadow-lg shadow-slate-300/50" onClick={() => navigate('/offers')}>
              Voir toutes les offres
            </button>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION 1 --- */}
      <section id='forstudent' className="bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 py-16 md:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Prêt à commencer votre parcours ?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-lg">Rejoignez des milliers d'étudiants qui ont trouvé leur opportunité idéale.</p>
            <button onClick={() => navigate('/login')} className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg">Commencer</button>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end relative mt-8 md:mt-0">
            <img src="/students1 1.png" alt="Étudiants" className="w-full max-w-md object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION 2 --- */}
      <section id='forcompany' className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center justify-between">
          <div className="md:w-1/2 flex justify-center md:justify-start relative mt-8 md:mt-0 pt-10">
            <img src="/company 1.png" alt="Entreprise" className="w-full max-w-lg object-contain drop-shadow-xl" />
          </div>
          <div className="md:w-1/2 py-16 md:pl-12 text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Vous voulez recruter les meilleurs talents ?</h2>
            <p className="text-emerald-50 text-lg mb-8 max-w-lg">Rejoignez des entreprises qui publient des offres captivantes.</p>
            <button onClick={() => navigate('/login')} className="px-8 py-3 bg-white text-teal-800 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg">Commencer</button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id='footer' className="bg-slate-950 text-slate-400 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-xl font-black text-white mb-4">STAGIA.</div>
            <p className="max-w-xs mb-6">La plateforme de référence pour les stages, PFE et premiers emplois en Algérie.</p>
            <div className="flex space-x-4">
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer"><Facebook size={16}/></div>
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer"><Linkedin size={16}/></div>
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer"><Twitter size={16}/></div>
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer"><Instagram size={16}/></div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Offres</a></li>
              <li><a href="#" className="hover:text-white">Entreprises</a></li>
              <li><a href="#" className="hover:text-white">À Propos</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              <li><a href="#" className="hover:text-white">Conditions</a></li>
              <li><a href="#" className="hover:text-white">Mentions légales</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-center text-xs">
          &copy; <span onClick={()=>navigate('/auth/admin/login')}>2025</span> STAGIA. Tous Droits Réservés.
        </div>
    </footer>
    </div>
  );
};

export default Homepage;
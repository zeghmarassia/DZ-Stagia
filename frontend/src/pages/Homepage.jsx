import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import translation hook
import LanguageSwitcher from '../components/LanguageSwitcher'; // Import switcher
import CompanyCard from '../components/CompanyCard';
import JobCard from '../components/JobCard';
import FeatureCard from '../components/FeatureCard';

import { 
  Search, MapPin, Briefcase, GraduationCap, Building2, Handshake,
  Check, ArrowRight, Menu, Facebook, Linkedin, Twitter, Instagram,
  Clock, Code2, BarChart3, TrendingUp, Smartphone, X
} from 'lucide-react';

const Homepage = () => {
  const { t } = useTranslation(); // Initialize translations
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search bar toggle

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-gray-50">
      
      {/* --- NAVIGATION --- */}
      <nav className="bg-white py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4 relative">
          
          {/* Left Side: Logo & Links */}
          <div className="flex items-center gap-8 md:gap-12">
            {/* Logo */}
            <div className="text-2xl font-black text-slate-900 tracking-wide uppercase cursor-pointer">
              LOGO
            </div>

            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-bold text-slate-900">
              <a href="#" className="hover:text-blue-600 transition">{t('nav.offers')}</a>
              <a href="#" className="hover:text-blue-600 transition">{t('nav.companies')}</a>
              <a href="#" className="hover:text-blue-600 transition">{t('nav.about')}</a>
            </div>
          </div>

          {/* Right Side: Search, Auth & Language */}
          <div className="flex items-center gap-4 ml-auto">
            
            {/* EXPANDABLE SEARCH BAR */}
            <div className="hidden md:flex items-center relative transition-all duration-300">
              {/* The Input Field (Hidden by default, expands when open) */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center
                  ${isSearchOpen ? 'w-64 opacity-100 mr-2' : 'w-0 opacity-0'}
                `}
              >
                <input 
                  type="text" 
                  placeholder={t('nav.search_placeholder')}
                  className="w-full py-2 px-4 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* The Search Icon Button */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 text-slate-600 transition"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            {/* Language Switcher Component */}
            <div className="hidden md:block">
               <LanguageSwitcher />
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/signup"> 
                <button className="px-5 py-2.5 bg-[#5B8C9D] text-white text-sm font-bold rounded-lg hover:bg-[#4a7280] transition shadow-sm">
                  {t('nav.signup')}
                </button>
              </Link>
              <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition">
                {t('nav.login')}
              </Link>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <Menu className="w-6 h-6 text-slate-900" />
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="bg-gray-50/50 pt-20 pb-24 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
            {t('hero.title')}
          </h1>
          
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button className="px-8 py-3.5 bg-[#5B8C9D] text-white font-bold rounded-lg shadow-md hover:bg-[#4a7280] transition">
              {t('hero.btn_browse')}
            </button>
            <button className="px-8 py-3.5 bg-white border border-gray-300 text-slate-700 font-bold rounded-lg hover:bg-gray-50 transition shadow-sm">
              {t('hero.btn_post')}
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="relative py-24 bg-gradient-to-r from-teal-600 to-slate-400">
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
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Postulez pour les meilleures entreprises</h2>
          <a href="#" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
            Voir tout <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CompanyCard name="SONATRACH" location="Boumerdès" logo="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sonatrach.svg/1200px-Sonatrach.svg.png" isFeatured={true} />
          <CompanyCard name="MOBILIS" location="Béjaia" logo="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Mobilis_Bonne_Ann%C3%A9e_2018.png/800px-Mobilis_Bonne_Ann%C3%A9e_2018.png" />
          <CompanyCard name="Algérie Télécom" location="Alger" logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Alg%C3%A9rie_T%C3%A9l%C3%A9com.svg/2560px-Alg%C3%A9rie_T%C3%A9l%C3%A9com.svg.png" isActive={true} />
          <CompanyCard name="Cévital" location="Alger" logo="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Cevital_logo.svg/1200px-Cevital_logo.svg.png" isFeatured={true} />
          <CompanyCard name="YASSIR" location="Alger" logo="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Yassir_logo.svg/2560px-Yassir_logo.svg.png" />
          <CompanyCard name="Djezzy" location="Oran" logo="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Djezzy_Logo.svg/1200px-Djezzy_Logo.svg.png" />
        </div>
      </section>

      {/* --- RECENT OFFERS --- */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Offres Récentes</h2>
            <p className="text-slate-500">Découvrez les dernières opportunités disponibles</p>
          </div>

          <div className="space-y-4">
            <JobCard title="Développeur Full Stack" company="Digital Solutions" location="Constantine" duration="2 mois" type="Stage" badgeColor="bg-emerald-100 text-emerald-600" logo={<Code2 size={28} className="text-indigo-600" />} logoBg="bg-indigo-100" />
            <JobCard title="Junior Data Analyst" company="Danone Algérie" location="Akbou, Béjaia" duration="CDI" type="Emploi" badgeColor="bg-amber-100 text-amber-600" logo={<BarChart3 size={28} className="text-emerald-600" />} logoBg="bg-emerald-100" />
            <JobCard title="Marketing Digital" company="Cévital" location="Alger" duration="6 mois" type="PFE" badgeColor="bg-blue-100 text-blue-600" logo={<TrendingUp size={28} className="text-amber-700" />} logoBg="bg-amber-100" />
            <JobCard title="Développeur d'applications mobiles" company="InnovEra" location="Bordj Bou Arréridj" duration="30 jours" type="Stage" badgeColor="bg-emerald-100 text-emerald-600" logo={<Smartphone size={28} className="text-blue-600" />} logoBg="bg-blue-100" />
          </div>

          <div className="mt-10 text-center">
            <button className="px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 transition shadow-lg shadow-slate-300/50">
              Voir toutes les offres
            </button>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION 1 --- */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 py-16 md:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Prêt à commencer votre parcours ?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-lg">Rejoignez des milliers d'étudiants qui ont trouvé leur opportunité idéale.</p>
            <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg">Commencer</button>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end relative mt-8 md:mt-0">
            <img src="/students1 1.png" alt="Étudiants" className="w-full max-w-md object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION 2 --- */}
      <section className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center justify-between">
          <div className="md:w-1/2 flex justify-center md:justify-start relative mt-8 md:mt-0 pt-10">
            <img src="/company 1.png" alt="Entreprise" className="w-full max-w-lg object-contain drop-shadow-xl" />
          </div>
          <div className="md:w-1/2 py-16 md:pl-12 text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Vous voulez recruter les meilleurs talents ?</h2>
            <p className="text-emerald-50 text-lg mb-8 max-w-lg">Rejoignez des entreprises qui publient des offres captivantes.</p>
            <button className="px-8 py-3 bg-white text-teal-800 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg">Commencer</button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-sm">
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
          &copy; 2025 STAGIA. Tous Droits Réservés.
        </div>
    </footer>
    </div>
  );
};

export default Homepage;
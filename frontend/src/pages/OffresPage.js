import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Added for navigation

const OffresPage = () => {
  // State for filter management
  const [selectedFilters, setSelectedFilters] = useState({
    type: ['Premier Emploi'],
    location: ['Béjaïa'],
    specialty: ['Software Engineering'],
    mode: [],
    duration: []
  });

  const toggleFilter = (category, label) => {
    setSelectedFilters(prev => {
      const currentCategory = prev[category];
      if (currentCategory.includes(label)) {
        return { ...prev, [category]: currentCategory.filter(item => item !== label) };
      } else {
        return { ...prev, [category]: [...currentCategory, label] };
      }
    });
  };

  const resetFilters = () => {
    setSelectedFilters({
      type: [],
      location: [],
      specialty: [],
      mode: [],
      duration: []
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-[#111827]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>

      {/* Header section */}
      <header className="w-full bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-12">
          <div className="text-[24px] font-[800] tracking-tighter text-[#111827]">LOGO</div>
          <nav className="hidden md:flex space-x-8 text-[14px] font-bold">
            {/* Updated to use Link component */}
            <Link to="/dashboard" className="text-gray-400 hover:text-[#111827] transition-colors">Tableau de Bord</Link>
            <Link to="/offres" className="text-[#4fa797] relative after:content-[''] after:absolute after:-bottom-[21px] after:left-0 after:w-full after:h-[3px] after:bg-[#4fa797]">Offres</Link>
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
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#538D85] via-[#8CB7B2] to-[#C2D8D5] py-20 px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-[44px] font-[800] text-white mb-4 tracking-tight">Trouvez l'opportunité idéale.</h1>
        <p className="text-white/90 text-[16px] mb-10 max-w-2xl font-medium">
          Explorez des centaines d'offres de stages, PFE et premiers emplois adaptés à votre profil
        </p>
        
        <div className="w-full max-w-3xl bg-white p-1.5 rounded-[12px] shadow-2xl flex items-center">
          <div className="flex-grow flex items-center px-4 space-x-3">
            <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Intitulé du poste, mots clés, entreprise, location, ..." 
              className="w-full py-3 outline-none text-[14px] font-medium text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <button className="bg-[#00607A] text-white px-8 py-3 rounded-[8px] font-[700] text-[15px] hover:bg-[#004d61] transition-all">
            Rechercher
          </button>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-[1400px] mx-auto w-full px-8 py-10 flex gap-10">
        
        {/* Filters Sidebar */}
        <aside className="w-[280px] shrink-0 hidden lg:block">
          <div className="bg-white rounded-[28px] border border-gray-100 p-7 sticky top-28 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-[800] text-[18px] flex items-center text-[#111827]">
                <svg className="mr-2 text-[#4fa797]" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                Filtres
              </h2>
              <button onClick={resetFilters} className="text-[11px] font-[700] text-[#4fa797] hover:underline">Réinitialiser</button>
            </div>
            
            <FilterGroup title="Type d'offre">
              <FilterItem label="Stage" count="199" active={selectedFilters.type.includes('Stage')} onToggle={() => toggleFilter('type', 'Stage')} />
              <FilterItem label="Projet de Fin d'Études" count="23" active={selectedFilters.type.includes("Projet de Fin d'Études")} onToggle={() => toggleFilter('type', "Projet de Fin d'Études")} />
              <FilterItem label="Premier Emploi" count="102" active={selectedFilters.type.includes('Premier Emploi')} onToggle={() => toggleFilter('type', 'Premier Emploi')} />
              <FilterItem label="Alternance" count="46" active={selectedFilters.type.includes('Alternance')} onToggle={() => toggleFilter('type', 'Alternance')} />
            </FilterGroup>

            <FilterDivider />

            <FilterGroup title="Localisation">
              <div className="relative mb-5">
                <input type="text" placeholder="Rechercher une ville..." className="w-full bg-white border border-gray-100 rounded-[10px] py-2.5 pl-10 pr-4 text-[12px] font-medium outline-none focus:border-[#4fa797] transition-all" />
                <svg className="absolute left-3.5 top-2.5 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <FilterItem label="Alger" count="311" active={selectedFilters.location.includes('Alger')} onToggle={() => toggleFilter('location', 'Alger')} />
              <FilterItem label="Béjaïa" count="159" active={selectedFilters.location.includes('Béjaïa')} onToggle={() => toggleFilter('location', 'Béjaïa')} />
              <FilterItem label="Constantine" count="102" active={selectedFilters.location.includes('Constantine')} onToggle={() => toggleFilter('location', 'Constantine')} />
              <FilterItem label="Sétif" count="72" active={selectedFilters.location.includes('Sétif')} onToggle={() => toggleFilter('location', 'Sétif')} />
              <FilterItem label="Jijel" count="21" active={selectedFilters.location.includes('Jijel')} onToggle={() => toggleFilter('location', 'Jijel')} />
              <FilterItem label="Tizi Ouzou" count="11" active={selectedFilters.location.includes('Tizi Ouzou')} onToggle={() => toggleFilter('location', 'Tizi Ouzou')} />
              <button className="text-[10px] font-[800] text-[#4fa797] mt-3 flex items-center uppercase tracking-widest">
                <svg className="mr-1" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                Afficher plus
              </button>
            </FilterGroup>

            <FilterDivider />

            <FilterGroup title="Spécialité">
              <FilterItem label="Intelligence Artificielle" count="109" active={selectedFilters.specialty.includes('Intelligence Artificielle')} onToggle={() => toggleFilter('specialty', 'Intelligence Artificielle')} />
              <FilterItem label="Marketing" count="23" active={selectedFilters.specialty.includes('Marketing')} onToggle={() => toggleFilter('specialty', 'Marketing')} />
              <FilterItem label="Software Engineering" count="102" active={selectedFilters.specialty.includes('Software Engineering')} onToggle={() => toggleFilter('specialty', 'Software Engineering')} />
              <FilterItem label="Finance" count="46" active={selectedFilters.specialty.includes('Finance')} onToggle={() => toggleFilter('specialty', 'Finance')} />
              <FilterItem label="Génie Civil" count="12" active={selectedFilters.specialty.includes('Génie Civil')} onToggle={() => toggleFilter('specialty', 'Génie Civil')} />
              <FilterItem label="Ressources Humaines" count="19" active={selectedFilters.specialty.includes('Ressources Humaines')} onToggle={() => toggleFilter('specialty', 'Ressources Humaines')} />
              <button className="text-[10px] font-[800] text-[#4fa797] mt-3 flex items-center uppercase tracking-widest">
                <svg className="mr-1" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                Afficher plus
              </button>
            </FilterGroup>

            <FilterDivider />

            <FilterGroup title="Mode de travail">
              <FilterItem label="Présentiel" active={selectedFilters.mode.includes('Présentiel')} onToggle={() => toggleFilter('mode', 'Présentiel')} />
              <FilterItem label="Télétravail" active={selectedFilters.mode.includes('Télétravail')} onToggle={() => toggleFilter('mode', 'Télétravail')} />
              <FilterItem label="Hybride" active={selectedFilters.mode.includes('Hybride')} onToggle={() => toggleFilter('mode', 'Hybride')} />
            </FilterGroup>

            <FilterDivider />

            <FilterGroup title="Durée">
              <FilterItem label="Moins de 3 mois" active={selectedFilters.duration.includes('Moins de 3 mois')} onToggle={() => toggleFilter('duration', 'Moins de 3 mois')} />
              <FilterItem label="3 à 6 mois" active={selectedFilters.duration.includes('3 à 6 ماه')} onToggle={() => toggleFilter('duration', '3 à 6 ماه')} />
              <FilterItem label="Plus de 6 mois" active={selectedFilters.duration.includes('Plus de 6 months')} onToggle={() => toggleFilter('duration', 'Plus de 6 months')} />
              <FilterItem label="CDI" active={selectedFilters.duration.includes('CDI')} onToggle={() => toggleFilter('duration', 'CDI')} />
              <FilterItem label="CDD" active={selectedFilters.duration.includes('CDD')} onToggle={() => toggleFilter('duration', 'CDD')} />
            </FilterGroup>
          </div>
        </aside>

        {/* Offers Results Grid */}
        <section className="flex-grow">
          <div className="flex justify-between items-center mb-8 px-2">
            <p className="text-gray-400 text-[14px] font-bold">842 opportunités trouvées</p>
            <div className="flex items-center space-x-2">
              <span className="text-[13px] text-gray-400 font-bold">Trier par:</span>
              <select className="bg-transparent font-[800] text-[13px] outline-none border-none cursor-pointer text-[#111827]">
                <option>Les plus récents</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <OfferCard key={i} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-20 flex justify-center items-center space-x-3 pb-24">
            <button className="text-gray-400 font-[800] text-[14px] px-4 flex items-center">
              <svg className="mr-2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              Précédent
            </button>
            <div className="flex space-x-2">
              <button className="w-10 h-10 rounded-[12px] bg-[#3E7E75] text-white font-[800]">1</button>
              <button className="w-10 h-10 rounded-[12px] bg-white border border-gray-100 font-[800] text-gray-400 hover:bg-gray-50">2</button>
              <button className="w-10 h-10 rounded-[12px] bg-white border border-gray-100 font-[800] text-gray-400">3</button>
              <span className="text-gray-300 self-center font-bold px-2">...</span>
              <button className="w-10 h-10 rounded-[12px] bg-white border border-gray-100 font-[800] text-gray-400">67</button>
              <button className="w-10 h-10 rounded-[12px] bg-white border border-gray-100 font-[800] text-gray-400">68</button>
            </div>
            <button className="text-[#111827] font-[800] text-[14px] px-4 flex items-center">
              Suivant
              <svg className="ml-2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

/* --- Helper Components --- */

const FilterDivider = () => (
  <hr className="border-gray-100 my-8" />
);

const FilterGroup = ({ title, children }) => (
  <div>
    <h3 className="text-[14px] font-[800] text-[#111827] mb-5 tracking-tight">{title}</h3>
    <div className="space-y-3.5">{children}</div>
  </div>
);

const FilterItem = ({ label, count, active, onToggle }) => (
  <div className="flex items-center justify-between cursor-pointer group" onClick={onToggle}>
    <div className="flex items-center space-x-3">
      <div className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-all ${active ? 'bg-[#1D5D51] border-[#1D5D51]' : 'border-gray-300 group-hover:border-[#4fa797]'}`}>
        {active && <div className="w-[8px] h-[2px] bg-white rounded-full"></div>}
      </div>
      <span className={`text-[13px] font-[600] ${active ? 'text-[#111827]' : 'text-gray-500'}`}>{label}</span>
    </div>
    {count && <span className="text-[10px] font-[700] text-gray-400">({count})</span>}
  </div>
);

const OfferCard = () => (
  <div className="bg-white rounded-[24px] border border-gray-100 p-8 relative hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] transition-all">
    <div className="flex justify-between items-center mb-6">
      <span className="px-3 py-1 rounded-full text-[10px] font-[700] bg-[#FEF9C3] text-[#A16207]">
        Type de l'offre
      </span>
      <span className="text-[11px] text-gray-300 font-medium italic">Il y a 3 jours</span>
    </div>

    <div className="flex items-start space-x-4 mb-6">
      <div className="w-[64px] h-[64px] rounded-[15px] bg-[#535353] shrink-0"></div>
      <div>
        <h4 className="text-[18px] font-[800] text-[#111827] leading-tight">Titre du stage/emploi</h4>
        <p className="text-[13px] text-gray-400 font-bold mt-1">Nom du l'entreprise</p>
      </div>
    </div>

    <p className="text-gray-400 text-[13px] font-medium leading-relaxed mb-8">
      Courte description de l'offre.
    </p>

    <div className="space-y-3 mb-8">
      <Tag icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} text="Location" />
      <Tag icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} text="Durée" />
      <Tag icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>} text="Mode de travail" />
    </div>

    <div className="flex justify-end">
      <button className="w-[120px] bg-[#5EAD9D] text-white py-2.5 rounded-[10px] font-[700] text-[12px] uppercase tracking-wide hover:bg-[#4d9183] transition-colors shadow-sm">
        VOIR PLUS
      </button>
    </div>
  </div>
);

const Tag = ({ icon, text }) => (
  <div className="flex items-center text-[#5EAD9D] text-[12px] font-[500] space-x-2">
    <span className="shrink-0">{icon}</span>
    <span className="text-gray-400 font-semibold">{text}</span>
  </div>
);

export default OffresPage;
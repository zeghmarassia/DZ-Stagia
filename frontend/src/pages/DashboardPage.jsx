import React from 'react';
import { Link } from 'react-router-dom'; // Added for navigation

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-[#111827]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>

      {/* Header */}
      <header className="w-full bg-white border-b-2 border-gray-200 px-8 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-12">
          <div className="text-[20px] font-[800] tracking-tighter text-[#111827]">LOGO</div>
          <nav className="hidden md:flex space-x-8">
            {/* Navigation links updated to use Link component */}
            <Link to="/dashboard" className="text-[#4fa797] font-bold text-[14px] border-b-2 border-[#4fa797] pb-1">Tableau de Bord</Link>
            <Link to="/offres" className="text-gray-500 font-bold text-[14px] hover:text-[#111827]">Offres</Link>
            <Link to="/applications" className="text-gray-500 font-bold text-[14px] hover:text-[#111827]">Mes Candidatures</Link>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 border-r-2 pr-6 border-gray-100">
            <button className="text-gray-500 hover:text-[#4fa797]">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <button className="text-gray-500 hover:text-[#4fa797] relative">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-[13px] font-bold text-[#111827] leading-none">Aicha Belaid</p>
              <p className="text-[11px] text-gray-500 font-bold mt-1">Étudiant</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-[#E5E7EB] overflow-hidden">
              <img src="/profile.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-8 py-10">
        <section className="mb-8">
          <h1 className="text-[30px] font-[800] text-[#111827] tracking-tight">Bonjour, Aicha !</h1>
          <p className="text-gray-500 text-[15px] mt-1 font-bold">Trouvez des offres qui vous correspondent et gérez vos candidatures.</p>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Candidatures actives" count="8" color="text-[#417482] bg-[#E8F1F3]" icon={<path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>} />
          <StatCard title="Entretien prévu" count="3" color="text-[#6db096] bg-[#ECFDF5]" icon={<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>} btnText="EN SAVOIR PLUS" />
          <StatCard title="Offres enregistrées" count="12" color="text-[#8FA7C7] bg-[#F0F4F8]" icon={<path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>} btnText="VOIR ENREGISTREMENTS" />
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden mb-12">
          <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center">
            <h2 className="text-[17px] font-[800] text-[#111827]">Candidatures récentes</h2>
            <div className="relative">
               <input type="text" placeholder="Rechercher..." className="bg-[#F9FAFB] border-2 border-gray-100 rounded-lg py-1.5 px-4 text-[13px] w-48 focus:ring-2 focus:ring-[#4fa797] focus:border-[#4fa797] font-semibold" />
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#F9FAFB]">
              <tr className="text-gray-500 text-[11px] font-[800] uppercase tracking-wider">
                <th className="px-6 py-4">Entreprise</th>
                <th className="px-6 py-4">Poste</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-50">
              <TableRow logo="/SONATRAC.png" company="SONATRACH" position="Ingénieur DevOps Junior" date="Publiée le 25 décembre 2025" type="Premier Emploi" typeColor="text-orange-600 bg-orange-50 border border-orange-100" status="Entretien prévu" statusColor="text-green-600 bg-green-50 border border-green-100" />
              <TableRow logo="/Cévital.png" company="Cévital" position="Assistant Ressources Humaines" date="Publiée le 5 نوفمبر 2025" type="Projet de Fin d'Études" typeColor="text-blue-600 bg-blue-50 border border-blue-100" status="Reçue" statusColor="text-gray-500 bg-gray-50 border border-gray-200" />
              <TableRow logo="/Djezzy.png" company="Djezzy" position="Développeur Full Stack React/Node" date="Publiée le 10 أكتوبر 2025" type="Stage" typeColor="text-[#4fa797] bg-emerald-50 border border-emerald-100" status="En cours d'étude" statusColor="text-blue-600 bg-blue-50 border border-blue-100" />
              <TableRow logo="/Yassir.png" company="Yassir" position="Designer UI/UX" date="Publiée le 4 أفريل 2025" type="Stage" typeColor="text-[#4fa797] bg-emerald-50 border border-emerald-100" status="Acceptée" statusColor="text-green-600 bg-green-50 border border-green-100" />
            </tbody>
          </table>
          <div className="p-4 text-center">
            <button className="text-[12px] font-[800] text-gray-500 border-2 border-gray-200 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all uppercase">Afficher Plus</button>
          </div>
        </div>

        {/* Saved Jobs Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-[800] text-[#111827]">Offres enregistrées</h2>
          {/* Updated link to use Link component for Offers */}
          <Link to="/offres" className="text-[#4fa797] text-[13px] font-[800] uppercase tracking-widest border-b-2 border-transparent hover:border-[#4fa797]">TOUT LES ENREGISTREMENTS &gt;</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <JobCard 
            company="Cévital" 
            logo="/logo.png" 
            title="Analyste Financier Junior" 
            type="Premier Emploi" 
            typeColor="text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A]" 
            loc="Alger" 
            contract="CDI" 
            mode="Présentiel" 
          />
          <JobCard 
            company="Mobilis" 
            logo="/mobilis.png" 
            title="Développeur Mobile (Flutter)" 
            type="Stage" 
            typeColor="text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0]" 
            loc="Algérie" 
            contract="3 mois" 
            mode="Télétravail" 
          />
        </div>
      </main>
    </div>
  );
};

/* --- Sub-Components --- */

const StatCard = ({ title, count, icon, color, btnText = "VOIR MES CANDIDATURES" }) => (
  <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm flex flex-col items-start hover:border-[#4fa797] transition-colors group">
    <div className={`p-3 rounded-xl ${color} mb-4 shadow-sm`}>
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
    </div>
    <p className="text-gray-500 text-[13px] font-bold mb-1 uppercase tracking-wider">{title}</p>
    <h3 className="text-[32px] font-[800] text-[#111827] leading-none">{count}</h3>
    <button className="mt-6 text-[11px] font-[800] text-[#4fa797] bg-[#E8F1F3] px-4 py-2 rounded-lg uppercase tracking-widest group-hover:bg-[#4fa797] group-hover:text-white transition-all">
      {btnText}
    </button>
  </div>
);

const TableRow = ({ logo, company, position, date, type, typeColor, status, statusColor }) => (
  <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
    <td className="px-6 py-5 flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden flex-shrink-0">
        <img src={logo} alt={company} className="w-full h-full object-cover" />
      </div>
      <span className="font-[800] text-[14px] text-gray-800">{company}</span>
    </td>
    <td className="px-6 py-5">
      <p className="font-[800] text-[14px] text-gray-900 leading-tight">{position}</p>
      <p className="text-[11px] text-gray-500 font-bold mt-1">{date}</p>
    </td>
    <td className="px-6 py-5">
      <span className={`${typeColor} px-3 py-1 rounded-full font-[800] text-[10px]`}>{type}</span>
    </td>
    <td className="px-6 py-5">
      <span className={`${statusColor} px-3 py-1 rounded-full font-[800] text-[10px] flex items-center w-fit`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>{status}
      </span>
    </td>
    <td className="px-6 py-5 text-right"><button className="text-gray-400 font-bold text-lg hover:text-gray-900">•••</button></td>
  </tr>
);

const JobCard = ({ company, logo, title, type, typeColor, loc, contract, mode }) => (
  <div className="bg-white p-7 rounded-[24px] border-2 border-gray-200 shadow-md relative group hover:border-[#4fa797] transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center space-x-3">
        <span className={`${typeColor} px-3 py-1 rounded-full font-[800] text-[10px]`}>{type}</span>
        <span className="text-gray-500 text-[11px] font-bold italic">Il y a 3 jours</span>
      </div>
      <button className="text-[#417482] hover:scale-110 transition-transform">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
      </button>
    </div>

    <div className="flex items-center space-x-4 mb-5">
      <div className="w-16 h-16 border border-gray-100 rounded-2xl flex items-center justify-center bg-white shadow-sm flex-shrink-0 overflow-hidden">
        <img 
          src={logo} 
          alt={company} 
          className="w-full h-full object-contain p-2" 
        />
      </div>
      <div>
        <h4 className="font-[800] text-[18px] leading-tight text-gray-900">{title}</h4>
        <p className="text-gray-500 font-bold text-[14px] mt-0.5">{company}</p>
      </div>
    </div>

    <p className="text-gray-600 text-[13px] mb-8 font-semibold leading-relaxed">
      Courte description de l'offre. Trouvez votre opportunité idéale.
    </p>

    <div className="flex justify-between items-end">
      <div className="space-y-3 text-[#4fa797] font-[800] text-[12px]">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
          {loc}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 14.71L11 12.41V7h2v4.59l3.71 3.71-1.42 1.41z"/></svg>
          {contract}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>
          {mode}
        </div>
      </div>
      
      <button className="px-10 py-3.5 bg-[#5BA49F] text-white rounded-xl font-[800] text-[13px] uppercase tracking-widest hover:bg-[#4a8a86] transition-all shadow-lg shadow-[#5BA49F]/20 active:scale-95">
        POSTULER
      </button>
    </div>
  </div>
);

export default DashboardPage;
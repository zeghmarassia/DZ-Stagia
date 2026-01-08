import React from 'react';
import { Link } from 'react-router-dom';

const CreateProfilePage = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-[#111827]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>

      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-12">
          <div className="text-[22px] font-[800] tracking-tighter text-[#111827]">LOGO</div>
          <nav className="hidden md:flex space-x-8 text-[14px] font-bold">
            <Link to="/dashboard" className="text-gray-400 hover:text-[#111827] transition-colors">Tableau de Bord</Link>
            <Link to="/offres" className="text-gray-400 hover:text-[#111827] transition-colors">Offres</Link>
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
            {/* Updated to match specific profile placeholder in the screenshot */}
            <div className="w-10 h-10 rounded-full border border-gray-200 bg-[#E5E7EB] flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition-colors ml-2">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto w-full px-8 py-10">
        <header className="mb-10">
          <h1 className="text-[28px] font-[800] text-[#111827] mb-2">Créer votre profil étudiant</h1>
          <p className="text-gray-400 text-[15px] font-medium">Complétez votre profil pour construire votre CV automatiquement.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-start">
          
          {/* Left Column */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm flex flex-col items-center">
              <div className="w-32 h-32 bg-[#2D3748] rounded-full flex items-center justify-center overflow-hidden mb-6 relative border-4 border-gray-50 shadow-inner">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button className="flex items-center text-[#4fa797] text-[13px] font-[800] hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors">
                <svg className="mr-2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                Modifier la photo de profil
              </button>
            </div>
            <div className="bg-white rounded-[24px] border border-gray-100 p-10 h-40 shadow-sm opacity-50"></div>
          </aside>

          {/* Right Column */}
          <div className="space-y-8">
            <FormSection title="Informations Personnelles" icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Prénom" placeholder="Votre prénom" />
                <InputField label="Nom" placeholder="Votre nom" />
              </div>
              <InputField label="Titre professionnel" placeholder="Ex: Étudiant en Informatique, Développeur Web Junior..." />
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Wilaya" options={['Alger', 'Oran', 'Constantine', 'Béjaïa']} />
                <InputField label="Numéro de téléphone" placeholder="05 50 XX XX XX" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[13px] font-[800] text-[#111827]">À propos de vous</label>
                <textarea 
                  placeholder="Décrivez brièvement votre parcours, vos ambitions et ce que vous recherchez..."
                  className="w-full bg-white border border-gray-100 rounded-[12px] p-4 text-[14px] font-medium outline-none focus:border-[#4fa797] min-h-[120px] transition-all"
                />
              </div>
            </FormSection>

            <FormSection title="Formation" icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>} showAdd>
              <InputField label="Université / École" placeholder="Ex: USTHB" />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Diplôme" placeholder="Ex: Master 2" />
                <InputField label="Domaine d'étude" placeholder="Ex: Informatique" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Date de début" placeholder="JJ/MM/AAAA" />
                <InputField label="Date de fin (ou prévu)" placeholder="JJ/MM/AAAA" />
              </div>
            </FormSection>

            <FormSection title="Expériences & Projets" icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>} showAdd>
              <div className="border-2 border-dashed border-gray-100 rounded-[16px] p-8 flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:bg-gray-50 transition-all">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                </div>
                <p className="text-[13px] font-bold">Ajoutez vos stages, freelances ou projets académiques importants</p>
              </div>
            </FormSection>

            <FormSection title="Compétences" icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>}>
              <div className="space-y-4">
                <label className="text-[13px] font-[800] text-[#111827]">Compétences techniques</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <SkillTag label="React" />
                  <SkillTag label="Tailwind CSS" />
                  <SkillTag label="Python" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ajouter une compétence (ex: Java, SQL...) et appuyez sur Entrée"
                  className="w-full bg-white border border-gray-100 rounded-[12px] px-4 py-3 text-[13px] font-medium outline-none focus:border-[#4fa797] transition-all"
                />
              </div>
              <div className="space-y-3 mt-6">
                {/* Updated: Icons to match the specific designs in the screenshot */}
                <SocialInput 
                  text="in" // Specific "in" text icon for LinkedIn
                  placeholder="Lien profil LinkedIn" 
                />
                <SocialInput 
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>} 
                  placeholder="Lien profil GitHub" 
                />
                <SocialInput 
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>} 
                  placeholder="Lien Portfolio Personnel" 
                />
              </div>
            </FormSection>

            <div className="flex justify-end space-x-4 pt-6 pb-20">
              <button className="flex items-center bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-[12px] font-[800] text-[14px] hover:bg-gray-50 transition-colors">
                <svg className="mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Télécharger CV
              </button>
              <button className="bg-[#4fa797] text-white px-10 py-3 rounded-[12px] font-[800] text-[14px] hover:bg-[#3d8b7d] transition-shadow shadow-lg shadow-teal-100">
                Enregistrer mon profil
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Updated SocialInput to support text or icon --- */
const SocialInput = ({ icon, text, placeholder }) => (
  <div className="relative group">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-gray-400 group-focus-within:text-[#4fa797] transition-all flex items-center justify-center">
      {text ? text : icon}
    </span>
    <input 
      type="text" 
      placeholder={placeholder}
      className="w-full bg-white border border-gray-100 rounded-[12px] pl-10 pr-4 py-3 text-[13px] font-medium outline-none focus:border-[#4fa797] transition-all"
    />
  </div>
);

/* Helper UI Components remain unchanged */
const FormSection = ({ title, icon, children, showAdd }) => (
  <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3 text-[#111827]">
        <span className="text-gray-400">{icon}</span>
        <h2 className="text-[16px] font-[800]">{title}</h2>
      </div>
      {showAdd && (
        <button className="text-[#4fa797] text-[12px] font-[800] hover:underline flex items-center">
          + Ajouter
        </button>
      )}
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

const InputField = ({ label, placeholder }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[13px] font-[800] text-[#111827]">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      className="bg-white border border-gray-100 rounded-[12px] px-4 py-3.5 text-[14px] font-medium outline-none focus:border-[#4fa797] transition-all"
    />
  </div>
);

const SelectField = ({ label, options }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[13px] font-[800] text-[#111827]">{label}</label>
    <select className="bg-white border border-gray-100 rounded-[12px] px-4 py-3.5 text-[14px] font-medium outline-none focus:border-[#4fa797] cursor-pointer transition-all">
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);

const SkillTag = ({ label }) => (
  <div className="bg-[#4fa797]/10 text-[#4fa797] px-3 py-1.5 rounded-full text-[12px] font-[700] flex items-center">
    {label}
    <button className="ml-2 hover:text-red-500 transition-colors">×</button>
  </div>
);

export default CreateProfilePage;
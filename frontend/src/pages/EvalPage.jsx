import React from 'react';

/**
 * Composant EvalPage : Affiche le message de confirmation après vérification.
 * Ce code est optimisé pour correspondre exactement au design Figma (Pixel Perfect).
 */
const EvalPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* BARRE DE NAVIGATION (HEADER) */}
      <header className="w-full bg-white py-4 px-12 flex justify-between items-center shadow-sm">
        {/* LOGO : Texte noir gras identique au design */}
        <div className="text-2xl font-black text-black tracking-tighter">
          LOGO
        </div>

        {/* PROFIL UTILISATEUR : Nom, Rôle et Avatar */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">Aicha BELAID</p>
            <p className="text-[11px] italic text-gray-500 mt-1">Étudiant</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          {/* Icône de déconnexion (Logout) */}
          <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL : La carte d'évaluation */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-[0_15px_50px_rgba(0,0,0,0.05)] p-16 flex flex-col items-center border border-gray-50">
          
          {/* ICONE D'ÉVALUATION : Personnage + Horloge stylisée */}
          <div className="relative mb-10">
            <div className="text-black">
              <svg width="85" height="85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            {/* L'icône de l'horloge en bas à droite de l'avatar */}
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border-4 border-white shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>

          {/* TITRE PRINCIPAL : Gras et centré */}
          <h1 className="text-[30px] font-bold text-[#1a1a1a] mb-10 text-center tracking-tight">
            Nous évaluons votre profil
          </h1>

          {/* PARAGRAPHES DE DESCRIPTION : Police grasse (font-bold) comme demandé */}
          <div className="text-center max-w-lg space-y-6">
            <p className="text-[#666666] text-[17px] leading-relaxed font-bold">
              Votre compte est en attente d'être approuvé par notre équipe 
              d'administration dans un délai de 24 heures.
            </p>
            
            <p className="text-[#666666] text-[17px] leading-relaxed font-bold">
              Vous serez informé(e) par e-mail une fois votre compte approuvé, 
              puis vous pourrez accéder à la plateforme.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default EvalPage;
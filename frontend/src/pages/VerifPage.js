import React, { useState, useRef } from 'react';

/**
 * Composant VerifPage : Gère l'affichage de la vérification OTP
 * @param {Function} onVerified - Fonction de rappel pour passer à l'étape suivante
 */
function VerifPage({ onVerified }) {
  // État pour stocker les 6 chiffres du code OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Références pour gérer le focus automatique entre les champs d'entrée
  const inputsRef = useRef([]);

  /**
   * Gère le changement de valeur dans les champs d'entrée
   * @param {Object} element - L'élément input ciblé
   * @param {number} index - L'index du champ (0-5)
   */
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false; // Accepte uniquement les chiffres

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Déplace le focus vers le champ suivant si un chiffre est entré
    if (element.value !== '' && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  /**
   * Gère les touches spéciales comme Backspace pour revenir en arrière
   */
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  /**
   * Valide le code et déclenche la transition vers la page d'évaluation
   */
  const handleContinue = () => {
    const code = otp.join('');
    if (code.length === 6) {
      onVerified(); // Succès : Appelle la fonction de transition
    } else {
      alert("Veuillez entrer le code complet de 6 chiffres.");
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      
      {/* SECTION GAUCHE : Formulaire de vérification */}
      <div className="w-[45%] flex flex-col p-10 relative">
        {/* Logo de l'application */}
        <div className="text-2xl font-black text-black mb-24 tracking-tighter">LOGO</div>
        
        <div className="max-w-md mx-auto w-full flex flex-col items-center">
          {/* Icône Enveloppe stylisée (Figma Match) */}
          <div className="mb-6 text-gray-800">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>

          <h2 className="text-[28px] font-bold text-[#1a1a1a] mb-4">Vérifiez votre boîte</h2>
          
          <p className="text-center text-[#666666] text-base mb-10 leading-relaxed px-4">
            Un email de vérification a été envoyé, entrer le code pour confirmer votre email.
          </p>

          {/* Grille des champs OTP (6 cases) */}
          <div className="flex gap-3 justify-center mb-10">
            {otp.map((data, index) => (
              <input
                key={index}
                ref={el => inputsRef.current[index] = el}
                type="text"
                maxLength="1"
                className="w-[52px] h-[64px] border-[1.5px] border-gray-300 rounded-xl text-center text-2xl font-semibold focus:border-[#6ea0ad] focus:ring-1 focus:ring-[#6ea0ad] outline-none transition-all shadow-sm"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
              />
            ))}
          </div>

          {/* Bouton de confirmation principal */}
          <button 
            onClick={handleContinue}
            className="w-full bg-[#6ea0ad] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#5a8b97] transition-all shadow-md active:scale-[0.98]"
          >
            CONTINUER
          </button>
        </div>
      </div>

      {/* SECTION DROITE : Design visuel et Illustration */}
      <div className="w-[55%] bg-gradient-to-br from-[#4fa797] to-[#255b51] relative flex flex-col items-center justify-center overflow-hidden">
        
        {/* Sélecteur de langue (Haut à droite) */}
        <div className="absolute top-8 right-10 flex items-center space-x-2 text-white">
            <span className="text-sm font-semibold">FR</span>
            <img src="https://flagcdn.com/w20/fr.png" alt="France Flag" className="w-5 shadow-sm" />
        </div>

        {/* Texte promotionnel / descriptif */}
        <div className="z-10 text-center max-w-sm mb-8 px-6">
          <h3 className="text-[22px] font-medium leading-[1.4] text-white/95 text-right">
            Créez votre profil, postulez aux offres en un clic, et suivez vos candidatures en temps réel.
          </h3>
        </div>

        {/* Illustration principale (chargée depuis /public) */}
        <div className="relative w-full max-w-xl px-10">
          <img 
            src="/students1 1.png" 
            alt="Students Illustration" 
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Note : Les éléments décoratifs bas de page peuvent être ajoutés ici */}
      </div>
    </div>
  );
}

export default VerifPage;
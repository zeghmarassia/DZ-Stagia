import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    // Redirect to CheckEmail page
    navigate('/verify-otp', { state: { email: email } });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 relative">
      
      {/* Top Header: Logo & Language */}
      <div className="p-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-slate-900 tracking-wide uppercase hover:text-blue-600 transition">
          LOGO
        </Link>
        <div><LanguageSwitcher /></div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto mt-10 px-6">
        
        {/* Headline */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
            <span className="text-[#5B8C9D]">{t('auth.forgot_title', 'Mot de passe oublié ?')}</span>
          </h1>
          <p className="text-slate-500 font-medium">
            {t('auth.forgot_subtitle', "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.")}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              {t('auth.email', 'Adresse email')}
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D] transition"
                placeholder="e.g. name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#5B8C9D] hover:bg-[#4a7280] text-white font-bold py-3.5 rounded-lg transition shadow-sm uppercase tracking-wide"
          >
            {t('auth.send_link', 'Envoyer le lien')}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center pb-8">
          <Link to="/login" className="font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center transition group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            {t('auth.back_login', 'Retour à la connexion')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
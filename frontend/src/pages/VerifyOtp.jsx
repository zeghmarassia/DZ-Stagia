import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

const VerifyOtp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || "votre email";

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  
  // Timer State
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // 1. TIMER COUNTDOWN EFFECT
  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  // 2. TIMER COMPLETION EFFECT (Safe place to update state)
  useEffect(() => {
    if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer]);

  // Input Handlers
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text');
    if (!/^\d{6}$/.test(data)) return;
    const digits = data.split('');
    setOtp(digits);
    inputRefs.current[5].focus();
  };

  const handleResend = () => {
    if (isResendDisabled) return;
    console.log("Resending to:", email);
    setTimer(30);
    setIsResendDisabled(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    console.log("Verifying:", code);
    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 relative">
      <div className="p-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-slate-900 tracking-wide uppercase hover:text-blue-600 transition">
          LOGO
        </Link>
        <div><LanguageSwitcher /></div>
      </div>

      <div className="max-w-md mx-auto mt-10 px-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
          {t('auth.otp_title', 'Entrez le code de vérification')}
        </h1>

        <p className="text-slate-500 font-medium mb-8">
          {t('auth.otp_subtitle', 'Nous avons envoyé un code à 6 chiffres à')} <br />
          <span className="text-slate-900 font-bold">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 sm:w-14 sm:h-16 border rounded-lg text-center text-2xl font-bold focus:outline-none transition
                  ${digit ? 'border-[#5B8C9D] bg-blue-50 text-[#5B8C9D]' : 'border-gray-300 focus:border-[#5B8C9D]'}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.some(d => !d)} 
            className={`w-full font-bold py-3.5 rounded-lg transition shadow-sm uppercase tracking-wide mb-6
              ${otp.some(d => !d) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5B8C9D] hover:bg-[#4a7280] text-white'}`}
          >
            {t('auth.verify_btn', 'Vérifier le code')}
          </button>
        </form>

        <div className="text-sm text-slate-500 mb-8">
          {t('auth.resend_text', "Vous n'avez pas reçu le code ?")} <br />
          {isResendDisabled ? (
            <span className="text-slate-400 font-medium">{t('auth.resend_wait', { seconds: timer })}</span>
          ) : (
            <button onClick={handleResend} className="font-bold text-[#5B8C9D] hover:underline mt-1">
               {t('auth.resend_link', 'Renvoyer')}
            </button>
          )}
        </div>

        <div className="w-full border-t border-gray-100 mb-8"></div>

        <Link to="/forgot-password" className="font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center transition group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          {t('auth.back_login', 'Retour')}
        </Link>
      </div>
    </div>
  );
};

export default VerifyOtp;
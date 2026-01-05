import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

const VerifyOtp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from previous state (or fallback)
  const email = location.state?.email || "votre email";

  // State for 6-digit OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(30); // 30 seconds cooldown
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  // Handle Input Change
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Only numbers

    const newOtp = [...otp];
    // Allow only last character if multiple typed (though maxlength handles this)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text');
    if (!/^\d{6}$/.test(data)) return; // Only paste if exactly 6 digits
    
    const digits = data.split('');
    setOtp(digits);
    inputRefs.current[5].focus();
  };

  const handleResend = () => {
    if (isResendDisabled) return;
    console.log("Resending code to:", email);
    setTimer(30);
    setIsResendDisabled(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;

    console.log("Verifying Code:", code);
    // If successful, navigate to Reset Password page
    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 relative">
      
      {/* Top Header */}
      <div className="p-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-slate-900 tracking-wide uppercase hover:text-blue-600 transition">
          LOGO
        </Link>
        <div><LanguageSwitcher /></div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto mt-10 px-6 text-center">
        
        {/* Headline */}
        <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
          {t('auth.otp_title', 'Entrez le code de vérification')}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-500 font-medium mb-8">
          {t('auth.otp_subtitle', 'Nous avons envoyé un code à 6 chiffres à')} <br />
          <span className="text-slate-900 font-bold">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          {/* OTP Inputs Grid */}
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
                  ${digit 
                    ? 'border-[#5B8C9D] bg-blue-50 text-[#5B8C9D]' 
                    : 'border-gray-300 focus:border-[#5B8C9D]'
                  }`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={otp.some(d => !d)} // Disable if not full
            className={`w-full font-bold py-3.5 rounded-lg transition shadow-sm uppercase tracking-wide mb-6
              ${otp.some(d => !d) 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#5B8C9D] hover:bg-[#4a7280] text-white'
              }`}
          >
            {t('auth.verify_btn', 'Vérifier le code')}
          </button>
        </form>

        {/* Resend Logic */}
        <div className="text-sm text-slate-500 mb-8">
          {t('auth.resend_text', "Vous n'avez pas reçu le code ?")} <br />
          {isResendDisabled ? (
            <span className="text-slate-400 font-medium">
               {t('auth.resend_wait', { seconds: timer })}
            </span>
          ) : (
            <button onClick={handleResend} className="font-bold text-[#5B8C9D] hover:underline mt-1">
               {t('auth.resend_link', 'Renvoyer')}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-100 mb-8"></div>

        {/* Back Link */}
        <Link to="/forgot-password" className="font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center transition group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          {t('auth.back_login', 'Retour')}
        </Link>

      </div>
    </div>
  );
};

export default VerifyOtp;
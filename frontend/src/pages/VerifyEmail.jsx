import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { verifyEmail } from '../services/authService';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
  const email = location.state?.email;
  const userType = location.state?.userType; // 'student' or 'company'

  // State for OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Configuration based on userType
  const isCompany = userType === 'company';

  // Styles & Text Configuration
  const config = {
    buttonColor: isCompany ? 'bg-[#6EB486] hover:bg-[#5da076]' : 'bg-[#5B8C9D] hover:bg-[#4a7280]',
    imageSideClass: isCompany 
      ? 'bg-gradient-to-br from-[#1E3A5F] to-[#2B5279]' // Dark Blue for Company
      : 'bg-gradient-to-br from-[#4AA59C] to-[#2D7A75]', // Teal for Student
    illustrationText: isCompany
      ? "Publiez vos offres, gérez vos candidatures et trouvez les meilleurs talents."
      : "Créez votre profil, postulez aux offres en un clic, et suivez vos candidatures en temps réel.",
    imagePosition: isCompany ? 'left' : 'right' // Company: Image Left | Student: Image Right
  };

  // Handle Input Change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 6).split('');
    if (data.length === 6) {
      setOtp(data);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate OTP
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!email) {
      setError('Email not found. Please sign up again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Pass object directly, not FormData - verifyEmail will handle FormData conversion
      const response = await verifyEmail({ email, otp_code: otpCode });

      // If successful, navigate to AccountPending
      navigate('/account-pending', { state: { email: email, userType: userType } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sub-components for Layout Sections
  const FormSection = () => (
    <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center px-8 relative">
       {/* Logo Absolute Top Left (Mobile friendly adjustment needed for real app) */}
       <div className="absolute top-8 left-8">
        <span className="text-2xl font-black uppercase tracking-widest" onClick={() => navigate('/')}>DZ-Stagia</span>
      </div>

      {/* Language Flag Absolute Top Right */}
      <div className="absolute top-8 right-8">
        <button className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
          <img 
            src="https://flagcdn.com/fr.svg" 
            alt="Français" 
            className="w-full h-full object-cover" 
          />
        </button>
      </div>

      <div className="max-w-md w-full text-center">
        
        {/* Mail Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-black text-white p-3 rounded-xl shadow-lg">
             <Mail size={32} strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Vérifiez votre boîte
        </h2>
        
        <p className="text-slate-500 mb-8 px-4">
          Un email de vérification a été envoyé, entrer le code pour confirmer votre email.
        </p>

        {error && (
          <div className="text-red-500 text-sm font-bold text-left animate-pulse bg-red-50 p-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 h-12 sm:w-12 sm:h-14 border border-gray-300 rounded-lg text-center text-xl font-bold text-slate-700 focus:border-[#5B8C9D] focus:ring-2 focus:ring-[#5B8C9D]/20 outline-none transition"
              />
            ))}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg text-white font-bold tracking-wide transition shadow-lg ${config.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Vérification...' : 'CONTINUER'}
          </button>
        </form>
      </div>
    </div>
  );

  const ImageSection = () => (
    <div className={`hidden lg:flex w-1/2 ${config.imageSideClass} flex-col justify-center items-center text-white p-12 relative overflow-hidden`}>
      {/* Skewed Background Overlay (Simulating the diagonal cut in design) */}
      {/* This is a simple CSS trick to get the diagonal line effect */}
      <div className={`absolute top-0 bottom-0 w-24 bg-white z-10 transform 
        ${isCompany ? 'right-[-50px] skew-x-[-6deg]' : 'left-[-50px] skew-x-[-6deg]'}`} 
      />

      {/* Illustration Placeholders */}
      <div className="relative z-20 mb-8">
        {isCompany ? (
          // Placeholder for Company Illustration
          <div className="w-80 h-64 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
             <span className="text-sm opacity-80">[Company Team Illustration]</span>
          </div>
        ) : (
          // Placeholder for Student Illustration
          <div className="w-80 h-64 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
             <span className="text-sm opacity-80">[Students Group Illustration]</span>
          </div>
        )}
      </div>

      <h3 className="relative z-20 text-center text-xl font-medium max-w-lg leading-relaxed">
        {config.illustrationText}
      </h3>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      {/* Conditional Rendering for Layout Order */}
      {config.imagePosition === 'left' ? (
        <>
          <ImageSection />
          <FormSection />
        </>
      ) : (
        <>
          <FormSection />
          <ImageSection />
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
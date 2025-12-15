import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // 2. INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. SUBMIT HANDLER
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
    
    // logic to send data to backend would go here
    console.log("Login Data Submitted:", formData);
    
    // Example: Redirect to dashboard after successful login
    // navigate('/dashboard'); 
  };

  const handleGoogleLogin = () => {
    console.log("Triggering Google Login...");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header */}
      <div className="p-6">
        <Link to="/" className="text-2xl font-black text-slate-900 tracking-wide uppercase hover:text-blue-600 transition">
          LOGO
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto mt-10 px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            <span className="text-[#5B8C9D]">Connectez-vous</span> avec les<br />
            meilleures opportunités et<br />
            talents.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Adresse email</label>
            <div className="relative">
              <input 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g.name@email.com" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D] transition"
                required
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Mot de passe</label>
            <div className="relative">
              <input 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrer votre mot de passe" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D] transition"
                required
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <div className="text-right mt-2">
              <a href="#" className="text-xs font-semibold text-slate-500 hover:text-[#5B8C9D] underline decoration-slate-300">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-[#5B8C9D] hover:bg-[#4a7280] text-white font-bold py-3.5 rounded-lg transition shadow-sm uppercase tracking-wide"
          >
            Continuer
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login */}
        <button 
            onClick={handleGoogleLogin}
            type="button" // Important so it doesn't submit the form
            className="w-full bg-gray-200 hover:bg-gray-300 text-slate-900 font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-3"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
        </button>

        <div className="text-center mt-8 pb-8">
            <span className="text-slate-600 font-medium">Pas de compte? </span>
            {/* Points to the student signup by default */}
            <Link to="/student/signup" className="font-bold text-slate-900 underline hover:text-[#5B8C9D]">
                Inscrivez-vous
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
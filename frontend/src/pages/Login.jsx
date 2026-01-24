import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';
import { login } from '../services/authService';
import { setCredentials } from '../store'; // Import Redux action
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(t('auth.error_required_fields', 'Veuillez remplir tous les champs'));
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email: formData.email, password: formData.password });

      console.log('Login response:', response.data);

      // Store token and user type in localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userType', response.data.user_type);

      // Update Redux state
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.access_token,
        userType: response.data.user_type
      }));

      // Navigate based on user type
      if (response.data.user_type === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (response.data.user_type === 'company') {
        navigate('/company/dashboard', { replace: true });
      } else if (response.data.user_type === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = t('auth.error_login', 'Identifiants incorrects');
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      // More user-friendly messages
      if (errorMessage.includes('verify your email')) {
        errorMessage = 'Veuillez vérifier votre email d\'abord';
      } else if (errorMessage.includes('wait for admin approval')) {
        errorMessage = 'Votre compte est en attente d\'approbation de l\'administrateur';
      } else if (errorMessage.includes('pending')) {
        errorMessage = 'Votre compte est en attente d\'approbation';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 relative">
      
      {/* Top Navigation */}
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
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            <span className="text-[#5B8C9D]">{t('auth.login_headline_start', 'Connectez-vous')}</span> 
            <br />
            {t('auth.login_headline_end', 'avec les meilleures opportunités et talents.')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
            <div className="text-red-500 text-sm font-bold text-left animate-pulse bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.email', 'Adresse email')}</label>
            <div className="relative">
              <input 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g.name@email.com" 
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition ${error ? 'border-red-500 text-red-900 placeholder:text-red-300' : 'border-gray-300 focus:border-[#5B8C9D]'}`}
              />
              <Mail className={`w-5 h-5 absolute left-3 top-3.5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.password', 'Mot de passe')}</label>
            <div className="relative">
              <input 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.password_placeholder', 'Entrez votre mot de passe')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition ${error ? 'border-red-500 text-red-900 placeholder:text-red-300' : 'border-gray-300 focus:border-[#5B8C9D]'}`}
              />
              <Lock className={`w-5 h-5 absolute left-3 top-3.5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <div className="text-right mt-2">
              <Link 
                to="/forgot-password" 
                className="text-xs font-semibold text-slate-500 hover:text-[#5B8C9D] underline decoration-slate-300"
              >
                {t('auth.forgot_password', 'Mot de passe oublié?')}
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#5B8C9D] hover:bg-[#4a7280] text-white font-bold py-3.5 rounded-lg transition shadow-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'CONNEXION...' : t('auth.continue_btn', 'CONTINUER')}
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center mt-8 pb-8">
            <span className="text-slate-600 font-medium">{t('auth.no_account', 'Pas de compte ?')} </span>
            <Link to="/student/signup" className="font-bold text-slate-900 underline hover:text-[#5B8C9D]">
                {t('auth.register_link', 'Inscrivez-vous')}
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
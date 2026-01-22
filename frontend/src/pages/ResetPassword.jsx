import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    // Simulate API Call
    console.log("Password reset successfully");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-800">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
         <Link to="/" className="text-3xl font-black text-slate-900 tracking-wide uppercase hover:text-blue-600 transition">
            LOGO
         </Link>
         <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
           {t('auth.reset_title')}
         </h2>
         <p className="mt-2 text-sm text-slate-600">
           {t('auth.reset_subtitle')}
         </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-slate-900">
                {t('auth.new_password')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="focus:ring-[#5B8C9D] focus:border-[#5B8C9D] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-3"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-slate-900">
                {t('auth.confirm_password')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="focus:ring-[#5B8C9D] focus:border-[#5B8C9D] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#5B8C9D] hover:bg-[#4a7280] transition"
            >
              {t('auth.reset_btn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Import Hook
import { Mail, Lock, Upload, User, Building, Briefcase, GraduationCap, X } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/api';
import LanguageSwitcher from '../components/LanguageSwitcher'; // 2. Import Switcher

const SignupPage = ({ type }) => {
  const { t } = useTranslation(); // 3. Initialize Translation
  const isStudent = type === 'student';

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      
      {/* MAIN CONTAINER */}
      <div className={`w-full min-h-screen flex flex-col md:flex-row transition-all duration-500 ease-in-out ${isStudent ? '' : 'md:flex-row-reverse'}`}>
        
        {/* --- FORM SECTION --- */}
        <div className="w-full md:w-1/2 flex flex-col h-screen overflow-y-auto">
          <div className="p-8 md:p-12 w-full max-w-2xl mx-auto relative">
            
            {/* Header: Logo & Switcher */}
            <div className="flex justify-between items-center mb-8">
                <Link to="/" className="text-2xl font-black text-slate-900 tracking-wide uppercase hover:text-blue-600 transition">
                  LOGO
                </Link>
                
                {/* Replaced Static Flag with LanguageSwitcher */}
                <div>
                   <LanguageSwitcher />
                </div>
            </div>

            {/* TOGGLE TABS */}
            <div className="flex border-b border-gray-200 mb-8">
              <Link 
                to="/student/signup"
                className={`flex-1 pb-3 text-center font-bold text-sm transition-all duration-300 relative
                  ${isStudent ? 'text-[#5B8C9D]' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                {t('auth.student', 'Étudiant')}
                {isStudent && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5B8C9D]" />}
              </Link>
              
              <Link 
                to="/company/signup"
                className={`flex-1 pb-3 text-center font-bold text-sm transition-all duration-300 relative
                  ${!isStudent ? 'text-[#6EB486]' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                {t('auth.company', 'Entreprise')}
                {!isStudent && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6EB486]" />}
              </Link>
            </div>

            {/* CONTENT AREA */}
            <div key={type} className="animate-fadeInSlideUp">
              {isStudent ? <StudentForm /> : <CompanyForm />}
            </div>

          </div>
        </div>

        {/* --- IMAGE / BANNER SECTION --- */}
        <div 
          className={`hidden md:flex w-1/2 items-center justify-center p-12 text-white text-center flex-col transition-colors duration-700
            ${isStudent 
              ? 'bg-gradient-to-br from-[#5B8C9D] to-teal-600' 
              : 'bg-gradient-to-br from-[#1F4E64] to-[#2B6A85]'
            }`}
        >
           {/* Animated Content Wrapper */}
           <div key={type} className="animate-fadeInScale">
             <h2 className="text-3xl font-bold mb-8 leading-tight max-w-md mx-auto">
               {isStudent 
                  ? t('hero.student_desc', "Créez votre profil, postulez aux offres en un clic, et suivez vos candidatures en temps réel.")
                  : t('hero.company_desc', "Publiez vos offres, gérez vos candidatures et trouvez les meilleurs talents.")
               }
             </h2>
             
             <div className="w-full max-w-md mx-auto">
               <img 
                  src={isStudent ? "/students1 1.png" : "/company 1.png"} 
                  alt="Illustration" 
                  className="w-full object-contain drop-shadow-2xl" 
               />
             </div>
           </div>
        </div>

      </div>

      {/* Internal CSS for Animations */}
      <style>{`
        @keyframes fadeInSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInSlideUp {
          animation: fadeInSlideUp 0.5s ease-out forwards;
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

/* --- STUDENT FORM SUB-COMPONENT --- */
const StudentForm = () => {
  const { t } = useTranslation(); // Initialize Hook
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    university: '', firstName: '', lastName: '', email: '', password: '', file: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
      setError('');
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.university || !formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.file) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const formDataBody = new FormData();
      formDataBody.append('email', formData.email);
      formDataBody.append('password', formData.password);
      formDataBody.append('first_name', formData.firstName);
      formDataBody.append('last_name', formData.lastName);
      formDataBody.append('establishment_id', formData.university);
      formDataBody.append('document', formData.file);

      const response = await axios.post(`${API_URL}/auth/student/register`, formDataBody, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to Email verification page
      navigate('/verify-email', { state: { email: formData.email, userType: 'student' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm font-bold text-left animate-pulse bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* University Select */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.university_label', 'Université / Établissement')}</label>
        <div className="relative">
          <select 
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D] appearance-none bg-white text-gray-600"
          >
            <option value="">{t('auth.university_placeholder', 'Choisissez votre établissement')}</option>
            <option value="1">USTHB</option>
            <option value="2">ESI</option>
            <option value="3">MDI</option>
          </select>
          <GraduationCap className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Name Row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.firstname', 'Prénom')}</label>
          <div className="relative">
            <input name="firstName" type="text" placeholder="John" value={formData.firstName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D]" />
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.lastname', 'Nom')}</label>
          <div className="relative">
            <input name="lastName" type="text" placeholder="Doe" value={formData.lastName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D]" />
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.email', 'Adresse email')}</label>
        <div className="relative">
          <input name="email" type="email" placeholder="e.g.name@email.com" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D]" />
          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.password', 'Mot de passe')}</label>
        <div className="relative">
          <input name="password" type="password" placeholder={t('auth.password_placeholder', 'Créez un mot de passe')} value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D]" />
          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.upload_label', 'Vérifiez votre identité')}</label>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.png" />
        <div onClick={handleFileClick} className={`border rounded-lg p-4 flex items-center cursor-pointer transition border-dashed ${formData.file ? 'bg-blue-50 border-[#5B8C9D]' : 'border-gray-300 hover:bg-gray-50'}`}>
          {formData.file ? (
             <>
               <div className="bg-[#5B8C9D] text-white p-2 rounded mr-3"><Upload className="w-5 h-5" /></div>
               <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-bold text-slate-900 truncate">{formData.file.name}</div>
               </div>
               <button onClick={handleRemoveFile} className="p-1 hover:bg-red-100 rounded-full text-red-500"><X className="w-5 h-5" /></button>
             </>
          ) : (
             <>
               <Upload className="w-6 h-6 text-gray-400 mr-3" />
               <div>
                   <div className="text-sm font-bold text-slate-600">{t('auth.upload_text', 'Déposer un document')}</div>
                   <div className="text-xs text-slate-400">{t('auth.upload_subtext_student', "Carte d'étudiant, certificat de scolarité, etc.")}</div>
               </div>
             </>
          )}
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-[#5B8C9D] text-white font-bold py-3.5 rounded-lg hover:bg-[#4a7280] transition mt-6 shadow-md uppercase disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? t('auth.loading', 'Inscription en cours...') : t('auth.continue_btn', 'CONTINUER')}
      </button>
    </form>
  );
};

/* --- COMPANY FORM SUB-COMPONENT --- */
const CompanyForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '', sector: '', email: '', password: '', address: '', file: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
      setError('');
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.companyName || !formData.sector || !formData.email || !formData.password || !formData.address || !formData.file) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const formDataBody = new FormData();
      formDataBody.append('email', formData.email);
      formDataBody.append('password', formData.password);
      formDataBody.append('company_name', formData.companyName);
      formDataBody.append('sector', formData.sector);
      formDataBody.append('address', formData.address);
      formDataBody.append('document', formData.file);

      const response = await axios.post(`${API_URL}/auth/company/register`, formDataBody, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to Email verification page
      navigate('/verify-email', { state: { email: formData.email, userType: 'company' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm font-bold text-left animate-pulse bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {/* Company Name */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.company_name', "Nom de l'entreprise")}</label>
        <div className="relative">
          <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder={t('auth.company_name', "Nom de l'entreprise")} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6EB486]" />
          <Building className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Sector */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.sector', "Secteur d'activité")}</label>
        <div className="relative">
          <select name="sector" value={formData.sector} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6EB486] appearance-none bg-white text-gray-600">
            <option value="">{t('auth.sector_placeholder', "Choisissez votre secteur d'activité")}</option>
            <option value="IT">Technologie / IT</option>
            <option value="Finance">Finance</option>
          </select>
          <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.address', 'Adresse')}</label>
        <div className="relative">
          <input name="address" value={formData.address} onChange={handleChange} type="text" placeholder="123 Rue de la Paix" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6EB486]" />
          <Building className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.email', 'Adresse email')}</label>
        <div className="relative">
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="e.g.name@email.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6EB486]" />
          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.password', 'Mot de passe')}</label>
        <div className="relative">
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder={t('auth.password_placeholder', 'Créez un mot de passe')} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6EB486]" />
          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">{t('auth.upload_label', 'Vérifiez votre identité')}</label>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.png" />
        <div onClick={handleFileClick} className={`border rounded-lg p-4 flex items-center cursor-pointer transition border-dashed ${formData.file ? 'bg-green-50 border-[#6EB486]' : 'border-gray-300 hover:bg-gray-50'}`}>
          {formData.file ? (
             <>
               <div className="bg-[#6EB486] text-white p-2 rounded mr-3"><Upload className="w-5 h-5" /></div>
               <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-bold text-slate-900 truncate">{formData.file.name}</div>
               </div>
               <button onClick={handleRemoveFile} className="p-1 hover:bg-red-100 rounded-full text-red-500"><X className="w-5 h-5" /></button>
             </>
          ) : (
             <>
               <Upload className="w-6 h-6 text-gray-400 mr-3" />
               <div>
                   <div className="text-sm font-bold text-slate-600">{t('auth.upload_text', 'Déposer un document')}</div>
                   <div className="text-xs text-slate-400">{t('auth.upload_subtext_company', "Document réglementaire, registre de commerce, etc.")}</div>
               </div>
             </>
          )}
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-[#6EB486] text-white font-bold py-3.5 rounded-lg hover:bg-[#5da076] transition mt-6 shadow-md uppercase disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? t('auth.loading', 'Inscription en cours...') : t('auth.continue_btn', 'CONTINUER')}
      </button>
    </form>
  );
};

export default SignupPage;
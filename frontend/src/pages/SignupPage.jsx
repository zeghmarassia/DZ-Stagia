import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Upload, User, Building, Briefcase, GraduationCap, X } from 'lucide-react';

const SignupPage = ({ type }) => {
  const isStudent = type === 'student';

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      <div className={`w-full min-h-screen flex flex-col md:flex-row transition-all duration-500 ease-in-out ${isStudent ? '' : 'md:flex-row-reverse'}`}>
        
        {/* --- FORM SECTION --- */}
        <div className="w-full md:w-1/2 flex flex-col h-screen overflow-y-auto">
          <div className="p-8 md:p-12 w-full max-w-2xl mx-auto">
            <Link to="/" className="text-2xl font-black text-slate-900 tracking-wide uppercase mb-8 block hover:text-blue-600 transition">
              LOGO
            </Link>

            {/* UPDATED LINKS IN TABS */}
            <div className="flex border-b border-gray-200 mb-8">
              <Link 
                to="/student/signup" 
                className={`flex-1 pb-3 text-center font-bold text-sm transition-all duration-300 relative ${isStudent ? 'text-[#5B8C9D]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Étudiant
                {isStudent && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5B8C9D]" />}
              </Link>
              
              <Link 
                to="/company/signup" 
                className={`flex-1 pb-3 text-center font-bold text-sm transition-all duration-300 relative ${!isStudent ? 'text-teal-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Entreprise
                {!isStudent && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-700" />}
              </Link>
            </div>

            <div key={type} className="animate-fadeInSlideUp">
              {isStudent ? <StudentForm /> : <CompanyForm />}
            </div>
          </div>
        </div>

        {/* --- IMAGE SECTION --- */}
        <div className={`hidden md:flex w-1/2 items-center justify-center p-12 text-white text-center flex-col transition-colors duration-700 ${isStudent ? 'bg-gradient-to-br from-[#5B8C9D] to-teal-600' : 'bg-gradient-to-br from-[#1F4E64] to-[#2B6A85]'}`}>
           <div key={type} className="animate-fadeInScale">
             <h2 className="text-3xl font-bold mb-8 leading-tight max-w-md mx-auto">
               {isStudent ? "Créez votre profil, postulez aux offres en un clic." : "Publiez vos offres, trouvez les meilleurs talents."}
             </h2>
             <div className="w-full max-w-md mx-auto">
               <img src={isStudent ? "/students1 1.png" : "/company 1.png"} alt="Illustration" className="w-full object-contain drop-shadow-2xl" />
             </div>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeInSlideUp { animation: fadeInSlideUp 0.5s ease-out forwards; }
        .animate-fadeInScale { animation: fadeInScale 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

/* --- FUNCTIONAL STUDENT FORM --- */
const StudentForm = () => {
  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState({
    university: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    file: null // To store the uploaded file object
  });

  // Reference to the hidden file input
  const fileInputRef = useRef(null);

  // 2. HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileClick = () => {
    fileInputRef.current.click(); // Trigger the hidden input
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation(); // Prevent opening the dialog again
    setFormData(prev => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Student Form:", formData);
    // Add your API call here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* University */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Université / Établissement</label>
        <div className="relative">
          <select 
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D] appearance-none bg-white text-gray-600"
          >
            <option value="">Choisissez votre établissement</option>
            <option value="USTHB">USTHB</option>
            <option value="ESI">ESI</option>
            <option value="MDI">MDI</option>
          </select>
          <GraduationCap className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Name Row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-900 mb-2">Prénom</label>
          <div className="relative">
            <input 
              name="firstName"
              type="text" 
              placeholder="John" 
              value={formData.firstName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D]" 
            />
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-900 mb-2">Nom</label>
          <div className="relative">
            <input 
              name="lastName"
              type="text" 
              placeholder="Doe" 
              value={formData.lastName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D]" 
            />
            <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Adresse email</label>
        <div className="relative">
          <input 
            name="email"
            type="email" 
            placeholder="e.g.name@email.com" 
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D]" 
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
            placeholder="Créez un mot de passe" 
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5B8C9D]" 
          />
          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* --- FILE UPLOAD SECTION --- */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Vérifiez votre identité</label>
        
        {/* Hidden Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.jpg,.png"
        />

        {/* Custom Styled Clickable Area */}
        <div 
          onClick={handleFileClick}
          className={`border rounded-lg p-4 flex items-center cursor-pointer transition border-dashed
            ${formData.file ? 'bg-blue-50 border-[#5B8C9D]' : 'border-gray-300 hover:bg-gray-50'}
          `}
        >
          {formData.file ? (
             // Shown when file IS selected
             <>
               <div className="bg-[#5B8C9D] text-white p-2 rounded mr-3">
                 <Upload className="w-5 h-5" />
               </div>
               <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-bold text-slate-900 truncate">{formData.file.name}</div>
                 <div className="text-xs text-slate-500">{(formData.file.size / 1024).toFixed(0)} KB</div>
               </div>
               <button onClick={handleRemoveFile} className="p-1 hover:bg-red-100 rounded-full text-red-500">
                 <X className="w-5 h-5" />
               </button>
             </>
          ) : (
             // Shown when NO file is selected
             <>
               <Upload className="w-6 h-6 text-gray-400 mr-3" />
               <div>
                   <div className="text-sm font-bold text-slate-600">Déposer un document</div>
                   <div className="text-xs text-slate-400">Carte d'étudiant, certificat, etc.</div>
               </div>
             </>
          )}
        </div>
      </div>

      <button type="submit" className="w-full bg-[#5B8C9D] text-white font-bold py-3.5 rounded-lg hover:bg-[#4a7280] transition mt-6 shadow-md">
        CONTINUER
      </button>

      {/* Footer Links */}
      <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">OU</span>
          <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button type="button" className="w-full bg-gray-100 text-slate-700 font-bold py-3.5 rounded-lg hover:bg-gray-200 transition text-sm">
        Continuer avec votre email universitaire
      </button>
    </form>
  );
};

/* --- FUNCTIONAL COMPANY FORM --- */
const CompanyForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    email: '',
    password: '',
    file: null
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Company Form:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company Name */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Nom de l'entreprise</label>
        <div className="relative">
          <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder="Entrez le nom" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-700" />
          <Building className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Sector */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Secteur d'activité</label>
        <div className="relative">
          <select name="sector" value={formData.sector} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-700 appearance-none bg-white text-gray-600">
            <option value="">Choisissez votre secteur</option>
            <option value="IT">Technologie / IT</option>
            <option value="Finance">Finance</option>
          </select>
          <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Adresse email</label>
        <div className="relative">
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="e.g.name@email.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-700" />
          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Mot de passe</label>
        <div className="relative">
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Mot de passe" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-700" />
          <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* --- FILE UPLOAD SECTION (Company) --- */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Vérifiez votre identité</label>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.png" />
        
        <div onClick={handleFileClick} className={`border rounded-lg p-4 flex items-center cursor-pointer transition border-dashed ${formData.file ? 'bg-teal-50 border-teal-700' : 'border-gray-300 hover:bg-gray-50'}`}>
          {formData.file ? (
             <>
               <div className="bg-teal-700 text-white p-2 rounded mr-3"><Upload className="w-5 h-5" /></div>
               <div className="flex-1 overflow-hidden">
                 <div className="text-sm font-bold text-slate-900 truncate">{formData.file.name}</div>
               </div>
               <button onClick={handleRemoveFile} className="p-1 hover:bg-red-100 rounded-full text-red-500"><X className="w-5 h-5" /></button>
             </>
          ) : (
             <>
               <Upload className="w-6 h-6 text-gray-400 mr-3" />
               <div>
                   <div className="text-sm font-bold text-slate-600">Déposer un document</div>
                   <div className="text-xs text-slate-400">Registre de commerce, NIF, etc.</div>
               </div>
             </>
          )}
        </div>
      </div>

      <button type="submit" className="w-full bg-teal-700 text-white font-bold py-3.5 rounded-lg hover:bg-teal-800 transition mt-6 shadow-md">
        CONTINUER
      </button>

      {/* Footer Links */}
      <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">OU</span>
          <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button type="button" className="w-full bg-gray-100 text-slate-700 font-bold py-3.5 rounded-lg hover:bg-gray-200 transition text-sm">
        Continuer avec votre email professionnel
      </button>
    </form>
  );
};

export default SignupPage;
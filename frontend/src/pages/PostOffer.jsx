import React, { useState } from 'react';
import { 
  ChevronDown, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Clock 
} from 'lucide-react';
import { postOffer } from '../services/offerService';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../components/CompanyNavbar';

// Standard list of Wilayas (You can expand this to all 58)
const WILAYAS = [
  { id: 16, name: "Alger" },
  { id: 31, name: "Oran" },
  { id: 25, name: "Constantine" },
  { id: 19, name: "Sétif" },
  { id: 6, name: "Béjaïa" },
  { id: 13, name: "Tlemcen" },
  { id: 23, name: "Annaba" },
  { id: 30, name: "Ouargla" },
  { id: 9, name: "Blida" },
  { id: 15, name: "Tizi Ouzou" }
];

const PostOffer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Comprehensive Form Data
  const [formData, setFormData] = useState({
    title: '',
    offer_type: '',       // e.g., 'stage', 'cdi'
    employment_type: '',  // e.g., 'temps_plein'
    duration: '',         // Number (months)
    wilaya_id: '',        // Integer ID
    commune: '',          // String detail
    salary_min: '',       // Number
    salary_max: '',       // Number
    expiration_date: '',  // Date string
    description: '',
    work_mode: '',        // 'presentiel', 'teletravail'
    skills: ''            // Comma separated string
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // 1. Clean Data & Convert Types
      // Ensure we send Integers for numeric fields, not strings
      const durationInt = formData.duration ? parseInt(formData.duration) : null;
      const salaryMinInt = formData.salary_min ? parseInt(formData.salary_min) : null;
      const salaryMaxInt = formData.salary_max ? parseInt(formData.salary_max) : null;
      const locationId = formData.wilaya_id ? parseInt(formData.wilaya_id) : null;

      // Clean skills array
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(skill => skill.trim()).filter(s => s)
        : [];

      // 2. Construct Payload
      const payload = {
        title: formData.title,
        offer_type: formData.offer_type,
        employment_type: formData.employment_type,
        duration: durationInt,
        location: locationId, // Sends the ID (e.g., 16), not "Alger"
        description: formData.description + (formData.commune ? `\n\nLieu précis: ${formData.commune}` : ""), // Append detail to description if needed, or send as separate field if backend supports it
        work_mode: formData.work_mode,
        salary_min: salaryMinInt,
        salary_max: salaryMaxInt,
        expiration_date: formData.expiration_date,
        is_active: true,
        skills: skillsArray
      };

      console.log("Sending Payload:", payload);

      // 3. Send Request
      // Commented out API call
      /*
      const response = await postOffer(payload);

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage('Offre publiée avec succès!');
        setTimeout(() => {
          navigate('/company/offers');
        }, 1500);
      } else {
        setError(`Erreur inattendue: Code ${response.status}`);
      }
      */

      // Simulate successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Offre publiée avec succès!');
      setTimeout(() => {
        navigate('/company/offers');
      }, 1500);

    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        // Show detailed error from backend (e.g. "Validation Error")
        const detail = err.response.data.detail;
        setError(typeof detail === 'object' ? JSON.stringify(detail) : detail || "Erreur serveur");
      } else {
        setError("Erreur de connexion au serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* <CompanyNavbar /> */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Publier une nouvelle offre</h1>
          <p className="text-slate-500 text-sm mt-1">
            Remplissez les détails complets de votre offre d'emploi ou de stage.
          </p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
            <span className="mr-2">✓</span> {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
             <span className="mr-2">⚠</span> {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* SECTION 1: General Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Informations Générales</h2>
              
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Titre de l'offre <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="ex. Développeur Full Stack Junior"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                  required
                />
              </div>

              {/* Grid: Types & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Offer Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Type d'offre <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      name="offer_type"
                      value={formData.offer_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="emploi">Premier Emploi</option>
                      <option value="stage">Stage</option>
                      <option value="pfe">PFE</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Employment Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Temps de travail</label>
                  <div className="relative">
                    <select 
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                    >
                      <option value="">Sélectionner</option>
                      <option value="full-time">Temps plein</option>
                      <option value="part-time">Temps partiel</option>
                      <option value="contract">Contrat</option>
                      <option value="internship">Stage</option>
                    </select>
                    <Briefcase size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Durée (Mois)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="ex. 6"
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                    />
                    <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Location & Work Mode */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Lieu & Modalités</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Wilaya (Sends ID) */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Wilaya <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      name="wilaya_id"
                      value={formData.wilaya_id}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                      required
                    >
                      <option value="">Choisir la wilaya</option>
                      {WILAYAS.map((w) => (
                        <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                      ))}
                    </select>
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Commune / Details */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Commune / Précision</label>
                  <input 
                    type="text" 
                    name="commune"
                    value={formData.commune}
                    onChange={handleChange}
                    placeholder="ex. Bab Ezzouar"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                  />
                </div>

                {/* Work Mode */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Mode de travail <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      name="work_mode"
                      value={formData.work_mode}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="onsite">Présentiel</option>
                      <option value="remote">Télétravail</option>
                      <option value="hybrid">Hybride</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Détails de l'offre</h2>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Description détaillée <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez les missions, responsabilités et profil recherché..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none resize-y"
                  required
                />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">Compétences (séparées par des virgules)</label>
                <input 
                  type="text" 
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="ex. Python, React, Communication, Gestion de projet"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                />
              </div>

              {/* Salary & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Salaire Min (DA)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleChange}
                      placeholder="ex. 30000"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                    />
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Salaire Max (DA)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleChange}
                      placeholder="ex. 50000"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                    />
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">Date d'expiration</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      name="expiration_date"
                      value={formData.expiration_date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/company/offers')}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-slate-700 font-bold text-sm hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-[#56Bca0] hover:bg-[#4aa58b] disabled:opacity-50 text-white font-bold text-sm shadow-sm transition flex items-center gap-2"
              >
                {loading && <span className="animate-spin">⌛</span>}
                {loading ? 'Publication...' : 'Publier l\'offre'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostOffer;
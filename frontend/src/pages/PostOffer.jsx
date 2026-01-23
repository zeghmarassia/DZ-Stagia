import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react'; // Added MapPin
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import CompanyNavbar from '../components/CompanyNavbar';

const PostOffer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    offer_type: '',
    duration: '',
    location: '', // ADDED: Location is usually required
    description: '',
    work_mode: '',
    skills: ''
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
    
    const token = localStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
      setError("Erreur : Vous n'êtes pas connecté (Token manquant).");
      setLoading(false);
      return;
    }

    const skillsArray = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const payload = {
      title: formData.title,
      offer_type: formData.offer_type,
      duration: formData.duration,
      location: formData.location, 
      description: formData.description,
      work_mode: formData.work_mode,
      is_active: true,
      skills: skillsArray
    };

    console.log("1. Sending Payload:", payload); // Step 1: Check data sent

    const response = await axios.post(`${API_URL}/api/v1/offers/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("2. Server Response:", response); // Step 2: Check server answer

    // Check for any 2xx success code (200, 201, 202)
    if (response.status >= 200 && response.status < 300) {
      console.log("3. Success! Navigating...");
      setSuccessMessage('Offre publiée avec succès!');
      
      // Navigate immediately to test, then add timeout back later if you want
      navigate('/company/offers'); 
    } else {
      console.log("3. Unexpected Status:", response.status);
      setError(`Erreur inattendue: Code ${response.status}`);
    }

  } catch (err) {
    console.error("4. ERROR CAUGHT:", err); // Step 3: Check specific error
    
    if (err.response) {
      // The server responded with a status code outside the 2xx range
      console.log("Error Data:", err.response.data);
      console.log("Error Status:", err.response.status);
      setError(JSON.stringify(err.response.data.detail || "Erreur serveur"));
    } else if (err.request) {
      // The request was made but no response was received
      setError("Erreur de connexion : Le serveur ne répond pas.");
    } else {
      // Something happened in setting up the request
      setError("Erreur : " + err.message);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <CompanyNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Publier une nouvelle offre</h1>
          <p className="text-slate-500 text-sm mt-1">
            Remplissez les informations ci-dessous pour publier une offre.
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Titre */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Titre de l'offre <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="ex. Ingénieur d'Études et de Développement"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                required
              />
            </div>

            {/* Row: Type & Durée */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Type de l'offre <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="offer_type"
                    value={formData.offer_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 appearance-none bg-white focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none cursor-pointer"
                    required
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="stage">Stage</option>
                    <option value="pfe">PFE</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900">
                  Durée <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="ex. 6 mois"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                  required
                />
              </div>
            </div>

            {/* NEW FIELD: Location */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Lieu (Wilaya / Commune) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="ex. Alger, Oran..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Description détaillée <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez les missions..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none resize-none"
                required
              />
            </div>

            {/* Mode de travail */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Mode de travail <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 appearance-none bg-white focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none cursor-pointer"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="presentiel">Présentiel</option>
                  <option value="teletravail">Télétravail</option>
                  <option value="hybride">Hybride</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Compétences */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">
                Compétences requises
              </label>
              <input 
                type="text" 
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="ex. Python, React..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#4AA59C]/20 focus:border-[#4AA59C] outline-none"
              />
            </div>

            <hr className="border-gray-200 my-6" />

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
                className="px-6 py-2.5 rounded-lg bg-[#56Bca0] hover:bg-[#4aa58b] disabled:opacity-50 text-white font-bold text-sm shadow-sm transition"
              >
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
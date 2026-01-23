import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Phone, Pen, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../config/api';
import CompanyNavbar from '../components/CompanyNavbar';

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    location: '',
    website: '',
    phone: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch company profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/company/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          setFormData({
            name: response.data.name || '',
            sector: response.data.sector || '',
            location: response.data.location || '',
            website: response.data.website || '',
            phone: response.data.phone || '',
            description: response.data.description || ''
          });
        }
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSuccessMessage('');
      const token = localStorage.getItem('token');
      
      await axios.put(`${API_URL}/company/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage('Profil mis à jour avec succès!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error('Profile update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <CompanyNavbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Profil de l'entreprise</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les informations publiques de votre entreprise visibles par les candidats.
          </p>
        </div>

        {/* Status Messages */}
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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-slate-500">Chargement du profil...</p>
          </div>
        ) : (
          <>
        {/* --- MAIN CARD --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          
          {/* Dark Banner */}
          <div className="h-32 bg-[#111827]"></div>

          <div className="px-8 pb-8">
            {/* Header: Logo & Edit Button */}
            <div className="flex justify-between items-start relative">
              {/* Logo (Overlapping Banner) */}
              <div className="relative -mt-16">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm flex items-center justify-center">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${formData.name}&background=random&color=fff`}
                    alt="Logo" 
                    className="w-full h-full object-contain p-2" 
                  />
                </div>
              </div>

              {/* Edit Photo Button */}
              <button className="mt-4 flex items-center gap-2 bg-blue-50 text-[#5B8C9D] px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition">
                <Pen size={14} />
                Modifier la photo de profile
              </button>
            </div>

            {/* Form Fields */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nom de l'entreprise</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5B8C9D]/20 focus:border-[#5B8C9D] outline-none"
                />
              </div>

              {/* Sector (Dropdown) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Secteur d'activité</label>
                <div className="relative">
                  <select 
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 appearance-none bg-white focus:ring-2 focus:ring-[#5B8C9D]/20 focus:border-[#5B8C9D] outline-none cursor-pointer"
                  >
                    <option value="">Sélectionner un secteur</option>
                    <option value="Technologie">Technologie</option>
                    <option value="Énergie et Pétrochimie">Énergie et Pétrochimie</option>
                    <option value="Finance">Finance</option>
                    <option value="Santé">Santé</option>
                    <option value="Éducation">Éducation</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Location/Address (With Icon) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Siège Social (Wilaya)</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5B8C9D]/20 focus:border-[#5B8C9D] outline-none"
                  />
                </div>
              </div>

              {/* Website (With Icon) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Site Web</label>
                <div className="relative">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5B8C9D]/20 focus:border-[#5B8C9D] outline-none"
                  />
                </div>
              </div>

              {/* Contact (With Icon) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Contact</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#5B8C9D]/20 focus:border-[#5B8C9D] outline-none"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- ABOUT CARD --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">À propos de l'entreprise</h2>
          <textarea 
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg text-slate-600 leading-relaxed focus:ring-2 focus:ring-[#5B8C9D]/20 focus:border-[#5B8C9D] outline-none resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-[#4AA59C] hover:bg-[#3d8b83] text-white font-bold py-3 px-6 rounded-lg transition shadow-sm"
          >
            Enregistrer les modifications
          </button>
        </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CompanyProfile;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Globe, Mail, Phone, Calendar, 
  ArrowLeft, Building2, CheckCircle2, Briefcase 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getCompanyPublicProfile } from '../services/companyService';
// import { useSelector } from 'react-redux';

const CompanyDetails = () => {
  const { id } = useParams(); // Get ID from URL
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  // const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      setLoading(true);
      try {
        // --- REAL API CALL (COMMENTED OUT) ---
        const response = await getCompanyPublicProfile(id);
        setCompany(response.data);
        console.log("Company Details:", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!company) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-slate-800">Entreprise introuvable</h2>
      <Link to="/" className="text-emerald-600 hover:underline">Retourner à la liste</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
     

      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-emerald-600 mb-6 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" /> Retour au Acceuil
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Large Logo */}
            <div className="w-32 h-32 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center justify-center shrink-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.company_name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="text-emerald-600" size={48} />
              )}
            </div>

            {/* Title & Actions */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{company.company_name}</h1>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                      {company.sector}
                    </span>
                    {company.is_email_verified && (
                      <span className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                        <CheckCircle2 size={14} /> Vérifié
                      </span>
                    )}
                  </div>
                </div>
                
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" 
                     className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold flex items-center justify-center gap-2">
                    <Globe size={18} /> Visiter le site
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Main Info */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase size={22} className="text-emerald-600"/> À propos
              </h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                {company.description || "Aucune description fournie."}
              </div>
            </section>

            {/* Active Offers Section */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Offres récentes</h2>
              <div className="space-y-4">
                {company.offers && company.offers.length > 0 ? (
                  company.offers.map((offer) => (
                    <div key={offer.id} className="bg-white p-5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all flex justify-between items-center group">
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{offer.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><MapPin size={14}/> {offer.location}</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">{offer.type}</span>
                        </div>
                      </div>
                      <Link to={`/offers/${offer.id}`} className="text-emerald-600 font-bold text-sm hover:underline">
                        Voir
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">Aucune offre active pour le moment.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 border-b border-gray-100 pb-2">Informations</h3>
              
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin className="text-slate-400 mt-1" size={20} />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Adresse</span>
                    <span className="text-slate-700 font-medium">{company.address || 'Non spécifiée'}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="text-slate-400 mt-1" size={20} />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Email</span>
                    <span className="text-slate-700 font-medium break-all">{company.email}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="text-slate-400 mt-1" size={20} />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Téléphone</span>
                    <span className="text-slate-700 font-medium">{company.contact || 'Non spécifié'}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Calendar className="text-slate-400 mt-1" size={20} />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Membre depuis</span>
                    <span className="text-slate-700 font-medium">
                      {new Date(company.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
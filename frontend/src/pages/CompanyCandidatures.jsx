import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Edit,
} from 'lucide-react';
import { getApplicationsForOffer } from '../services/companyService';
import CompanyNavbar from '../components/CompanyNavbar';

// Status Badge Component
const Badge = ({ status }) => {
  const statusMap = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En attente' },
    accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepté' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejeté' }
  };
  
  const config = statusMap[status] || statusMap.pending;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const CompanyCandidatures = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [candidates, setCandidates] = useState([]);
  const [offerDetails, setOfferDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch candidates for the offer
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        // Fetch applications for this specific offer
        const response = await getApplicationsForOffer(id);
        
        const applications = response.data.applications || [];
        setCandidates(applications);
        
        // Extract offer details from first application if available
        if (applications && applications.length > 0) {
          setOfferDetails({
            title: applications[0].offer?.title || 'Offre',
            date: new Date(applications[0].offer?.created_at).toLocaleDateString('fr-FR')
          });
        } else {
          setOfferDetails({
            title: 'Offre',
            date: new Date().toLocaleDateString('fr-FR')
          });
        }
      } catch (err) {
        setError('Erreur lors du chargement des candidatures');
        console.error('Candidates fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidates();
    }
  }, [id]);

  const filteredCandidates = activeTab === 'all' 
    ? candidates 
    : candidates.filter(c => c.status === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* <CompanyNavbar /> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/company/offers" className="hover:text-emerald-600 transition-colors">Mes offres</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Candidatures</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {offerDetails?.title || 'Chargement...'}
              </h1>
              <p className="text-slate-500">
                Publiée le {offerDetails?.date || '...'}
              </p>
            </div>
            
            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm">
              <Edit className="w-4 h-4" />
              Modifier l'offre
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-4 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-4">
            
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
              {['all', 'pending', 'accepted', 'rejected'].map((status) => {
                const count = candidates.filter(c => status === 'all' ? true : c.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === status
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'all' ? 'Tous' : status === 'pending' ? 'En attente' : status === 'accepted' ? 'Acceptés' : 'Rejetés'}
                    <span className={`ml-1 text-xs ${activeTab === status ? 'text-emerald-100' : 'text-slate-400'}`}>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full xl:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher un candidat..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
              />
            </div>
          </div>

          {/* Candidates List */}
          <div className="divide-y divide-slate-100">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
              <div className="col-span-4">Nom du candidat</div>
              <div className="col-span-3">Université / École</div>
              <div className="col-span-3">Filière</div>
              <div className="col-span-2">Statut</div>
            </div>

            {/* Rows */}
            {loading ? (
              <div className="px-6 py-8 text-center text-slate-500">
                Chargement des candidatures...
              </div>
            ) : error ? (
              <div className="px-6 py-8 text-center text-red-500">
                {error}
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                Aucune candidature trouvée
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  // ADDED: onClick handler to navigate
                  onClick={() => navigate(`/company/applications/${candidate.id}`)}
                  className="group md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors cursor-pointer border-b md:border-b-0 border-slate-100"
                >
                  
                  {/* Candidate Info */}
                  <div className="col-span-12 md:col-span-4 flex items-center gap-4 mb-2 md:mb-0">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${candidate.student?.first_name || ''}+${candidate.student?.last_name || ''}&background=random&color=fff`}
                      alt={candidate.student?.first_name} 
                      className="w-10 h-10 rounded-full border border-slate-200"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {candidate.student?.first_name} {candidate.student?.last_name}
                      </h3>
                      <p className="text-sm text-slate-500">{candidate.student?.email}</p>
                    </div>
                  </div>

                  {/* University/School - Desktop only */}
                  <div className="col-span-12 md:col-span-3 hidden md:block">
                    <p className="text-sm text-slate-700">{candidate.student?.education?.[0]?.institution || 'N/A'}</p>
                  </div>

                  {/* Specialization - Desktop only */}
                  <div className="col-span-12 md:col-span-3 hidden md:block">
                    <p className="text-sm text-slate-700">{candidate.student?.speciality?.name || 'N/A'}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-12 md:col-span-2">
                    <Badge status={candidate.status} />
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons (Bottom) */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
          >
            ← Retour
          </button>
        </div>
      </main>
    </div>
  );
};

export default CompanyCandidatures;
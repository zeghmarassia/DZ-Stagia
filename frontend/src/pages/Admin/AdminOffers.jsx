import React, { useState, useEffect } from 'react';
import { getOffers, deleteOffer } from '../../services/AdminService.js';
import { Trash2, MapPin, Briefcase, Calendar } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await getOffers({ skip: 0, limit: 100 });
      console.log('Offers:', response.data);
      setOffers(response.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.')) return;
    
    setActionLoading(offerId);
    try {
      await deleteOffer(offerId);
      // Refresh the list
      await fetchOffers();
      alert('Offre supprimée avec succès !');
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert('Erreur lors de la suppression de l\'offre');
    } finally {
      setActionLoading(null);
    }
  };

  const getOfferTypeBadge = (type) => {
    const styles = {
      internship: 'bg-blue-100 text-blue-800',
      job: 'bg-purple-100 text-purple-800',
      freelance: 'bg-orange-100 text-orange-800'
    };
    
    const labels = {
      internship: 'Stage',
      job: 'Emploi',
      freelance: 'Freelance'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
        {labels[type] || type}
      </span>
    );
  };

  const getLocationModeBadge = (mode) => {
    const styles = {
      remote: 'bg-green-100 text-green-800',
      onsite: 'bg-slate-100 text-slate-800',
      hybrid: 'bg-teal-100 text-teal-800'
    };
    
    const labels = {
      remote: 'À distance',
      onsite: 'Sur site',
      hybrid: 'Hybride'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[mode] || 'bg-gray-100 text-gray-800'}`}>
        {labels[mode] || mode}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type) => {
    const styles = {
      full_time: 'bg-indigo-100 text-indigo-800',
      part_time: 'bg-cyan-100 text-cyan-800',
      contract: 'bg-amber-100 text-amber-800'
    };
    
    const labels = {
      full_time: 'Temps plein',
      part_time: 'Temps partiel',
      contract: 'Contrat'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
        {labels[type] || type}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ml-64 p-8 bg-slate-50 min-h-screen">
      <Sidebar />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Gestion des Offres</h1>
        <p className="text-slate-500">Gérer toutes les offres publiées sur la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total des Offres</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{offers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Briefcase size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Offres Actives</p>
              <p className="text-3xl font-black text-green-600 mt-1">
                {offers.filter(o => o.is_active).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Briefcase size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Offres Inactives</p>
              <p className="text-3xl font-black text-slate-400 mt-1">
                {offers.filter(o => !o.is_active).length}
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl">
              <Briefcase size={24} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-slate-500">Chargement...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Aucune offre trouvée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Type d'offre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Mode de travail
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Type d'emploi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {offers.map((offer) => (
                  <tr key={offer.offer_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">
                          {offer.title}
                        </span>
                        {offer.company && (
                          <span className="text-xs text-slate-500 mt-1">
                            {offer.company.company_name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOfferTypeBadge(offer.offer_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLocationModeBadge(offer.location_mode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEmploymentTypeBadge(offer.employment_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {offer.is_active ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{formatDate(offer.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(offer.offer_id)}
                        disabled={actionLoading === offer.offer_id}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all disabled:opacity-50"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
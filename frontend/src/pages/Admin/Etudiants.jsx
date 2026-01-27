import React, { useState, useEffect } from 'react';
import { 
  getPendingStudents, 
  getApprovedStudents, 
  approveStudent, 
  rejectStudent 
} from '../../services/AdminService.js';
import { Check, X, FileText, Mail, MailCheck } from 'lucide-react';
import Sidebar from '../../components/Sidebar.jsx';

const Etudiants = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [filter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let response;
      
      if (filter === 'pending') {
        response = await getPendingStudents({ skip: 0, limit: 100 });
      } else if (filter === 'approved') {
        response = await getApprovedStudents({ skip: 0, limit: 100 });
      } else {
        // Fetch both pending and approved
        const [pendingRes, approvedRes] = await Promise.all([
          getPendingStudents({ skip: 0, limit: 100 }),
          getApprovedStudents({ skip: 0, limit: 100 })
        ]);
        response = { 
          data: [...pendingRes.data, ...approvedRes.data] 
        };
      }
      
      console.log('Students:', response.data);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir approuver cet étudiant ?')) return;
    
    setActionLoading(studentId);
    try {
      await approveStudent(studentId);
      // Refresh the list
      await fetchStudents();
      alert('Étudiant approuvé avec succès !');
    } catch (error) {
      console.error('Error approving student:', error);
      alert('Erreur lors de l\'approbation de l\'étudiant');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (studentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter cet étudiant ?')) return;
    
    setActionLoading(studentId);
    try {
      await rejectStudent(studentId);
      // Refresh the list
      await fetchStudents();
      alert('Étudiant rejeté avec succès !');
    } catch (error) {
      console.error('Error rejecting student:', error);
      alert('Erreur lors du rejet de l\'étudiant');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
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
        <h1 className="text-3xl font-black text-slate-900 mb-2">Gestion des Étudiants</h1>
        <p className="text-slate-500">Gérer les inscriptions et approbations des étudiants</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              filter === 'all' 
                ? 'bg-teal-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              filter === 'approved' 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Approuvés
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-slate-500">Chargement...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Aucun étudiant trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Prénom
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Email Vérifié
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student) => (
                  <tr key={student.student_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-900">
                        {student.first_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-900">
                        {student.last_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{student.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.document_url ? (
                        <a 
                          href={student.document_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-semibold"
                        >
                          <FileText size={16} />
                          <span>Voir</span>
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">Aucun</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.is_email_verified ? (
                        <MailCheck size={20} className="text-green-500" />
                      ) : (
                        <Mail size={20} className="text-slate-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {formatDate(student.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {student.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(student.student_id)}
                              disabled={actionLoading === student.student_id}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all disabled:opacity-50"
                              title="Approuver"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(student.student_id)}
                              disabled={actionLoading === student.student_id}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all disabled:opacity-50"
                              title="Rejeter"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        {student.status === 'approved' && (
                          <span className="text-xs text-green-600 font-semibold">Approuvé ✓</span>
                        )}
                        {student.status === 'rejected' && (
                          <span className="text-xs text-red-600 font-semibold">Rejeté ✗</span>
                        )}
                      </div>
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

export default Etudiants;
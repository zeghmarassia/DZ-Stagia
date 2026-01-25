import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingStudents, approveStudent, rejectStudent } from '../../services/studentService';
import { getPendingCompanies, approveCompany, rejectCompany } from '../../services/companyService';

const getDocColor = (docName) => {
  if (!docName) return 'bg-gray-200 text-gray-800';
  const extension = docName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'bg-[#EAF2FF] text-[#2A85FF]';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'bg-[#F3EFFF] text-[#8E59FF]';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const UserValidation = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock Data
  const MOCK_USERS = [
    {
      id: 1,
      name: "Yasmine Amrani",
      type: "student",
      date: "2024-01-24T10:00:00Z",
      doc: "certificat_scolarite.pdf",
      email: "yasmine.amrani@estin.dz"
    },
    {
      id: 2,
      name: "Tech Solutions",
      type: "company",
      date: "2024-01-23T15:30:00Z",
      doc: "registre_commerce.pdf",
      email: "contact@techsolutions.com"
    },
    {
      id: 3,
      name: "Karim Benzema",
      type: "student",
      date: "2024-01-22T09:15:00Z",
      doc: "releve_notes.png",
      email: "karim.benzema@estin.dz"
    }
  ];

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        // Commented out API call
        /*
        const [studentsRes, companiesRes] = await Promise.all([
          getPendingStudents(),
          getPendingCompanies(),
        ]);

        const pendingStudents = studentsRes.data.map(s => ({ ...s, id: s.student_id, name: `${s.first_name} ${s.last_name}`, type: 'student', date: s.created_at, doc: s.document_url }));
        const pendingCompanies = companiesRes.data.map(c => ({ ...c, id: c.company_id, name: c.company_name, type: 'company', date: c.created_at, doc: c.document_url }));

        setUsers([...pendingStudents, ...pendingCompanies]);
        */
        
        // Use Mock Data
        setUsers(MOCK_USERS);

      } catch (err) {
        setError('Failed to fetch users.');
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id, type) => {
    try {
      // Commented out API call
      /*
      if (type === 'student') {
        await approveStudent(id);
      } else if (type === 'company') {
        await approveCompany(id);
      }
      */
      
      // Update local state
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError('Failed to approve user.');
      console.error('Approve user error:', err);
    }
  };

  const handleReject = async (id, type) => {
    try {
      // Commented out API call
      /*
      if (type === 'student') {
        await rejectStudent(id);
      } else if (type === 'company') {
        await rejectCompany(id);
      }
      */
      
      // Update local state
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError('Failed to reject user.');
      console.error('Reject user error:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-[#1A1D1F]">
      {/* Sidebar - Collapsed Version */}
      <aside className="w-20 border-r border-[#F0F0F0] flex flex-col items-center py-8 bg-white">
        <div className="mb-12">
          <h1 className="text-[18px] font-[900] tracking-tighter">STAGIA</h1>
        </div>
        <nav className="flex-1 space-y-8">
          <SideIcon icon={<HomeIcon />} to="/admin" />
          <SideIcon icon={<UsersIcon />} to="/admin/users" active />
          <SideIcon icon={<StudentIcon />} to="/admin/students" />
          <SideIcon icon={<BuildingIcon />} to="/admin/companies" />
          <SideIcon icon={<BriefcaseIcon />} to="/admin/offers" />
        </nav>
        <div className="pt-8 border-t border-[#F0F0F0] w-full flex justify-center">
          <SideIcon icon={<SettingsIcon />} to="/admin/settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#F4F4F4]/30 px-12 py-8">
        {/* Header */}
        <div className="flex justify-end items-center mb-10 space-x-8">
          <button className="text-[#6F767E] hover:text-black transition-colors"><SearchIcon /></button>
          <button className="text-[#6F767E] relative hover:text-black transition-colors">
            <BellIcon />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF6A55] rounded-full border border-white"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-[#F0F0F0]">
            <div className="text-right">
              <p className="text-[14px] font-[700] text-[#1A1D1F]">Hiba Kara</p>
              <p className="text-[11px] text-[#6F767E]">Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FFBC99] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-white font-bold text-xs">
               HK
            </div>
            <button className="text-[#6F767E] ml-2 hover:text-[#FF6A55] transition-colors">
              <LogoutIcon />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-[28px] font-[700] text-[#1A1D1F]">Utilisateurs</h2>
          <p className="text-[#6F767E] text-[13px]">Vérifiez les comptes créés des utilisateurs pour gérer l'accès à la plateforme.</p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm">
          <div className="p-5 flex justify-between items-center border-b border-[#F0F0F0]">
            <div className="flex items-center space-x-2">
              <span className="text-[#6F767E] text-xs font-medium">Trier par:</span>
              <select className="bg-[#F4F4F4] border-none rounded-lg px-3 py-1.5 text-xs font-[700] outline-none cursor-pointer">
                <option>Les plus récents</option>
              </select>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F767E]"><SearchIcon size={14} /></span>
              <input 
                type="text" 
                placeholder="Rechercher ..." 
                className="bg-[#F4F4F4] border-none rounded-lg pl-9 pr-4 py-2 text-xs w-64 focus:ring-1 focus:ring-gray-200 outline-none"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#6F767E] text-[10px] font-[700] uppercase tracking-widest border-b border-[#F0F0F0]">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Créé le</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F4]">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="text-center py-10 text-red-500">{error}</td></tr>
              ) : (
                users.map((user, idx) => (
                <tr key={idx} className="hover:bg-[#F4F4F4]/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#EFEFEF] border border-white flex items-center justify-center">
                        <UserPlaceholderIcon />
                      </div>
                      <span className="text-[13px] font-[700] text-[#1A1D1F]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#6F767E] font-medium">{new Date(user.date).toLocaleString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#F4F4F4] text-[#6F767E] px-3 py-1.5 rounded-lg text-[11px] font-[700]">
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg w-fit cursor-pointer hover:opacity-80 transition-opacity ${getDocColor(user.doc)}`}>
                      <FileIcon />
                      <span className="text-[11px] font-[700] underline">{user.doc}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-3">
                                            <button onClick={() => handleReject(user.id, user.type)} className="text-[#FF6A55] p-2 hover:bg-[#FFF2F0] rounded-lg transition-colors">
                        <CloseIcon />
                      </button>
                                            <button onClick={() => handleApprove(user.id, user.type)} className="bg-[#27AE60] text-white px-4 py-2 rounded-xl flex items-center space-x-2 text-[12px] font-[700] hover:bg-[#219653] shadow-sm transition-all">
                        <CheckIcon />
                        <span>Approuver</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 flex justify-between items-center border-t border-[#F4F4F4]">
            <button className="px-4 py-1.5 border border-[#E8E8E8] rounded-lg text-[#6F767E] text-xs font-bold opacity-50">Précédent</button>
            <button className="px-4 py-1.5 border border-[#E8E8E8] rounded-lg text-[#1A1D1F] text-xs font-bold hover:bg-gray-50 transition-colors">Suivant</button>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-component for Collapsed Sidebar Icons ---
const SideIcon = ({ icon, to, active = false }) => (
  <Link 
    to={to} 
    className={`p-3 rounded-xl flex items-center justify-center transition-all ${
      active 
        ? 'bg-[#F4F4F4] text-[#27AE60] border border-[#E8E8E8] shadow-sm' 
        : 'text-[#6F767E] hover:text-black hover:bg-gray-50'
    }`}
  >
    {icon}
  </Link>
);

// --- Icons (Same as your previous ones) ---
const HomeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
const StudentIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10L12 5L2 10L12 15L22 10Z"/><path d="M6 12.5V16.5L12 19.5L18 16.5V12.5"/></svg>;
const BuildingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/></svg>;
const BriefcaseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09"/></svg>;
const SearchIcon = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const BellIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const LogoutIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const FileIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const CloseIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const UserPlaceholderIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F767E" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>;

export default UserValidation;
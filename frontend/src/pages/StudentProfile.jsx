import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStudentProfile, updateStudentProfile, uploadProfilePicture } from '../services/studentService';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    professionalTitle: '',
    wilaya: 'Alger',
    phoneNumber: '',
    about: '',
    education: [{
      university: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: ''
    }],
    experiences: [],
    skills: [],
    linkedIn: '',
    github: '',
    portfolio: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);

  // Mock Data
  const MOCK_PROFILE = {
    firstName: 'Yasmine',
    lastName: 'Amrani',
    professionalTitle: 'Développeuse Web Full Stack',
    wilaya: 'Alger',
    phoneNumber: '0555123456',
    about: 'Étudiante passionnée par le développement web et les nouvelles technologies.',
    education: [{
      university: 'ESTIN',
      degree: 'Ingénieur',
      fieldOfStudy: 'Informatique',
      startDate: '2021-09-01',
      endDate: '2026-06-30'
    }],
    experiences: [],
    skills: ['React', 'Node.js', 'Python'],
    linkedIn: 'https://linkedin.com/in/yasmine-amrani',
    github: 'https://github.com/yasmine-amrani',
    portfolio: 'https://yasmine-amrani.com'
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Commented out API call
        /*
        const response = await getStudentProfile();
        if (response.data) {
          setProfile(prev => ({ ...prev, ...response.data }));
        }
        */
       
        // Use Mock Data
        setProfile(prev => ({ ...prev, ...MOCK_PROFILE }));

      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...profile.education];
    updatedEducation[index][name] = value;
    setProfile(prev => ({ ...prev, education: updatedEducation }));
  };

  const handleAddEducation = () => {
    setProfile(prev => ({ ...prev, education: [...prev.education, { university: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }] }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Commented out API call
      /*
      // 1. Update textual profile data
      const profileData = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phoneNumber,
        bio: profile.about,
        portfolio_url: profile.portfolio,
        github_url: profile.github,
        linkedin_url: profile.linkedIn,
      };
      await updateStudentProfile(profileData);

      // 2. Upload profile picture if it exists
      if (profilePicture) {
        await uploadProfilePicture(profilePicture);
      }
      */

      // TODO: Add separate calls for education, experience, and skills when those services are ready.

      // Simulate successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profil mis à jour avec succès !');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert('Erreur lors de la mise à jour du profil.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-[#111827]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>

      {/* Main Content */}
      <main className="max-w-[1000px] mx-auto w-full px-8 py-10">
        <header className="mb-10">
          <h1 className="text-[28px] font-[800] text-[#111827] mb-2">Créer votre profil étudiant</h1>
          <p className="text-gray-400 text-[15px] font-medium">Complétez votre profil pour construire votre CV automatiquement.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-start">
          
          {/* Left Column */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm flex flex-col items-center">
              <div className="w-32 h-32 bg-[#2D3748] rounded-full flex items-center justify-center overflow-hidden mb-6 relative border-4 border-gray-50 shadow-inner">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input type="file" id="profile-pic-upload" hidden onChange={handleFileChange} />
              <label htmlFor="profile-pic-upload" className="cursor-pointer flex items-center text-[#4fa797] text-[13px] font-[800] hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors">
                <svg className="mr-2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                Modifier la photo de profil
              </label>
            </div>
            <div className="bg-white rounded-[24px] border border-gray-100 p-10 h-40 shadow-sm opacity-50"></div>
          </aside>

          {/* Right Column */}
          <div className="space-y-8">
            <FormSection title="Informations Personnelles" icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Prénom" name="firstName" value={profile.firstName} onChange={handleChange} placeholder="Votre prénom" />
                <InputField label="Nom" name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Votre nom" />
              </div>
              <InputField label="Titre professionnel" name="professionalTitle" value={profile.professionalTitle} onChange={handleChange} placeholder="Ex: Étudiant en Informatique, Développeur Web Junior..." />
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Wilaya" name="wilaya" value={profile.wilaya} onChange={handleChange} options={['Alger', 'Oran', 'Constantine', 'Béjaïa']} />
                <InputField label="Numéro de téléphone" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} placeholder="05 50 XX XX XX" />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[13px] font-[800] text-[#111827]">À propos de vous</label>
                <textarea 
                  name="about"
                  value={profile.about}
                  onChange={handleChange}
                  placeholder="Décrivez brièvement votre parcours, vos ambitions et ce que vous recherchez..."
                  className="w-full bg-white border border-gray-100 rounded-[12px] p-4 text-[14px] font-medium outline-none focus:border-[#4fa797] min-h-[120px] transition-all"
                />
              </div>
            </FormSection>

            <FormSection title="Formation" icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>} onAdd={handleAddEducation}>
              {profile.education.map((edu, index) => (
                <div key={index} className="space-y-5 border-b border-gray-100 pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
                  <InputField label="Université / École" name="university" value={edu.university} onChange={(e) => handleEducationChange(index, e)} placeholder="Ex: USTHB" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Diplôme" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} placeholder="Ex: Master 2" />
                    <InputField label="Domaine d'étude" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(index, e)} placeholder="Ex: Informatique" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Date de début" name="startDate" value={edu.startDate} onChange={(e) => handleEducationChange(index, e)} placeholder="JJ/MM/AAAA" type="date" />
                    <InputField label="Date de fin (ou prévu)" name="endDate" value={edu.endDate} onChange={(e) => handleEducationChange(index, e)} placeholder="JJ/MM/AAAA" type="date" />
                  </div>
                </div>
              ))}
            </FormSection>

            <FormSection title="Expériences & Projets" icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>} showAdd>
              <div className="border-2 border-dashed border-gray-100 rounded-[16px] p-8 flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:bg-gray-50 transition-all">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                </div>
                <p className="text-[13px] font-bold">Ajoutez vos stages, freelances ou projets académiques importants</p>
              </div>
            </FormSection>

            <FormSection title="Compétences" icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>}>
              <div className="space-y-4">
                <label className="text-[13px] font-[800] text-[#111827]">Compétences techniques</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  <SkillTag label="React" />
                  <SkillTag label="Tailwind CSS" />
                  <SkillTag label="Python" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ajouter une compétence (ex: Java, SQL...) et appuyez sur Entrée"
                  className="w-full bg-white border border-gray-100 rounded-[12px] px-4 py-3 text-[13px] font-medium outline-none focus:border-[#4fa797] transition-all"
                />
              </div>
              <div className="space-y-3 mt-6">
                {/* Updated: Icons to match the specific designs in the screenshot */}
                <SocialInput 
                  text="in" // Specific "in" text icon for LinkedIn
                  name="linkedIn" 
                  value={profile.linkedIn} 
                  onChange={handleChange} 
                  placeholder="Lien profil LinkedIn" 
                />
                <SocialInput 
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>} 
                  name="github" 
                  value={profile.github} 
                  onChange={handleChange} 
                  placeholder="Lien profil GitHub" 
                />
                <SocialInput 
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>} 
                  name="portfolio" 
                  value={profile.portfolio} 
                  onChange={handleChange} 
                  placeholder="Lien Portfolio Personnel" 
                />
              </div>
            </FormSection>

            <div className="flex justify-end space-x-4 pt-6 pb-20">
              <button className="flex items-center bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-[12px] font-[800] text-[14px] hover:bg-gray-50 transition-colors">
                <svg className="mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Télécharger CV
              </button>
              <button onClick={handleSubmit} className="bg-[#4fa797] text-white px-10 py-3 rounded-[12px] font-[800] text-[14px] hover:bg-[#3d8b7d] transition-shadow shadow-lg shadow-teal-100">
                Enregistrer mon profil
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Updated SocialInput to support text or icon --- */
const SocialInput = ({ icon, text, placeholder, name, value, onChange }) => (
  <div className="relative group">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-bold text-gray-400 group-focus-within:text-[#4fa797] transition-all flex items-center justify-center">
      {text ? text : icon}
    </span>
    <input 
      type="text" 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white border border-gray-100 rounded-[12px] pl-10 pr-4 py-3 text-[13px] font-medium outline-none focus:border-[#4fa797] transition-all"
    />
  </div>
);

/* Helper UI Components remain unchanged */
const FormSection = ({ title, icon, children, onAdd }) => (
  <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3 text-[#111827]">
        <span className="text-gray-400">{icon}</span>
        <h2 className="text-[16px] font-[800]">{title}</h2>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="text-[#4fa797] text-[12px] font-[800] hover:underline flex items-center">
          + Ajouter
        </button>
      )}
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

const InputField = ({ label, placeholder, name, value, onChange, type = 'text' }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[13px] font-[800] text-[#111827]">{label}</label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-white border border-gray-100 rounded-[12px] px-4 py-3.5 text-[14px] font-medium outline-none focus:border-[#4fa797] transition-all"
    />
  </div>
);

const SelectField = ({ label, options, name, value, onChange }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[13px] font-[800] text-[#111827]">{label}</label>
    <select name={name} value={value} onChange={onChange} className="bg-white border border-gray-100 rounded-[12px] px-4 py-3.5 text-[14px] font-medium outline-none focus:border-[#4fa797] cursor-pointer transition-all">
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
);

const SkillTag = ({ label }) => (
  <div className="bg-[#4fa797]/10 text-[#4fa797] px-3 py-1.5 rounded-full text-[12px] font-[700] flex items-center">
    {label}
    <button className="ml-2 hover:text-red-500 transition-colors">×</button>
  </div>
);

export default StudentProfile;
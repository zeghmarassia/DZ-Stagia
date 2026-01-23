import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Calendar, MapPin, Phone, 
  Download, Eye, ExternalLink, Github, Linkedin, Globe, 
  Clock, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Data (matches your screenshot)
  const candidate = {
    id: 1,
    name: "Amine Benali",
    title: "Étudiant M2 Informatique à USTHB",
    avatar: "https://i.pravatar.cc/150?u=amine", // Placeholder image
    location: "Alger, Bab Ezzouar",
    email: "amine.benali@usthb.dz",
    phone: "+213 555 123 456",
    about: "Passionné par le développement logiciel et l'architecture cloud. Actuellement en Master 2 Génie Logiciel, je cherche un stage de fin d'études pour appliquer mes connaissances en DevOps et CI/CD. J'ai réalisé plusieurs projets académiques utilisant Docker et Kubernetes.",
    skills: ["Python", "Docker", "Kubernetes", "AWS", "Git", "Linux", "Jenkins"],
    education: [
      {
        degree: "Master en Informatique (Génie Logiciel)",
        school: "Université des Sciences et de la Technologie Houari Boumediene (USTHB)",
        year: "2022 - Présent",
        color: "bg-emerald-500"
      },
      {
        degree: "Licence en Informatique Académique",
        school: "USTHB",
        year: "2019 - 2022",
        color: "bg-gray-300"
      }
    ],
    experience: [
      {
        role: "Stagiaire Développeur Full Stack",
        company: "Startup Algérie Tech · Alger",
        date: "Juin 2023 - Sept 2023",
        description: "Développement d'une application de gestion de stock avec React et Django. Mise en place de conteneurs Docker pour l'environnement de développement."
      }
    ],
    status: "En cours d'étude",
    history: [
      { action: "Statut changé à En cours d'étude", date: "Hier", type: "update" },
      { action: "Candidature reçue", date: "12 Oct", type: "create" }
    ]
  };

  const [currentStatus, setCurrentStatus] = useState(candidate.status);

  // Helper for Status Badge Colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Reçue': return 'bg-blue-100 text-blue-700';
      case "En cours d'étude": return 'bg-yellow-100 text-yellow-700';
      case 'Entretien planifié': return 'bg-purple-100 text-purple-700';
      case 'Accepté': return 'bg-green-100 text-green-700';
      case 'Refusé': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-teal-600 font-medium mb-6 hover:underline"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={candidate.avatar} 
            alt={candidate.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{candidate.name}</h1>
            <p className="text-slate-600 font-medium">{candidate.title}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {candidate.location}</span>
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {candidate.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {candidate.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" /> Envoyer un email
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" /> Planifier un entretien
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Profil du candidat</h2>
              <a href="#" className="text-teal-600 text-sm font-medium hover:underline flex items-center gap-1">
                Voir profil complet <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* About */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">À Propos</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {candidate.about}
              </p>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education Timeline */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Formation</h3>
              <div className="space-y-6 border-l-2 border-slate-100 ml-2 pl-6 relative">
                {candidate.education.map((edu, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full ${idx === 0 ? 'bg-teal-500' : 'bg-slate-300'} border-2 border-white ring-1 ring-slate-100`}></span>
                    <h4 className="text-slate-900 font-bold text-sm">{edu.degree}</h4>
                    <p className="text-slate-600 text-sm">{edu.school}</p>
                    <span className="text-slate-400 text-xs mt-1 block">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>

             {/* Experience Timeline */}
             <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Expérience</h3>
              <div className="space-y-6 border-l-2 border-slate-100 ml-2 pl-6 relative">
                {candidate.experience.map((exp, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[37px] top-0 bg-slate-50 p-1 rounded-lg border border-slate-200">
                         {/* Simple briefcase icon placeholder */}
                         <div className="w-4 h-4 bg-slate-800 rounded-sm"></div> 
                    </div>
                    <h4 className="text-slate-900 font-bold text-sm">{exp.role}</h4>
                    <p className="text-slate-600 text-sm">{exp.company}</p>
                    <span className="text-slate-400 text-xs mt-1 block mb-2">{exp.date}</span>
                    <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CV Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
               <button className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-center gap-2 text-sm">
                <Eye className="w-4 h-4" /> Aperçu du CV
              </button>
              <button className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" /> Télécharger CV
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="space-y-6">
          
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-amber-400">
            <h3 className="text-slate-900 font-bold mb-4">Statut de la candidature</h3>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 text-sm">Actuel:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(currentStatus)}`}>
                {currentStatus}
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 block">Modifier le statut</label>
              <select 
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="Reçue">Reçue</option>
                <option value="En cours d'étude">En cours d'étude</option>
                <option value="Entretien planifié">Entretien planifié</option>
                <option value="Accepté">Accepté</option>
                <option value="Refusé">Refusé</option>
              </select>
              <button className="w-full py-2.5 bg-teal-700 text-white rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors">
                Mettre à jour
              </button>
            </div>
          </div>

          {/* History Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="text-slate-900 font-bold mb-4">Historique</h3>
             <div className="space-y-6 relative border-l border-slate-200 ml-2 pl-6">
                {candidate.history.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full ${item.type === 'update' ? 'bg-amber-400' : 'bg-blue-400'} ring-4 ring-white`}></span>
                    <p className="text-sm text-slate-700 font-medium">{item.action}</p>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* External Links */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-slate-900 font-bold mb-4">Liens Externes</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-between text-slate-600 hover:text-teal-600 transition-colors group">
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Linkedin className="w-4 h-4" /> Profil LinkedIn
                </span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">›</span>
              </a>
              <a href="#" className="flex items-center justify-between text-slate-600 hover:text-teal-600 transition-colors group">
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Github className="w-4 h-4" /> GitHub
                </span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">›</span>
              </a>
              <a href="#" className="flex items-center justify-between text-slate-600 hover:text-teal-600 transition-colors group">
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Globe className="w-4 h-4" /> Portfolio Personnel
                </span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">›</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
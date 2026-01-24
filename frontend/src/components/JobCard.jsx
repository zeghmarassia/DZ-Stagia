import React from 'react';
import {
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Clock, 
  Code2, 
  BarChart3, 
  TrendingUp, 
  Smartphone
} from 'lucide-react';


const JobCard = ({ title, company, location, duration, type, badgeColor, logo, logoBg, onViewClick, offerId }) => (
  <div className="bg-white border border-gray-100 p-6 rounded-xl flex flex-col md:flex-row gap-6 hover:shadow-lg transition group relative">
    
    {/* Badge - Positioned Top Right */}
    <span className={`absolute top-6 right-6 px-3 py-1 rounded-md text-xs font-bold ${badgeColor}`}>
      {type}
    </span>

    {/* Logo Container */}
    <div className={`w-16 h-16 min-w-[4rem] rounded-xl flex items-center justify-center ${logoBg}`}>
      {/* We render the passed icon component here */}
      {logo}
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col justify-center pt-2 md:pt-0">
      <h3 className="font-bold text-lg text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 font-medium text-sm mb-5">{company}</p>
      
      {/* Meta Info (Location & Duration) */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-slate-400" />
          {location}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-slate-400" />
          {duration}
        </div>
      </div>
    </div>

    {/* Button - Aligned to bottom right */}
    <div className="flex flex-col justify-end mt-4 md:mt-0 items-stretch md:items-end">
       <button 
         onClick={() => onViewClick && onViewClick(offerId)}
         className="px-8 py-2.5 bg-[#5B8C9D] text-white text-xs font-bold rounded hover:bg-[#4A7280] transition uppercase tracking-wide"
       >
         Voir Offre
       </button>
    </div>
  </div>
);

export default JobCard
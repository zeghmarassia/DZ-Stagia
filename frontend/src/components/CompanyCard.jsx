import React from 'react'
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
  Instagram
} from 'lucide-react';

// Make sure MapPin is imported from 'lucide-react' in your file header
// import { MapPin, ...otherIcons } from 'lucide-react';

const CompanyCard = ({ name, location, logo, isFeatured = false }) => (
  <div 
    className="group flex flex-col p-6 bg-white rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-cyan-600 cursor-pointer"
  >
    {/* Top Section: Logo, Name, Featured Tag, Location */}
    <div className="flex items-start mb-6">
      {/* Logo */}
      <img 
        src={logo} 
        alt={`${name} logo`} 
        className="w-16 h-16 object-contain mr-4"
      />
      
      {/* Text Content */}
      <div>
        <div className="flex items-center flex-wrap gap-2">
          <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-cyan-700 transition-colors">
            {name}
          </h3>
          {isFeatured && (
            <span className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <div className="flex items-center mt-2 text-slate-500">
          <MapPin className="w-4 h-4 mr-1.5" />
          <span className="text-sm">{location}</span>
        </div>
      </div>
    </div>

    {/* Bottom Section: Button */}
    {/* group-hover classes allow the button to change style when the parent div is hovered */}
    <button 
      className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 
                 bg-blue-50 text-blue-600 
                 group-hover:bg-cyan-700 group-hover:text-white"
    >
      VOIR PROFIL
    </button>
  </div>
);

export default CompanyCard
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
  Handshake,
  Check
} from 'lucide-react';

const FeatureCard = ({ icon, title, description, items }) => (
  <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl flex flex-col h-full text-left">
    {/* Header: Icon + Title */}
    <div className="flex items-center mb-6">
      <div className="bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center shadow-sm mr-4 shrink-0">
        {icon}
      </div>
      <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">{title}</h3>
    </div>

    {/* Description Paragraph */}
    <p className="text-slate-600 mb-8 leading-relaxed">
      {description}
    </p>

    {/* List Items */}
    <ul className="space-y-3 mt-auto">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-center text-slate-700 font-medium text-sm">
          {/* Green bold checkmark */}
          <Check className="w-5 h-5 mr-3 text-emerald-500 stroke-[3]" /> 
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default FeatureCard;
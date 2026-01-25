import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

const CompanyCard2 = ({ company }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group flex flex-col h-full">
      {/* Header: Logo & Ext Link */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-lg border border-gray-50 bg-white p-2 flex items-center justify-center shadow-sm">
          {company.logo_url ? (
            <img 
              src={company.logo_url} 
              alt={company.company_name} 
              className="w-full h-full object-contain" 
            />
          ) : (
            <Building2 className="text-emerald-600" size={32} />
          )}
        </div>
        {company.website && (
          <a 
            href={company.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-emerald-600 transition-colors p-2"
            onClick={(e) => e.stopPropagation()} // Prevent card click
          >
            <ExternalLink size={18} />
          </a>
        )}
      </div>

      {/* Info */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
          {company.company_name}
        </h3>
        <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md border border-emerald-100">
          {company.sector || 'Secteur non spécifié'}
        </span>
      </div>

      {/* Description */}
      <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
        {company.description || "Aucune description disponible pour cette entreprise."}
      </p>

      {/* Footer */}
      <div className="border-t border-gray-50 pt-4 mt-auto">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
          <MapPin size={16} />
          <span className="truncate">{company.address || 'Algérie'}</span>
        </div>
        
        {/* Navigation Link */}
        <Link 
          to={`/companies/${company.company_id}`} 
          className="w-full py-2.5 rounded-lg bg-slate-50 text-slate-700 font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center gap-2"
        >
          Voir le profil <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard2;
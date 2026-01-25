import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import CompanyCard2 from '../components/CompanyCard2'; // CHANGED: Imported CompanyCard2

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("Tous");

  const MOCK_COMPANIES = [
    {
      company_id: 1,
      company_name: "Sonatrach",
      email: "contact@sonatrach.dz",
      status: "active",
      is_email_verified: true,
      description: "La première compagnie d'hydrocarbures en Afrique.",
      sector: "Énergie & Pétrole",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Sonatrach_Logo.svg",
      address: "Hydra, Alger",
      contact: "021 54 70 00",
      website: "https://sonatrach.com",
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      company_id: 2,
      company_name: "Ooredoo Algérie",
      email: "recrutement@ooredoo.dz",
      status: "active",
      is_email_verified: true,
      description: "Leader des télécommunications offrant des services mobiles innovants.",
      sector: "Télécommunications",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Ooredoo_logo.svg/2560px-Ooredoo_logo.svg.png",
      address: "Ouled Fayet, Alger",
      contact: "0550 00 00 00",
      website: "https://ooredoo.dz",
      created_at: "2024-02-10T14:30:00Z"
    },
    {
      company_id: 3,
      company_name: "Yassir",
      email: "careers@yassir.com",
      status: "active",
      is_email_verified: true,
      description: "Super-App offrant des services de transport, de livraison et de paiement.",
      sector: "Technologie & Startup",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/43/Yassir_Logo.png",
      address: "Sidi Abdellah, Alger",
      contact: "023 12 34 56",
      website: "https://yassir.com",
      created_at: "2024-03-05T09:15:00Z"
    },
    {
      company_id: 4,
      company_name: "Cevital",
      email: "rh@cevital.com",
      status: "active",
      is_email_verified: true,
      description: "Premier groupe privé en Algérie, présent dans l'agroalimentaire.",
      sector: "Industrie & Agroalimentaire",
      logo_url: "https://upload.wikimedia.org/wikipedia/fr/0/06/Logo_Cevital.png",
      address: "Bejaia, Algérie",
      contact: "034 21 21 21",
      website: "https://cevital.com",
      created_at: "2024-01-20T11:45:00Z"
    },
    {
      company_id: 5,
      company_name: "ESI (École Nationale Supérieure d'Informatique)",
      email: "partenariat@esi.dz",
      status: "active",
      is_email_verified: true,
      description: "Établissement d'enseignement supérieur formant les ingénieurs d'état en informatique.",
      sector: "Éducation & Recherche",
      logo_url: "https://upload.wikimedia.org/wikipedia/fr/6/63/Logo_ESI_Alg%C3%A9rie.png",
      address: "Oued Smar, Alger",
      contact: "023 93 91 32",
      website: "https://esi.dz",
      created_at: "2023-11-12T08:00:00Z"
    },
    {
      company_id: 6,
      company_name: "Banque d'Algérie",
      email: "rh@bank-of-algeria.dz",
      status: "active",
      is_email_verified: true,
      description: "La banque centrale de l'Algérie.",
      sector: "Finance & Banque",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_Banque_d%27Alg%C3%A9rie.svg",
      address: "Alger Centre, Alger",
      contact: "021 23 00 23",
      website: "https://bank-of-algeria.dz",
      created_at: "2023-12-01T16:20:00Z"
    }
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setCompanies(MOCK_COMPANIES);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "Tous" || company.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const uniqueSectors = ["Tous", ...new Set(companies.map(c => c.sector).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar /> 

      <div className="bg-white border-b border-gray-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Découvrez les entreprises
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mb-8">
            Explorez les entreprises qui recrutent en ce moment.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher par nom, mot-clé..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative md:w-64">
              <Filter className="absolute left-3 top-3 text-slate-400" size={20} />
              <select 
                className="w-full pl-10 pr-8 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                {uniqueSectors.map((sector, index) => (
                  <option key={index} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
           <div className="text-center">Chargement...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              // CHANGED: Using CompanyCard2
              <CompanyCard2 key={company.company_id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
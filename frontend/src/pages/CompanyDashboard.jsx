import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  LogOut, 
  Briefcase, 
  Users, 
  Archive, 
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
// Import the i18n config
import '../i18n';
import CompanyNavbar from '../components/CompanyNavbar';

// --- Sub-Components ---

const StatCard = ({ icon: Icon, iconColor, title, count, buttonText }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
    <div className="flex items-start gap-4 mb-6">
      <div className={`p-3 rounded-lg ${iconColor} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{count}</h3>
      </div>
    </div>
    <button className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg text-sm transition-colors uppercase tracking-wide">
      {buttonText}
    </button>
  </div>
);

const Badge = ({ type, text }) => {
  const styles = {
    yellow: "bg-amber-100 text-amber-700",
    blue: "bg-sky-100 text-sky-700",
    green: "bg-emerald-100 text-emerald-700",
    emerald: "bg-emerald-100 text-emerald-700", // For Active status
    gray: "bg-slate-200 text-slate-600",
    cyan: "bg-cyan-50 text-cyan-600"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[type] || styles.gray}`}>
      {text}
    </span>
  );
};

const AvatarGroup = ({ count, images }) => (
  <div className="flex items-center -space-x-2">
    {images.slice(0, 3).map((img, i) => (
      <img 
        key={i} 
        src={img} 
        alt="User" 
        className="w-8 h-8 rounded-full border-2 border-white object-cover" 
      />
    ))}
    {count > 0 && (
      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
        +{count}
      </div>
    )}
  </div>
);

// --- Main Page ---

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState('fr');

  // Handle RTL for Arabic
  useEffect(() => {
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const changeLanguage = (l) => {
    setLang(l);
    i18n.changeLanguage(l);
  };

  // Mock Data
  const offers = [
    {
      id: 1,
      title: "Ingénieur DevOps Junior",
      date: "25 décembre 2025",
      typeKey: "first_job",
      typeColor: "yellow",
      status: "active",
      candidatesCount: 42,
      avatars: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"]
    },
    {
      id: 2,
      title: "Assistant Ressources Humaines",
      date: "5 novembre 2025",
      typeKey: "pfe",
      typeColor: "blue",
      status: "active",
      candidatesCount: 7,
      avatars: ["https://i.pravatar.cc/150?u=3", "https://i.pravatar.cc/150?u=4"]
    },
    {
      id: 3,
      title: "Développeur Full Stack React/Node",
      date: "10 octobre 2025",
      typeKey: "internship",
      typeColor: "cyan",
      status: "active",
      candidatesCount: 15,
      avatars: ["https://i.pravatar.cc/150?u=5", "https://i.pravatar.cc/150?u=6", "https://i.pravatar.cc/150?u=7"]
    },
    {
      id: 4,
      title: "Designer UI/UX",
      date: "4 avril 2025",
      typeKey: "internship",
      typeColor: "cyan",
      status: "archived",
      candidatesCount: 0, // Should show text "60 Candidats" instead of avatar group in design, handled in render
      totalCandidates: 60,
      avatars: []
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      <CompanyNavbar/>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t('company_hero.greeting', { name: 'SONATRACH' })}
          </h1>
          <p className="text-slate-500">
            {t('company_hero.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={Briefcase} 
            iconColor="bg-slate-700" 
            title={t('stats.active_offers')} 
            count="20" 
            buttonText={t('stats.btn_view')} 
          />
          <StatCard 
            icon={Users} 
            iconColor="bg-emerald-500" 
            title={t('stats.apps_received')} 
            count="148" 
            buttonText={t('stats.btn_manage')} 
          />
          <StatCard 
            icon={Archive} 
            iconColor="bg-blue-400" 
            title={t('stats.archived_offers')} 
            count="20" 
            buttonText={t('stats.btn_history')} 
          />
        </div>

        {/* Recent Offers Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Table Header / Controls */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800">{t('table.title')}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:right-3 rtl:left-auto" />
              <input 
                type="text" 
                placeholder={t('table.search_placeholder')}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64 rtl:pl-4 rtl:pr-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">{t('table.headers.title')}</th>
                  <th className="px-6 py-4 text-center">{t('table.headers.type')}</th>
                  <th className="px-6 py-4 text-center">{t('table.headers.status')}</th>
                  <th className="px-6 py-4">{t('table.headers.candidates')}</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{offer.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {t('table.published_on', { date: offer.date })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge type={offer.typeColor} text={t(`table.badges.${offer.typeKey}`)} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge 
                        type={offer.status === 'active' ? 'emerald' : 'gray'} 
                        text={t(`table.badges.${offer.status}`)} 
                      />
                    </td>
                    <td className="px-6 py-4">
                      {offer.status === 'active' ? (
                        <div className="flex items-center gap-2">
                          <AvatarGroup count={offer.candidatesCount} images={offer.avatars} />
                          {lang !== 'ar' && <span className="text-xs font-semibold text-slate-500">+{offer.candidatesCount}</span>}
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-500">
                          {t('table.candidates_count', { count: offer.totalCandidates })}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right rtl:text-left">
                      <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-4 flex justify-center border-t border-slate-100">
             <button className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:shadow-md">
               {t('table.load_more')}
             </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
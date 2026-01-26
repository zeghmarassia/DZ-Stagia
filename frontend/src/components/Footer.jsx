import React from 'react'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer id='footer' className="bg-slate-950 text-slate-400 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-xl font-black text-white mb-4">STAGIA.</div>
            <p className="max-w-xs mb-6">La plateforme de référence pour les stages, PFE et premiers emplois en Algérie.</p>
            <div className="flex space-x-4">
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer"><Facebook size={16}/></div>
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer"><Linkedin size={16}/></div>
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer"><Twitter size={16}/></div>
               <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer"><Instagram size={16}/></div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Offres</a></li>
              <li><a href="#" className="hover:text-white">Entreprises</a></li>
              <li><a href="#" className="hover:text-white">À Propos</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              <li><a href="#" className="hover:text-white">Conditions</a></li>
              <li><a href="#" className="hover:text-white">Mentions légales</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-center text-xs">
          &copy; <span onClick={()=>navigate('/auth/admin/login')}>2025</span> STAGIA. Tous Droits Réservés.
        </div>
    </footer>
  )
}

export default Footer
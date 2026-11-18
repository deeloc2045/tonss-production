import React from 'react';
import { Film, Sparkles, MapPin, Mail, Phone } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const Footer: React.FC = () => {
  const { settings } = useSiteContent();

  return (
    <footer className="bg-[#090909] border-t border-white/10 text-slate-400 text-xs relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Studio Identity & Mission */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="TONSS PRODUCTION Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-black text-white font-['Montserrat'] tracking-wider uppercase">
                TONSS <span className="gold-text">PRODUCTION</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Studio média hybride basé à Dakar, Sénégal. Nous fusionnons la maestria du récit cinématographique et l&#39;innovation logicielle pour valoriser la culture africaine dans le monde entier.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] gold-text font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full gold-bg"></span>
              <span>Hub Dakar • Projets Internationaux</span>
            </div>
          </div>

          {/* Column 2: Navigation Rapide */}
          <div>
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest font-['Montserrat'] mb-4">
              PÔLES D&#39;ACTIVITÉ
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/cinema-longs-metrages" className="hover:text-[#FFD700] transition-colors flex items-center gap-2">
                  <span className="gold-text">•</span> Cinéma &amp; Longs-Métrages
                </a>
              </li>
              <li>
                <a href="/production-audiovisuelle" className="hover:text-[#FFD700] transition-colors flex items-center gap-2">
                  <span className="gold-text">•</span> Production Audiovisuelle
                </a>
              </li>
              <li>
                <a href="/developpement-applications" className="hover:text-[#FFD700] transition-colors flex items-center gap-2">
                  <span className="gold-text">•</span> Développement d&#39;Applications
                </a>
              </li>
              <li>
                <a href="/streaming-et-cloud" className="hover:text-[#FFD700] transition-colors flex items-center gap-2">
                  <span className="gold-text">•</span> Streaming &amp; Cloud
                </a>
              </li>
              <li>
                <a href="/waaxtu" className="hover:text-[#FFD700] transition-colors flex items-center gap-2">
                  <span className="gold-text">•</span> Plateforme Waaxtu
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-[#FFD700] transition-colors flex items-center gap-2">
                  <span className="gold-text">•</span> Questions Fréquentes (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Studio Info */}
          <div>
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest font-['Montserrat'] mb-4">
              CONTACT &amp; LOCALISATION
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 gold-text shrink-0 mt-0.5" />
                <span>{settings?.contactAddress || "PA1 02 des Parcelles Assainies, Dakar, Sénégal"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 gold-text shrink-0" />
                <a href={`mailto:${settings?.contactEmail?.split('/')[0]?.trim() || "contact@tonssproduction.com"}`} className="hover:text-[#FFD700] transition-colors">
                  {settings?.contactEmail || "contact@tonssproduction.com"}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 gold-text shrink-0" />
                <span>{settings?.contactPhone || "+221 33 843 77 35 / +221 78 012 88 62"}</span>
              </li>
            </ul>

            {/* Social Network Links with dynamic styling */}
            <div className="mt-5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-['Montserrat']">
                REJOIGNEZ LA COMMUNAUTÉ :
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={settings?.socialFacebook || "https://facebook.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#FFD700] hover:border-[#FFD700] transition-all"
                  aria-label="Facebook"
                >
                  <i className="fa-brands fa-facebook-f text-xs"></i>
                </a>
                <a
                  href={settings?.socialInstagram || "https://instagram.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#FFD700] hover:border-[#FFD700] transition-all"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram text-xs"></i>
                </a>
                <a
                  href={settings?.socialTiktok || "https://tiktok.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#FFD700] hover:border-[#FFD700] transition-all"
                  aria-label="TikTok"
                >
                  <i className="fa-brands fa-tiktok text-xs"></i>
                </a>
                <a
                  href={settings?.socialYoutube || "https://youtube.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#FFD700] hover:border-[#FFD700] transition-all"
                  aria-label="YouTube"
                >
                  <i className="fa-brands fa-youtube text-xs"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Bottom Right Logo & Studio Seal (as requested) */}
          <div className="flex flex-col justify-between items-start lg:items-end">
            <div className="text-left lg:text-right">
              <span className="text-[10px] font-bold gold-text uppercase tracking-widest block mb-2 font-['Montserrat']">
                LABEL DE QUALITÉ HYBRIDE
              </span>
              <p className="text-xs text-slate-400 max-w-xs">
                Certifié excellence créative africaine &amp; souveraineté technologique.
              </p>
            </div>

            {/* Requested Logo in bottom right */}
            <a 
              href="#home"
              id="footer-logo-bottom-right"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-6 flex flex-col items-start lg:items-end group p-4 rounded bg-white/5 border border-white/10 hover:border-[#FFD700]/60 transition-all shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded flex items-center justify-center font-['Montserrat'] group-hover:scale-105 transition-transform overflow-hidden">
                  <img src="/logo.png" alt="TONSS PRODUCTION Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-extrabold text-sm text-white tracking-wider font-['Montserrat'] uppercase group-hover:text-[#FFD700] transition-colors">
                  TONSS PRODUCTION
                </span>
              </div>
              <span className="text-[9px] font-mono gold-text tracking-widest uppercase">
                DAKAR • SÉNÉGAL • MONDE
              </span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright and Legal Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} TONSS Production. Tous droits réservés. L&#39;image, le code, la culture africaine réinventée.</p>
          <div className="flex items-center gap-4">
            <a href="#legal" className="hover:text-slate-300 transition-colors">Mentions Légales</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Politique de Confidentialité</a>
            <span>•</span>
            <span className="gold-text font-semibold">Dakar • Sénégal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};


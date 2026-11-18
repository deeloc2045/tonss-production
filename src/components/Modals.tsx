import React, { useState, useEffect } from 'react';
import { ProjectItem } from '../types';
import { VIGNETTE_PROJECTS, DETAILED_PROJECTS } from '../data/tonssData';
import { X, Film, Code, Smartphone, Download, Check, Search, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logActivity } from '../lib/activityLogger';

// Trailer Video Modal
interface TrailerModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        id="trailer-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded bg-[#121212] border border-white/10 shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <div className="p-4 sm:p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded gold-bg text-[#121212] flex items-center justify-center font-bold">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Montserrat'] line-clamp-1 uppercase">
                  {project.title}
                </h3>
                <span className="text-[10px] gold-text font-mono uppercase tracking-wider">
                  {project.badge} • Réalisation : {project.directorOrLead || 'TONSS Studios'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Fermer le lecteur"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video Player Box */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
            <video
              src={project.trailerVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
              poster={project.bannerImage || project.image}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Details & Direct Production Links */}
          <div className="p-5 sm:p-6 bg-[#0d0d0d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
            <div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2">
                {project.fullDesc || project.shortDesc}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-mono">
                <span>Année : {project.year}</span>
                <span>•</span>
                <span>Qualité : 4K HDR DCI</span>
                <span>•</span>
                <span className="gold-text font-semibold">{project.impactMetric || 'Sélection Officielle'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <a
                href="#contact"
                onClick={() => {
                  onClose();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2 rounded gold-bg text-[#121212] font-black text-[10px] uppercase tracking-widest font-['Montserrat'] flex items-center justify-center gap-1.5 shadow-md hover:bg-yellow-400 transition-colors"
              >
                <span>DEMANDER LE MASTER COMPLET</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// App Download / Interactive Demo Modal
interface AppDownloadModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ project, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        id="app-download-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl rounded bg-[#121212] border border-white/10 shadow-[0_0_50px_rgba(255,215,0,0.15)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded gold-bg text-[#121212] flex items-center justify-center font-bold shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Montserrat'] uppercase">
                  {project.title}
                </h3>
                <span className="text-[10px] gold-text font-mono uppercase tracking-wider">
                  {project.appPlatform || 'Multiplateforme'} • Conçu par TONSS Tech
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body: Mockup & Download details */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0d0d0d]">
            
            {/* Phone Screen Simulator / QR */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-48 h-80 rounded-[28px] bg-[#0A0A0A] border-4 border-white/10 shadow-2xl p-2 flex flex-col justify-between overflow-hidden">
                {/* Notch */}
                <div className="w-20 h-3 bg-white/10 rounded-full mx-auto mb-1"></div>
                
                {/* App Screen Content Preview */}
                <div className="flex-1 rounded-xl bg-gradient-to-b from-[#1C1A14] to-[#111] p-3 flex flex-col justify-between border border-[#FFD700]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold gold-text font-['Montserrat']">TONSS APP</span>
                    <span className="text-[8px] text-[#FFD700] font-mono">EN LIGNE</span>
                  </div>

                  <div className="my-auto text-center">
                    <div className="w-12 h-12 rounded-xl gold-bg mx-auto flex items-center justify-center text-[#121212] mb-2 shadow-lg">
                      <Code className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-white font-['Montserrat'] uppercase">{project.title.split(':')[0]}</p>
                    <p className="text-[9px] text-slate-400 mt-1">Dakar Digital Hub</p>
                  </div>

                  <div className="p-2 rounded bg-black/60 text-center">
                    <span className="text-[8px] gold-text font-mono">v3.4 • Fast Mobile Engine</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="w-16 h-1 bg-slate-600 rounded-full mx-auto mt-1"></div>
              </div>
            </div>

            {/* Right: Feature Highlights & Store Buttons */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold gold-text uppercase tracking-widest font-['Montserrat'] block mb-2">
                  SPÉCIFICATIONS TECHNIQUES
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {project.fullDesc || project.shortDesc}
                </p>

                {/* Tech Chips */}
                {project.techStack && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Download CTA Buttons */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleSimulateDownload}
                    className="py-2.5 px-4 rounded gold-bg hover:bg-yellow-400 text-[#121212] text-[10px] font-black font-['Montserrat'] uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4 text-[#121212]" />
                    <span>TÉLÉCHARGER L&#39;APP</span>
                  </button>

                  <a
                    href="#contact"
                    onClick={() => {
                      onClose();
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-2.5 px-4 rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[#FFD700] text-[10px] font-bold font-['Montserrat'] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 gold-text" />
                    <span>DÉPLOYER CHEZ VOUS</span>
                  </a>
                </div>

                {downloadSuccess && (
                  <div className="p-3 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Lien d&#39;installation généré. Téléchargement démarré sur votre appareil.</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Global Search & Live Filter Modal
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allProjects = [...VIGNETTE_PROJECTS, ...DETAILED_PROJECTS];
  const filtered = allProjects.filter((p) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.techStack && p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        id="search-filter-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded bg-[#121212] border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
            <Search className="w-4 h-4 gold-text" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, film, technologie (ex: Flutter, 8K, Dakar, Sabar, SaaS)..."
              className="w-full bg-transparent text-white text-xs focus:outline-none placeholder:text-slate-500 font-['Montserrat']"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 space-y-2.5 bg-[#0d0d0d]">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProject(item);
                    onClose();
                  }}
                  className="p-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700]/60 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-white/10">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors font-['Montserrat'] uppercase">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.shortDesc}</p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono gold-text bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20 shrink-0 uppercase">
                    {item.categoryLabel}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Aucun projet ne correspond à votre recherche « {searchTerm} ».
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Client & Talent Portal Modal
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase non configuré');
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: code,
      });
      if (signInError) throw signInError;
      setIsLogged(true);
      logActivity('login', 'S\'est connecté à l\'Espace Client');
      setTimeout(() => {
        setIsLogged(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError('Identifiant ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        id="login-portal-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded bg-[#121212] border border-white/10 shadow-2xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded gold-bg text-[#121212] flex items-center justify-center font-bold font-['Montserrat']">
                TP
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Montserrat'] uppercase">ESPACE STUDIO</h3>
                <p className="text-[9px] text-slate-400 font-mono uppercase">Clients • Créateurs • Coproducteurs</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest font-['Montserrat'] mb-1">
                Identifiant ou Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partenaire@domaine.sn"
                className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 focus:gold-border text-white text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest font-['Montserrat'] mb-1">
                Code d&#39;accès ou Mot de passe
              </label>
              <input
                type="password"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 focus:gold-border text-white text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded gold-bg hover:bg-yellow-400 text-[#121212] font-black text-xs uppercase tracking-widest font-['Montserrat'] transition-all shadow-md cursor-pointer flex justify-center items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              CONNEXION SÉCURISÉE
            </button>

            {error && (
              <div className="p-3 rounded bg-red-950/80 border border-red-500 text-red-300 text-xs text-center">
                {error}
              </div>
            )}

            {isLogged && (
              <div className="p-3 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs text-center">
                Authentification réussie. Redirection vers votre espace...
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

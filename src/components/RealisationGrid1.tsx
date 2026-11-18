import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { useSiteContent } from '../context/SiteContentContext';
import { Play, Download, Film, Smartphone, Star, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { handleShare } from '../lib/shareHelper';
import { LazyImage } from './LazyImage';

interface RealisationGrid1Props {
  onWatchTrailer: (project: ProjectItem) => void;
  onDownloadApp: (project: ProjectItem) => void;
}

export const RealisationGrid1: React.FC<RealisationGrid1Props> = ({
  onWatchTrailer,
  onDownloadApp
}) => {
  const [filter, setFilter] = useState<'all' | 'cinema' | 'audiovisuel' | 'mobile' | 'tech'>('all');
  const { vignetteProjects } = useSiteContent();

  const filteredProjects = vignetteProjects.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'cinema') return item.category === 'cinema';
    if (filter === 'audiovisuel') return item.category === 'audiovisuel';
    if (filter === 'mobile' || filter === 'tech') return item.category === 'mobile' || item.category === 'tech';
    return true;
  });

  return (
    <section 
      id="audiovisuel" 
      className="py-16 bg-[#121212] border-t border-white/10 relative"
      aria-label="Nos Réalisations - Vignettes Interactives"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.2em] mb-3 font-['Montserrat']">
              <Film className="w-3.5 h-3.5 gold-text" />
              <span>GRILLE 1 • SÉLECTION VIGNETTES INTERACTIVES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-['Montserrat'] tracking-tight uppercase">
              NOS RÉALISATIONS : <span className="gold-text">FILMS &amp; APPS</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mt-2">
              Explorez nos créations cinématographiques primées et nos solutions applicatives déployées à travers l&#39;Afrique.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded text-[10px] font-black tracking-widest font-['Montserrat'] uppercase transition-all cursor-pointer ${
                filter === 'all'
                  ? 'gold-bg text-[#121212] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              TOUS LES PROJETS
            </button>
            <button
              type="button"
              onClick={() => setFilter('cinema')}
              className={`px-3.5 py-1.5 rounded text-[10px] font-black tracking-widest font-['Montserrat'] uppercase transition-all cursor-pointer ${
                filter === 'cinema'
                  ? 'gold-bg text-[#121212] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              CINÉMA &amp; FICTION
            </button>
            <button
              type="button"
              onClick={() => setFilter('mobile')}
              className={`px-3.5 py-1.5 rounded text-[10px] font-black tracking-widest font-['Montserrat'] uppercase transition-all cursor-pointer ${
                filter === 'mobile'
                  ? 'gold-bg text-[#121212] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              APPS &amp; TECH
            </button>
            <button
              type="button"
              onClick={() => setFilter('audiovisuel')}
              className={`px-3.5 py-1.5 rounded text-[10px] font-black tracking-widest font-['Montserrat'] uppercase transition-all cursor-pointer ${
                filter === 'audiovisuel'
                  ? 'gold-bg text-[#121212] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              DOCU &amp; CULTURE
            </button>
          </div>
        </div>

        {/* Dynamic Vignette Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => {
            const isMovie = project.category === 'cinema' || project.category === 'audiovisuel';

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-xl bg-[#161616] border border-white/10 hover:border-[#FFD700]/70 overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.2)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Media Image Container with Lazy Loading & WebP support */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#0D0D0D]">
                  <LazyImage
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/50"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#121212]/85 backdrop-blur-md border border-white/10 text-[#FFD700] text-[9px] font-bold uppercase tracking-widest font-['Montserrat'] flex items-center gap-1.5">
                      {isMovie ? <Film className="w-3 h-3 gold-text" /> : <Smartphone className="w-3 h-3 gold-text" />}
                      {project.badge}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-black/70 text-slate-300 text-[10px] font-mono border border-white/10">
                      {project.year}
                    </span>
                  </div>

                  {/* Center Play/App Icon Hover Cue */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    {isMovie ? (
                      <button
                        type="button"
                        onClick={() => onWatchTrailer(project)}
                        className="w-12 h-12 rounded-full gold-bg flex items-center justify-center text-[#121212] shadow-lg transform scale-90 group-hover:scale-100 transition-transform cursor-pointer"
                        title="Visionner la bande-annonce"
                      >
                        <Play className="w-5 h-5 fill-[#121212] ml-0.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onDownloadApp(project)}
                        className="w-12 h-12 rounded-full gold-bg flex items-center justify-center text-[#121212] shadow-lg transform scale-90 group-hover:scale-100 transition-transform cursor-pointer"
                        title="Télécharger ou tester l'application"
                      >
                        <Download className="w-5 h-5 text-[#121212]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className="gold-text font-bold uppercase tracking-widest text-[10px] font-['Montserrat']">
                        {project.categoryLabel}
                      </span>
                      {project.rating && (
                        <span className="flex items-center gap-1 text-amber-300 text-[11px] font-semibold">
                          <Star className="w-3 h-3 fill-amber-300" />
                          {project.rating}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white font-['Montserrat'] group-hover:text-[#FFD700] transition-colors leading-snug mb-2 uppercase">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 mb-4">
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* Impact Metric & Tech details */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                      <span>{project.directorOrLead}</span>
                      {project.impactMetric && (
                        <span className="gold-text font-semibold">{project.impactMetric}</span>
                      )}
                    </div>

                    {/* Dual Requested Action Buttons: Watch Trailer & Download */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Button Watch Trailer */}
                      <button
                        type="button"
                        id={`btn-trailer-${project.id}`}
                        onClick={() => onWatchTrailer(project)}
                        className="w-full py-2 px-3 rounded bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#FFD700] text-white hover:text-[#FFD700] text-[10px] font-bold tracking-widest font-['Montserrat'] uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                      >
                        <Play className="w-3.5 h-3.5 gold-text fill-[#FFD700]" />
                        <span>WATCH TRAILER</span>
                      </button>

                      {/* Button Download */}
                      <button
                        type="button"
                        id={`btn-download-${project.id}`}
                        onClick={() => onDownloadApp(project)}
                        className="w-full py-2 px-3 rounded gold-bg hover:bg-yellow-400 text-[#121212] text-[10px] font-black tracking-widest font-['Montserrat'] uppercase flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,215,0,0.25)] hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <Download className="w-3.5 h-3.5 text-[#121212]" />
                        <span>DOWNLOAD</span>
                      </button>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mr-auto">Partager :</span>
                      <button 
                        onClick={() => handleShare('whatsapp', project.title)}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/50 flex items-center justify-center text-slate-400 hover:text-[#25D366] transition-colors"
                        title="Partager sur WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleShare('linkedin', project.title)}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 hover:border-[#0A66C2]/50 flex items-center justify-center text-slate-400 hover:text-[#0A66C2] transition-colors"
                        title="Partager sur LinkedIn"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleShare('instagram', project.title)}
                        className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#E1306C]/20 border border-white/10 hover:border-[#E1306C]/50 flex items-center justify-center text-slate-400 hover:text-[#E1306C] transition-colors"
                        title="Copier le lien pour Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};


import React from 'react';
import { ProjectItem } from '../types';
import { useSiteContent } from '../context/SiteContentContext';
import { Code, CheckCircle2, Play, Download, Smartphone, Layers, Award, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { handleShare } from '../lib/shareHelper';
import { LazyImage } from './LazyImage';

interface RealisationGrid2Props {
  onWatchTrailer: (project: ProjectItem) => void;
  onDownloadApp: (project: ProjectItem) => void;
}

export const RealisationGrid2: React.FC<RealisationGrid2Props> = ({
  onWatchTrailer,
  onDownloadApp
}) => {
  const { detailedProjects } = useSiteContent();

  return (
    <section 
      id="cinema" 
      className="py-16 bg-[#090909] border-t border-white/10 relative"
      aria-label="Nos Réalisations - Grandes Cartes Détaillées"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] gold-text font-bold uppercase tracking-widest mb-3 font-['Montserrat']">
            <Layers className="w-3.5 h-3.5" />
            <span>GRILLE 2 • GRANDES CARTES DE PROJETS DÉTAILLÉES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Montserrat'] tracking-tight uppercase">
            PROJETS PHARES : <span className="gold-text">SCÈNES DE FILM &amp; MOCKUPS APPS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-2">
            Plongez au cœur des productions majeures où la direction artistique cinématographique et l&#39;architecture logicielle atteignent leur plus haut niveau d&#39;exigence.
          </p>
        </div>

        {/* Detailed Full-Width Project Cards */}
        <div className="flex flex-col gap-12">
          {detailedProjects.map((project, index) => {
            const isReversed = index % 2 === 1;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className="rounded bg-[#121212] border border-white/10 hover:border-[#FFD700]/60 p-6 sm:p-8 lg:p-10 shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Background ambient gold tint on hover */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FFD700]/10 transition-colors"></div>

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Visual Showcase Side (Film Scenes + App Mockups) */}
                  <div className={`lg:col-span-6 flex flex-col gap-4 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                    
                    {/* Main High Quality Image (Cinema / Scene / Dashboard) */}
                    <div className="relative rounded overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl aspect-[16/10] group/img">
                      <LazyImage
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-all duration-700 ease-out"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Top Label */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded bg-[#121212]/90 backdrop-blur-md border border-white/10 gold-text text-[10px] font-bold font-['Montserrat'] tracking-widest uppercase">
                          {project.badge}
                        </span>
                      </div>

                      {/* Bottom Image Stats Bar */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="bg-black/80 px-2 py-0.5 rounded font-mono border border-white/10 gold-text text-[10px]">
                          {project.year}
                        </span>
                        <span className="bg-black/80 px-2 py-0.5 rounded font-medium text-slate-300 text-[10px]">
                          {project.duration || project.appPlatform}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Dual Mockup Preview Cards (Scenes & UI Frames) */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative rounded overflow-hidden border border-white/10 bg-[#0F0F0F] aspect-video">
                        <LazyImage
                          src={project.bannerImage || project.image}
                          alt="Détail scène & interface"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-[9px] font-bold gold-text bg-black/90 px-2 py-0.5 rounded border border-white/10 uppercase font-['Montserrat']">
                            SCÈNE CINÉMA 4K
                          </span>
                        </div>
                      </div>

                      <div className="relative rounded overflow-hidden border border-white/10 bg-[#0F0F0F] aspect-video flex items-center justify-center p-2 text-center bg-gradient-to-br from-[#1C1A14] to-[#121212]">
                        <div className="flex flex-col items-center gap-1">
                          <Smartphone className="w-4 h-4 gold-text" />
                          <span className="text-[9px] font-bold text-slate-200 uppercase font-['Montserrat']">
                            MOCKUP APP UI
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono">Mobile &amp; Cloud Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content & Technical Breakdown Side */}
                  <div className={`lg:col-span-6 flex flex-col justify-between ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div>
                      {/* Meta Pill */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold gold-text uppercase tracking-widest font-['Montserrat']">
                          {project.categoryLabel}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400">{project.client}</span>
                      </div>

                      {/* Main Title */}
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Montserrat'] leading-tight mb-4 group-hover:text-[#FFD700] transition-colors uppercase">
                        {project.title}
                      </h3>

                      {/* Full Descriptive Text */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                        {project.fullDesc}
                      </p>

                      {/* Key Indicators / Impact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded bg-white/5 border border-white/10">
                        <div className="flex items-start gap-2.5">
                          <Award className="w-4 h-4 gold-text shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block font-['Montserrat'] uppercase tracking-wider">IMPACT &amp; DIFFUSION</span>
                            <span className="text-xs font-semibold text-slate-200">{project.impactMetric}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 gold-text shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block font-['Montserrat'] uppercase tracking-wider">DIRECTION &amp; TECH</span>
                            <span className="text-xs font-semibold text-slate-200">{project.directorOrLead}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack & Pipeline Tags */}
                      {project.techStack && (
                        <div className="mb-8">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] block mb-2">
                            PIPELINE TECHNIQUE &amp; TECHNOLOGIES :
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono flex items-center gap-1.5"
                              >
                                <Code className="w-3 h-3 gold-text" />
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => onWatchTrailer(project)}
                        className="px-4 py-2.5 rounded bg-white/5 hover:bg-white/10 text-white hover:text-[#FFD700] border border-white/10 hover:border-[#FFD700] text-[10px] font-bold tracking-widest font-['Montserrat'] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 gold-text fill-[#FFD700]" />
                        <span>VOIR EXTRAIT &amp; TRAILER</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDownloadApp(project)}
                        className="px-4 py-2.5 rounded gold-bg hover:bg-yellow-400 text-[#121212] text-[10px] font-black tracking-widest font-['Montserrat'] uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.35)] cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#121212]" />
                        <span>EXPLORER LA SOLUTION</span>
                      </button>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-auto">Partager ce projet :</span>
                      <button 
                        onClick={() => handleShare('whatsapp', project.title)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/50 flex items-center justify-center text-slate-400 hover:text-[#25D366] transition-colors"
                        title="Partager sur WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleShare('linkedin', project.title)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 hover:border-[#0A66C2]/50 flex items-center justify-center text-slate-400 hover:text-[#0A66C2] transition-colors"
                        title="Partager sur LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleShare('instagram', project.title)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#E1306C]/20 border border-white/10 hover:border-[#E1306C]/50 flex items-center justify-center text-slate-400 hover:text-[#E1306C] transition-colors"
                        title="Copier le lien pour Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


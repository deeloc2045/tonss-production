import React from 'react';
import { Film, Code, Sparkles, Play, ArrowRight, Layers, Smartphone, Award, Globe2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroSectionProps {
  onDiscoverProductions: () => void;
  onDiscoverTech: () => void;
  onOpenContact: () => void;
  onOpenShowreel: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onDiscoverProductions,
  onDiscoverTech,
  onOpenContact,
  onOpenShowreel
}) => {
  const { settings } = useSiteContent();

  const bgImage = settings?.heroBgImage || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop";

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#121212]"
      aria-label="Hero Section TONSS Production"
    >
      {/* Background Cinematic Image with Deep Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url("${bgImage}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/70 to-[#121212] backdrop-blur-[2px]"></div>
        
        {/* Subtle glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFD700]/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center pt-24 pb-16">
        
        {/* Top Hybrid Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl mb-8"
        >
          <span className="w-2 h-2 rounded-full gold-bg animate-pulse"></span>
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white font-['Montserrat']">
            {settings?.heroBadge || "STUDIO MÉDIA HYBRIDE • DAKAR, SÉNÉGAL"}
          </span>
        </motion.div>

        {/* Main Bold Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white font-['Montserrat'] leading-[1.1] mb-8 max-w-5xl uppercase"
        >
          {settings?.heroTitle ? (
            <span>{settings.heroTitle}</span>
          ) : (
            <>
              L&#39;IMAGE, LE CODE, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFEA70]">LA CULTURE AFRICAINE</span> <span className="italic font-light">RÉINVENTÉE.</span>
            </>
          )}
        </motion.h1>

        {/* Description Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-3xl mb-12 text-center"
        >
          {settings?.heroSubtitle || "Tonss Production est un studio d'excellence fusionnant création cinématographique et ingénierie logicielle. Nous racontons des histoires à fort impact culturel tout en concevant des expériences digitales modernes."}
        </motion.p>

        {/* Premium CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto mb-20"
        >
          <button
            type="button"
            id="btn-hero-showreel"
            onClick={onOpenShowreel}
            className="w-full sm:w-auto px-8 py-4 rounded gold-bg hover:bg-yellow-400 text-[#121212] font-black text-sm tracking-widest font-['Montserrat'] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-4 h-4 text-[#121212] fill-[#121212]" />
            <span>LANCER LE SHOWREEL</span>
          </button>

          <button
            type="button"
            id="btn-hero-productions"
            onClick={onDiscoverProductions}
            className="w-full sm:w-auto px-8 py-4 rounded bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/20 hover:border-[#FFD700]/50 font-bold text-sm tracking-widest font-['Montserrat'] uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>DÉCOUVRIR LE PORTFOLIO</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform gold-text" />
          </button>
        </motion.div>

        {/* Clean, spacious features row instead of dashboard boxes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl pt-12 border-t border-white/10"
        >
          <a href="#cinema" onClick={(e) => { e.preventDefault(); document.querySelector('#cinema')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex flex-col items-center group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#FFD700]/50 group-hover:scale-110 transition-all">
              <Film className="w-5 h-5 gold-text" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat'] mb-2 group-hover:text-[#FFD700] transition-colors">Cinéma 4K &amp; 8K</h3>
            <p className="text-xs text-slate-400 font-light max-w-[200px]">Productions fictions, documentaires et publicités haut de gamme.</p>
          </a>

          <a href="#tech" onClick={(e) => { e.preventDefault(); document.querySelector('#tech')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex flex-col items-center group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#FFD700]/50 group-hover:scale-110 transition-all">
              <Code className="w-5 h-5 gold-text" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat'] mb-2 group-hover:text-[#FFD700] transition-colors">Ingénierie Tech</h3>
            <p className="text-xs text-slate-400 font-light max-w-[200px]">Développement sur-mesure d&#39;applications web et plateformes cloud.</p>
          </a>

          <a href="#culture" onClick={(e) => { e.preventDefault(); document.querySelector('#culture')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex flex-col items-center group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#FFD700]/50 group-hover:scale-110 transition-all">
              <Globe2 className="w-5 h-5 gold-text" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat'] mb-2 group-hover:text-[#FFD700] transition-colors">Impact Culturel</h3>
            <p className="text-xs text-slate-400 font-light max-w-[200px]">Valorisation du patrimoine et rayonnement des récits africains.</p>
          </a>
        </motion.div>

      </div>
    </section>
  );
};


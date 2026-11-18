import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { Film, Code, Sparkles, Globe, Compass, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export const CultureSection: React.FC = () => {
  const { values, settings } = useSiteContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera':
        return <Film className="w-5 h-5 gold-text" />;
      case 'code':
        return <Code className="w-5 h-5 gold-text" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 gold-text" />;
      case 'globe':
        return <Globe className="w-5 h-5 gold-text" />;
      default:
        return <Compass className="w-5 h-5 gold-text" />;
    }
  };

  return (
    <section 
      id="culture" 
      className="py-16 bg-[#0d0d0d] border-t border-white/10 relative overflow-hidden"
      aria-label="Notre Vision & Culture"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] gold-text font-bold uppercase tracking-widest mb-3 font-['Montserrat']">
            <Compass className="w-3.5 h-3.5" />
            <span>L&#39;ÂME DU STUDIO • DAKAR &amp; AFRIQUE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Montserrat'] tracking-tight mb-4 uppercase">
            LA CULTURE AFRICAINE : <span className="gold-text">SOURCE DE RÉCIT &amp; MOTEUR D&#39;INNOVATION</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Nous croyons que l&#39;Afrique ne doit pas seulement consommer les technologies et les images mondiales, mais concevoir ses propres récits visuels et bâtir ses architectures numériques souveraines.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {values.map((val, idx) => (
            <motion.div
              key={val.id || val.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded bg-[#121212] border border-white/10 hover:border-[#FFD700]/60 transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]"
            >
              <div>
                <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {getIcon(val.icon)}
                </div>

                <h3 className="text-sm font-bold text-white font-['Montserrat'] mb-2 group-hover:text-[#FFD700] transition-colors uppercase">
                  {val.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {val.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono gold-text">
                <span>PILIER 0{idx + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full gold-bg"></span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cultural Quote Banner */}
        <div className="rounded bg-white/5 border border-white/10 p-6 sm:p-8 text-center flex flex-col items-center">
          <Flame className="w-5 h-5 gold-text mb-3" />
          <blockquote className="text-sm sm:text-base text-slate-300 italic max-w-3xl leading-relaxed mb-3">
            {settings?.manifestoQuote || "« Tant que les lions n'auront pas leurs propres historiens, les histoires de chasse continueront de glorifier le chasseur. À TONSS Production, nous donnons la caméra et le code aux créateurs africains. »"}
          </blockquote>
          <p className="text-[10px] font-bold gold-text uppercase tracking-widest font-['Montserrat']">
            MANIFESTE TONSS PRODUCTION • DAKAR
          </p>
        </div>

      </div>
    </section>
  );
};


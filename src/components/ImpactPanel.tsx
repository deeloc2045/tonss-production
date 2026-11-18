import React from 'react';
import { getInitials } from '../lib/utils';
import { useSiteContent } from '../context/SiteContentContext';
import { Clapperboard, Users, Award, Globe, Cpu, Sparkles, TrendingUp, Quote, CheckCircle, BarChart3, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const ImpactPanel: React.FC = () => {
  const { kpis, stories } = useSiteContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clapperboard': return <Clapperboard className="w-6 h-6 gold-text" />;
      case 'users': return <Users className="w-6 h-6 gold-text" />;
      case 'award': return <Award className="w-6 h-6 gold-text" />;
      case 'globe': return <Globe className="w-6 h-6 gold-text" />;
      case 'cpu': return <Cpu className="w-6 h-6 gold-text" />;
      default: return <Sparkles className="w-6 h-6 gold-text" />;
    }
  };

  return (
    <section 
      id="tech" 
      className="py-24 bg-[#050505] relative overflow-hidden"
      aria-label="Panneau Notre Impact et Indicateurs Clés"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <BarChart3 className="w-4 h-4 gold-text" />
            <span>IMPACT &amp; PERFORMANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Montserrat'] tracking-tight uppercase mb-6">
            NOS CHIFFRES <span className="gold-text">PARLENT D'EUX-MÊMES</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 font-light">
            Des métriques concrètes démontrant l&#39;impact culturel et la robustesse technologique de nos réalisations à Dakar et à l&#39;international.
          </p>
        </div>

        {/* Spacious KPI Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {kpis.map((kpi, idx) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 group-hover:scale-110 group-hover:border-[#FFD700]/50 transition-all duration-300">
                {getIcon(kpi.iconName)}
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white font-['Montserrat'] tracking-tight mb-2 group-hover:text-[#FFD700] transition-colors">
                {kpi.value}
              </div>
              <h3 className="text-xs uppercase font-bold tracking-[0.2em] font-['Montserrat'] mb-3 text-slate-300">
                {kpi.label}
              </h3>
              <p className="text-sm text-slate-400 font-light max-w-[240px] mx-auto">
                {kpi.subtext}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Success Stories Grid (3 columns) */}
        <div className="pt-16 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <h3 className="text-2xl font-black text-white uppercase font-['Montserrat']">
              TÉMOIGNAGES <span className="gold-text">&amp; SUCCÈS</span>
            </h3>
            <a href="#contact" className="text-sm font-bold gold-text uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
              Démarrer un projet <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.slice(0, 3).map((story, idx) => (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="p-8 rounded bg-white/[0.02] border border-white/5 hover:border-[#FFD700]/30 transition-colors flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] gold-text font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded">
                    {story.category}
                  </span>
                  <Quote className="w-6 h-6 text-white/10" />
                </div>

                <h4 className="text-lg font-bold text-white font-['Montserrat'] mb-4 uppercase">
                  {story.client}
                </h4>

                <p className="text-sm text-slate-300 font-light leading-relaxed mb-8 flex-grow">
                  « {story.quote} »
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] text-[10px] font-bold font-['Montserrat']">
                      {getInitials(story.author)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{story.author}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest">{story.role}</div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};


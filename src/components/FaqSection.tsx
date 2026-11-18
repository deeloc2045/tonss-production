import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  ChevronDown, 
  Film, 
  Cpu, 
  Clock, 
  Search, 
  X, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';
import { FaqItem } from '../types';

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-formats-audiovisuels',
    question: "Quels types de formats audiovisuels prenez-vous en charge ?",
    answer: "TONSS Production prend en charge l'ensemble du cycle de réalisation audiovisuelle : longs et courts-métrages de cinéma, séries télévisées, documentaires patrimoniaux et d'investigation, spots publicitaires de prestige, clips musicaux conceptuels et captations multicaméras d'événements majeurs. Nos équipes tournent en 4K/8K Cinema RAW avec des optiques anamorphiques de pointe et appliquent un étalonnage colorimétrique de standard international.",
    category: 'production',
    categoryLabel: 'Production & Cinéma',
    iconName: 'film'
  },
  {
    id: 'faq-solutions-tech',
    question: "Quels types de solutions logicielles et digitales développez-vous ?",
    answer: "Notre pôle d'ingénierie logicielle conçoit des plateformes de streaming vidéo et audio haute disponibilité, des applications mobiles natives et cross-platform (iOS et Android avec Flutter / React Native), des architectures cloud scalables (GCP, Firebase, AWS), des billetteries connectées avec QR code infalsifiable, ainsi que des automatisations intelligentes intégrant l'IA générative pour accélérer vos processus métiers.",
    category: 'tech',
    categoryLabel: 'Solutions Technologiques',
    iconName: 'cpu'
  },
  {
    id: 'faq-post-production-seule',
    question: "Pouvez-vous intervenir uniquement sur la post-production ou le sound design ?",
    answer: "Absolument. Si vos prises de vue sont déjà effectuées, nos laboratoires de post-production à Dakar prennent le relais de manière chirurgicale : montage narratif dynamique, étalonnage cinématique avancé (DaVinci Resolve Studio), composition musicale originale sur-mesure, design sonore immersif surround 5.1/7.1, mixage pour les standards cinéma (DCP) et effets visuels (VFX / Motion Design).",
    category: 'production',
    categoryLabel: 'Production & Cinéma',
    iconName: 'film'
  },
  {
    id: 'faq-securite-scalabilite',
    question: "Comment garantissez-vous la sécurité et la scalabilité de vos plateformes web et mobiles ?",
    answer: "Toutes nos applications reposent sur des infrastructures cloud mondiales avec répartition de charge (CDN), chiffrement intégral SSL/TLS et conformité rigoureuse aux normes de protection des données (RGPD et législation sénégalaise CDP). Nous réalisons des tests de charge continus afin d'assurer une disponibilité de 99,9% même lors de pics de trafic massifs (sorties de films, diffusions live ou campagnes virales).",
    category: 'tech',
    categoryLabel: 'Solutions Technologiques',
    iconName: 'cpu'
  },
  {
    id: 'faq-methodologie-hybride',
    question: "Qu'est-ce qui différencie TONSS Production d'une agence classique ou d'une simple société de production ?",
    answer: "Notre statut de Studio Média Hybride unique en Afrique de l'Ouest. Nous ne séparons pas le récit artistique de la puissance technologique : lorsque nous produisons un film ou un contenu culturel, nous concevons simultanément l'écosystème numérique (application mobile, plateforme VOD, campagne interactive) qui maximisera son audience et sa monétisation.",
    category: 'process',
    categoryLabel: 'Méthodologie & Devis',
    iconName: 'sparkles'
  },
  {
    id: 'faq-delais-projets',
    question: "Quels sont les délais moyens de réalisation pour un projet ?",
    answer: "Les délais dépendent de l'envergure du projet : 2 à 4 semaines pour un spot publicitaire ou un prototype / MVP d'application ; 6 à 12 semaines pour une plateforme web/mobile d'envergure ou un documentaire complet ; et 4 à 9 mois pour un long-métrage ou une série de fiction. Un rétroplanning jalonné avec livrables précis vous est fourni dès la validation du cadrage.",
    category: 'process',
    categoryLabel: 'Méthodologie & Devis',
    iconName: 'clock'
  },
  {
    id: 'faq-tarifs-devis',
    question: "Comment obtenir un devis personnalisé et quel est votre modèle de tarification ?",
    answer: "Chaque projet fait l'objet d'une estimation budgétaire détaillée et transparente après analyse de vos besoins. Vous pouvez déposer une demande via notre formulaire de contact ou par WhatsApp. Notre équipe de production et nos architectes tech vous recontactent sous 24h ouvrées pour planifier un atelier de qualification et vous transmettre une proposition forfaitaire clé en main.",
    category: 'process',
    categoryLabel: 'Méthodologie & Devis',
    iconName: 'sparkles'
  },
  {
    id: 'faq-maintenance-support',
    question: "Proposez-vous une maintenance et un accompagnement après la livraison ?",
    answer: "Oui, nous proposons des contrats de Tierce Maintenance Applicative (TMA) incluant une surveillance 24/7 de vos serveurs, la résolution prioritaire d'incidents, l'adaptation aux nouvelles versions d'iOS et Android, et des évolutions fonctionnelles continues pour que vos plateformes restent toujours à la pointe de l'industrie.",
    category: 'tech',
    categoryLabel: 'Solutions Technologiques',
    iconName: 'cpu'
  },
  {
    id: 'faq-international-droits',
    question: "Intervenez-vous à l'international et comment sont gérés les droits de propriété intellectuelle ?",
    answer: "Nos équipes se déplacent régulièrement à travers l'Afrique de l'Ouest, l'Afrique Centrale, l'Europe et les États-Unis pour des tournages et audits techniques. Concernant les droits, toutes nos prestations font l'objet d'un contrat clair garantissant la cession des droits patrimoniaux convenus pour les œuvres audiovisuelles et la pleine propriété du code source pour les développements logiciels.",
    category: 'production',
    categoryLabel: 'Production & Cinéma',
    iconName: 'film'
  }
];

type CategoryFilter = 'all' | 'production' | 'tech' | 'process';

export const FaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-formats-audiovisuels', 'faq-solutions-tech']);

  const toggleItem = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(filteredFaqs.map(item => item.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const matchSearch = !normalizedQuery || 
        item.question.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery) ||
        item.categoryLabel.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'production':
        return <Film className="w-4 h-4 gold-text shrink-0" />;
      case 'tech':
        return <Cpu className="w-4 h-4 gold-text shrink-0" />;
      case 'process':
        return <Clock className="w-4 h-4 gold-text shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 gold-text shrink-0" />;
    }
  };

  return (
    <section 
      id="faq" 
      className="py-24 bg-[#080808] border-t border-b border-white/5 relative overflow-hidden"
      aria-label="Foire Aux Questions TONSS Production"
    >
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <HelpCircle className="w-4 h-4 gold-text" />
            <span>QUESTIONS FRÉQUENTES</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Montserrat'] tracking-tight uppercase mb-5">
            TOUT CE QUE VOUS DEVEZ SAVOIR <span className="gold-text">SUR NOS SERVICES</span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-400 font-light max-w-2xl mx-auto">
            Découvrez comment nous combinons la création cinématographique de haut vol et l'ingénierie logicielle pour propulser vos projets à Dakar et à l'échelle internationale.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-10 space-y-4">
          
          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une question (ex: devis, 4K, application, délais...)"
              className="w-full bg-[#121212] text-white text-xs sm:text-sm pl-11 pr-10 py-3.5 rounded-xl border border-white/10 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                id="faq-clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs & Expand/Collapse Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Catégories FAQ">
              <button
                type="button"
                id="faq-tab-all"
                role="tab"
                aria-selected={activeCategory === 'all'}
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === 'all'
                    ? 'bg-[#FFD700] text-black shadow-md font-bold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                Toutes ({FAQ_DATA.length})
              </button>
              
              <button
                type="button"
                id="faq-tab-production"
                role="tab"
                aria-selected={activeCategory === 'production'}
                onClick={() => setActiveCategory('production')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                  activeCategory === 'production'
                    ? 'bg-[#FFD700] text-black shadow-md font-bold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Production &amp; Cinéma</span>
              </button>

              <button
                type="button"
                id="faq-tab-tech"
                role="tab"
                aria-selected={activeCategory === 'tech'}
                onClick={() => setActiveCategory('tech')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                  activeCategory === 'tech'
                    ? 'bg-[#FFD700] text-black shadow-md font-bold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Solutions Tech</span>
              </button>

              <button
                type="button"
                id="faq-tab-process"
                role="tab"
                aria-selected={activeCategory === 'process'}
                onClick={() => setActiveCategory('process')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                  activeCategory === 'process'
                    ? 'bg-[#FFD700] text-black shadow-md font-bold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Méthodologie &amp; Devis</span>
              </button>
            </div>

            {/* Expand / Collapse Actions */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <button
                type="button"
                id="faq-btn-expand-all"
                onClick={expandAll}
                className="hover:text-[#FFD700] transition-colors underline-offset-4 hover:underline"
              >
                Tout déplier
              </button>
              <span className="text-white/20">•</span>
              <button
                type="button"
                id="faq-btn-collapse-all"
                onClick={collapseAll}
                className="hover:text-[#FFD700] transition-colors underline-offset-4 hover:underline"
              >
                Tout replier
              </button>
            </div>

          </div>

        </div>

        {/* Accordions List */}
        <div className="space-y-3.5" id="faq-accordions-container">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id);

              return (
                <motion.div
                  key={faq.id}
                  id={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'bg-[#121212] border-[#FFD700]/40 shadow-lg shadow-black/40' 
                      : 'bg-[#0e0e0e] border-white/5 hover:border-white/15'
                  }`}
                >
                  <button
                    type="button"
                    id={`faq-btn-toggle-${faq.id}`}
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full text-left px-5 sm:px-6 py-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-3.5 flex-grow pr-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-[#FFD700]/15 text-[#FFD700]' : 'bg-white/5 text-slate-400 group-hover:text-white'
                      }`}>
                        {getCategoryIcon(faq.category)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFD700]/80">
                            {faq.categoryLabel}
                          </span>
                        </div>
                        <h3 className={`text-sm sm:text-base font-bold font-['Montserrat'] transition-colors ${
                          isOpen ? 'text-[#FFD700]' : 'text-white group-hover:text-[#FFD700]'
                        }`}>
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen 
                        ? 'bg-[#FFD700] border-[#FFD700] text-black rotate-180' 
                        : 'border-white/10 text-slate-400 group-hover:border-white/30 group-hover:text-white'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        role="region"
                        aria-labelledby={`faq-btn-toggle-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed pl-16">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4 rounded-xl bg-white/[0.02] border border-white/5">
              <Search className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-white font-bold text-sm mb-1">Aucune question ne correspond à votre recherche</p>
              <p className="text-slate-400 text-xs mb-4">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
              <button
                type="button"
                id="faq-btn-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Direct Contact CTA Card */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#141414] via-[#101010] to-[#141414] border border-[#FFD700]/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 gold-text" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white uppercase font-['Montserrat'] tracking-wide">
                Vous avez une question spécifique ou un projet sur-mesure ?
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Nos producteurs exécutifs et directeurs technologiques vous répondent en moins de 24 heures.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            id="faq-btn-ask-custom-question"
            className="shrink-0 px-6 py-3 rounded-lg bg-[#FFD700] hover:bg-[#e6c200] text-black font-['Montserrat'] text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#FFD700]/10 cursor-pointer"
          >
            <span>Poser ma question</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

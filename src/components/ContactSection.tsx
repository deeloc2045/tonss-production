import React, { useState } from 'react';
import { Send, Mail, User, Phone, MapPin, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactFormData } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSiteContent } from '../context/SiteContentContext';

export const ContactSection: React.FC = () => {
  const { settings } = useSiteContent();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: 'Production Cinéma & Long-Métrage',
    budget: '5M - 20M FCFA',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Sauvegarde dans Supabase
      if (isSupabaseConfigured) {
        const { error: insertError } = await supabase.from('contacts').insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          service: formData.service,
          budget: formData.budget || '',
          message: formData.message,
        });
        if (insertError) throw insertError;
      }
      
      // 2. Notification par email via le serveur SMTP
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (mailErr) {
        console.warn("Notice: notification email non envoyée (vérifiez le SMTP):", mailErr);
      }
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Production Cinéma & Long-Métrage',
        budget: '5M - 20M FCFA',
        message: ''
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-20 bg-[#0d0d0d] border-t border-white/10 relative overflow-hidden"
      aria-label="Section Contact TONSS Production"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Pitch & Studio Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.2em] mb-3 font-['Montserrat']">
                <Sparkles className="w-3.5 h-3.5 gold-text" />
                <span>COMMENÇONS VOTRE PROJET</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white font-['Montserrat'] tracking-tight mb-4 uppercase">
                PARLONS DE VOTRE <br />
                <span className="gold-text">PROJET HYBRIDE</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 border-l-2 gold-border pl-4">
                Que vous ayez un scénario de film à produire, une campagne audiovisuelle de marque ou une application web/mobile à développer, notre équipe à Dakar est à votre écoute.
              </p>

              {/* Direct Info List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5 p-3.5 rounded bg-white/5 border border-white/10">
                  <MapPin className="w-5 h-5 gold-text shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-200 font-['Montserrat'] uppercase tracking-wider">Studio &amp; Siège</h3>
                    <p className="text-xs text-slate-400">{settings?.contactAddress || "PA1 02 des Parcelles Assainies, Dakar, Sénégal"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded bg-white/5 border border-white/10">
                  <Mail className="w-5 h-5 gold-text shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-200 font-['Montserrat'] uppercase tracking-wider">Email Professionnel</h3>
                    <p className="text-xs text-slate-400">contact@tonssproduction.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded bg-white/5 border border-white/10">
                  <Phone className="w-5 h-5 gold-text shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-200 font-['Montserrat'] uppercase tracking-wider">Ligne Directe Studio</h3>
                    <p className="text-xs text-slate-400">+221 33 843 77 35 / +221 78 012 88 62</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded bg-white/5 border border-white/10">
                  <Clock className="w-5 h-5 gold-text shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-200 font-['Montserrat'] uppercase tracking-wider">Temps de Réponse</h3>
                    <p className="text-xs text-slate-400">Réponse de nos directeurs de production sous 24h ouvrées</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Badge */}
            <div className="p-4 rounded bg-white/5 border-l-2 gold-border border border-white/10 text-xs text-slate-400">
              <span className="gold-text font-bold">Teranga Garantie :</span> Chaque proposition fait l&#39;objet d&#39;un cadrage technique et artistique sur mesure.
            </div>
          </div>

          {/* Right Column: Elegant Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass rounded border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl relative">
              
              <h3 className="text-xl sm:text-2xl font-black text-white font-['Montserrat'] mb-2 uppercase">
                Envoyez-nous votre brief
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Remplissez les champs ci-dessous pour planifier une session de cadrage.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" id="tonss-contact-form">
                
                {/* Field: Nom */}
                <div>
                  <label htmlFor="contact-name" className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                    Nom &amp; Prénom *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="contact-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Cheikh Anta Diop"
                      className="w-full pl-10 pr-4 py-3 rounded bg-white/5 border border-white/10 focus:gold-border text-white text-sm placeholder:text-slate-600 transition-colors focus:outline-none"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Field: Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                    Adresse Email Professionnelle *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="contact-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ex: contact@votre-entreprise.com"
                      className="w-full pl-10 pr-4 py-3 rounded bg-white/5 border border-white/10 focus:gold-border text-white text-sm placeholder:text-slate-600 transition-colors focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Field: Service Dropdown Menu */}
                <div>
                  <label htmlFor="contact-service" className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                    Service / Type de Projet Recherché *
                  </label>
                  <select
                    id="contact-service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded bg-[#161616] border border-white/10 focus:gold-border text-white text-sm transition-colors focus:outline-none"
                  >
                    <option value="Production Cinéma & Long-Métrage">Production Cinéma &amp; Long-Métrage (Fiction / 4K / 8K)</option>
                    <option value="Création Audiovisuelle & Publicité">Création Audiovisuelle, Spot Publicitaire &amp; Clip</option>
                    <option value="Application Mobile (iOS & Android)">Développement Application Mobile (iOS &amp; Android)</option>
                    <option value="Plateforme Web, SaaS & E-Commerce">Plateforme Web Moderne, SaaS &amp; Cloud</option>
                    <option value="Expérience Immersive 3D & VR">Expérience Immersive 3D, WebGL &amp; Réalité Virtuelle</option>
                    <option value="Projet Hybride Multimédia">Projet Hybride Complet (Film + Solution Tech)</option>
                    <option value="Autre Demande Spécifique">Autre Collaboration / Partenariat Institutionnel</option>
                  </select>
                </div>

                {/* Field: Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                    Détails du Message &amp; Objectifs *
                  </label>
                  <div className="relative">
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre vision, vos délais et vos besoins artistiques ou technologiques..."
                      className="w-full p-4 rounded bg-white/5 border border-white/10 focus:gold-border text-white text-sm placeholder:text-slate-600 transition-colors focus:outline-none resize-y"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button on requested gold-yellow background */}
                <button
                  type="submit"
                  id="btn-contact-submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded gold-bg hover:bg-yellow-400 text-[#121212] font-black text-xs tracking-widest font-['Montserrat'] uppercase flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(255,215,0,0.35)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFD700] disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin"></div>
                      <span>TRANSMISSION EN COURS...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#121212]" />
                      <span>ENVOYER</span>
                    </>
                  )}
                </button>

                {/* Feedback Toast */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 flex items-center gap-3 text-xs"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-bold">Message transmis avec succès à TONSS Production !</p>
                        <p className="text-[11px] text-emerald-400">Notre équipe de production et nos architectes tech vous contacteront sous 24h.</p>
                      </div>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-300 flex items-center gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold">Erreur de transmission</p>
                        <p className="text-[11px] text-red-400">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

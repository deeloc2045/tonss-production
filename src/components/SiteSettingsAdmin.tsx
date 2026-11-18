import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { mapSettingsToRow } from '../lib/supabaseMappers';
import { processAndUploadFile, ensureCompressedDataUrl } from '../lib/mediaUpload';
import { useSiteContent, SiteSettings, DEFAULT_SITE_SETTINGS } from '../context/SiteContentContext';
import { Settings, Save, Loader2, Check, Sparkles, Globe, Mail, Phone, MessageSquare, Play, Video, Share2, Image as ImageIcon } from 'lucide-react';

export const SiteSettingsAdmin: React.FC = () => {
  const { settings, refreshContent } = useSiteContent();
  const [formData, setFormData] = useState<SiteSettings>(settings || DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await processAndUploadFile(file, 'site');
      handleChange('heroBgImage', res.url);
    } catch (err) {
      console.warn("Upload error:", err);
      alert("Erreur lors de l'upload de l'image. Vérifiez votre connexion ou utilisez une URL directe.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const sanitizedHeroBg = await ensureCompressedDataUrl(formData.heroBgImage || '');
      const settingsRow = mapSettingsToRow({
        ...formData,
        heroBgImage: sanitizedHeroBg,
      });
      const { error } = await supabase
        .from('site_settings')
        .upsert(settingsRow, { onConflict: 'id' });

      if (error) throw error;

      await refreshContent();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving site settings:", err);
      alert("Erreur lors de l'enregistrement des paramètres généraux.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#121212] p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center text-[#121212] font-black">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-['Montserrat']">
              Contenus du Site, Textes &amp; Coordonnées
            </h2>
            <p className="text-xs text-slate-400">
              Modifiez en temps réel les textes de la page d'accueil, coordonnées de contact et réseaux sociaux
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFD700] hover:bg-yellow-400 text-[#121212] rounded text-xs font-black uppercase tracking-widest font-['Montserrat'] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] disabled:opacity-75"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
          <span>{success ? 'Enregistré !' : 'Enregistrer Tout'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Hero Banner & Titres */}
        <div className="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Play className="w-4 h-4 text-[#FFD700]" />
            <h3 className="text-sm font-bold text-white uppercase font-['Montserrat']">
              Section Héro (En-tête Principal)
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Badge du Héro
              </label>
              <input
                type="text"
                value={formData.heroBadge || ''}
                onChange={(e) => handleChange('heroBadge', e.target.value)}
                placeholder="STUDIO MÉDIA HYBRIDE • DAKAR, SÉNÉGAL"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Titre Principal (H1)
              </label>
              <input
                type="text"
                value={formData.heroTitle || ''}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="L'IMAGE, LE CODE, LA CULTURE AFRICAINE RÉINVENTÉE."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Sous-titre / Accroche du Studio
              </label>
              <textarea
                rows={3}
                value={formData.heroSubtitle || ''}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                placeholder="Tonss Production est un studio d'excellence fusionnant création cinématographique et ingénierie logicielle..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  URL Vidéo Showreel (Bouton « Voir le Showreel »)
                </label>
                <input
                  type="url"
                  value={formData.heroShowreelUrl || ''}
                  onChange={(e) => handleChange('heroShowreelUrl', e.target.value)}
                  placeholder="https://commondatastorage.googleapis.com/... ou YouTube"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  Arrière-Plan Héro (Image Haute Résolution)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.heroBgImage || ''}
                    onChange={(e) => handleChange('heroBgImage', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                  <input
                    ref={heroImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => heroImageInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    title="Uploader une image locale vers Supabase Storage"
                  >
                    {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    <span>{uploadingImage ? 'Upload...' : 'Uploader'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Coordonnées */}
        <div className="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Mail className="w-4 h-4 text-[#FFD700]" />
            <h3 className="text-sm font-bold text-white uppercase font-['Montserrat']">
              Coordonnées Officielles &amp; WhatsApp
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Adresses Email de Contact
              </label>
              <input
                type="text"
                value={formData.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="contact@tonssproduction.com"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Numéros de Téléphone
              </label>
              <input
                type="text"
                value={formData.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+221 33 843 77 35 / +221 78 012 88 62"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Numéro WhatsApp (sans le +, avec indicatif pays)
              </label>
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="221780128862"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Adresse Physique du Studio
              </label>
              <input
                type="text"
                value={formData.contactAddress || ''}
                onChange={(e) => handleChange('contactAddress', e.target.value)}
                placeholder="PA1 02 des Parcelles Assainies"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Réseaux Sociaux */}
        <div className="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Share2 className="w-4 h-4 text-[#FFD700]" />
            <h3 className="text-sm font-bold text-white uppercase font-['Montserrat']">
              Liens Réseaux Sociaux &amp; Diffusion
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={formData.socialFacebook || ''}
                onChange={(e) => handleChange('socialFacebook', e.target.value)}
                placeholder="https://facebook.com/tonssproduction"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={formData.socialInstagram || ''}
                onChange={(e) => handleChange('socialInstagram', e.target.value)}
                placeholder="https://instagram.com/tonssproduction"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                TikTok
              </label>
              <input
                type="url"
                value={formData.socialTiktok || ''}
                onChange={(e) => handleChange('socialTiktok', e.target.value)}
                placeholder="https://tiktok.com/@tonssproduction"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                YouTube
              </label>
              <input
                type="url"
                value={formData.socialYoutube || ''}
                onChange={(e) => handleChange('socialYoutube', e.target.value)}
                placeholder="https://youtube.com/@tonss"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Manifeste / Citation Footer */}
        <div className="bg-[#121212] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <h3 className="text-sm font-bold text-white uppercase font-['Montserrat']">
              Manifeste Culturel &amp; Citation du Studio
            </h3>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
              Citation du Manifeste (Section Culture &amp; Footer)
            </label>
            <textarea
              rows={3}
              value={formData.manifestoQuote || ''}
              onChange={(e) => handleChange('manifestoQuote', e.target.value)}
              placeholder="« Tant que les lions n'auront pas leurs propres historiens... »"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 resize-y"
            />
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#FFD700] hover:bg-yellow-400 text-[#121212] rounded text-xs font-black uppercase tracking-widest font-['Montserrat'] transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-75"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
            <span>{success ? 'Modifications Enregistrées !' : 'Enregistrer Tout le Contenu'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

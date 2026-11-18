import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { mapStoryToRow } from '../lib/supabaseMappers';
import { processAndUploadFile, ensureCompressedDataUrl } from '../lib/mediaUpload';
import { SuccessStory } from '../types';
import { Quote, Plus, Trash2, Edit2, Loader2, Check, X, Sparkles, Image as ImageIcon, Upload, User } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { getInitials } from '../lib/utils';

interface StoriesAdminProps {
  stories: SuccessStory[];
}

export const StoriesAdmin: React.FC<StoriesAdminProps> = ({ stories }) => {
  const { seedInitialData, refreshContent } = useSiteContent();
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('Cinéma & Diffusion');
  const [result, setResult] = useState('+1.2M entrées & Record Box-Office');
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('Producteur Exécutif');
  const [image, setImage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEditingStory(null);
    setTitle('');
    setClient('');
    setCategory('Cinéma & Diffusion');
    setResult('');
    setQuote('');
    setAuthor('');
    setRole('');
    setImage('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await processAndUploadFile(file, 'stories');
      setImage(res.url);
    } catch (err) {
      console.error("Error uploading story image", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (story: SuccessStory) => {
    setEditingStory(story);
    setTitle(story.title || '');
    setClient(story.client || '');
    setCategory(story.category || '');
    setResult(story.result || '');
    setQuote(story.quote || '');
    setAuthor(story.author || '');
    setRole(story.role || '');
    setImage(story.image || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = image;
      if (fileRef.current?.files?.[0] && !image.startsWith('data:') && !image.includes('/storage/v1/object/')) {
        try {
          const res = await processAndUploadFile(fileRef.current.files[0], 'stories');
          finalImageUrl = res.url;
        } catch (uploadErr) {
          console.warn("Storage upload failed, keeping URL", uploadErr);
        }
      }

      finalImageUrl = await ensureCompressedDataUrl(finalImageUrl);

      const storyRow = mapStoryToRow({
        ...(editingStory ? { id: editingStory.id } : { id: crypto.randomUUID(), order: stories.length }),
        title,
        client,
        category,
        result,
        quote,
        author,
        role,
        image: finalImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      });

      const { error } = editingStory
        ? await supabase.from('stories').upsert(storyRow, { onConflict: 'id' })
        : await supabase.from('stories').insert(storyRow);

      if (error) throw error;

      await refreshContent();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error saving story:", err);
      alert("Erreur lors de l'enregistrement du témoignage.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, _clientName: string) => {
    try {
      const { error } = await supabase.from('stories').delete().eq('id', id);
      if (error) throw error;
      await refreshContent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await seedInitialData();
      setTimeout(() => setSeeding(false), 500);
    } catch (e) {
      console.error(e);
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#121212] p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center text-[#121212] font-black">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-['Montserrat']">
              Témoignages &amp; Success Stories
            </h2>
            <p className="text-xs text-slate-400">
              {stories.length} retours clients affichés dans le carrousel d'impact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {stories.length < 2 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-colors flex items-center gap-2"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin text-[#FFD700]" /> : <Sparkles className="w-4 h-4 text-[#FFD700]" />}
              <span>Importer Témoignages</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFD700] hover:bg-yellow-400 text-[#121212] rounded text-xs font-black uppercase tracking-widest font-['Montserrat'] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Story</span>
          </button>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-[#121212] border border-white/10 rounded-xl p-5 hover:border-[#FFD700]/40 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-[#FFD700] uppercase tracking-wider font-['Montserrat']">
                  {story.category}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold font-mono">
                  {story.result}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white uppercase font-['Montserrat'] mb-2">
                {story.title}
              </h4>

              <p className="text-xs text-slate-300 italic mb-4 line-clamp-3">
                « {story.quote} »
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] text-[10px] font-bold font-['Montserrat']">
                  {getInitials(story.author)}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{story.author}</h5>
                  <p className="text-[10px] text-slate-400">{story.role} • {story.client}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(story)}
                  className="p-1.5 rounded bg-white/5 hover:bg-[#FFD700] hover:text-black text-slate-300 transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(story.id, story.client)}
                  className="p-1.5 rounded bg-white/5 hover:bg-red-600 hover:text-white text-slate-300 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#161616]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded gold-bg text-[#121212] flex items-center justify-center font-bold">
                  {editingStory ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat']">
                    {editingStory ? `Modifier Story : ${editingStory.client}` : 'Ajouter une Success Story'}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Titre du Cas / Projet *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Distribution & Festival"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Client / Entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Ex: Canal+ Afrique"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Cinéma & Diffusion"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Résultat Chiffré Clé
                  </label>
                  <input
                    type="text"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="Ex: +1.2M d'entrées"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  Citation / Témoignage *
                </label>
                <textarea
                  rows={3}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Ce que le client dit de sa collaboration avec Tonss Production..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Nom du Témoin / Auteur
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ex: David Mendy"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Rôle / Fonction
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Ex: Directeur des Acquisitions"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                  Photo / Portrait Client
                </label>
                
                {author ? (
                  <div className="flex items-center gap-3 p-2 bg-black/40 border border-white/10 rounded-lg mb-2">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] text-sm font-bold font-['Montserrat']">
                      {getInitials(author)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">Avatar généré automatiquement</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{author}</p>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Check className="w-3 h-3" /> Initials
                    </div>
                  </div>
                ) : (
                  <div className="w-full border border-dashed border-white/20 rounded-lg p-3 text-center mb-2 flex items-center justify-center gap-2 text-xs text-slate-500 font-['Montserrat']">
                    <User className="w-4 h-4" />
                    <span>Entrez un nom pour générer l'avatar</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="ID / Metadata (Optionnel)"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD700]/50"
                />
              </div>

              <div className="p-4 border-t border-white/10 flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white uppercase font-['Montserrat']"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded gold-bg text-[#121212] font-black text-xs uppercase tracking-widest font-['Montserrat'] flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingStory ? 'Modifier' : 'Ajouter'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

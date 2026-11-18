import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { mapValueToRow } from '../lib/supabaseMappers';
import { StudioValue, useSiteContent } from '../context/SiteContentContext';
import { ShieldCheck, Plus, Trash2, Edit2, Loader2, Check, X, Sparkles, Compass, Lightbulb, Cpu, Globe, Heart, Target } from 'lucide-react';

interface ValuesAdminProps {
  values: StudioValue[];
}

export const ValuesAdmin: React.FC<ValuesAdminProps> = ({ values }) => {
  const { seedInitialData, refreshContent } = useSiteContent();
  const [showModal, setShowModal] = useState(false);
  const [editingValue, setEditingValue] = useState<StudioValue | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Lightbulb');

  const resetForm = () => {
    setEditingValue(null);
    setTitle('');
    setDescription('');
    setIcon('Lightbulb');
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (val: StudioValue) => {
    setEditingValue(val);
    setTitle(val.title || '');
    setDescription(val.description || '');
    setIcon(val.icon || 'Lightbulb');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const valRow = mapValueToRow({
        ...(editingValue?.id ? { id: editingValue.id } : { id: crypto.randomUUID(), order: values.length }),
        title,
        description,
        icon,
      });

      const { error } = editingValue?.id
        ? await supabase.from('studio_values').upsert(valRow, { onConflict: 'id' })
        : await supabase.from('studio_values').insert(valRow);

      if (error) throw error;

      await refreshContent();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error saving value:", err);
      alert("Erreur lors de l'enregistrement du pilier.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string, _valTitle?: string) => {
    if (!id) return;
    try {
      const { error } = await supabase.from('studio_values').delete().eq('id', id);
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
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-['Montserrat']">
              Culture &amp; Piliers du Studio
            </h2>
            <p className="text-xs text-slate-400">
              {values.length} piliers affichés dans la section « Culture Africaine &amp; Souveraineté »
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {values.length < 2 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-colors flex items-center gap-2"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin text-[#FFD700]" /> : <Sparkles className="w-4 h-4 text-[#FFD700]" />}
              <span>Importer Valeurs</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFD700] hover:bg-yellow-400 text-[#121212] rounded text-xs font-black uppercase tracking-widest font-['Montserrat'] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Pilier</span>
          </button>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((val, idx) => (
          <div
            key={val.id || idx}
            className="bg-[#121212] border border-white/10 rounded-xl p-5 hover:border-[#FFD700]/40 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-[#FFD700] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>

              <h4 className="text-sm font-bold text-white uppercase font-['Montserrat'] mb-2 group-hover:text-[#FFD700] transition-colors">
                {val.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {val.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Icône: {val.icon}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(val)}
                  className="p-1.5 rounded bg-white/5 hover:bg-[#FFD700] hover:text-black text-slate-300 transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {val.id && (
                  <button
                    onClick={() => handleDelete(val.id, val.title)}
                    className="p-1.5 rounded bg-white/5 hover:bg-red-600 hover:text-white text-slate-300 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
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
                  {editingValue ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat']">
                    {editingValue ? `Modifier : ${editingValue.title}` : 'Ajouter un Pilier Culturel'}
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
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  Titre du Pilier *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Récit Authentique & Non-Filtré"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  Icône Représentative
                </label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                >
                  <option value="Lightbulb">Lightbulb / Idée & Créativité</option>
                  <option value="Cpu">Cpu / Ingénierie & Tech</option>
                  <option value="Globe">Globe / Portée Internationale</option>
                  <option value="ShieldCheck">ShieldCheck / Souveraineté & Intégrité</option>
                  <option value="Compass">Compass / Vision & Direction</option>
                  <option value="Target">Target / Excellence & Précision</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  Description Détaillée *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expliquez ce pilier et comment il s'exprime dans le travail du studio..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 resize-y"
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
                  <span>{editingValue ? 'Modifier' : 'Ajouter'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

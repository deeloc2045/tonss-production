import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { mapKpiToRow } from '../lib/supabaseMappers';
import { KpiMetric } from '../types';
import { BarChart3, Plus, Trash2, Edit2, Loader2, Check, X, Sparkles, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface KpiAdminProps {
  kpis: KpiMetric[];
}

export const KpiAdmin: React.FC<KpiAdminProps> = ({ kpis }) => {
  const { seedInitialData, refreshContent } = useSiteContent();
  const [showModal, setShowModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KpiMetric | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Form state
  const [value, setValue] = useState('');
  const [numberValue, setNumberValue] = useState<number>(100);
  const [suffix, setSuffix] = useState('+');
  const [label, setLabel] = useState('');
  const [subtext, setSubtext] = useState('');
  const [iconName, setIconName] = useState('Film');
  const [trend, setTrend] = useState('+28% vs 2024');

  const resetForm = () => {
    setEditingKpi(null);
    setValue('');
    setNumberValue(100);
    setSuffix('+');
    setLabel('');
    setSubtext('');
    setIconName('Film');
    setTrend('+25% vs 2024');
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (kpi: KpiMetric) => {
    setEditingKpi(kpi);
    setValue(kpi.value || '');
    setNumberValue(kpi.numberValue ?? 0);
    setSuffix(kpi.suffix || '');
    setLabel(kpi.label || '');
    setSubtext(kpi.subtext || '');
    setIconName(kpi.iconName || 'Film');
    setTrend(kpi.trend || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const kpiRow = mapKpiToRow({
        ...(editingKpi ? { id: editingKpi.id } : { id: crypto.randomUUID(), order: kpis.length }),
        value: value || `${numberValue}${suffix}`,
        numberValue: Number(numberValue),
        suffix,
        label,
        subtext,
        iconName,
        trend,
      });

      const { error } = editingKpi
        ? await supabase.from('kpis').upsert(kpiRow, { onConflict: 'id' })
        : await supabase.from('kpis').insert(kpiRow);

      if (error) throw error;

      await refreshContent();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Error saving KPI:", err);
      alert("Erreur lors de l'enregistrement de l'indicateur KPI.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, _labelText: string) => {
    try {
      const { error } = await supabase.from('kpis').delete().eq('id', id);
      if (error) throw error;
      await refreshContent();
    } catch (err) {
      console.error("Error deleting KPI:", err);
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#121212] p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center text-[#121212] font-black">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-['Montserrat']">
              Indicateurs Clés &amp; Impact (KPIs)
            </h2>
            <p className="text-xs text-slate-400">
              {kpis.length} métriques affichées dans la section « Notre Impact »
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {kpis.length < 2 && (
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-colors flex items-center gap-2"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin text-[#FFD700]" /> : <Sparkles className="w-4 h-4 text-[#FFD700]" />}
              <span>Importer KPIs par défaut</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFD700] hover:bg-yellow-400 text-[#121212] rounded text-xs font-black uppercase tracking-widest font-['Montserrat'] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un KPI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-[#121212] border border-white/10 rounded-xl p-5 hover:border-[#FFD700]/40 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl sm:text-3xl font-black text-white font-['Montserrat'] group-hover:text-[#FFD700] transition-colors">
                  {kpi.value || `${kpi.numberValue}${kpi.suffix || ''}`}
                </span>
                {kpi.trend && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3" />
                    {kpi.trend}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-200 uppercase font-['Montserrat'] mb-1">
                {kpi.label}
              </h4>
              <p className="text-xs text-slate-400">
                {kpi.subtext}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Icône: {kpi.iconName}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(kpi)}
                  className="p-1.5 rounded bg-white/5 hover:bg-[#FFD700] hover:text-black text-slate-300 transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(kpi.id, kpi.label)}
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

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#161616]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded gold-bg text-[#121212] flex items-center justify-center font-bold">
                  {editingKpi ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat']">
                    {editingKpi ? `Modifier : ${editingKpi.label}` : 'Ajouter un Indicateur KPI'}
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
                    Valeur Chiffrée *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={numberValue}
                    onChange={(e) => setNumberValue(Number(e.target.value))}
                    placeholder="150"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Suffixe / Unité
                  </label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="+ ou M ou %"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  Affichage Complet (ex: 155+ ou 3.4M)
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Ex: 155+ ou 99.9%"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  Libellé Titre *
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ex: Projets Clés Livrés"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                  Sous-titre / Description
                </label>
                <input
                  type="text"
                  value={subtext}
                  onChange={(e) => setSubtext(e.target.value)}
                  placeholder="Ex: Films, séries & apps numériques"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Icône
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  >
                    <option value="Film">Film / Cinéma</option>
                    <option value="Users">Users / Audience</option>
                    <option value="Award">Award / Prix</option>
                    <option value="Globe">Globe / Pays</option>
                    <option value="Zap">Zap / Performance</option>
                    <option value="Sparkles">Sparkles / Création</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1">
                    Tendance / Croissance
                  </label>
                  <input
                    type="text"
                    value={trend}
                    onChange={(e) => setTrend(e.target.value)}
                    placeholder="+32% vs 2024"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>
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
                  <span>{editingKpi ? 'Modifier' : 'Ajouter'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

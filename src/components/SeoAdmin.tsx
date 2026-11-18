import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, RefreshCw, ExternalLink, CheckCircle2, Search, FileText, Check, AlertCircle } from 'lucide-react';

interface SeoPageItem {
  slug: string;
  routePath: string;
  url: string;
  title: string;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  isGenerated: boolean;
}

export const SeoAdmin: React.FC = () => {
  const [pages, setPages] = useState<SeoPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateMessage, setGenerateMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seo/pages');
      const data = await res.json();
      if (data.pages) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error("Erreur récupération pages SEO:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleGenerateAllWithAi = async () => {
    try {
      setGenerating(true);
      setGenerateMessage(null);
      const res = await fetch('/api/seo/generate-pages', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setGenerateMessage({
          text: data.message || "Pages régénérées avec succès par Google AI (Gemini) !",
          type: 'success'
        });
        await fetchPages();
      } else {
        setGenerateMessage({
          text: data.error || "Une erreur est survenue lors de la génération avec Google AI.",
          type: 'error'
        });
      }
    } catch (err: any) {
      setGenerateMessage({
        text: err.message || "Erreur de connexion au serveur de génération.",
        type: 'error'
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8" id="seo-admin-panel">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#141414] via-[#111111] to-[#141414] border border-[#FFD700]/30 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 gold-text" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase font-['Montserrat'] tracking-wide flex items-center gap-2">
              <span>Génération &amp; Indexation Google Search par Google AI</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD700] text-black">
                Gemini
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Google AI analyse votre catalogue, vos services et rédige automatiquement des pages d'atterrissage riches (HTML sémantique, balises Schema.org JSON-LD, FAQ structurées) pour positionner <strong className="text-white">tonssproduction.com</strong> en tête des résultats de recherche Google.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-regenerate-seo-pages"
          onClick={handleGenerateAllWithAi}
          disabled={generating}
          className="px-5 py-3 rounded-xl bg-[#FFD700] hover:bg-[#e6c200] disabled:opacity-50 text-black text-xs font-black uppercase tracking-wider font-['Montserrat'] flex items-center gap-2 transition-all shadow-lg shadow-[#FFD700]/10 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Génération Google AI en cours...' : 'Régénérer avec Google AI'}</span>
        </button>
      </div>

      {/* Status Message */}
      {generateMessage && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
          generateMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {generateMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{generateMessage.text}</span>
        </div>
      )}

      {/* Sitemaps & Directives Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan du site dynamique</div>
            <div className="text-xs font-bold text-white font-mono mt-0.5">/sitemap.xml</div>
          </div>
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#FFD700] transition-colors"
            title="Consulter le sitemap"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Directives robots</div>
            <div className="text-xs font-bold text-white font-mono mt-0.5">/robots.txt</div>
          </div>
          <a 
            href="/robots.txt" 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#FFD700] transition-colors"
            title="Consulter le robots.txt"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google Search Console</div>
            <div className="text-xs font-bold text-[#FFD700] mt-0.5">Indexation Prête</div>
          </div>
          <a 
            href="https://search.google.com/search-console" 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#FFD700] transition-colors"
            title="Ouvrir Google Search Console"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Table of Generated Pages */}
      <div className="rounded-2xl bg-[#0f0f0f] border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white font-['Montserrat'] uppercase">
              Pages SEO Générées pour Google Search ({pages.length})
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Chaque page intègre du balisage Schema.org (LocalBusiness + FAQPage) certifié pour les résultats enrichis Google.
            </p>
          </div>
          <button 
            type="button" 
            onClick={fetchPages} 
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            title="Actualiser la liste"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Chargement des données d'indexation...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-6">Page &amp; Titre Optimisé</th>
                  <th className="py-3.5 px-4">Requête Cible Google</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {pages.map((p) => (
                  <tr key={p.slug} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white mb-0.5">{p.title}</div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span className="gold-text">URL :</span> {p.routePath}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold">
                        {p.primaryKeyword}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                        <Check className="w-3 h-3" />
                        <span>Prêt pour Googlebot</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={p.routePath}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#FFD700] hover:text-black text-slate-300 font-semibold transition-all"
                      >
                        <span>Voir la page</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

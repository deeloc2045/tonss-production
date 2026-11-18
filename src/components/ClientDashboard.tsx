import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Film, FolderLock, FileText, LogOut, Clock, Download, PlayCircle, ShieldCheck, MessageSquare, Info } from 'lucide-react';
import { ClientChat } from './ClientChat';
import { logActivity } from '../lib/activityLogger';

export const ClientDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages'>('overview');
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadingData(false);
      return;
    }
    supabase.auth.getUser().then(({ data: { user: current } }) => {
      setUser(current ?? null);
    });
  }, []);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const updatePresence = async () => {
      try {
        await supabase
          .from('users')
          .update({ last_active: new Date().toISOString() })
          .eq('id', user.id);
      } catch (e) {
        console.error("Error updating presence:", e);
      }
    };

    updatePresence();
    const intervalId = setInterval(updatePresence, 60000);

    return () => clearInterval(intervalId);
  }, [user]);

  const loadClientData = useCallback(async (uid: string) => {
    if (!isSupabaseConfigured) {
      setLoadingData(false);
      return;
    }

    const [projRes, filesRes] = await Promise.all([
      supabase.from('client_projects').select('*').eq('client_id', uid).limit(1).maybeSingle(),
      supabase.from('client_files').select('*').eq('client_id', uid).order('created_at', { ascending: false }).limit(3),
    ]);

    if (!projRes.error && projRes.data) {
      setActiveProject({
        ...projRes.data,
        actionUrl: projRes.data.action_url ?? projRes.data.actionUrl,
        actionLabel: projRes.data.action_label ?? projRes.data.actionLabel,
      });
    } else {
      setActiveProject(null);
    }

    if (!filesRes.error && filesRes.data) {
      setRecentFiles(
        filesRes.data.map((f: any) => ({
          ...f,
          actionLabel: f.action_label ?? f.actionLabel,
        }))
      );
    }

    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadClientData(user.id);

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel(`client_dashboard_${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_projects', filter: `client_id=eq.${user.id}` }, () => {
        loadClientData(user.id);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_files', filter: `client_id=eq.${user.id}` }, () => {
        loadClientData(user.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadClientData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-['Poppins'] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#121212] border-r border-white/10 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded bg-white/10 text-white flex items-center justify-center font-bold font-['Montserrat']">
            {user?.email?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat'] truncate">Espace Client</h2>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest font-['Montserrat'] transition-all ${
              activeTab === 'overview' ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4" />
            Vue d'ensemble
          </button>
          
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest font-['Montserrat'] transition-all ${
              activeTab === 'messages' ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Messagerie
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest font-['Montserrat'] transition-all text-slate-400 hover:text-white hover:bg-white/5">
            <FolderLock className="w-4 h-4" />
            Rushes & Fichiers
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest font-['Montserrat'] transition-all text-slate-400 hover:text-white hover:bg-white/5">
            <FileText className="w-4 h-4" />
            Contrats
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg uppercase tracking-widest transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/10 bg-[#121212]/50 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-white font-['Montserrat'] uppercase">
            {activeTab === 'overview' ? "Vue d'ensemble" : "Messagerie Directe"}
          </h1>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            Connexion sécurisée
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto bg-[#0a0a0a] ${activeTab === 'overview' ? 'p-8' : 'p-4 md:p-8 h-full'}`}>
          {activeTab === 'messages' && user ? (
            <div className="h-full max-w-4xl mx-auto">
              <ClientChat clientId={user.id} isAdmin={false} />
            </div>
          ) : (
            <>
              {/* Active Project Card */}
              <div className="mb-8">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-4">Projet en cours</h2>
                
                {loadingData ? (
                  <div className="bg-[#121212] border border-white/5 rounded-xl p-8 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : activeProject ? (
                  <div className="bg-[#121212] border border-white/10 rounded-xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded bg-[#FFD700]/10 border border-[#FFD700]/20 text-[10px] text-[#FFD700] font-bold uppercase tracking-widest font-['Montserrat']">
                            {activeProject.status || "En cours"}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Mis à jour récemment
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white font-['Montserrat'] uppercase mb-2">{activeProject.title}</h3>
                        <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                          {activeProject.description}
                        </p>
                      </div>
                      
                      {activeProject.actionUrl && (
                        <button onClick={() => logActivity('project_view', `A interagi avec le projet ${activeProject.title}`)} className="shrink-0 bg-white text-black px-6 py-3 rounded text-xs font-bold uppercase tracking-widest font-['Montserrat'] hover:bg-slate-200 transition-colors flex items-center gap-2">
                          <PlayCircle className="w-4 h-4" />
                          {activeProject.actionLabel || "Visionner"}
                        </button>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-8 relative z-10">
                      <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-2 font-bold">
                        <span className={(activeProject.step || 1) >= 1 ? "text-[#FFD700]" : ""}>Pré-prod</span>
                        <span className={(activeProject.step || 1) >= 2 ? "text-[#FFD700]" : ""}>Tournage</span>
                        <span className={(activeProject.step || 1) >= 3 ? "text-[#FFD700]" : ""}>Post-prod</span>
                        <span className={(activeProject.step || 1) >= 4 ? "text-[#FFD700]" : ""}>Livraison</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full gold-bg rounded-full relative transition-all duration-1000"
                          style={{ width: `${(activeProject.step || 1) * 25}%` }}
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#121212] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Info className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-['Montserrat'] uppercase mb-2">Aucun projet actif</h3>
                    <p className="text-sm text-slate-500 max-w-md">
                      Vous n'avez pas de projet en cours de production actuellement.
                    </p>
                  </div>
                )}
              </div>

              {/* Deliverables Grid */}
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-4">Derniers fichiers partagés</h2>
                
                {loadingData ? (
                  <div className="bg-[#121212] border border-white/5 rounded-xl p-8 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : recentFiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentFiles.map(file => (
                      <div key={file.id} onClick={() => logActivity('download', `A interagi avec ${file.name}`)} className="bg-[#121212] border border-white/10 rounded-lg p-5 flex flex-col items-center justify-center text-center group hover:border-white/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          {file.type === 'video' ? <Film className="w-5 h-5 text-slate-300" /> : file.type === 'document' ? <FileText className="w-5 h-5 text-slate-300" /> : <FolderLock className="w-5 h-5 text-slate-300" />}
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{file.name}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">{file.size} • {file.label}</p>
                        <button className="text-xs text-[#FFD700] font-bold uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-3 h-3" /> {file.actionLabel || 'Ouvrir'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#121212] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-slate-500">
                      Aucun fichier n'a encore été partagé avec vous.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LayoutDashboard, Users, MessageSquare, LogOut, Loader2, UserPlus, X, Film, Plus, Trash2, Edit2, Image as ImageIcon, Mail, MessageCircle, Bell, Activity, Download, BarChart3, Quote, Compass, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { ProjectsAdmin } from './ProjectsAdmin';
import { KpiAdmin } from './KpiAdmin';
import { StoriesAdmin } from './StoriesAdmin';
import { ValuesAdmin } from './ValuesAdmin';
import { SiteSettingsAdmin } from './SiteSettingsAdmin';
import { SeoAdmin } from './SeoAdmin';
import { ClientChat } from './ClientChat';
import { useSiteContent } from '../context/SiteContentContext';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'kpis' | 'stories' | 'values' | 'settings' | 'seo' | 'messages' | 'users' | 'chat' | 'logs'>('projects');
  const [selectedClient, setSelectedClient] = useState<{id: string, email: string} | null>(null);
  
  const { projects, kpis, stories, values, refreshContent } = useSiteContent();

  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const [toasts, setToasts] = useState<{id: string, message: string, type: 'user' | 'message' | 'contact'}[]>([]);
  const isInitialUsersLoad = useRef(true);
  const isInitialContactsLoad = useRef(true);
  const isInitialChatLoad = useRef(true);

  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);

  const addToast = (message: string, type: 'user' | 'message' | 'contact') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAdminEmail(user?.email ?? null);
      setAdminUserId(user?.id ?? null);
    });
  }, []);

  const loadActivityLogs = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (!error && data) {
      setActivityLogs(data);
    }
  }, []);

  const loadUsersAndContacts = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const [usersRes, contactsRes] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
    ]);

    if (!usersRes.error && usersRes.data) {
      isInitialUsersLoad.current = false;
      setUsers(usersRes.data);
    }
    if (!contactsRes.error && contactsRes.data) {
      isInitialContactsLoad.current = false;
      setMessages(contactsRes.data);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'logs' || !isSupabaseConfigured) return;
    loadActivityLogs();

    const logsChannel = supabase
      .channel('admin_activity_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, () => {
        loadActivityLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(logsChannel);
    };
  }, [activeTab, loadActivityLogs]);

  useEffect(() => {
    loadUsersAndContacts();

    if (!isSupabaseConfigured) return;

    const adminChannel = supabase
      .channel('admin_dashboard_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        if (payload.eventType === 'INSERT' && !isInitialUsersLoad.current) {
          addToast(`Nouvel utilisateur inscrit : ${(payload.new as any)?.email || ''}`, 'user');
        }
        loadUsersAndContacts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
        if (payload.eventType === 'INSERT' && !isInitialContactsLoad.current) {
          const data = payload.new as any;
          addToast(`Nouvelle demande de contact : ${data?.name || data?.email || ''}`, 'contact');
        }
        loadUsersAndContacts();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversation_messages' }, (payload) => {
        if (!isInitialChatLoad.current) {
          const data = payload.new as any;
          if (data?.sender_id !== adminUserId && data?.sender_role !== 'admin') {
            addToast(`Nouveau message reçu`, 'message');
          }
        }
      })
      .subscribe(() => {
        isInitialChatLoad.current = false;
      });

    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, [loadUsersAndContacts, adminUserId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleInviteClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError('');
    setInviteSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/invite-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        if (res.status === 409) {
          setInviteError('Cet email est déjà utilisé.');
        } else {
          setInviteError(result.error || 'Erreur lors de la création du compte.');
        }
        return;
      }

      setInviteSuccess(true);
      setInviteEmail('');
      await loadUsersAndContacts();
    } catch (err: any) {
      console.error(err);
      setInviteError('Erreur lors de la création du compte.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      await loadUsersAndContacts();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour du rôle.');
    }
  };

  const handleResendInvitation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      alert(`Invitation renvoyée avec succès à ${email}`);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi de l'invitation.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: {
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
      });
      if (!res.ok) {
        await supabase.from('users').delete().eq('id', userId);
      }
      if (selectedClient?.id === userId) setSelectedClient(null);
      await loadUsersAndContacts();
    } catch (e) {
      console.error(e);
    }
  };

  const openChat = (user: any) => {
    setSelectedClient({ id: user.id, email: user.email });
    setActiveTab('chat');
  };

  const isOnline = (lastActive: any) => {
    if (!lastActive) return false;
    const ms = typeof lastActive === 'string' ? Date.parse(lastActive) : lastActive?.toMillis?.() ?? 0;
    if (!ms || Number.isNaN(ms)) return false;
    return Date.now() - ms < 5 * 60 * 1000;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-['Poppins'] flex">
      {/* Sidebar */}
      <div className="w-72 bg-[#121212] border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Studio Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-lg gold-bg text-[#121212] flex items-center justify-center font-black font-['Montserrat'] text-sm shadow-md">
              TP
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat']">Admin Studio</h2>
              <p className="text-[10px] text-[#FFD700] font-mono">TONSS CMS v2.5</p>
            </div>
          </div>

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-['Montserrat'] px-3 mb-2">
            Gestion du Contenu
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                activeTab === 'projects' ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4" />
                <span>Projets &amp; Médias</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kpis')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                activeTab === 'kpis' ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Impact &amp; KPIs</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                {kpis.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stories')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                activeTab === 'stories' ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Quote className="w-4 h-4" />
                <span>Témoignages</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                {stories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('values')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                activeTab === 'values' ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4" />
                <span>Culture &amp; Piliers</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                {values.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                activeTab === 'settings' ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Textes &amp; Coordonnées</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                activeTab === 'seo' ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                <span>Indexation Google AI</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] font-bold">
                7
              </span>
            </button>

            <div className="pt-4 pb-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-['Montserrat'] px-3">
                Communication &amp; Clients
              </div>
            </div>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                activeTab === 'messages' ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Demandes Contact</span>
              </div>
              {messages.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFD700] text-black font-bold">
                  {messages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                (activeTab === 'users' || activeTab === 'chat') ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Clients &amp; Accès</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-all ${
                activeTab === 'logs' ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Journal d'Activité</span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#121212]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-white font-['Montserrat'] uppercase flex items-center gap-3">
              {activeTab === 'projects' && '🎬 Gestion du Catalogue Projets & Médias'}
              {activeTab === 'kpis' && '📊 Indicateurs Clés de Performance (KPI)'}
              {activeTab === 'stories' && '💬 Témoignages & Success Stories'}
              {activeTab === 'values' && '🏛️ Piliers Culturels du Studio'}
              {activeTab === 'settings' && '⚙️ Textes, Coordonnées & Paramètres du Site'}
              {activeTab === 'seo' && '🤖 Pages d\'Indexation Google Search (Google AI)'}
              {activeTab === 'messages' && '✉️ Demandes de Contact Reçues'}
              {activeTab === 'users' && '👥 Utilisateurs & Rôles'}
              {activeTab === 'chat' && (
                <>
                  <button onClick={() => setActiveTab('users')} className="text-slate-400 hover:text-white transition-colors">
                    <Users className="w-4 h-4" />
                  </button>
                  Messagerie Directe Client
                </>
              )}
              {activeTab === 'logs' && '⚡ Journal des Activités en Temps Réel'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {(activeTab === 'users' || activeTab === 'chat') && (
              <button
                onClick={() => {
                  setShowInviteModal(true);
                  setInviteSuccess(false);
                  setInviteError('');
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] rounded text-xs font-bold uppercase tracking-widest font-['Montserrat'] hover:bg-[#FFD700]/20 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Inviter un Client
              </button>
            )}

            <span className="text-[11px] text-slate-400 font-mono hidden md:inline-block">
              {adminEmail}
            </span>
          </div>
        </header>

        {/* Body content */}
        <main className={`flex-1 overflow-y-auto bg-[#0a0a0a] ${activeTab === 'chat' ? 'p-4 md:p-8' : 'p-6 md:p-8'}`}>
          {loading && activeTab !== 'chat' ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
            </div>
          ) : activeTab === 'projects' ? (
            <ProjectsAdmin projects={projects} fetchData={refreshContent} />
          ) : activeTab === 'kpis' ? (
            <KpiAdmin kpis={kpis} />
          ) : activeTab === 'stories' ? (
            <StoriesAdmin stories={stories} />
          ) : activeTab === 'values' ? (
            <ValuesAdmin values={values} />
          ) : activeTab === 'settings' ? (
            <SiteSettingsAdmin />
          ) : activeTab === 'seo' ? (
            <SeoAdmin />
          ) : activeTab === 'messages' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#121212] p-4 rounded-xl border border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-['Montserrat']">
                    Messages envoyés via le formulaire ({messages.length})
                  </h3>
                  <p className="text-xs text-slate-400">Consultez les demandes de devis et prises de contact.</p>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center bg-[#121212] border border-white/10 rounded-xl">
                  <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Aucun message pour le moment.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-[#121212] border border-white/10 rounded-xl p-6 hover:border-[#FFD700]/30 transition-colors shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-white uppercase font-['Montserrat']">{msg.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          <a href={`mailto:${msg.email}`} className="text-[#FFD700] hover:underline">{msg.email}</a>
                          {msg.phone && ` • Téléphone : ${msg.phone}`}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono px-2 py-1 rounded bg-white/5">
                        {(msg.created_at || msg.createdAt) ? new Date(msg.created_at || msg.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Récent'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 uppercase tracking-widest font-['Montserrat']">
                        Service : {msg.service}
                      </span>
                      <span className="px-3 py-1 rounded bg-[#FFD700]/10 border border-[#FFD700]/20 text-[10px] text-[#FFD700] font-bold uppercase tracking-widest font-['Montserrat']">
                        Budget : {msg.budget || 'Non spécifié'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 font-light leading-relaxed bg-[#0a0a0a] p-4 rounded-lg border border-white/5 whitespace-pre-wrap">
                      {msg.message || "Aucun message détaillé."}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'chat' && selectedClient ? (
            <div className="h-full max-w-5xl mx-auto flex gap-6">
              {/* Sidebar with clients list */}
              <div className="w-64 flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-2 px-2">Clients</h3>
                {users.filter(u => u.role === 'client' || u.role === 'user').map(u => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedClient({ id: u.id, email: u.email })}
                    className={`w-full text-left px-4 py-3 rounded-lg text-xs truncate transition-all flex items-center justify-between gap-2 ${
                      selectedClient.id === u.id 
                        ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20' 
                        : 'bg-[#121212] border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{u.email}</span>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isOnline(u.last_active ?? u.lastActive) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} title={isOnline(u.last_active ?? u.lastActive) ? "En ligne" : "Hors ligne"} />
                  </button>
                ))}
              </div>
              <div className="flex-1 h-full">
                <ClientChat clientId={selectedClient.id} isAdmin={true} clientEmail={selectedClient.email} />
              </div>
            </div>
          ) : activeTab === 'logs' ? (
            <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-lg">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat'] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FFD700]" />
                  Journal d'Activité en direct
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {activityLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    Aucune activité enregistrée.
                  </div>
                ) : (
                  activityLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 mt-1">
                        {log.action === 'login' && <UserPlus className="w-4 h-4 text-emerald-400" />}
                        {log.action === 'download' && <Download className="w-4 h-4 text-blue-400" />}
                        {log.action === 'message' && <MessageCircle className="w-4 h-4 text-[#FFD700]" />}
                        {log.action === 'project_view' && <Film className="w-4 h-4 text-purple-400" />}
                        {!['login', 'download', 'message', 'project_view'].includes(log.action) && <Activity className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-white">{log.user_email ?? log.userEmail}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(log.created_at || log.createdAt) ? new Date(log.created_at || log.createdAt).toLocaleString('fr-FR') : '...'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{log.details}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest font-['Montserrat']">Email</th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest font-['Montserrat']">Rôle</th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest font-['Montserrat']">Date d'inscription</th>
                    <th className="p-4 text-xs font-bold text-slate-300 uppercase tracking-widest font-['Montserrat'] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 group">
                      <td className="p-4 text-sm text-white">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${isOnline(user.last_active ?? user.lastActive) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} title={isOnline(user.last_active ?? user.lastActive) ? "En ligne" : "Hors ligne"} />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className={`bg-transparent outline-none cursor-pointer px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${
                            user.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}
                        >
                          <option value="user" className="bg-[#121212] text-white">USER</option>
                          <option value="client" className="bg-[#121212] text-white">CLIENT</option>
                          <option value="admin" className="bg-[#121212] text-white">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs text-slate-400 font-mono">
                        {(user.created_at || user.createdAt) ? new Date(user.created_at || user.createdAt).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => openChat(user)}
                          className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 inline-flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"
                          title="Ouvrir la messagerie"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResendInvitation(user.email)}
                          className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 inline-flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                          title="Renvoyer l'invitation par email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 inline-flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                          title="Supprimer l'accès"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-6 border border-[#FFD700]/20">
                <UserPlus className="w-6 h-6 text-[#FFD700]" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Montserrat'] mb-2">Inviter un Client</h2>
              <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                Un compte sécurisé sera créé et un e-mail d'invitation officiel sera envoyé à l'adresse indiquée pour qu'il configure son mot de passe.
              </p>

              <form onSubmit={handleInviteClient} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-2">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    placeholder="client@exemple.com"
                  />
                </div>

                {inviteError && (
                  <div className="p-3 rounded bg-red-950/80 border border-red-500 text-red-300 text-xs">
                    {inviteError}
                  </div>
                )}
                
                {inviteSuccess && (
                  <div className="p-3 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs">
                    Invitation envoyée avec succès ! Le client a été ajouté.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="w-full py-3 rounded gold-bg hover:bg-yellow-400 text-[#121212] font-black text-xs uppercase tracking-widest font-['Montserrat'] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {inviteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer et envoyer l\'invitation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div 
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-[#121212] border border-white/10 rounded-lg p-4 shadow-xl flex items-center gap-3"
            >
              {toast.type === 'user' && <UserPlus className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'contact' && <MessageSquare className="w-5 h-5 text-blue-400" />}
              {toast.type === 'message' && <MessageCircle className="w-5 h-5 text-[#FFD700]" />}
              <p className="text-sm text-white font-['Montserrat']">{toast.message}</p>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-400 hover:text-white ml-2 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};


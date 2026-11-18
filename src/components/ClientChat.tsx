import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Send, Loader2, User, ShieldCheck } from 'lucide-react';
import { logActivity } from '../lib/activityLogger';

export const ClientChat: React.FC<{ clientId: string; isAdmin: boolean; clientEmail?: string }> = ({ clientId, isAdmin, clientEmail }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null);
    });
  }, []);

  const loadMessages = useCallback(async () => {
    if (!clientId || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data, error: fetchError } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true });

    if (!fetchError && data) {
      setMessages(data);
    }
    setLoading(false);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    loadMessages();

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel(`conversation_${clientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_messages',
          filter: `client_id=eq.${clientId}`,
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, loadMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!newMessage.trim()) {
      setError('Impossible d\'envoyer un message vide.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const text = newMessage;
    setNewMessage('');

    await supabase.from('conversation_messages').insert({
      client_id: clientId,
      sender_id: user.id,
      sender_role: isAdmin ? 'admin' : 'client',
      text,
    });

    if (!isAdmin) {
      logActivity('message', 'A envoyé un message via la messagerie');
    }
    await loadMessages();
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] rounded-xl overflow-hidden border border-white/10 relative">
      <div className="p-4 border-b border-white/10 bg-[#121212]/90 backdrop-blur flex items-center gap-3">
        {isAdmin ? (
          <>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-['Montserrat']">Discussion avec</h3>
              <p className="text-xs text-slate-400">{clientEmail}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFD700] uppercase tracking-widest font-['Montserrat']">Tonss Production</h3>
              <p className="text-xs text-slate-400">Équipe Studio</p>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <Send className="w-8 h-8 opacity-20" />
            <p className="text-sm">Envoyez un message pour démarrer la discussion.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const senderId = msg.sender_id ?? msg.senderId;
            const createdAt = msg.created_at ?? msg.createdAt;
            const isMe = senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl p-4 ${
                  isMe 
                    ? 'bg-[#FFD700] text-black rounded-tr-none' 
                    : 'bg-[#1a1a1a] border border-white/10 text-white rounded-tl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-[10px] block mt-2 ${isMe ? 'text-black/60' : 'text-slate-500'}`}>
                    {createdAt ? new Date(createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#0a0a0a] border-t border-white/10 flex flex-col">
        {error && (
          <div className="px-4 pt-3 text-xs text-red-400 animate-in fade-in">
            {error}
          </div>
        )}
        <form onSubmit={handleSend} className="p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (error) setError('');
            }}
            placeholder="Écrivez votre message..."
            className={`flex-1 bg-[#121212] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors`}
          />
          <button
            type="submit"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#FFD700] text-black hover:bg-yellow-400 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

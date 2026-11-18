import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../context/SiteContentContext';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { settings } = useSiteContent();
  const phoneNumber = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '221780128862';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Ouvre WhatsApp avec le message pré-rempli
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    setIsOpen(false);
    setMessage('');
  };


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* Header WhatsApp Style */}
            <div className="bg-[#075E54] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=Tonss+Production&background=FFD700&color=000&bold=true" 
                    alt="Tonss" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Tonss Production</h3>
                  <p className="text-[#DCF8C6] text-xs">En ligne</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              className="bg-[#E5DDD5] p-4 h-[260px] overflow-y-auto flex flex-col gap-3 relative"
              style={{
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="bg-white p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm text-sm text-slate-800 max-w-[85%] self-start relative pr-12 pb-5">
                Bonjour ! 👋<br/><br/>Comment pouvons-nous vous aider aujourd'hui ?
                <span className="text-[9px] text-slate-400 absolute bottom-1.5 right-2">
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#F0F0F0]">
              <form onSubmit={handleSend} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 text-sm focus:outline-none text-slate-800 bg-transparent"
                />
                <button 
                  type="submit" 
                  disabled={!message.trim()} 
                  className="text-[#075E54] disabled:opacity-50 hover:scale-110 transition-transform"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            aria-label="Ouvrir le chat WhatsApp"
            className="p-3.5 rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 transition-all cursor-pointer flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

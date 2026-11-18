import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RealisationGrid1 } from './components/RealisationGrid1';
import { RealisationGrid2 } from './components/RealisationGrid2';
import { ImpactPanel } from './components/ImpactPanel';
import { FaqSection } from './components/FaqSection';
import { CultureSection } from './components/CultureSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TrailerModal, AppDownloadModal, SearchModal, LoginModal } from './components/Modals';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientDashboard } from './components/ClientDashboard';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { LegalPage } from "./components/LegalPage";
import { ProjectItem } from './types';
import { VIGNETTE_PROJECTS } from './data/tonssData';
import { ArrowUp, Loader2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [selectedTrailerProject, setSelectedTrailerProject] = useState<ProjectItem | null>(null);
  const [selectedAppProject, setSelectedAppProject] = useState<ProjectItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  // Global keybindings and auth listener
  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);

    const resolveUserRole = async (user: User | null) => {
      setCurrentUser(user);
      if (user) {
        if (user.email === 'deeloc2045@gmail.com' || user.email === 'deeloc2045agmail.com') {
          setIsAdmin(true);
          setIsClient(false);
          setAuthLoading(false);
          return;
        }

        try {
          const { data: userRow, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          if (!error && userRow) {
            if (userRow.role === 'admin') {
              setIsAdmin(true);
              setIsClient(false);
            } else if (userRow.role === 'client') {
              setIsAdmin(false);
              setIsClient(true);
            } else {
              setIsAdmin(false);
              setIsClient(false);
              await supabase.auth.signOut();
            }
          } else {
            setIsAdmin(false);
            setIsClient(false);
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error("Error checking role:", error);
          setIsAdmin(false);
          setIsClient(false);
        }
      } else {
        setIsAdmin(false);
        setIsClient(false);
      }
      setAuthLoading(false);
    };

    let authSubscription: { unsubscribe: () => void } | null = null;

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        resolveUserRole(session?.user ?? null);
      });

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        resolveUserRole(session?.user ?? null);
      });
      authSubscription = data.subscription;
    } else {
      setAuthLoading(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      authSubscription?.unsubscribe();
    };
  }, []);

  const handleDiscoverProductions = () => {
    if (window.location.hash) { window.location.hash = ""; setCurrentHash(""); setTimeout(() => { const el = document.querySelector("#audiovisuel"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100); return; }
    const el = document.querySelector('#audiovisuel');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDiscoverTech = () => {
    if (window.location.hash) { window.location.hash = ""; setCurrentHash(""); setTimeout(() => { const el = document.querySelector("#tech"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100); return; }
    const el = document.querySelector('#tech');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    if (window.location.hash) { window.location.hash = ""; setCurrentHash(""); setTimeout(() => { const el = document.querySelector("#contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100); return; }
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenShowreel = () => {
    // Open the primary flagship cinema project trailer as showreel
    setSelectedTrailerProject(VIGNETTE_PROJECTS[0]);
  };

  const handleSelectFromSearch = (project: ProjectItem) => {
    if (project.category === 'cinema' || project.category === 'audiovisuel') {
      setSelectedTrailerProject(project);
    } else {
      setSelectedAppProject(project);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  if (currentUser) {
    if (isAdmin) {
      return <AdminDashboard />;
    }
    if (isClient) {
      return <ClientDashboard />;
    }
    // Return loading while waiting for signOut to process
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 selection:bg-[#FFD700] selection:text-black flex flex-col font-['Poppins',sans-serif] relative antialiased">
      
      {/* Top Sticky Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenContact={handleOpenContact}
      />

      {/* Main Full-Width Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        
        {currentHash === "#legal" || currentHash === "#privacy" ? (
          <LegalPage type={currentHash === "#legal" ? "legal" : "privacy"} />
        ) : (
          <>
        {/* Section Héro */}
        <HeroSection
          onDiscoverProductions={handleDiscoverProductions}
          onDiscoverTech={handleDiscoverTech}
          onOpenContact={handleOpenContact}
          onOpenShowreel={handleOpenShowreel}
        />

        {/* Section Grille 1: Vignettes interactives pour films & apps mobiles avec boutons Watch Trailer & Download */}
        <RealisationGrid1
          onWatchTrailer={(proj) => setSelectedTrailerProject(proj)}
          onDownloadApp={(proj) => setSelectedAppProject(proj)}
        />

        {/* Section Grille 2: Grandes cartes de projets détaillées avec scènes de film et mockups apps */}
        <RealisationGrid2
          onWatchTrailer={(proj) => setSelectedTrailerProject(proj)}
          onDownloadApp={(proj) => setSelectedAppProject(proj)}
        />

        {/* Panneau Notre Impact: Indicateurs Clés (KPI) & Success Stories */}
        <ImpactPanel />

        {/* Section FAQ Interactive: Questions Fréquentes sur nos services & solutions */}
        <FaqSection />

        {/* Section Blog Dynamique: Coulisses de la création audiovisuelle et innovations tech */}
        <BlogSection />

        {/* Section Culture: Récit Africain & Souveraineté Technologique */}
        <CultureSection />

        {/* Section Contact: Formulaire d'envoi élégant avec bouton ENVOYER doré */}
        <ContactSection />
          </>
        )}
      </main>

      {/* Footer avec coordonnées complètes, réseaux sociaux et logo en bas à droite */}
      <Footer />

      {/* Floating Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            id="btn-scroll-to-top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            aria-label="Retour en haut"
            className="fixed bottom-[88px] right-6 z-40 p-3 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center group"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Chatbot Widget */}
      <WhatsAppWidget />

      {/* Interactive Modals */}
      <TrailerModal
        project={selectedTrailerProject}
        onClose={() => setSelectedTrailerProject(null)}
      />

      <AppDownloadModal
        project={selectedAppProject}
        onClose={() => setSelectedAppProject(null)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProject={handleSelectFromSearch}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

    </div>
  );
}

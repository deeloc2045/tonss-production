import React, { useState, useEffect } from 'react';
import { Search, User, LogIn, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenLogin: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenLogin, onOpenContact }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('HOME');
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'ACCUEIL', href: '#home', id: 'home' },
    { label: 'AUDIOVISUEL', href: '#audiovisuel', id: 'audiovisuel' },
    { label: 'TECHNOLOGIE', href: '#tech', id: 'tech' },
    { label: 'CULTURE', href: '#culture', id: 'culture' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  // Scrollspy effect and background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollPosition = window.scrollY + 150;
      const sections = ['home', 'audiovisuel', 'cinema', 'tech', 'culture', 'contact'];

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            const found = navItems.find((n) => n.id === sectionId || (n.id === 'audiovisuel' && sectionId === 'cinema'));
            if (found) {
              setActiveNav(found.label);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (label: string, href: string) => {
    setActiveNav(label);
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: TONSS Production Logo */}
        <a 
          href="#home" 
          id="header-logo-link"
          className="flex items-center gap-3 group cursor-pointer focus:outline-none"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform rounded-sm overflow-hidden">
            <img src="/logo.png" alt="TONSS PRODUCTION Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tighter uppercase text-white font-['Montserrat']">
                TONSS <span className="gold-text">PRODUCTION</span>
              </span>
            </div>
            <span className="text-[9px] tracking-[0.25em] text-slate-400 uppercase font-medium">
              STUDIO • DAKAR
            </span>
          </div>
        </a>

        {/* Center: Clean Minimal Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              id={`nav-link-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.label, item.href);
              }}
              className={`relative py-2 text-[11px] font-bold tracking-widest font-['Montserrat'] uppercase transition-colors duration-200 ${
                activeNav === item.label
                  ? 'gold-text'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
              {activeNav === item.label && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] gold-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            id="btn-header-search"
            onClick={onOpenSearch}
            className="text-slate-300 hover:gold-text transition-colors cursor-pointer p-1"
            title="Recherche"
            aria-label="Recherche"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            id="btn-header-login"
            onClick={onOpenLogin}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-[#FFD700] hover:bg-[#FFD700]/5 text-xs font-bold tracking-widest font-['Montserrat'] text-white transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>STUDIO</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            id="btn-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-slate-300 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Menu Mobile"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 shadow-2xl"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                id={`mobile-nav-${item.label.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.label, item.href);
                }}
                className={`text-sm font-bold tracking-widest font-['Montserrat'] py-3 border-b border-white/5 flex items-center justify-between ${
                  activeNav === item.label
                    ? 'gold-text'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {activeNav === item.label && <Sparkles className="w-4 h-4" />}
              </a>
            ))}

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded gold-bg text-[#121212] font-black text-xs tracking-widest font-['Montserrat'] cursor-pointer"
              >
                <User className="w-4 h-4" />
                ACCÉDER AU STUDIO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

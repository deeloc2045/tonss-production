import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/tonssData';
import { getInitials } from '../lib/utils';
import { BookOpen, Clock, Calendar, ArrowRight, Search, X, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mapBlogPostFromRow } from '../lib/supabaseMappers';

export const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setPosts(data.map(mapBlogPostFromRow));
        }
      } catch (err) {
        console.warn("Could not load blog posts from Supabase, using local data", err);
      }
    };

    loadPosts();

    const channel = supabase
      .channel('blog_posts_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = [
    { id: 'all', label: 'Tous les articles' },
    { id: 'cinema', label: 'Cinéma & Tournage' },
    { id: 'tech', label: 'Innovation & Tech' },
    { id: 'sound', label: 'Son & Post-Production' },
    { id: 'backstage', label: 'Coulisses & Culture' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 bg-[#0a0a0c] text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Journal du Studio & R&D</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
            Coulisses et Innovations Tech chez <span className="text-[#FFD700]">TONSS</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Plongez au cœur de notre processus de création cinématographique, découvrez nos choix technologiques avancés et les histoires qui façonnent notre vision du futur numérique africain.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-[#121216] p-4 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFD700] text-black font-semibold shadow-lg shadow-[#FFD700]/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD700] transition-colors"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#121216] rounded-2xl border border-zinc-800">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg font-medium">Aucun article ne correspond à votre recherche.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#FFD700] text-black font-semibold text-xs rounded-xl hover:bg-[#ffdf33] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post, idx) => {
              const initials = getInitials(post.author);
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => setActiveArticle(post)}
                  className="group bg-[#121216] rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-[#FFD700]/50 transition-all duration-300 flex flex-col cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-[#FFD700]/5"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#FFD700] text-xs font-mono uppercase tracking-wider border border-[#FFD700]/30">
                        {post.categoryLabel}
                      </span>
                    </div>
                    {post.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#FFD700] text-black text-xs font-bold uppercase tracking-wider shadow">
                          À la une
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-[#FFD700] transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-amber-600 flex items-center justify-center text-black font-black text-xs shadow-md">
                          {initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{post.author}</div>
                          <div className="text-[11px] text-zinc-500">{post.authorRole}</div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FFD700] group-hover:translate-x-1 transition-transform">
                        Lire l'article
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#121216] border border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white"
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-zinc-700 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-72 sm:h-96 w-full">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-[#121216]/40 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#FFD700] text-black text-xs font-bold uppercase tracking-wider">
                      {activeArticle.categoryLabel}
                    </span>
                    <span className="text-zinc-300 text-xs font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
                      {activeArticle.readTime}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                    {activeArticle.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 sm:p-10">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-amber-600 flex items-center justify-center text-black font-black text-sm shadow">
                      {getInitials(activeArticle.author)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{activeArticle.author}</div>
                      <div className="text-xs text-zinc-400">{activeArticle.authorRole} • Publié le {activeArticle.date}</div>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-zinc-500">
                    TONSS Production Journal
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-zinc-300 space-y-6 text-base sm:text-lg leading-relaxed">
                  {activeArticle.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-xl sm:text-2xl font-bold text-[#FFD700] mt-8 mb-4">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    return (
                      <p key={idx}>
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    Partagez cet article ou contactez notre équipe pour vos projets.
                  </div>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl transition-colors"
                  >
                    Fermer l'article
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

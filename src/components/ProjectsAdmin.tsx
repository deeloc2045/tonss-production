import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { mapProjectToRow } from '../lib/supabaseMappers';
import { processAndUploadFile, ensureCompressedDataUrl, getEstimatedByteSize } from '../lib/mediaUpload';
import { ProjectItem } from '../types';
import { Film, Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Video, ExternalLink, X, Search, Sparkles, Smartphone, Check, Eye, Upload, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface ProjectsAdminProps {
  projects: ProjectItem[];
  fetchData: () => void;
}

export const ProjectsAdmin: React.FC<ProjectsAdminProps> = ({ projects, fetchData }) => {
  const { seedInitialData } = useSiteContent();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'cinema' | 'audiovisuel' | 'tech' | 'mobile'>('cinema');
  const [categoryLabel, setCategoryLabel] = useState('Cinéma & Fiction');
  const [badge, setBadge] = useState('Long-métrage • 4K HDR');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [client, setClient] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [trailerVideoUrl, setTrailerVideoUrl] = useState('');
  const [appDownloadUrl, setAppDownloadUrl] = useState('');
  const [appPlatform, setAppPlatform] = useState<string>('iOS & Android');
  const [rating, setRating] = useState('9.5/10');
  const [duration, setDuration] = useState('110 min');
  const [directorOrLead, setDirectorOrLead] = useState('');
  const [impactMetric, setImpactMetric] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [gridType, setGridType] = useState<'grid1' | 'grid2' | 'both'>('both');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const imageRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'banner' | 'video'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') setUploadingImage(true);
    else if (type === 'banner') setUploadingBanner(true);
    else if (type === 'video') setUploadingVideo(true);

    try {
      const folder = type === 'image' ? 'projects/images' : type === 'banner' ? 'projects/banners' : 'projects/videos';
      const result = await processAndUploadFile(file, folder);
      if (type === 'image') {
        setImageUrl(result.url);
      } else if (type === 'banner') {
        setBannerImageUrl(result.url);
      } else if (type === 'video') {
        setTrailerVideoUrl(result.url);
      }
    } catch (err) {
      console.error('Erreur lors du traitement du fichier:', err);
      alert("Erreur lors du chargement du fichier. Vérifiez le format.");
    } finally {
      if (type === 'image') setUploadingImage(false);
      else if (type === 'banner') setUploadingBanner(false);
      else if (type === 'video') setUploadingVideo(false);
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('cinema');
    setCategoryLabel('Cinéma & Fiction');
    setBadge('Long-métrage • 4K HDR');
    setYear(new Date().getFullYear().toString());
    setClient('');
    setShortDesc('');
    setFullDesc('');
    setImageUrl('');
    setBannerImageUrl('');
    setTrailerVideoUrl('');
    setAppDownloadUrl('');
    setAppPlatform('iOS & Android');
    setRating('9.5/10');
    setDuration('110 min');
    setDirectorOrLead('');
    setImpactMetric('');
    setTechStackInput('');
    setGridType('both');
    if (imageRef.current) imageRef.current.value = '';
    if (bannerRef.current) bannerRef.current.value = '';
    if (videoRef.current) videoRef.current.value = '';
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setTitle(proj.title || '');
    setCategory(proj.category || 'cinema');
    setCategoryLabel(proj.categoryLabel || '');
    setBadge(proj.badge || '');
    setYear(proj.year || new Date().getFullYear().toString());
    setClient(proj.client || '');
    setShortDesc(proj.shortDesc || '');
    setFullDesc(proj.fullDesc || '');
    setImageUrl(proj.image || '');
    setBannerImageUrl(proj.bannerImage || '');
    setTrailerVideoUrl(proj.trailerVideoUrl || '');
    setAppDownloadUrl(proj.appDownloadUrl || '');
    setAppPlatform(proj.appPlatform || 'iOS & Android');
    setRating(proj.rating || '');
    setDuration(proj.duration || '');
    setDirectorOrLead(proj.directorOrLead || '');
    setImpactMetric(proj.impactMetric || '');
    setTechStackInput(proj.techStack ? proj.techStack.join(', ') : '');
    setGridType(proj.gridType || 'both');
    setShowModal(true);
  };

  const handleCategoryChange = (newCat: 'cinema' | 'audiovisuel' | 'tech' | 'mobile') => {
    setCategory(newCat);
    if (!editingProject) {
      if (newCat === 'cinema') {
        setCategoryLabel('Cinéma & Fiction');
        setBadge('Long-métrage • 4K HDR');
      } else if (newCat === 'audiovisuel') {
        setCategoryLabel('Création Audiovisuelle');
        setBadge('Documentaire Immersif');
      } else if (newCat === 'mobile') {
        setCategoryLabel('Solution Mobile & Cloud');
        setBadge('App Mobile iOS & Android');
      } else {
        setCategoryLabel('Plateforme Web & SaaS');
        setBadge('SaaS Cloud');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = imageUrl;
      let finalBannerUrl = bannerImageUrl;
      let finalVideoUrl = trailerVideoUrl;

      // In case user selected files right before submit without change event
      if (imageRef.current?.files?.[0] && !imageUrl.startsWith('data:') && !imageUrl.includes('/storage/v1/object/')) {
        try {
          const res = await processAndUploadFile(imageRef.current.files[0], 'projects/images');
          finalImageUrl = res.url;
        } catch (uploadErr) {
          console.warn("Storage upload failed, keeping URL", uploadErr);
        }
      }

      if (bannerRef.current?.files?.[0] && !bannerImageUrl.startsWith('data:') && !bannerImageUrl.includes('/storage/v1/object/')) {
        try {
          const res = await processAndUploadFile(bannerRef.current.files[0], 'projects/banners');
          finalBannerUrl = res.url;
        } catch (uploadErr) {
          console.warn("Storage upload failed, keeping URL", uploadErr);
        }
      }

      if (videoRef.current?.files?.[0] && !trailerVideoUrl.startsWith('data:') && !trailerVideoUrl.includes('/storage/v1/object/')) {
        try {
          const res = await processAndUploadFile(videoRef.current.files[0], 'projects/videos');
          finalVideoUrl = res.url;
        } catch (uploadErr) {
          console.warn("Storage upload failed, keeping URL", uploadErr);
        }
      }

      // Re-compress any existing large base64 image data URLs before saving
      finalImageUrl = await ensureCompressedDataUrl(finalImageUrl);
      finalBannerUrl = await ensureCompressedDataUrl(finalBannerUrl);

      // Protect against storing large raw video data in database
      if (finalVideoUrl && finalVideoUrl.startsWith('data:') && finalVideoUrl.length > 400000) {
        alert("La vidéo est trop volumineuse pour être stockée directement dans la base de données. Veuillez renseigner un lien vidéo (YouTube, Vimeo, MP4 en ligne).");
        setLoading(false);
        return;
      }

      const techStackArray = techStackInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const projectRow = mapProjectToRow({
        ...(editingProject ? { id: editingProject.id } : { id: crypto.randomUUID(), order: projects.length }),
        title,
        category,
        categoryLabel: categoryLabel || (category === 'cinema' ? 'Cinéma' : category === 'audiovisuel' ? 'Publicité' : 'App / Web'),
        badge: badge || 'Tonss Production',
        year: year || new Date().getFullYear().toString(),
        client: client || '',
        shortDesc: shortDesc || title,
        fullDesc: fullDesc || shortDesc || title,
        image: finalImageUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
        bannerImage: finalBannerUrl || finalImageUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
        trailerVideoUrl: finalVideoUrl,
        appDownloadUrl: appDownloadUrl || finalVideoUrl,
        appPlatform: appPlatform as ProjectItem['appPlatform'],
        rating,
        duration,
        directorOrLead,
        impactMetric,
        techStack: techStackArray,
        gridType,
      });

      const byteSize = getEstimatedByteSize(projectRow);
      if (byteSize > 850000) {
        alert("Le projet contient des médias trop volumineux. Veuillez réduire la taille des images ou utiliser des URLs web.");
        setLoading(false);
        return;
      }

      const { error } = editingProject
        ? await supabase.from('projects').upsert(projectRow, { onConflict: 'id' })
        : await supabase.from('projects').insert(projectRow);

      if (error) throw error;

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Erreur lors de l'enregistrement du projet.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, _projectTitle: string) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (e) {
      console.error("Error deleting project:", e);
    }
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      await seedInitialData();
      fetchData();
      // Use a brief timeout to let the user see the loader finish before resetting
      setTimeout(() => {
        setSeeding(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setSeeding(false);
    }
  };

  // Filter projects by search and category
  const filteredProjects = projects.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.shortDesc || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#121212] p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gold-bg flex items-center justify-center text-[#121212] font-black">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-['Montserrat']">
              Catalogue Projets &amp; Réalisations
            </h2>
            <p className="text-xs text-slate-400">
              {projects.length} projet{projects.length > 1 ? 's' : ''} au total • Gestion CRUD en temps réel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded text-xs font-bold uppercase tracking-wider font-['Montserrat'] transition-colors flex items-center gap-2"
            title="Remplir la base avec les projets par défaut"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin text-[#FFD700]" /> : <Sparkles className="w-4 h-4 text-[#FFD700]" />}
            <span>Importer catalogue initial</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFD700] hover:bg-yellow-400 text-[#121212] rounded text-xs font-black uppercase tracking-widest font-['Montserrat'] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Projet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par titre, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFD700]/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['all', 'cinema', 'audiovisuel', 'mobile', 'tech'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest font-['Montserrat'] transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40'
                  : 'bg-[#121212] text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Tous' : cat === 'cinema' ? 'Cinéma' : cat === 'audiovisuel' ? 'Audiovisuel' : cat === 'mobile' ? 'Mobile' : 'Tech'}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-[#121212] border border-white/10 rounded-xl p-12 text-center">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white uppercase font-['Montserrat'] mb-2">Aucun projet trouvé</h3>
            <p className="text-xs text-slate-400 mb-6">Ajoutez votre premier projet ou importez le catalogue par défaut.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#FFD700] text-[#121212] rounded text-xs font-bold uppercase tracking-widest font-['Montserrat']"
            >
              Créer un projet
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden group hover:border-[#FFD700]/40 transition-all flex flex-col justify-between shadow-lg">
              {/* Media Thumbnail */}
              <div className="aspect-video relative bg-[#0a0a0a] overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                
                {/* Badges on Top */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-bold text-[#FFD700] uppercase tracking-wider font-['Montserrat'] border border-white/10">
                    {project.categoryLabel || project.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-slate-300 border border-white/10">
                    {project.year || '2025'}
                  </span>
                </div>

                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button
                    onClick={() => openEditModal(project)}
                    className="w-10 h-10 rounded-full bg-[#FFD700] text-[#121212] flex items-center justify-center hover:bg-yellow-300 transition-transform hover:scale-110 shadow-lg"
                    title="Modifier ce projet"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-transform hover:scale-110 shadow-lg"
                    title="Supprimer ce projet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {project.trailerVideoUrl && (
                    <a
                      href={project.trailerVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-transform hover:scale-110"
                      title="Ouvrir le lien média"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-['Montserrat'] group-hover:text-[#FFD700] transition-colors line-clamp-1 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {project.shortDesc || project.fullDesc || 'Aucune description fournie.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{project.client ? `Client: ${project.client}` : 'Studio Tonss'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="text-[#FFD700] hover:underline font-bold uppercase font-['Montserrat']"
                    >
                      Éditer
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      className="text-red-400 hover:underline font-bold uppercase font-['Montserrat']"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#161616]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded gold-bg text-[#121212] flex items-center justify-center font-bold">
                  {editingProject ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-widest font-['Montserrat']">
                    {editingProject ? `Modifier : ${editingProject.title}` : 'Ajouter un nouveau projet'}
                  </h2>
                  <p className="text-[11px] text-slate-400">Remplissez les détails du projet pour l'afficher sur le site.</p>
                </div>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <form id="project-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Title & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Titre du Projet *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Dakar Noir : Les Ombres du Plateau"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Catégorie Principale *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value as any)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    >
                      <option value="cinema">Cinéma &amp; Fiction (Long/Court-métrage)</option>
                      <option value="audiovisuel">Audiovisuel &amp; Documentaire / Brand</option>
                      <option value="mobile">Application Mobile (iOS &amp; Android)</option>
                      <option value="tech">Plateforme Web &amp; Solutions Tech / VR</option>
                    </select>
                  </div>
                </div>

                {/* Sub-label, Badge & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Libellé Catégorie
                    </label>
                    <input
                      type="text"
                      value={categoryLabel}
                      onChange={(e) => setCategoryLabel(e.target.value)}
                      placeholder="Ex: Cinéma & Fiction"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="Ex: Long-métrage • 4K HDR"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Année de Sortie
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Ex: 2025"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    />
                  </div>
                </div>

                {/* Client & Director / Tech Lead */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Client / Coproducteur
                    </label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="Ex: Fondation Sud Cinéma / Ministère de la Culture"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Réalisateur ou Lead Tech
                    </label>
                    <input
                      type="text"
                      value={directorOrLead}
                      onChange={(e) => setDirectorOrLead(e.target.value)}
                      placeholder="Ex: Mamadou Tonss Sow / Lead Tech Aïssatou Ba"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    />
                  </div>
                </div>

                {/* Short & Full Descriptions */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                    Description Courte (Vignette) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Brève accroche résumant le projet en 1 ou 2 phrases..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                    Description Détaillée (Grande Carte &amp; Modal)
                  </label>
                  <textarea
                    rows={3}
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    placeholder="Description complète du synopsis, des enjeux techniques, artistiques et culturels..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 resize-y"
                  />
                </div>

                {/* Image Section */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase font-['Montserrat'] flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#FFD700]" />
                      Images &amp; Visuels du Projet
                    </h4>
                    <span className="text-[11px] text-slate-400">Glissez ou choisissez un fichier depuis votre ordinateur</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Image Principale */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Image Principale (Affiche / Carte) *
                      </label>
                      
                      {/* Upload Box / Preview */}
                      {imageUrl ? (
                        <div className="relative rounded-lg overflow-hidden border border-white/20 bg-black/40 aspect-video flex items-center justify-center group">
                          <img
                            src={imageUrl}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <button
                              type="button"
                              onClick={() => imageRef.current?.click()}
                              className="px-2.5 py-1.5 bg-[#FFD700] text-black rounded text-xs font-bold flex items-center gap-1 hover:bg-[#FFE55C]"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Changer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImageUrl('');
                                if (imageRef.current) imageRef.current.value = '';
                              }}
                              className="px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs font-bold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Effacer
                            </button>
                          </div>
                          <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-[#FFD700] font-medium flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            Image prête
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => imageRef.current?.click()}
                          className={`border-2 border-dashed border-white/20 hover:border-[#FFD700]/60 bg-black/20 hover:bg-white/5 rounded-lg p-4 text-center cursor-pointer transition-all ${
                            uploadingImage ? 'opacity-60 pointer-events-none' : ''
                          }`}
                        >
                          {uploadingImage ? (
                            <div className="flex flex-col items-center justify-center py-3">
                              <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin mb-2" />
                              <span className="text-xs text-slate-300 font-medium">Traitement de l'image...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-2">
                              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FFD700] mb-2">
                                <Upload className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-white mb-0.5">Choisir une image depuis l'ordinateur</span>
                              <span className="text-[10px] text-slate-400">JPG, PNG, WebP (optimisation automatique)</span>
                            </div>
                          )}
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        ref={imageRef}
                        onChange={(e) => handleFileSelect(e, 'image')}
                        className="hidden"
                      />

                      {/* Manual URL input fallback */}
                      <div className="pt-1">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Ou collez une URL d'image web..."
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD700]/50 placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Image Bannière */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Image Bannière / Scène Large
                      </label>

                      {/* Upload Box / Preview */}
                      {bannerImageUrl ? (
                        <div className="relative rounded-lg overflow-hidden border border-white/20 bg-black/40 aspect-video flex items-center justify-center group">
                          <img
                            src={bannerImageUrl}
                            alt="Aperçu Bannière"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <button
                              type="button"
                              onClick={() => bannerRef.current?.click()}
                              className="px-2.5 py-1.5 bg-[#FFD700] text-black rounded text-xs font-bold flex items-center gap-1 hover:bg-[#FFE55C]"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Changer
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBannerImageUrl('');
                                if (bannerRef.current) bannerRef.current.value = '';
                              }}
                              className="px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs font-bold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Effacer
                            </button>
                          </div>
                          <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-[#FFD700] font-medium flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            Bannière prête
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => bannerRef.current?.click()}
                          className={`border-2 border-dashed border-white/20 hover:border-[#FFD700]/60 bg-black/20 hover:bg-white/5 rounded-lg p-4 text-center cursor-pointer transition-all ${
                            uploadingBanner ? 'opacity-60 pointer-events-none' : ''
                          }`}
                        >
                          {uploadingBanner ? (
                            <div className="flex flex-col items-center justify-center py-3">
                              <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin mb-2" />
                              <span className="text-xs text-slate-300 font-medium">Traitement de la bannière...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-2">
                              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FFD700] mb-2">
                                <Upload className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-white mb-0.5">Choisir une bannière depuis l'ordinateur</span>
                              <span className="text-[10px] text-slate-400">Format panoramique conseillé</span>
                            </div>
                          )}
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        ref={bannerRef}
                        onChange={(e) => handleFileSelect(e, 'banner')}
                        className="hidden"
                      />

                      {/* Manual URL input fallback */}
                      <div className="pt-1">
                        <input
                          type="url"
                          value={bannerImageUrl}
                          onChange={(e) => setBannerImageUrl(e.target.value)}
                          placeholder="Ou collez une URL d'image large..."
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD700]/50 placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Links & Apps */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase font-['Montserrat'] flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#FFD700]" />
                    Médias, Liens Vidéo &amp; Application
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Bande-Annonce / Vidéo (Fichier ou URL YouTube/MP4)
                      </label>
                      <input
                        type="url"
                        value={trailerVideoUrl}
                        onChange={(e) => setTrailerVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... ou https://..."
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]/50"
                      />
                      <input
                        type="file"
                        accept="video/*"
                        ref={videoRef}
                        onChange={(e) => handleFileSelect(e, 'video')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => videoRef.current?.click()}
                        disabled={uploadingVideo}
                        className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {uploadingVideo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#FFD700]" />}
                        <span>{uploadingVideo ? 'Téléversement vidéo...' : 'Téléverser un extrait vidéo'}</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Lien Téléchargement / Accès App
                      </label>
                      <input
                        type="url"
                        value={appDownloadUrl}
                        onChange={(e) => setAppDownloadUrl(e.target.value)}
                        placeholder="https://sunupass.tonss.sn"
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics, Rating, Tech Stack & Grid Display */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Chiffre d'Impact / Métrique
                    </label>
                    <input
                      type="text"
                      value={impactMetric}
                      onChange={(e) => setImpactMetric(e.target.value)}
                      placeholder="Ex: 850K Spectateurs / 140K Téléchargements"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Note / Récompense
                    </label>
                    <input
                      type="text"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      placeholder="Ex: 9.8/10 FESPACO"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                      Affichage dans les Grilles
                    </label>
                    <select
                      value={gridType}
                      onChange={(e) => setGridType(e.target.value as any)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                    >
                      <option value="both">Grille 1 (Vignettes) &amp; Grille 2 (Grandes Cartes)</option>
                      <option value="grid1">Grille 1 Uniquement (Vignettes)</option>
                      <option value="grid2">Grille 2 Uniquement (Grandes Cartes Détaillées)</option>
                    </select>
                  </div>
                </div>

                {/* Tech Stack Input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Montserrat'] mb-1.5">
                    Technologies / Matériel (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="Ex: RED Monstro 8K, Dolby Atmos, React Native, Node.js"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 bg-[#0a0a0a] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowModal(false); resetForm(); }}
                className="px-5 py-2.5 rounded text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider font-['Montserrat']"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="project-form"
                disabled={loading}
                className="px-6 py-2.5 rounded gold-bg hover:bg-yellow-400 text-[#121212] font-black text-xs uppercase tracking-widest font-['Montserrat'] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)] disabled:opacity-75"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{editingProject ? 'Enregistrer les Modifications' : 'Créer et Publier'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

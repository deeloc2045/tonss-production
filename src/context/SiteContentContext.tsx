import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  mapProjectFromRow,
  mapProjectToRow,
  mapKpiFromRow,
  mapKpiToRow,
  mapStoryFromRow,
  mapStoryToRow,
  mapValueFromRow,
  mapValueToRow,
  mapSettingsFromRow,
  mapSettingsToRow,
} from '../lib/supabaseMappers';
import { ProjectItem, KpiMetric, SuccessStory } from '../types';
import { VIGNETTE_PROJECTS, DETAILED_PROJECTS, KPI_METRICS, SUCCESS_STORIES, STUDIO_VALUES } from '../data/tonssData';

export interface StudioValue {
  id?: string;
  icon: string;
  title: string;
  description: string;
  order?: number;
}

export interface SiteSettings {
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroShowreelUrl?: string;
  heroBgImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  whatsappNumber?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTiktok?: string;
  socialYoutube?: string;
  manifestoQuote?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroBadge: "STUDIO MÉDIA HYBRIDE • DAKAR, SÉNÉGAL",
  heroTitle: "L'IMAGE, LE CODE, LA CULTURE AFRICAINE RÉINVENTÉE.",
  heroSubtitle: "Tonss Production est un studio d'excellence fusionnant création cinématographique et ingénierie logicielle. Nous racontons des histoires à fort impact culturel tout en concevant des expériences digitales modernes.",
  heroShowreelUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  heroBgImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop",
  contactEmail: "contact@tonssproduction.com",
  contactPhone: "+221 33 843 77 35 / +221 78 012 88 62",
  contactAddress: "PA1 02 des Parcelles Assainies",
  whatsappNumber: "221780128862",
  socialFacebook: "https://facebook.com",
  socialInstagram: "https://instagram.com",
  socialTiktok: "https://tiktok.com",
  socialYoutube: "https://youtube.com",
  manifestoQuote: "« Tant que les lions n'auront pas leurs propres historiens, les histoires de chasse continueront de glorifier le chasseur. À TONSS Production, nous donnons la caméra et le code aux créateurs africains. »"
};

interface SiteContentContextType {
  projects: ProjectItem[];
  vignetteProjects: ProjectItem[];
  detailedProjects: ProjectItem[];
  kpis: KpiMetric[];
  stories: SuccessStory[];
  values: StudioValue[];
  settings: SiteSettings;
  loading: boolean;
  refreshContent: () => Promise<void>;
  seedInitialData: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const FALLBACK_PROJECTS: ProjectItem[] = [
  ...VIGNETTE_PROJECTS.map(p => ({ ...p, gridType: 'grid1' as const })),
  ...DETAILED_PROJECTS.map(p => ({ ...p, gridType: 'grid2' as const }))
];

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(FALLBACK_PROJECTS);
  const [kpis, setKpis] = useState<KpiMetric[]>(KPI_METRICS);
  const [stories, setStories] = useState<SuccessStory[]>(SUCCESS_STORIES);
  const [values, setValues] = useState<StudioValue[]>(STUDIO_VALUES.map((v, i) => ({ id: `val-${i}`, ...v })));
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadAllContent = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProjects(FALLBACK_PROJECTS);
      setKpis(KPI_METRICS);
      setStories(SUCCESS_STORIES);
      setValues(STUDIO_VALUES.map((v, i) => ({ id: `val-${i}`, ...v })));
      setSettings(DEFAULT_SITE_SETTINGS);
      setLoading(false);
      return;
    }

    try {
      const [projRes, kpiRes, storyRes, valRes, setRes] = await Promise.all([
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('kpis').select('*').order('sort_order', { ascending: true }),
        supabase.from('stories').select('*').order('sort_order', { ascending: true }),
        supabase.from('studio_values').select('*').order('sort_order', { ascending: true }),
        supabase.from('site_settings').select('*').eq('id', 'general').maybeSingle(),
      ]);

      if (!projRes.error && projRes.data && projRes.data.length > 0) {
        setProjects(projRes.data.map(mapProjectFromRow));
      } else {
        setProjects(FALLBACK_PROJECTS);
      }

      if (!kpiRes.error && kpiRes.data && kpiRes.data.length > 0) {
        setKpis(kpiRes.data.map(mapKpiFromRow));
      } else {
        setKpis(KPI_METRICS);
      }

      if (!storyRes.error && storyRes.data && storyRes.data.length > 0) {
        setStories(storyRes.data.map(mapStoryFromRow));
      } else {
        setStories(SUCCESS_STORIES);
      }

      if (!valRes.error && valRes.data && valRes.data.length > 0) {
        setValues(valRes.data.map(mapValueFromRow));
      } else {
        setValues(STUDIO_VALUES.map((v, i) => ({ id: `val-${i}`, ...v })));
      }

      if (!setRes.error && setRes.data) {
        setSettings({ ...DEFAULT_SITE_SETTINGS, ...mapSettingsFromRow(setRes.data) });
      } else {
        setSettings(DEFAULT_SITE_SETTINGS);
      }
    } catch (err) {
      console.warn("Could not fetch site content from Supabase, using local fallback", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllContent();

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('site_content_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        loadAllContent();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kpis' }, () => {
        loadAllContent();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, () => {
        loadAllContent();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'studio_values' }, () => {
        loadAllContent();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        loadAllContent();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadAllContent]);

  const refreshContent = async () => {
    await loadAllContent();
  };

  // Seed default data into Supabase if admin wants to initialize the database
  const seedInitialData = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const projectRows = [
        ...VIGNETTE_PROJECTS.map((p, idx) => mapProjectToRow({ ...p, gridType: 'grid1', order: idx })),
        ...DETAILED_PROJECTS.map((p, idx) => mapProjectToRow({ ...p, gridType: 'grid2', order: VIGNETTE_PROJECTS.length + idx })),
      ];
      await supabase.from('projects').upsert(projectRows, { onConflict: 'id' });

      const kpiRows = KPI_METRICS.map((k, i) => mapKpiToRow({ ...k, order: i }));
      await supabase.from('kpis').upsert(kpiRows, { onConflict: 'id' });

      const storyRows = SUCCESS_STORIES.map((s, i) => mapStoryToRow({ ...s, order: i }));
      await supabase.from('stories').upsert(storyRows, { onConflict: 'id' });

      const valueRows = STUDIO_VALUES.map((v, i) => mapValueToRow({ id: `val-${i + 1}`, ...v, order: i }));
      await supabase.from('studio_values').upsert(valueRows, { onConflict: 'id' });

      await supabase.from('site_settings').upsert(mapSettingsToRow(DEFAULT_SITE_SETTINGS), { onConflict: 'id' });

      await loadAllContent();
    } catch (e) {
      console.error("Error seeding initial data", e);
      throw e;
    }
  };

  // Split projects based on grid preference
  const vignetteProjects = projects.filter(p => !p.gridType || p.gridType === 'grid1' || p.gridType === 'both');
  const detailedProjects = projects.filter(p => p.gridType === 'grid2' || p.gridType === 'both');

  return (
    <SiteContentContext.Provider
      value={{
        projects,
        vignetteProjects: vignetteProjects.length > 0 ? vignetteProjects : VIGNETTE_PROJECTS,
        detailedProjects: detailedProjects.length > 0 ? detailedProjects : DETAILED_PROJECTS,
        kpis,
        stories,
        values,
        settings,
        loading,
        refreshContent,
        seedInitialData
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};

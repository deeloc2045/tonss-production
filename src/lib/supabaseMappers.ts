import { ProjectItem, KpiMetric, SuccessStory, BlogPost } from '../types';
import type { SiteSettings, StudioValue } from '../context/SiteContentContext';

export const mapProjectFromRow = (row: any): ProjectItem => ({
  id: row.id,
  title: row.title || '',
  category: row.category || 'cinema',
  categoryLabel: row.category_label ?? row.categoryLabel ?? '',
  badge: row.badge || '',
  year: row.year || '',
  shortDesc: row.short_desc ?? row.shortDesc ?? '',
  fullDesc: row.full_desc ?? row.fullDesc ?? '',
  client: row.client || '',
  image: row.image || '',
  bannerImage: row.banner_image ?? row.bannerImage ?? '',
  trailerVideoUrl: row.trailer_video_url ?? row.trailerVideoUrl ?? '',
  appDownloadUrl: row.app_download_url ?? row.appDownloadUrl ?? '',
  appPlatform: row.app_platform ?? row.appPlatform ?? 'iOS & Android',
  rating: row.rating || '',
  duration: row.duration || '',
  techStack: Array.isArray(row.tech_stack) ? row.tech_stack : Array.isArray(row.techStack) ? row.techStack : [],
  directorOrLead: row.director_or_lead ?? row.directorOrLead ?? '',
  impactMetric: row.impact_metric ?? row.impactMetric ?? '',
  featured: Boolean(row.featured),
  gridType: row.grid_type ?? row.gridType ?? 'both',
  order: row.sort_order ?? row.order ?? 0,
});

export const mapProjectToRow = (p: Partial<ProjectItem> & { id?: string }) => ({
  ...(p.id ? { id: p.id } : {}),
  title: p.title ?? '',
  category: p.category ?? 'cinema',
  category_label: p.categoryLabel ?? '',
  badge: p.badge ?? '',
  year: p.year ?? '',
  short_desc: p.shortDesc ?? '',
  full_desc: p.fullDesc ?? '',
  client: p.client ?? '',
  image: p.image ?? '',
  banner_image: p.bannerImage ?? '',
  trailer_video_url: p.trailerVideoUrl ?? '',
  app_download_url: p.appDownloadUrl ?? '',
  app_platform: p.appPlatform ?? 'iOS & Android',
  rating: p.rating ?? '',
  duration: p.duration ?? '',
  tech_stack: p.techStack ?? [],
  director_or_lead: p.directorOrLead ?? '',
  impact_metric: p.impactMetric ?? '',
  featured: Boolean(p.featured),
  grid_type: p.gridType ?? 'both',
  sort_order: p.order ?? 0,
  updated_at: new Date().toISOString(),
});

export const mapKpiFromRow = (row: any): KpiMetric => ({
  id: row.id,
  value: row.value || '',
  numberValue: Number(row.number_value ?? row.numberValue ?? 0),
  suffix: row.suffix || '',
  label: row.label || '',
  subtext: row.subtext || '',
  iconName: row.icon_name ?? row.iconName ?? 'Film',
  trend: row.trend || '',
});

export const mapKpiToRow = (k: Partial<KpiMetric> & { id?: string; order?: number }) => ({
  ...(k.id ? { id: k.id } : {}),
  value: k.value ?? '',
  number_value: Number(k.numberValue ?? 0),
  suffix: k.suffix ?? '',
  label: k.label ?? '',
  subtext: k.subtext ?? '',
  icon_name: k.iconName ?? 'Film',
  trend: k.trend ?? '',
  ...(typeof k.order === 'number' ? { sort_order: k.order } : {}),
  updated_at: new Date().toISOString(),
});

export const mapStoryFromRow = (row: any): SuccessStory => ({
  id: row.id,
  title: row.title || '',
  client: row.client || '',
  category: row.category || '',
  result: row.result || '',
  quote: row.quote || '',
  author: row.author || '',
  role: row.role || '',
  image: row.image || '',
});

export const mapStoryToRow = (s: Partial<SuccessStory> & { id?: string; order?: number }) => ({
  ...(s.id ? { id: s.id } : {}),
  title: s.title ?? '',
  client: s.client ?? '',
  category: s.category ?? '',
  result: s.result ?? '',
  quote: s.quote ?? '',
  author: s.author ?? '',
  role: s.role ?? '',
  image: s.image ?? '',
  ...(typeof s.order === 'number' ? { sort_order: s.order } : {}),
  updated_at: new Date().toISOString(),
});

export const mapValueFromRow = (row: any): StudioValue => ({
  id: row.id,
  icon: row.icon || 'Lightbulb',
  title: row.title || '',
  description: row.description || '',
  order: row.sort_order ?? row.order ?? 0,
});

export const mapValueToRow = (v: Partial<StudioValue>) => ({
  ...(v.id ? { id: v.id } : {}),
  icon: v.icon ?? 'Lightbulb',
  title: v.title ?? '',
  description: v.description ?? '',
  ...(typeof v.order === 'number' ? { sort_order: v.order } : {}),
  updated_at: new Date().toISOString(),
});

export const mapSettingsFromRow = (row: any): SiteSettings => ({
  heroBadge: row.hero_badge ?? row.heroBadge,
  heroTitle: row.hero_title ?? row.heroTitle,
  heroSubtitle: row.hero_subtitle ?? row.heroSubtitle,
  heroShowreelUrl: row.hero_showreel_url ?? row.heroShowreelUrl,
  heroBgImage: row.hero_bg_image ?? row.heroBgImage,
  contactEmail: row.contact_email ?? row.contactEmail,
  contactPhone: row.contact_phone ?? row.contactPhone,
  contactAddress: row.contact_address ?? row.contactAddress,
  whatsappNumber: row.whatsapp_number ?? row.whatsappNumber,
  socialFacebook: row.social_facebook ?? row.socialFacebook,
  socialInstagram: row.social_instagram ?? row.socialInstagram,
  socialTiktok: row.social_tiktok ?? row.socialTiktok,
  socialYoutube: row.social_youtube ?? row.socialYoutube,
  manifestoQuote: row.manifesto_quote ?? row.manifestoQuote,
});

export const mapSettingsToRow = (s: SiteSettings) => ({
  id: 'general',
  hero_badge: s.heroBadge ?? '',
  hero_title: s.heroTitle ?? '',
  hero_subtitle: s.heroSubtitle ?? '',
  hero_showreel_url: s.heroShowreelUrl ?? '',
  hero_bg_image: s.heroBgImage ?? '',
  contact_email: s.contactEmail ?? '',
  contact_phone: s.contactPhone ?? '',
  contact_address: s.contactAddress ?? '',
  whatsapp_number: s.whatsappNumber ?? '',
  social_facebook: s.socialFacebook ?? '',
  social_instagram: s.socialInstagram ?? '',
  social_tiktok: s.socialTiktok ?? '',
  social_youtube: s.socialYoutube ?? '',
  manifesto_quote: s.manifestoQuote ?? '',
  updated_at: new Date().toISOString(),
});

export const mapBlogPostFromRow = (row: any): BlogPost => ({
  id: row.id,
  title: row.title || '',
  slug: row.slug || '',
  category: row.category || 'cinema',
  categoryLabel: row.category_label ?? row.categoryLabel ?? '',
  readTime: row.read_time ?? row.readTime ?? '5 min de lecture',
  date: row.date || '',
  author: row.author || '',
  authorRole: row.author_role ?? row.authorRole ?? '',
  excerpt: row.excerpt || '',
  content: row.content || '',
  image: row.image || '',
  featured: Boolean(row.featured),
});

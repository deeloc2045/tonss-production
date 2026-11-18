export interface ProjectItem {
  id: string;
  title: string;
  category: 'cinema' | 'audiovisuel' | 'tech' | 'mobile';
  categoryLabel: string;
  badge: string;
  year: string;
  shortDesc: string;
  fullDesc: string;
  client?: string;
  image: string;
  bannerImage?: string;
  trailerVideoUrl?: string;
  appDownloadUrl?: string;
  appPlatform?: 'iOS & Android' | 'Web & SaaS' | 'VR & WebGL' | 'Cross-Platform';
  rating?: string;
  duration?: string;
  techStack?: string[];
  directorOrLead?: string;
  impactMetric?: string;
  featured?: boolean;
  gridType?: 'grid1' | 'grid2' | 'both';
  order?: number;
}

export interface KpiMetric {
  id: string;
  value: string;
  numberValue: number;
  suffix?: string;
  label: string;
  subtext: string;
  iconName: string;
  trend?: string;
}

export interface SuccessStory {
  id: string;
  title: string;
  client: string;
  category: string;
  result: string;
  quote: string;
  author: string;
  role: string;
  image: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'production' | 'tech' | 'process';
  categoryLabel: string;
  iconName?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'cinema' | 'tech' | 'sound' | 'backstage';
  categoryLabel: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  excerpt: string;
  content: string;
  image: string;
  featured?: boolean;
}

export type DomainPaymentProvider = 'wave' | 'orange_money';
export type DomainOrderStatus = 'PENDING' | 'PAID' | 'ACTIVE' | 'FAILED';

export interface DomainOrder {
  id: string;
  user_id: string | null;
  domain_name: string;
  years: number;
  amount_fcfa: number;
  payment_provider: DomainPaymentProvider;
  payment_ref: string | null;
  logicbox_customer_id: string | null;
  logicbox_contact_id: string | null;
  logicbox_order_id: string | null;
  status: DomainOrderStatus;
  created_at: string;
}

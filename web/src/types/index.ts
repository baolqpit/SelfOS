export type ID = string;

export interface User {
  id: ID;
  username: string;
  email: string;
  createdAt: string;
}

export interface MediaItem {
  publicId: string;
  url: string;
  type: 'image' | 'video' | 'raw';
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  alt?: string;
}

export type RichText = { type: 'doc'; content: unknown[] };

export interface Profile {
  userId: ID;
  fullName: string;
  dateOfBirth?: string | null;
  address?: string | null;
  email: string;
  phone?: string | null;
  occupation?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  coverUrl?: string | null;
  coverPublicId?: string | null;
  socialLinks?: Record<string, string | undefined> | null;
}

export interface Project {
  id: ID;
  userId: ID;
  slug: string;
  name: string;
  summary?: string | null;
  content: RichText | Record<string, unknown>;
  contentHtml?: string | null;
  coverUrl?: string | null;
  coverPublicId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  teamSize?: number | null;
  technologies: string[];
  results?: string | null;
  revenueAmount?: string | number | null;
  revenueCurrency?: string | null;
  client?: string | null;
  role?: string | null;
  links?: { label: string; url: string }[] | null;
  gallery?: MediaItem[] | null;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyVlog {
  id: ID;
  userId: ID;
  slug: string;
  title: string;
  content: RichText | Record<string, unknown>;
  contentHtml?: string | null;
  coverUrl?: string | null;
  videos?: MediaItem[] | null;
  images?: MediaItem[] | null;
  publishedAt?: string | null;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Knowledge {
  id: ID;
  userId: ID;
  slug: string;
  title: string;
  content: RichText | Record<string, unknown>;
  contentHtml?: string | null;
  method?: string | null;
  source?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  certificateUrl?: string | null;
  certificatePublicId?: string | null;
  images?: MediaItem[] | null;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DisplaySettings {
  theme: 'light' | 'dark' | 'system' | string;
  accentColor?: string | null;
  layout: 'grid' | 'list' | 'magazine';
  modulesVisibility: {
    profile: {
      visible: boolean;
      fields: Partial<Record<keyof Profile, boolean>>;
    };
    projects: { visible: boolean; showRevenue: boolean; showClient: boolean };
    daily: { visible: boolean };
    knowledge: { visible: boolean; showCertificates: boolean };
  };
  seo?: { title?: string; description?: string; ogImageUrl?: string } | null;
  customDomain?: string | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

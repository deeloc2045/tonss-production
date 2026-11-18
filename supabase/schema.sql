-- ============================================================================
-- TONSS PRODUCTION - Schema SQL pour Supabase auto-hébergé (PostgreSQL)
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Table utilisateurs & rôles (synchronisée avec auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'client', 'admin')),
  last_active timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  ) or (auth.jwt() ->> 'email') in ('deeloc2045@gmail.com', 'deeloc2045agmail.com');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    coalesce(new.email, ''),
    case
      when new.email in ('deeloc2045@gmail.com', 'deeloc2045agmail.com') then 'admin'
      else coalesce(new.raw_user_meta_data ->> 'role', 'user')
    end
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.users enable row level security;

drop policy if exists "Users can view own profile or admin all" on public.users;
create policy "Users can view own profile or admin all"
  on public.users for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update own presence" on public.users;
create policy "Users can update own presence"
  on public.users for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "Admin can insert or delete users" on public.users;
create policy "Admin can insert or delete users"
  on public.users for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- 2. Boutique de Domaines : table domain_orders
-- ============================================================================
create table if not exists public.domain_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  domain_name text not null,
  years integer not null default 1 check (years >= 1 and years <= 10),
  amount_fcfa integer not null check (amount_fcfa >= 0),
  payment_provider text not null check (payment_provider in ('wave', 'orange_money')),
  payment_ref text unique,
  logicbox_customer_id text,
  logicbox_contact_id text,
  logicbox_order_id text,
  status text not null default 'PENDING' check (status in ('PENDING', 'PAID', 'ACTIVE', 'FAILED')),
  created_at timestamptz not null default now()
);

create index if not exists idx_domain_orders_user_id on public.domain_orders(user_id);
create index if not exists idx_domain_orders_domain_name on public.domain_orders(domain_name);
create index if not exists idx_domain_orders_payment_ref on public.domain_orders(payment_ref);
create index if not exists idx_domain_orders_status on public.domain_orders(status);

alter table public.domain_orders enable row level security;

drop policy if exists "Users read own domain orders or admin all" on public.domain_orders;
create policy "Users read own domain orders or admin all"
  on public.domain_orders for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Authenticated users create own domain orders" on public.domain_orders;
create policy "Authenticated users create own domain orders"
  on public.domain_orders for insert
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admin updates domain orders" on public.domain_orders;
create policy "Admin updates domain orders"
  on public.domain_orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- 3. Tables CMS du site (projets, kpis, témoignages, valeurs, paramètres, blog)
-- ============================================================================
create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  category text not null check (category in ('cinema', 'audiovisuel', 'tech', 'mobile')),
  category_label text not null default '',
  badge text not null default '',
  year text not null default '',
  short_desc text not null default '',
  full_desc text not null default '',
  client text default '',
  image text not null default '',
  banner_image text default '',
  trailer_video_url text default '',
  app_download_url text default '',
  app_platform text default 'iOS & Android',
  rating text default '',
  duration text default '',
  tech_stack jsonb not null default '[]'::jsonb,
  director_or_lead text default '',
  impact_metric text default '',
  featured boolean default false,
  grid_type text default 'both' check (grid_type in ('grid1', 'grid2', 'both')),
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects" on public.projects for select using (true);
drop policy if exists "Admin write projects" on public.projects;
create policy "Admin write projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.kpis (
  id text primary key default gen_random_uuid()::text,
  value text not null,
  number_value numeric not null default 0,
  suffix text default '',
  label text not null,
  subtext text not null default '',
  icon_name text not null default 'Film',
  trend text default '',
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kpis enable row level security;
drop policy if exists "Public read kpis" on public.kpis;
create policy "Public read kpis" on public.kpis for select using (true);
drop policy if exists "Admin write kpis" on public.kpis;
create policy "Admin write kpis" on public.kpis for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.stories (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  client text not null,
  category text not null default '',
  result text not null default '',
  quote text not null,
  author text not null,
  role text not null default '',
  image text default '',
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stories enable row level security;
drop policy if exists "Public read stories" on public.stories;
create policy "Public read stories" on public.stories for select using (true);
drop policy if exists "Admin write stories" on public.stories;
create policy "Admin write stories" on public.stories for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.studio_values (
  id text primary key default gen_random_uuid()::text,
  icon text not null default 'Lightbulb',
  title text not null,
  description text not null,
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.studio_values enable row level security;
drop policy if exists "Public read studio_values" on public.studio_values;
create policy "Public read studio_values" on public.studio_values for select using (true);
drop policy if exists "Admin write studio_values" on public.studio_values;
create policy "Admin write studio_values" on public.studio_values for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.site_settings (
  id text primary key default 'general',
  hero_badge text,
  hero_title text,
  hero_subtitle text,
  hero_showreel_url text,
  hero_bg_image text,
  contact_email text,
  contact_phone text,
  contact_address text,
  whatsapp_number text,
  social_facebook text,
  social_instagram text,
  social_tiktok text,
  social_youtube text,
  manifesto_quote text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings" on public.site_settings for select using (true);
drop policy if exists "Admin write site_settings" on public.site_settings;
create policy "Admin write site_settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.blog_posts (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text not null unique,
  category text not null check (category in ('cinema', 'tech', 'sound', 'backstage')),
  category_label text not null,
  read_time text not null default '5 min de lecture',
  date text not null,
  author text not null,
  author_role text not null default '',
  excerpt text not null,
  content text not null,
  image text not null default '',
  featured boolean default false,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
drop policy if exists "Public read blog_posts" on public.blog_posts;
create policy "Public read blog_posts" on public.blog_posts for select using (true);
drop policy if exists "Admin write blog_posts" on public.blog_posts;
create policy "Admin write blog_posts" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- 4. Contacts, Espace Client, Messagerie & Journal d'Activité
-- ============================================================================
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text default '',
  service text not null,
  budget text default '',
  message text not null default '',
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;
drop policy if exists "Public insert contacts" on public.contacts;
create policy "Public insert contacts" on public.contacts for insert with check (true);
drop policy if exists "Admin read contacts" on public.contacts;
create policy "Admin read contacts" on public.contacts for select using (public.is_admin());

create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  status text default 'En cours',
  step integer default 1,
  action_url text default '',
  action_label text default 'Visionner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.client_projects enable row level security;
drop policy if exists "Client reads own projects" on public.client_projects;
create policy "Client reads own projects" on public.client_projects for select using (auth.uid() = client_id or public.is_admin());
drop policy if exists "Admin manages client_projects" on public.client_projects;
create policy "Admin manages client_projects" on public.client_projects for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.client_files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text default 'document',
  size text default '',
  label text default '',
  file_url text default '',
  action_label text default 'Ouvrir',
  created_at timestamptz not null default now()
);

alter table public.client_files enable row level security;
drop policy if exists "Client reads own files" on public.client_files;
create policy "Client reads own files" on public.client_files for select using (auth.uid() = client_id or public.is_admin());
drop policy if exists "Admin manages client_files" on public.client_files;
create policy "Admin manages client_files" on public.client_files for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('admin', 'client')),
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversation_messages_client on public.conversation_messages(client_id, created_at);

alter table public.conversation_messages enable row level security;
drop policy if exists "Participants read conversation" on public.conversation_messages;
create policy "Participants read conversation"
  on public.conversation_messages for select
  using (auth.uid() = client_id or public.is_admin());

drop policy if exists "Participants send messages" on public.conversation_messages;
create policy "Participants send messages"
  on public.conversation_messages for insert
  with check ((auth.uid() = client_id and sender_id = auth.uid()) or public.is_admin());

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  action text not null,
  details text not null default '',
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;
drop policy if exists "Authenticated insert activity_logs" on public.activity_logs;
create policy "Authenticated insert activity_logs"
  on public.activity_logs for insert
  with check (auth.uid() is not null);

drop policy if exists "Admin read activity_logs" on public.activity_logs;
create policy "Admin read activity_logs"
  on public.activity_logs for select
  using (public.is_admin());

-- ============================================================================
-- 5. Stockage médias (Supabase Storage) & Realtime
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media bucket" on storage.objects;
create policy "Public read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Admin upload media bucket" on storage.objects;
create policy "Admin upload media bucket"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

-- Activer Realtime sur les tables dynamiques (ignorer si déjà ajoutées)
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'projects', 'kpis', 'stories', 'studio_values', 'site_settings',
    'blog_posts', 'contacts', 'users', 'client_projects', 'client_files',
    'conversation_messages', 'activity_logs', 'domain_orders'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    exception when duplicate_object then
      null;
    end;
  end loop;
end $$;

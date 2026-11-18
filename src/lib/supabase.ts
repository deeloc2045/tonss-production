import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const safeUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const safeAnonKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(safeUrl, safeAnonKey);
  }
  return browserClient;
}

export const supabase = getSupabaseBrowserClient();

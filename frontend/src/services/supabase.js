import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = () => {
  if (!rawUrl || !rawKey) return false;
  if (rawUrl === 'https://your-supabase-project.supabase.co' || rawUrl.includes('placeholder')) return false;
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

let client = null;
if (isSupabaseConfigured()) {
  try {
    client = createClient(rawUrl, rawKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    client = null;
  }
}

export const supabase = client;
export default supabase;

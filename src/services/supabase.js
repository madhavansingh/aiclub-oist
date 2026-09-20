/**
 * AI Club OIST — Supabase Client Configuration
 * Initializes connection to managed PostgreSQL backend using public anon credentials.
 * Row Level Security (RLS) is strictly enforced on all queries.
 */

import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are provided and not default placeholders
const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

let client = null;

if (isConfigured) {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-application-name': 'aiclub-oist-web',
      },
    },
  });
}

export const isSupabaseConfigured = isConfigured;
export const supabase = client;

// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {});

let rawUrl = (env.VITE_SUPABASE_URL || '').trim();

// Normalización automática si se ingresó solo el Project ID
if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = `https://${rawUrl}.supabase.co`;
}

const supabaseUrl = rawUrl;
const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://yjesqvzwugzdtkjjqcew.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZXNxdnp3dWd6ZHRrampxY2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTMzOTcsImV4cCI6MjEwNDE2OTM5N30.wcRMcG0jaKkFZ1VKQHawRjTiujGvwiPaODrQ5m4Es-I';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
  return createBrowserClient(url, key);
}

// Singleton for client components
let client;
export function getSupabase() {
  if (!client) {
    client = createClient();
  }
  return client;
}

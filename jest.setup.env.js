// Stub env vars required by src/lib/supabase.ts so tests can import it without crashing.
// The pure-helper tests never call supabase, so these values are never used for real requests.
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

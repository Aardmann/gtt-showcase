const SUPABASE_URL = "https://vtmdateqrrrkqbpeedrx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bWRhdGVxcnJya3FicGVlZHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjAwMTAsImV4cCI6MjA3NjgzNjAxMH0.5ydzJnACZrldXIMf3LAOJVsmb6BFEers1nJTv_QorrU";

// Renamed to avoid global scope naming collision with the Supabase CDN script
let supabaseClient = null;

if (typeof supabase !== "undefined" && SUPABASE_URL && SUPABASE_ANON_KEY) {
  // Use the global createClient function provided by the CDN
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase client not initialized. Check that config/supabase.js is loaded after the Supabase CDN script.");
}
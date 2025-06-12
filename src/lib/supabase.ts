import { createClient } from "@supabase/supabase-js";

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that we have the required configuration
if (!supabaseUrl) {
  throw new Error(
    "Missing VITE_SUPABASE_URL environment variable. Please create a .env.local file with your Supabase URL."
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_ANON_KEY environment variable. Please create a .env.local file with your Supabase anon key."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export types for TypeScript
export type { User, Session } from "@supabase/supabase-js";

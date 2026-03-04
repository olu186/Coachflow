import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export type SupabaseClient = ReturnType<typeof createClient<Database>>;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Create a Supabase client. Use in both web and mobile apps.
 * Pass url and anonKey from env (NEXT_PUBLIC_SUPABASE_* or EXPO_PUBLIC_SUPABASE_*).
 */
export function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient<Database>(url, anonKey);
}

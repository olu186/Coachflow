import { createClient } from "@supabase/supabase-js";
import type { Database } from "@coachflow/api-types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!url || !serviceRoleKey) {
  console.warn("Supabase admin client: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabaseAdmin =
  url && serviceRoleKey
    ? createClient<Database>(url, serviceRoleKey, { auth: { persistSession: false } })
    : null;

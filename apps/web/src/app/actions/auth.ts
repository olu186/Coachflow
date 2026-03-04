"use server";

import { createClient } from "@/lib/supabase/server";

/** Call after signup when role is trainer to ensure a trainers row exists. */
export async function ensureTrainerRow() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data: existing } = await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!existing) {
    // SSR client types don't infer Database; insert is safe at runtime
    await (supabase as any).from("trainers").insert({
      user_id: user.id,
      business_name: null,
      subscription_plan: null,
      stripe_customer_id: null,
    });
  }
}

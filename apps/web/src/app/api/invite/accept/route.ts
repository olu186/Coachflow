import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@coachflow/api-types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = typeof body.token === "string" ? body.token : null;
  const accessToken = typeof body.access_token === "string" ? body.access_token : null;
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const { data: invite } = (await supabaseAdmin
    .from("client_invites")
    .select("id, email, trainer_id, expires_at")
    .eq("token", token)
    .maybeSingle()) as {
    data: { id: string; email: string; trainer_id: string; expires_at: string } | null;
  };
  if (!invite) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 400 });
  }
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invite expired" }, { status: 400 });
  }

  let userId: string | null = null;
  if (accessToken) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    const supabaseAuth = createClient<Database>(url, anonKey);
    const { data: { user } } = await supabaseAuth.auth.getUser(accessToken);
    userId = user?.id ?? null;
  } else {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error: insertError } = (await (supabaseAdmin as any).from("clients").insert({
    user_id: userId,
    trainer_id: invite.trainer_id,
    status: "active",
    start_date: new Date().toISOString().slice(0, 10),
  })) as { error: unknown };
  if (insertError) {
    const err = insertError as { code?: string };
    if (err.code === "23505") {
      return NextResponse.json({ error: "Already linked to this trainer" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to link client" }, { status: 500 });
  }

  await supabaseAdmin.from("client_invites").delete().eq("id", invite.id);

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ valid: false, email: null }, { status: 200 });
  }
  const { data: invite, error } = (await supabaseAdmin
    .from("client_invites")
    .select("id, email, trainer_id, expires_at")
    .eq("token", token)
    .maybeSingle()) as {
    data: { id: string; email: string; trainer_id: string; expires_at: string } | null;
    error: unknown;
  };
  if (error || !invite) {
    return NextResponse.json({ valid: false, email: null }, { status: 200 });
  }
  const expired = new Date(invite.expires_at) < new Date();
  if (expired) {
    return NextResponse.json({ valid: false, email: null }, { status: 200 });
  }
  return NextResponse.json({
    valid: true,
    email: invite.email,
    trainer_id: invite.trainer_id,
  });
}

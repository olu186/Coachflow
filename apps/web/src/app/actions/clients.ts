"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { sendInviteEmail } from "@/lib/email";

const INVITE_EXPIRY_DAYS = 7;
const APP_INVITE_SCHEME = "coachflow://invite";

function buildInviteLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (baseUrl) {
    return `${baseUrl}/invite?token=${encodeURIComponent(token)}`;
  }
  return `${APP_INVITE_SCHEME}?token=${token}`;
}

export async function inviteClientAction(
  trainerId: string,
  email: string
): Promise<{
  error?: string;
  inviteLink?: string;
  emailSent?: boolean;
  emailError?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trainerRow } = (await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .single()) as { data: { id: string } | null };
  if (trainerRow?.id !== trainerId) {
    return { error: "Unauthorized" };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);
  const normalizedEmail = email.trim().toLowerCase();

  const { error: insertError } = (await (supabase as any)
    .from("client_invites")
    .insert({
      trainer_id: trainerId,
      email: normalizedEmail,
      token,
      expires_at: expiresAt.toISOString(),
    })) as { error: unknown };

  if (insertError) {
    const err = insertError as { message?: string; code?: string };
    if (err.code === "23505") return { error: "An invite for this email already exists." };
    return { error: err.message ?? "Failed to create invite." };
  }

  const inviteLink = buildInviteLink(token);
  const emailResult = await sendInviteEmail(normalizedEmail, inviteLink);

  return {
    inviteLink,
    emailSent: emailResult.ok,
    ...(emailResult.ok ? {} : { emailError: emailResult.error }),
  };
}

export async function updateClientAction(
  clientId: string,
  data: { status?: string; start_date?: string | null }
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trainerRow } = (await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .single()) as { data: { id: string } | null };
  if (!trainerRow) return { error: "Unauthorized" };

  const { error } = (await (supabase as any)
    .from("clients")
    .update(data)
    .eq("id", clientId)
    .eq("trainer_id", trainerRow.id)) as { error: unknown };

  if (error) return { error: (error as { message: string }).message };
  return {};
}

export async function deleteClientAction(clientId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trainerRow } = (await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .single()) as { data: { id: string } | null };
  if (!trainerRow) return { error: "Unauthorized" };

  const { error } = (await (supabase as any)
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("trainer_id", trainerRow.id)) as { error: unknown };

  if (error) return { error: (error as { message: string }).message };
  return {};
}

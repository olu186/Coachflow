import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { InviteClientForm } from "./InviteClientForm";
import type { Profile } from "@coachflow/api-types";

export default async function InviteClientPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/clients/new");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: Profile | null };
  if (profile?.role !== "trainer") redirect("/dashboard");

  const { data: trainerRow } = (await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .single()) as { data: { id: string } | null };
  const trainerId = trainerRow?.id ?? "";
  if (!trainerId) redirect("/dashboard");

  return (
    <div className="space-y-6 max-w-lg">
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to clients
      </Link>
      <div>
        <h2 className="text-xl font-semibold text-foreground">Invite client</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Send an invite link to open signup in the CoachFlow mobile app. The client will be linked to you.
        </p>
      </div>
      <InviteClientForm trainerId={trainerId} />
    </div>
  );
}

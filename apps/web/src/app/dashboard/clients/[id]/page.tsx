import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ClientTabs } from "./ClientTabs";
import { ClientActions } from "./ClientActions";
import type { Client } from "@coachflow/api-types";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/clients/" + id);

  const { data: trainerRow } = (await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .single()) as { data: { id: string } | null };
  const trainerId = trainerRow?.id ?? "";

  const { data: client } = (await supabase
    .from("clients")
    .select("id, user_id, status, start_date")
    .eq("id", id)
    .eq("trainer_id", trainerId)
    .single()) as { data: Client | null };

  if (!client) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back to clients
        </Link>
      </div>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Client</h2>
          <p className="text-sm text-muted-foreground">
            Status: {client.status} · Started {client.start_date ?? "—"}
          </p>
        </div>
        <ClientActions
          clientId={id}
          status={client.status}
          startDate={client.start_date}
        />
      </header>
      <ClientTabs clientId={id} />
    </div>
  );
}

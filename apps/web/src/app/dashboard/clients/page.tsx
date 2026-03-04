import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Search, MessageSquare, ClipboardList } from "lucide-react";
import type { Client } from "@coachflow/api-types";
export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/clients");

  const { data: trainerRow } = (await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .single()) as { data: { id: string } | null };
  const trainerId = trainerRow?.id ?? "";

  const { data: clients } = (await supabase
    .from("clients")
    .select("id, user_id, status, start_date")
    .eq("trainer_id", trainerId)
    .order("created_at", { ascending: false })) as { data: Client[] | null };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search clients…"
            className="w-full rounded-button border border-border bg-background py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            defaultValue="active"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="overdue">Overdue</option>
          </select>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Client
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-background shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-medium text-foreground">Name</th>
              <th className="px-4 py-3 font-medium text-foreground">Plan</th>
              <th className="px-4 py-3 font-medium text-foreground">Sessions this week</th>
              <th className="px-4 py-3 font-medium text-foreground">Last active</th>
              <th className="px-4 py-3 font-medium text-foreground">Payment status</th>
              <th className="px-4 py-3 font-medium text-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No clients yet. Add your first client to get started.
                </td>
              </tr>
            ) : (
              (clients ?? []).map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href={`/dashboard/clients/${c.id}`} className="hover:underline">
                      Client
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-muted-foreground">—</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      Paid
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Assign program"
                      >
                        <ClipboardList className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Message"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile, Client } from "@coachflow/api-types";
import Link from "next/link";
import {
  Users,
  DollarSign,
  ClipboardList,
  AlertCircle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single()) as { data: Profile | null };

  if (profile?.role !== "trainer") redirect("/client/home");

  const { data: trainerRow } = (await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .single()) as { data: { id: string } | null };
  const trainerId = trainerRow?.id ?? "";

  const { count: clientCount } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("trainer_id", trainerId);

  const kpis = [
    {
      label: "Active Clients",
      value: clientCount ?? 0,
      icon: Users,
      trend: null,
      href: "/dashboard/clients",
    },
    {
      label: "Monthly Revenue",
      value: "—",
      icon: DollarSign,
      trend: null,
      href: "/dashboard/payments",
    },
    {
      label: "Upcoming Check-ins",
      value: "—",
      icon: ClipboardList,
      trend: null,
      href: "/dashboard/check-ins",
    },
    {
      label: "Outstanding Payments",
      value: "—",
      icon: AlertCircle,
      trend: null,
      href: "/dashboard/payments",
    },
  ];

  const { data: clients } = (await supabase
    .from("clients")
    .select("id, status, start_date")
    .eq("trainer_id", trainerId)
    .limit(10)) as { data: Client[] | null };

  const clientRows = (clients ?? []).map((c) => ({
    id: c.id,
    name: "Client",
    lastSession: "—",
    compliance: "—",
    status: c.status,
  }));

  return (
    <div className="space-y-8">
      <section>
        <h2 className="sr-only">KPIs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-card flex items-start justify-between gap-4 border border-border bg-background p-5 shadow-soft transition-shadow hover:shadow-card"
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
              </div>
              <div className="rounded-button flex h-10 w-10 items-center justify-center bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Client snapshot</h2>
          <Link
            href="/dashboard/clients"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-card border border-border bg-background shadow-soft">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 font-medium text-foreground">Name</th>
                <th className="px-4 py-3 font-medium text-foreground">Last session</th>
                <th className="px-4 py-3 font-medium text-foreground">Compliance %</th>
                <th className="px-4 py-3 font-medium text-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {clientRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No clients yet. Add your first client to get started.
                  </td>
                </tr>
              ) : (
                clientRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.lastSession}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.compliance}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/clients/${row.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        View <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2" />
        <aside className="rounded-card border border-border bg-background p-5 shadow-soft">
          <h3 className="font-semibold text-foreground">Upcoming tasks</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>3 check-ins due</li>
            <li>2 unpaid clients</li>
            <li>1 expiring subscription</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}

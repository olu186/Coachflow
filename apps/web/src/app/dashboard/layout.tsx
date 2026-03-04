import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@coachflow/api-types";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: Profile | null };

  if (profile?.role !== "trainer") redirect("/client/home");

  // Ensure trainer has a row (e.g. signed up before ensureTrainerRow existed)
  const { data: existingTrainer } = (await supabase
    .from("trainers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle()) as { data: { id: string } | null };
  if (!existingTrainer) {
    await (supabase as any).from("trainers").insert({
      user_id: user.id,
      business_name: null,
      subscription_plan: null,
      stripe_customer_id: null,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="min-h-screen transition-[margin] duration-200 ease-out" style={{ marginLeft: "var(--sidebar-width, 240px)" }}>
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

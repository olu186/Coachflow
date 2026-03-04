import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Profile } from "@coachflow/api-types";

export default async function ClientHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/client/home");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single() as { data: Profile | null };

  if (profile?.role !== "client") redirect("/dashboard");

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">CoachFlow</h1>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign out
          </button>
        </form>
      </header>
      <div className="max-w-4xl">
        <h2 className="text-lg font-semibold mb-2">Client Home</h2>
        <p className="text-gray-600">
          Welcome, {profile?.name ?? user.email}. Use the CoachFlow mobile app to view
          workouts and log your progress.
        </p>
      </div>
    </main>
  );
}

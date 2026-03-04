"use client";

import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const titleByPath: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/clients": "Clients",
  "/dashboard/programs": "Programs",
  "/dashboard/check-ins": "Check-ins",
  "/dashboard/payments": "Payments",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

function getTitle(pathname: string): string {
  if (titleByPath[pathname]) return titleByPath[pathname];
  if (pathname.startsWith("/dashboard/clients/") && pathname !== "/dashboard/clients")
    return "Client";
  if (pathname === "/dashboard/clients/new") return "Invite client";
  return "Dashboard";
}

export function Topbar() {
  const pathname = usePathname();
  const [name, setName] = useState<string | null>(null);
  const supabase = createClient();
  const title = getTitle(pathname);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = (await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single()) as { data: { name: string | null } | null };
      setName(profile?.name ?? user.email ?? null);
    };
    load();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{name ?? "…"}</span>
      </div>
    </header>
  );
}

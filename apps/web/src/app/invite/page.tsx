"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const APP_SCHEME = "coachflow://invite";

function InviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [triedOpen, setTriedOpen] = useState(false);

  const deepLink = token ? `${APP_SCHEME}?token=${token}` : null;

  useEffect(() => {
    if (!deepLink) return;
    // Try to open the app; on mobile this often works from browser. Don't do it on desktop.
    const isLikelyMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      typeof navigator !== "undefined" ? navigator.userAgent : ""
    );
    if (!isLikelyMobile) return;
    setTriedOpen(true);
    window.location.href = deepLink;
  }, [deepLink]);

  if (!token) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold text-foreground">Invalid invite link</h1>
          <p className="text-sm text-muted-foreground mt-2">
            This invite link is missing or invalid. Ask your trainer to send a new one.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm space-y-6">
        <h1 className="text-xl font-bold text-foreground">Open in CoachFlow</h1>
        <p className="text-sm text-muted-foreground">
          {triedOpen
            ? "If the app didn’t open, tap the button below to open the CoachFlow app and sign up."
            : "Tap the button below to open the CoachFlow app and sign up with your trainer."}
        </p>
        <a
          href={deepLink!}
          className="inline-block rounded-button bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open in CoachFlow app
        </a>
        <p className="text-xs text-muted-foreground">
          Don’t have the app? Install CoachFlow from the App Store or Google Play, then open this page again.
        </p>
      </div>
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground">Loading…</p>
        </main>
      }
    >
      <InviteContent />
    </Suspense>
  );
}

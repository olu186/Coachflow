"use client";

import { useState } from "react";
import { OverviewTab } from "./OverviewTab";
import { ProgramsTab } from "./ProgramsTab";
import { LogsTab } from "./LogsTab";
import { BillingTab } from "./BillingTab";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "programs", label: "Programs" },
  { id: "logs", label: "Logs" },
  { id: "billing", label: "Billing" },
] as const;

export function ClientTabs({ clientId }: { clientId: string }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("overview");

  return (
    <div>
      <div className="border-b border-border">
        <nav className="flex gap-6" aria-label="Client sections">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                active === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-6">
        {active === "overview" && <OverviewTab clientId={clientId} />}
        {active === "programs" && <ProgramsTab clientId={clientId} />}
        {active === "logs" && <LogsTab clientId={clientId} />}
        {active === "billing" && <BillingTab clientId={clientId} />}
      </div>
    </div>
  );
}

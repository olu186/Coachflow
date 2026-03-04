export function OverviewTab({ clientId }: { clientId: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-card border border-border bg-background p-5 shadow-soft">
          <h3 className="font-semibold text-foreground">Profile & subscription</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Subscription status, next payment date, and profile details will appear here.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-card border border-border bg-background p-5 shadow-soft">
          <h3 className="font-semibold text-foreground">Weight</h3>
          <p className="mt-2 text-sm text-muted-foreground">Weight graph placeholder.</p>
        </div>
        <div className="rounded-card border border-border bg-background p-5 shadow-soft">
          <h3 className="font-semibold text-foreground">Attendance</h3>
          <p className="mt-2 text-sm text-muted-foreground">Attendance heatmap placeholder.</p>
        </div>
        <div className="rounded-card border border-border bg-background p-5 shadow-soft">
          <h3 className="font-semibold text-foreground">Recent messages</h3>
          <p className="mt-2 text-sm text-muted-foreground">Messages preview placeholder.</p>
        </div>
      </div>
    </div>
  );
}

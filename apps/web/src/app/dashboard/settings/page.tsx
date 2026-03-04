export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Account and business settings.
      </p>
      <div className="rounded-card border border-border bg-background p-6 shadow-soft">
        <h3 className="font-semibold text-foreground">Profile</h3>
        <p className="mt-2 text-sm text-muted-foreground">Name, email, business name.</p>
      </div>
      <div className="rounded-card border border-border bg-background p-6 shadow-soft">
        <h3 className="font-semibold text-foreground">Subscription</h3>
        <p className="mt-2 text-sm text-muted-foreground">Plan and billing (Phase 6).</p>
      </div>
    </div>
  );
}

export function BillingTab({ clientId }: { clientId: string }) {
  return (
    <div className="rounded-card border border-border bg-background p-6 shadow-soft">
      <h3 className="font-semibold text-foreground">Billing & payments</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Stripe subscription status and payment history will appear here (Phase 6).
      </p>
    </div>
  );
}

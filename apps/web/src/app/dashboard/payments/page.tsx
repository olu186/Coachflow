export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Revenue and client billing. Stripe integration in Phase 6.
      </p>
      <div className="rounded-card border border-border bg-background p-6 shadow-soft">
        <h3 className="font-semibold text-foreground">Monthly recurring revenue</h3>
        <p className="mt-2 text-sm text-muted-foreground">Revenue chart placeholder.</p>
      </div>
      <div className="overflow-hidden rounded-card border border-border bg-background shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-medium text-foreground">Client</th>
              <th className="px-4 py-3 font-medium text-foreground">Plan</th>
              <th className="px-4 py-3 font-medium text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                No billing data yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

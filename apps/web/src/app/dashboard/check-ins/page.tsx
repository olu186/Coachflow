export default function CheckInsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Weekly check-in summary. See who submitted, weight change, and notes. (Phase 8)
      </p>
      <div className="overflow-hidden rounded-card border border-border bg-background shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-medium text-foreground">Client</th>
              <th className="px-4 py-3 font-medium text-foreground">Submitted?</th>
              <th className="px-4 py-3 font-medium text-foreground">Weight change</th>
              <th className="px-4 py-3 font-medium text-foreground">Notes preview</th>
              <th className="px-4 py-3 font-medium text-foreground"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                No check-in data yet. Set up weekly questions in Settings.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-card border border-border bg-background p-5 shadow-soft">
        <h3 className="font-semibold text-foreground">Compliance trends</h3>
        <p className="mt-2 text-sm text-muted-foreground">Graph section: compliance over time.</p>
      </div>
    </div>
  );
}

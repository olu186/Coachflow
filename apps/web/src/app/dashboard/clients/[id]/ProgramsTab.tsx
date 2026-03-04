export function ProgramsTab({ clientId }: { clientId: string }) {
  return (
    <div className="rounded-card border border-border bg-background p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Assigned programs</h3>
        <button
          type="button"
          className="rounded-button bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Assign new
        </button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        No programs assigned yet. Assign a program from the Programs page.
      </p>
    </div>
  );
}

export function LogsTab({ clientId }: { clientId: string }) {
  return (
    <div className="rounded-card border border-border bg-background p-6 shadow-soft">
      <h3 className="font-semibold text-foreground">Workout history</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Timeline of completed workouts with exercises and PR highlights will appear here.
      </p>
    </div>
  );
}

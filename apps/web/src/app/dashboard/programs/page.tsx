import { Plus, GripVertical } from "lucide-react";

export default function ProgramsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Create and assign workout programs to clients.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Create program
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="rounded-card border border-border bg-background p-5 shadow-soft lg:col-span-1">
          <h3 className="font-semibold text-foreground">Exercise library</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse and add exercises. (Phase 4)
          </p>
        </aside>
        <div className="rounded-card border border-dashed border-border bg-muted/30 p-12 text-center lg:col-span-2">
          <GripVertical className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">Drag area to build workout</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Save as template, duplicate, assign to client.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { updateClientAction, deleteClientAction } from "@/app/actions/clients";

export function ClientActions({
  clientId,
  status,
  startDate,
}: {
  clientId: string;
  status: string;
  startDate: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editStatus, setEditStatus] = useState(status);
  const [editStartDate, setEditStartDate] = useState(startDate ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave() {
    setError(null);
    setSaving(true);
    const result = await updateClientAction(clientId, {
      status: editStatus,
      start_date: editStartDate || null,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setError(null);
    setDeleting(true);
    const result = await deleteClientAction(clientId);
    setDeleting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/dashboard/clients");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {editing ? (
        <div className="flex flex-wrap items-center gap-2 rounded-card border border-border bg-background p-3">
          {error && (
            <p className="w-full text-sm text-danger">{error}</p>
          )}
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
            className="rounded-button border border-border bg-background px-2 py-1.5 text-sm"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="overdue">Overdue</option>
          </select>
          <input
            type="date"
            value={editStartDate}
            onChange={(e) => setEditStartDate(e.target.value)}
            className="rounded-button border border-border bg-background px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-button bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-button border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Delete this client?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-button bg-danger px-3 py-1.5 text-sm font-medium text-white hover:bg-danger/90 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-button border border-border px-3 py-1.5 text-sm hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-danger/10 hover:text-danger hover:border-danger/30"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          )}
        </>
      )}
    </div>
  );
}

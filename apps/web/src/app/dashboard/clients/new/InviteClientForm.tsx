"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inviteClientAction } from "@/app/actions/clients";
import { CheckCircle2 } from "lucide-react";

export function InviteClientForm({ trainerId }: { trainerId: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInviteLink(null);
    setInvitedEmail(null);
    setEmailSent(false);
    setEmailError(null);
    setLoading(true);
    const result = await inviteClientAction(trainerId, email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.inviteLink) {
      setInviteLink(result.inviteLink);
      setInvitedEmail(email.trim());
      setEmailSent(result.emailSent ?? false);
      setEmailError(result.emailError ?? null);
      setEmail("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-danger/10 text-danger text-sm p-3">
          {error}
        </div>
      )}
      {inviteLink && (
        <div className="rounded-card border border-emerald-500/50 bg-emerald-500/10 p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold">
              {emailSent
                ? "Invite sent successfully"
                : "Invite link created"}
            </p>
          </div>
          {emailSent && invitedEmail && (
            <p className="text-sm text-muted-foreground">
              An email with the invite link was sent to <strong>{invitedEmail}</strong>. They can also use the link below.
            </p>
          )}
          {!emailSent && (
            <p className="text-xs text-muted-foreground">
              {emailError
                ? `Link created but email could not be sent (${emailError}). Copy the link below to share with your client.`
                : "Copy the link below and send it to your client. They open it on their phone to sign up in the CoachFlow app."}
            </p>
          )}
          <div className="flex gap-2">
            <input
              readOnly
              value={inviteLink}
              className="flex-1 rounded-button border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(inviteLink)}
              className="rounded-button border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Copy
            </button>
          </div>
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Client email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="client@example.com"
          className="w-full rounded-button border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-button bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create invite link"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/clients")}
          className="rounded-button border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

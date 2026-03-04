import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "CoachFlow <onboarding@resend.dev>";

export type SendInviteEmailResult = { ok: true } | { ok: false; error: string };

/**
 * Send client invite email with the invite link. No-op if RESEND_API_KEY is not set.
 */
export async function sendInviteEmail(to: string, inviteLink: string): Promise<SendInviteEmailResult> {
  if (!resend) {
    return { ok: false, error: "Email not configured (RESEND_API_KEY)" };
  }

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: to.trim().toLowerCase(),
      subject: "You're invited to CoachFlow",
      html: `
        <p>You've been invited to join CoachFlow as a client.</p>
        <p>On your phone, tap the link below. It will open the CoachFlow app so you can sign up and get started:</p>
        <p><a href="${inviteLink}" style="word-break: break-all;">${inviteLink}</a></p>
        <p>If you don't have the app yet, install CoachFlow from the App Store or Google Play, then tap the link again.</p>
        <p>This invite expires in 7 days.</p>
      `,
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return { ok: false, error: message };
  }
}

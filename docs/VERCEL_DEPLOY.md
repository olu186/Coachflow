# Deploy CoachFlow web app to Vercel (step-by-step)

Deploying the web app gives you an HTTPS URL (e.g. `https://coachflow.vercel.app`) for invite links so clients can tap the link in email and open the mobile app.

**Important:** `.env.local` and `.env` are not pushed to GitHub (they’re in `.gitignore` to keep secrets safe). You must add the same variables in Vercel’s dashboard so the deployed app can sign in and call Supabase.

---

## Fix: Sign in / Sign up not working after deploy

If you already deployed and sign in or sign up fails, the app is missing environment variables. Add them in Vercel:

1. Open [vercel.com](https://vercel.com) → your **CoachFlow** project.
2. Go to **Settings** → **Environment Variables**.
3. Add these (use the **exact same values** as in your local `apps/web/.env.local`):

   | Name | Value | Required |
   |------|--------|----------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) | Yes |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (secret) | Yes (for invites) |
   | `NEXT_PUBLIC_APP_URL` | Your Vercel app URL (e.g. `https://coachflow-xxx.vercel.app`) | For invite links |
   | `RESEND_API_KEY` | Your Resend API key | Optional (invite emails) |

   Add each for **Production** (and **Preview** if you want). Save.

4. **Redeploy:** go to **Deployments** → **…** on the latest deployment → **Redeploy**. Wait for the build to finish.

After the redeploy, sign in and sign up should work.

---

## Fix: "Safari cannot open the page because the address is invalid"

This usually happens when the **invite link in the email** is a custom link (`coachflow://invite?token=...`) and the **CoachFlow app is not installed** on the client’s phone. iOS doesn’t know what to do with `coachflow://` and shows that error.

**Fix:** Use **HTTPS** invite links so the client opens a normal webpage first.

1. In Vercel → your project → **Settings** → **Environment Variables**, add or set **`NEXT_PUBLIC_APP_URL`** to your Vercel URL (e.g. `https://coachflow-xxx.vercel.app`). No trailing slash.
2. **Redeploy** the project (Deployments → … → Redeploy).

After that, new invite emails will contain a link like `https://your-app.vercel.app/invite?token=...`. When the client taps it, Safari opens that page (no “invalid address”). From that page they tap **“Open in CoachFlow app”** to open the app—which only works if the CoachFlow app is **installed** on their device (TestFlight, App Store, or a dev build). You don’t “deploy” the mobile app like a website; the client must install the app on their phone.

---

## 1. Create a Vercel account

1. Go to [vercel.com](https://vercel.com).
2. Click **Sign Up**.
3. Sign up with **GitHub**, **GitLab**, or **Bitbucket** (recommended so Vercel can connect your repo), or use **Email**.
4. Complete the sign-up and log in.

---

## 2. Push your project to Git (if you haven’t already)

Vercel deploys from a Git repository.

1. Create a new repository on **GitHub** (or GitLab/Bitbucket).
2. In your project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/CoachFlow.git
   git push -u origin main
   ```

   (Use your real repo URL and branch name, e.g. `main` or `master`.)

---

## 3. Import the project on Vercel

1. On Vercel, click **Add New…** → **Project**.
2. **Import** your Git repository (e.g. your CoachFlow repo). Authorize Vercel to access your Git provider if asked.
3. Select the **CoachFlow** repository and click **Import**.

---

## 4. Configure the project (monorepo)

Your app lives in `apps/web`. Tell Vercel to build that folder:

1. **Root Directory**
   - Click **Edit** next to **Root Directory**.
   - Enter: **`apps/web`**.
   - Confirm.

2. **Include files outside Root**
   - In **Settings** → **General**, find **Include source files outside of the Root Directory in the Build Step**.
   - Ensure it is **enabled** (default for newer projects). This lets `apps/web` use `packages/api-types`.

3. **Build and output**
   - **Framework Preset:** Next.js (should be auto-detected).
   - **Build Command:** leave default **`npm run build`** (or `next build`).
   - **Output Directory:** leave default **`.next`**.
   - **Install Command:** leave default **`npm install`**.

---

## 5. Add environment variables (required)

Your local `.env.local` is not in Git, so Vercel has no env vars until you add them. In the Vercel project, go to **Settings** → **Environment Variables** and add the same variables you use in `apps/web/.env.local`. At minimum:

| Name | Value | Notes |
|------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | From Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | For invite validate/accept (keep secret) |
| `NEXT_PUBLIC_APP_URL` | **`https://your-project.vercel.app`** | Replace with your **actual** Vercel URL after first deploy (see step 6) |
| `RESEND_API_KEY` | Your Resend API key | Optional; for sending invite emails |

Add them for **Production** (and optionally Preview if you want). Then save.

---

## 6. Deploy

1. Click **Deploy**.
2. Wait for the build to finish. If it fails, check the build log (often a missing env var or Root Directory).
3. When it succeeds, Vercel shows your app URL, e.g. **`https://coachflow-xxxx.vercel.app`** or a custom domain.

---

## 7. Set `NEXT_PUBLIC_APP_URL` to your real URL

1. Copy the URL Vercel gave you (e.g. `https://coachflow-xxxx.vercel.app`).
2. In Vercel → **Settings** → **Environment Variables**, edit **`NEXT_PUBLIC_APP_URL`** and set it to that URL (e.g. `https://coachflow-xxxx.vercel.app`). No trailing slash.
3. **Redeploy** the project (Deployments → … on latest → Redeploy) so the new value is used. After that, new invite links will use this URL and the `/invite` page will work.

---

## 8. (Optional) Custom domain

In **Settings** → **Domains** you can add a custom domain (e.g. `app.coachflow.com`). Then set **`NEXT_PUBLIC_APP_URL`** to that domain and redeploy.

---

## Summary

- **`NEXT_PUBLIC_APP_URL`** belongs in the **web** app env: in Vercel that’s **Settings → Environment Variables**; locally it’s **`apps/web/.env.local`**.
- The **mobile** app uses **`EXPO_PUBLIC_WEB_APP_URL`** in **`apps/mobile/.env`** and should point to this same Vercel URL so the app can call the invite validate/accept APIs.

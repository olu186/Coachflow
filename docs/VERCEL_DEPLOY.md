# Deploy CoachFlow web app to Vercel (step-by-step)

Deploying the web app gives you an HTTPS URL (e.g. `https://coachflow.vercel.app`) for invite links so clients can tap the link in email and open the mobile app.

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

## 5. Add environment variables

In the Vercel project, go to **Settings** → **Environment Variables** and add the same variables you use locally. At minimum:

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

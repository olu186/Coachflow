# Supabase setup for CoachFlow

Follow these steps so the web and mobile apps can use your Supabase project.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose your **organization**, set a **name** (e.g. `coachflow`), set a **database password** (save it somewhere safe), pick a **region**, then click **Create new project**.
4. Wait until the project is ready (green status).

---

## 2. Get your API keys and URL

1. In the project, open **Settings** (gear) → **API**.
2. Note:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" — keep this secret, server-only)

You’ll use these in step 4.

---

## 3. Run the database migrations

You need to create tables and RLS policies. Run the SQL in this order.

### Option A: SQL Editor (simplest)

1. In Supabase, go to **SQL Editor**.
2. **First migration:** open `supabase/migrations/20240302000000_initial_schema.sql` in your repo, copy its full contents, paste into a new query, and click **Run**.
3. **Second migration:** open `supabase/migrations/20240304000000_client_invites.sql`, copy its full contents, paste into a new query, and click **Run**.

You should see “Success. No rows returned” (or similar) for both.

### Option B: Supabase CLI (optional)

If you use the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

(`YOUR_PROJECT_REF` is the part of your Project URL before `.supabase.co`.)

---

## 4. Configure environment variables

### Web app

Create **one** of these (pick the place you run the web app from):

- **Repo root:** `c:\Projects\Web_Apps\CoachFlow\.env.local`
- **Or** `c:\Projects\Web_Apps\CoachFlow\apps\web\.env.local`

Put in it (use your real values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

For **invite flow** (validate/accept by token and mobile linking):

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Invite links that open the mobile app from email:** Set your web app’s public URL so invite links in emails use HTTPS (they open a web page that then opens the app). Without this, links use `coachflow://` and often don’t open when tapped in email.

```env
NEXT_PUBLIC_APP_URL=https://your-deployed-web-url.vercel.app
```

**Client invite emails (optional):** To send the invite link to the client’s email when the trainer clicks “Create invite link”, add [Resend](https://resend.com) (get an API key, then add to `.env.local`):

```env
RESEND_API_KEY=re_your-api-key
```

Without this, the invite link is still created; the trainer sees it on screen and can copy it to send manually. Optionally set `RESEND_FROM_EMAIL=CoachFlow <invites@yourdomain.com>` after verifying your domain in Resend.

Restart the Next.js dev server after changing env.

### Mobile app (Expo)

Create `c:\Projects\Web_Apps\CoachFlow\apps\mobile\.env` (or use EAS/Expo env):

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

For **invite links** from the mobile app (validate + accept):

```env
EXPO_PUBLIC_WEB_APP_URL=https://your-deployed-web-url.vercel.app
```

Use your real web app URL. For local dev with a device/emulator, use a tunnel URL (e.g. ngrok to `http://localhost:3000`) so the phone can reach the API.

---

## 5. Auth settings (Supabase Dashboard)

1. Go to **Authentication** → **Providers**.
2. **Email** should be **Enabled** (default). Leave it on for email/password signup and login.
3. (Optional) **Authentication** → **URL Configuration**:
   - **Site URL:** your production URL (e.g. `https://your-app.vercel.app`) or `http://localhost:3000` for local dev.
   - **Redirect URLs:** add any extra URLs you use (e.g. `http://localhost:3000/**`, your production URL).

No redirect URL is required for the current CoachFlow web flow; this is only if you add OAuth or email magic links later.

---

## 6. Confirm it works

1. **Web:** From repo root run `npm run dev:web`, open the app in the browser, then:
   - Sign up (choose Trainer or Client).
   - Sign in and check you’re sent to Dashboard (trainer) or Client home (client).
2. If something fails, check the browser console and the terminal for errors, and confirm:
   - `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Both migrations ran without errors in the SQL Editor (or `supabase db push` succeeded).

---

## Checklist

- [ ] Supabase project created
- [ ] Project URL and anon key copied
- [ ] `20240302000000_initial_schema.sql` run in SQL Editor
- [ ] `20240304000000_client_invites.sql` run in SQL Editor
- [ ] `.env.local` (root or `apps/web`) has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] (Optional) `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` for invite validate/accept
- [ ] (Optional) `RESEND_API_KEY` in `.env.local` so client invite emails are sent automatically
- [ ] (Optional) Mobile `.env` with `EXPO_PUBLIC_*` and `EXPO_PUBLIC_WEB_APP_URL` for invite flow
- [ ] Sign up / sign in tested on web

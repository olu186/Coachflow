# CoachFlow

Trainer OS — web dashboard for trainers, mobile app for clients. Built with Next.js, Expo, Supabase, and Turborepo.

## Structure

- **apps/web** — Next.js 14 (App Router, Tailwind) — Trainer dashboard
- **apps/mobile** — Expo (React Native) — Client app
- **packages/api-types** — Shared TypeScript types and Supabase client factory
- **supabase/migrations** — Versioned SQL schema and RLS

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Follow **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** for step-by-step instructions: create project, get URL + keys, run both migrations, set env vars for web and mobile.

3. **Run dev**
   ```bash
   npm run dev:web      # web app
   ```
   Open the URL shown in the terminal (e.g. **http://localhost:3000**). If 3000 is in use, Next.js will use 3001 or 3002 — use the **Local:** URL printed when the server starts.
   **Optional:** Add `apps/web/.env.local` (or root `.env.local`) with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for auth; the app will load without them but login/signup will not work until Supabase is configured.
   For the mobile app (separate install; not in the root workspace to avoid React Native hoisting issues):
   ```bash
   cd apps/mobile && npm install && npx expo start
   ```
   If mobile `npm install` fails on Windows (e.g. `bob` not found during postinstall), try running in a new terminal, or use `npm install --ignore-scripts` then `npx expo start` (some native modules may need a full install later).

## Build

```bash
npm run build           # builds all packages and apps
```

See [BUILD_PLAN.md](./BUILD_PLAN.md) for the full phased build and product decisions.

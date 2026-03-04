# Deploy CoachFlow mobile app (make it installable)

The CoachFlow mobile app is built with **Expo**. To let clients (or testers) install it on their phones, you use **EAS (Expo Application Services)** to build the app and then distribute it via **TestFlight** (iOS) and **Google Play** (Android), or share direct install links for testing.

You do **not** deploy the app to a server like Vercel. You create an **installable build** (IPA for iOS, AAB/APK for Android) and distribute it through Apple’s and Google’s stores or internal testing.

**Quick path for testing:** Install EAS CLI → log in → set env secrets → run `eas build --platform android --profile preview` from `apps/mobile` → share the APK link with your client (easiest). For iOS you need an Apple Developer account and a TestFlight build (see below).

---

## Prerequisites

1. **Expo account** – Sign up at [expo.dev](https://expo.dev).
2. **Apple Developer account** – Required for iOS (TestFlight/App Store). [$99/year](https://developer.apple.com/programs/).
3. **Google Play Developer account** – Required for Android. [One-time $25](https://play.google.com/console/signup).
4. **Env vars for the app** – The app needs `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, and `EXPO_PUBLIC_WEB_APP_URL` (your Vercel URL). Keep these in `apps/mobile/.env` locally; for EAS builds you set them in the EAS dashboard or via `eas secret`.

---

## 1. Install mobile app dependencies (required for EAS)

EAS and `expo config` need the app's dependencies (including `expo-router`) to be installed. From the **mobile app** directory:

```bash
cd apps/mobile
npm install
```

If that fails on a postinstall step (e.g. `'bob' is not recognized` from `react-native-screens`), install without running scripts:

```bash
npm install --ignore-scripts
```

The project includes an **`apps/mobile/.npmrc`** with `ignore-scripts=true` so EAS Build and local install skip postinstall scripts (avoids the same failure on EAS "Install dependencies" phase). Local dev and EAS builds work with this.

---

## 2. Install EAS CLI and log in

From anywhere:

```bash
npm install -g eas-cli
eas login
```

Use your Expo account. If you don’t have a project linked yet, the first build will prompt you to create one.

---

## 3. Configure the project for EAS

From the **mobile app** directory:

```bash
cd apps/mobile
eas build:configure
```

This uses the existing `eas.json` in `apps/mobile`. You can leave the defaults.

---

## 4. Set environment variables for EAS builds

Your app needs Supabase and the web app URL at **build time** (they get baked into the app). Set them in EAS:

```bash
cd apps/mobile
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co" --type string
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_ANON_KEY" --type string
eas secret:create --name EXPO_PUBLIC_WEB_APP_URL --value "https://YOUR_VERCEL_APP.vercel.app" --type string
```

Use your real Supabase URL, anon key, and Vercel URL (no trailing slash). These apply to all EAS builds for this project unless you override them per profile.

---

## 5. Build the app

Run builds from **`apps/mobile`** (monorepo app directory).

**Option A – Preview (internal testing, no store)**

Good for sharing with a few testers or clients. You get a link to install the app.

**iOS (TestFlight-style internal build):**

```bash
cd apps/mobile
eas build --platform ios --profile preview
```

When the build finishes, EAS gives you a link. For **internal distribution** you need an Apple Developer account; EAS can upload to TestFlight so testers install via the TestFlight app.

**Android (APK – easy to share):**

```bash
cd apps/mobile
eas build --platform android --profile preview
```

EAS produces an APK and a download link. Share the link with testers; they can install the APK (they may need to allow “Install from unknown sources” for the browser).

**Option B – Production (App Store / Google Play)**

For public or production builds:

```bash
cd apps/mobile
eas build --platform ios --profile production
eas build --platform android --profile production
```

You’ll be prompted for Apple credentials (for iOS) the first time. For Android, EAS can generate a keystore or use one you provide.

---

## 6. Submit to the stores (so people can install)

After a **production** build succeeds, submit it to the stores:

**iOS – TestFlight / App Store:**

```bash
cd apps/mobile
eas submit --platform ios --latest
```

You’ll need your Apple ID, app-specific password, and (for App Store) App Store Connect setup. TestFlight lets you add testers by email; they install via the TestFlight app.

**Android – Google Play:**

```bash
cd apps/mobile
eas submit --platform android --latest
```

You need a Google Play Developer account and a Play Console app. Upload the AAB to an **Internal testing** or **Closed testing** track, add testers, and they get an install link.

---

## 7. Summary: what to run when

| Goal | What to run |
|------|-------------|
| **First-time setup** | `eas login`, `cd apps/mobile`, `eas build:configure`, set `eas secret` for env vars |
| **Internal testing (Android)** | `cd apps/mobile` → `eas build --platform android --profile preview` → share the APK link |
| **Internal testing (iOS)** | `cd apps/mobile` → `eas build --platform ios --profile preview` → submit to TestFlight, invite testers |
| **Production (stores)** | `eas build --platform all --profile production` then `eas submit --platform ios --latest` and `eas submit --platform android --latest` |

---

## 8. After the app is installable

- **Invite links:** Use **HTTPS** invite links (set `NEXT_PUBLIC_APP_URL` on the web app). The client taps the link → opens your web page → taps “Open in CoachFlow app” → the app opens (only if they’ve already installed CoachFlow).
- **TestFlight (iOS):** Add the client’s email in App Store Connect → TestFlight → testers; they get an invite to install.
- **Android:** Share the Play Store internal-test link, or the direct APK link from a preview build.

You don’t “deploy” the mobile app like a website; you **build** it with EAS and **distribute** it via TestFlight, Play Store, or direct APK/link so clients can install it on their devices.

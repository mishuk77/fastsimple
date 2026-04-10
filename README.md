# FastSimple — Fasting Timer

A dead-simple fasting timer. No bloat, no subscription. Just a beautiful timer, history, and streaks.

## Quick Start

```bash
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## CI/CD Pipeline

This project uses **EAS Build** + **GitHub Actions** for a fully cloud-based build pipeline. No local builds needed.

### How It Works

| Trigger | What Happens | Speed |
|---------|-------------|-------|
| Push JS-only changes to `main` | OTA update via `eas update` | ~30 seconds |
| Push native config changes to `main` | Full EAS build (APK + IPA) | ~10-15 min |
| Manual trigger (Actions tab) | iOS or Android build on demand | ~10-15 min |

### Setup (One-Time)

#### 1. Create an Expo Account
- Sign up at [expo.dev](https://expo.dev)
- Go to **Account Settings → Access Tokens**
- Create a new token (type: Robot, never expires)

#### 2. Link Your Project
```bash
npm install -g eas-cli
eas login
eas init  # This sets your project ID
```
After running `eas init`, update `app.json`:
- Replace `YOUR_PROJECT_ID` in `updates.url` with your actual project ID
- Replace `YOUR_PROJECT_ID` in `extra.eas.projectId` with the same ID

#### 3. Add GitHub Secret
- Go to your GitHub repo → **Settings → Secrets and variables → Actions**
- Click **New repository secret**
- Name: `EXPO_TOKEN`
- Value: paste the token from step 1

#### 4. Register iOS Devices (iOS only)
```bash
eas device:create
```
This generates a URL — open it on your iPhone to register. You need to do this before your first iOS ad-hoc build.

---

## Testing Builds

### Option 1: Expo Go (Fastest — Development)

Best for quick testing during development.

1. Install **Expo Go** from [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Push code to `main` or run `npx expo start --tunnel` locally
3. Scan the QR code with your phone camera (iOS) or Expo Go app (Android)

> **Note:** Expo Go has limitations — it can't run custom native modules. Use a development build for full functionality.

### Option 2: Development Build (Full Native)

For testing with all native features (notifications, haptics, etc.).

1. Trigger a build: push to `main`, or go to **Actions → iOS Build → Run workflow** and select `development`
2. Or run manually: `eas build --platform android --profile development`
3. Once built, install the dev client app on your phone
4. Open it and connect to your dev server (`npx expo start --dev-client`)

### Option 3: Preview Build (Standalone APK/IPA)

The closest to a production app — no dev server needed.

1. Push native changes to `main` (or trigger manually from Actions tab)
2. GitHub Actions automatically builds via EAS
3. Get the download link:
   - **Expo Dashboard:** [expo.dev](https://expo.dev) → Your Project → Builds
   - **GitHub Actions:** Check the workflow run summary for the build link
4. **Android:** Download the `.apk` directly to your phone and install
5. **iOS:** Open the install link on your registered iPhone

### Option 4: OTA Updates (Instant — No Reinstall)

For JS-only changes after you already have a preview build installed:

1. Just push code to `main`
2. GitHub Actions runs `eas update` automatically (~30 seconds)
3. **The app updates on next launch** — no reinstall needed
4. This is the fast path for UI tweaks, bug fixes, and logic changes

### How to Know Which Path Runs

- Changed files in `src/`, `app/`, or `assets/`? → **OTA update** (fast)
- Changed `package.json`, `app.json`, or `eas.json`? → **Full build** (slow but automatic)
- Want to force a build? → Go to **Actions tab → Preview Build → Run workflow**

---

## GitHub Secrets Reference

| Secret | Where to Get It | Required |
|--------|----------------|----------|
| `EXPO_TOKEN` | [expo.dev/settings/access-tokens](https://expo.dev/accounts/[username]/settings/access-tokens) | Yes |

---

## Project Structure

```
app/                    # Expo Router screens (file-based routing)
  (tabs)/               # Bottom tab navigator
    index.tsx           # Timer screen
    history.tsx         # History screen
    settings.tsx        # Settings screen
  pro.tsx               # Pro upgrade (modal)
src/
  components/           # Reusable UI components
  constants/            # Plans, zones, colors, milestones
  hooks/                # Custom React hooks
  screens/              # Screen implementations
  store/                # Zustand state management
  theme/                # Dark/light theme system
  types/                # TypeScript type definitions
  utils/                # Business logic utilities
```

## Tech Stack

- **Framework:** React Native + Expo (SDK 54)
- **Navigation:** Expo Router (file-based)
- **State:** Zustand + AsyncStorage + expo-sqlite
- **Animations:** react-native-reanimated (60fps)
- **CI/CD:** EAS Build + EAS Update + GitHub Actions

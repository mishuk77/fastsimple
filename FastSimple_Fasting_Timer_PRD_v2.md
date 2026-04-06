# PRD: FastSimple — Clean Intermittent Fasting Timer

## Overview

A dead-simple fasting timer that does one thing perfectly: tracks your fasting window. No coaching, no meal logging, no "fasting scores," no articles, no community features, no $70/year subscription. Just a beautiful timer, a history log, and a streak counter.

**Why this wins:** Zero (the market leader) went from free to $70/year. Fastic charges $50/year. Both have become bloated health platforms. Users are furious. The 1-star reviews on both apps are filled with people saying "I just want a timer." We're building exactly that.

**Target users:** Anyone doing intermittent fasting (16:8, 18:6, 20:4, OMAD, custom). Estimated 50M+ Americans have tried IF. The search volume for "fasting timer," "intermittent fasting app," and "fasting tracker" is massive and year-round.

**Build target:** React Native (Expo) for Android + iOS. Ship in 1-2 days.

---

## Competitive Landscape

| App | Downloads | Price | Problem |
|-----|-----------|-------|---------|
| Zero | 10M+ | Free trial → $70/year | Was free, now paywalled. Bloated with articles, "fasting zones," coaching, body metrics |
| Fastic | 10M+ | Free trial → $50/year | Aggressive upsells, meal plans, water tracking, step counter, recipes — massive bloat |
| LIFE Fasting | 5M+ | Free trial → $40/year | Social features, circles, community — unnecessary for solo fasters |
| BodyFast | 10M+ | Free trial → $50/year | "Coaching" upsells, meal plans, weekly fasting plans locked behind paywall |
| Simple | 5M+ | Free trial → $60/year | Food logging, water tracking, "AI nutritionist," lessons — a full health app |

**Every single competitor** has the same pattern: starts as a timer, then enshittifies into a health platform with a $50-70/year subscription. Our positioning is the anti-thesis: **a timer that stays a timer.**

---

## Core Philosophy

1. **Open the app → see the timer → start fasting.** That's it. Zero onboarding.
2. **No account required.** All data stored locally.
3. **No subscription.** Free with optional one-time $3.99 Pro unlock.
4. **No bloat.** No articles, no coaching, no meal logging, no water tracking, no social features, no AI anything.
5. **Fast.** App opens in <1 second. No splash screen. No loading spinners.

---

## Screens

### 1. Timer Screen (Home)

This is 90% of the app experience. A single, beautiful, full-screen timer.

**Fasting state (timer running):**
- Large circular progress ring showing elapsed time vs. target duration
  - **Fluid fill animation:** The ring should fill like liquid pouring, not a rigid arc. Use a smooth easing curve with a subtle glow on the leading edge. Think "satisfying fill" TikToks.
  - **Ghost line — "Beat Yesterday":** A subtle dashed/translucent line on the ring shows where you were at this same elapsed time during your last fast. It's a race against yourself. If you're ahead, the ghost line is behind you. If you're behind, it's ahead. Incredibly motivating without being preachy. Only appears if there's a previous fast to compare against.
- Center of ring: elapsed time in large text (e.g., "14h 32m")
  - **Odometer digit animation:** Each digit rolls/flips like a mechanical counter when it changes, not a static text swap. Use a vertical slide animation with slight overshoot and bounce. This makes the timer feel alive and satisfying to watch.
- Below ring: target duration (e.g., "Goal: 16 hours")
- Below that: start time and projected end time (e.g., "Started 8:00 PM · Ends 12:00 PM")
- Current fasting zone label (subtle, not preachy):
  - 0-12h: "Burning glucose"
  - 12-14h: "Fat burning begins"
  - 14-16h: "Fat burning"  
  - 16-24h: "Autophagy zone"
  - 24h+: "Extended fast"
- **"End Fast" button** — secondary style, bottom of screen
- **Ambient color shift:** The entire screen's background/accent subtly shifts as the fast progresses. Cool indigo at start → teal at midpoint → warm green approaching goal → rich gold/amber when exceeded. The whole UI transforms over the fasting window, giving users a reason to check in ("what color am I at now?"). Same mechanic as sunrise/sunset apps.
- The progress ring uses matching color transitions:
  - 0-50%: indigo/blue gradient
  - 50-75%: teal gradient
  - 75-100%: green gradient
  - 100%+: gold/amber (exceeded goal)
- **Goal reached celebration:** When the timer hits 100% of the target, trigger:
  - Confetti/particle explosion animation bursting from the ring (brief, 2-3 seconds)
  - Strong haptic "thud" (notificationSuccess on iOS, EFFECT_HEAVY_CLICK on Android)
  - The ring briefly glows and pulses
  - A subtle chime sound plays (see Sound Design section)
  - This moment should be screenshot-worthy and shareable

**Not fasting state (timer stopped):**
- Same circular ring, but empty/dimmed
- Center text: "Ready to fast"
- Last fast summary card: "Last fast: 16h 12m · 2 hours ago"
- Current streak badge: "🔥 12 day streak"
  - **Growing streak fire:** The fire icon visually scales with streak length. It's not just an emoji — it's a custom animated flame component:
    - Days 1-6: Small single flame, gentle flicker
    - Days 7-13: Medium flame, slightly taller, warmer color
    - Days 14-29: Large flame with ember particles rising
    - Days 30-59: Roaring double flame, intense glow effect
    - Days 60-99: Triple flame with radiating heat waves
    - Days 100+: Crown of fire with golden sparkle particles 👑🔥
  - The flame animates continuously with a subtle flicker (Lottie or react-native-reanimated)
- **"Start Fast" button** — primary CTA, large, prominent, bottom of screen
- Quick-select fasting plan chips above the button:
  - 16:8 (default, pre-selected)
  - 18:6
  - 20:4
  - OMAD (23:1)
  - Custom
- Tapping a chip just sets the target duration. That's all.

**Timer behavior:**
- Timer runs in the background using local notifications
- When target is reached: send a notification "🎉 You hit your 16-hour goal!"
- Timer continues counting past the goal (doesn't stop automatically)
- User manually ends the fast when they eat

### 2. History Screen

Accessed via bottom tab or swipe. Shows past fasts in reverse chronological order.

**Elements:**
- **Calendar heatmap** at top (GitHub contribution style)
  - Each day is a cell
  - Color intensity = fast duration (light = short, dark = long/hit goal)
  - Empty/gray = no fast logged
  - Shows current month by default, swipeable to previous months
  - Today highlighted with a border

- **Stats summary row** below calendar:
  - Current streak: "🔥 12 days"
  - Longest streak: "🏆 34 days"
  - Average fast: "16.3h"
  - Total fasts: "142"

- **Fast history list** below stats:
  - Each entry shows:
    - Date (e.g., "Today" / "Yesterday" / "Mon, Mar 31")
    - Duration (e.g., "16h 12m")
    - Start → End time (e.g., "8:00 PM → 12:12 PM")
    - Goal indicator: ✅ if hit goal, ⚠️ if <75% of goal, ❌ if <50%
  - Tappable to edit (adjust start/end time retroactively)
  - Swipe left to delete

### 3. Settings Screen

Minimal. Accessed via gear icon in header.

**Elements:**
- **Default fasting plan:** dropdown (16:8, 18:6, 20:4, OMAD, Custom)
  - Custom: lets user set any hour target (slider 1-72 hours)
- **Notifications:**
  - Toggle: Goal reached notification (default ON)
  - Toggle: Reminder to start fast (default OFF)
    - If ON: time picker for daily reminder
  - Toggle: Halfway notification (default OFF)
- **Appearance:**
  - Dark mode / Light mode / System default
- **Sound & Haptics:**
  - Toggle: Sound effects (default OFF) — enables start/end/goal/milestone sounds
  - Toggle: Haptic feedback (default ON)
- **Data:**
  - Export data as CSV
  - Clear all data (with confirmation)
- **About:**
  - Version number
  - "Made with ❤️ — No subscriptions, ever."
  - Rate app link
  - Privacy policy link

### 4. Upgrade Screen (optional, non-intrusive)

Only accessible via a subtle "✨ Pro" badge in settings. **Never** shown as a popup, interstitial, or nag screen.

**Pro features ($3.99 one-time purchase):**
- Custom fasting plans (any duration)
- Widget for home screen (shows timer)
- CSV export
- App icon customization (dark, light, minimal)
- Remove the single small banner ad (if using ads)

**Free tier includes everything core:**
- Timer with all preset plans (16:8, 18:6, 20:4, OMAD)
- Full history and calendar
- Streaks and stats
- Notifications
- Dark mode

---

## Engagement & Dopamine Layer

These features make the app *feel* rewarding and drive organic sharing without adding bloat. They're all visual/animation layers on top of the same simple timer — no new data entry, no new workflows, no subscriptions.

### Share Card Generator (Viral Mechanic)

One-tap shareable cards designed for Instagram Stories and TikTok. This is the primary organic growth engine.

**"Share My Fast" card (available during or after a fast):**
- Beautiful dark-mode card (1080x1920px, Stories-ready) showing:
  - Progress ring at current state (with color gradient)
  - Fast duration in large text
  - Fasting zone label
  - Current streak with animated fire tier
  - Start/end times
- Subtle "FastSimple" watermark at bottom — every share is a free ad
- One-tap share via native share sheet (Instagram, TikTok, iMessage, etc.)
- Accessible via a share icon on the timer screen

**"Weekly Recap" card (auto-generated every Sunday):**
- Summary card showing:
  - Total fasting hours this week
  - Fasts completed / fasts missed
  - Streak status (continued, broken, or new personal best)
  - Mini 7-day heatmap strip
  - Longest fast of the week
  - Comparison to previous week: "↑ 3.2 more hours than last week"
- Auto-prompted via notification: "Your weekly fasting recap is ready 📊"
- Tapping the notification opens the recap card with a "Share" button
- The card is generated locally — no server, no account needed

**"Milestone Unlocked" card (on achievement):**
- Generated when a milestone badge is earned (see below)
- Shows the badge artwork, milestone name, and the streak/stat that triggered it
- Pre-formatted for sharing

### Milestone Badges & Achievements

Milestones provide surprise-and-delight moments. They are NOT gamification bloat — there's no points system, no leaderboards, no social comparison. Just personal achievement recognition.

**Streak milestones:**

| Streak | Badge | Name | Visual |
|--------|-------|------|--------|
| 3 days | 🌱 | "Getting Started" | Small green sprout |
| 7 days | ⚡ | "One Week Strong" | Lightning bolt with glow |
| 14 days | 💪 | "Two Week Warrior" | Flexed arm with pulse |
| 21 days | 🧠 | "Habit Formed" | Brain with spark effect |
| 30 days | 🏆 | "Iron Will" | Gold trophy with shine |
| 60 days | 💎 | "Diamond Discipline" | Rotating diamond |
| 100 days | 👑 | "Centurion" | Animated golden crown |
| 365 days | 🌟 | "Full Year" | Supernova explosion |

**Duration milestones (single fast):**

| Duration | Badge | Name |
|----------|-------|------|
| First 16h+ fast | 🎯 | "First Goal" |
| First 20h+ fast | 🔥 | "Warrior Fast" |
| First 24h+ fast | ⭐ | "Full Day" |
| First 36h+ fast | 🚀 | "Extended Explorer" |
| First 48h+ fast | 🏔️ | "Summit" |

**Total fasts milestones:**

| Total | Badge | Name |
|-------|-------|------|
| 10 fasts | 🔟 | "Double Digits" |
| 50 fasts | 🎖️ | "Fifty Strong" |
| 100 fasts | 💯 | "The Century" |
| 500 fasts | 🏅 | "Legendary" |

**How milestones display:**
- When a milestone is reached, it appears as a brief fullscreen celebration overlay (NOT a blocking modal — tappable to dismiss):
  - Badge artwork scales in with a bounce animation
  - Confetti/particles in the background
  - Badge name and congratulatory text
  - "Share" button to generate shareable card
  - Auto-dismisses after 4 seconds if user doesn't interact
- All earned badges visible in a "Badges" section within the History screen
- Unearned badges shown as locked/grayed silhouettes so users know what to aim for

### Sound Design

Subtle, opt-in audio that makes key moments feel tactile. All sounds disabled by default with a toggle in settings ("Sounds: ON/OFF").

| Moment | Sound | Description |
|--------|-------|-------------|
| Start fast | Soft mechanical "click-lock" | Like a vault locking shut. Brief, satisfying, signals commitment |
| Goal reached | Gentle ascending chime | Three-note upward melody, warm and rewarding. NOT an alarm — a celebration |
| End fast | Soft "unlatch" release | Counterpart to start sound. Signals release |
| Milestone unlocked | Brief fanfare sparkle | 1-second magical shimmer sound |
| Halfway notification | Single soft bell | Gentle ping, encouraging |

**Implementation:** Bundle 5 short .wav files (<50KB each). Use expo-av for playback. Total addition to app size: <250KB.

---

## Data Model

All data stored locally using AsyncStorage (or SQLite for better performance with large history).

### Fast Record

```json
{
  "id": "uuid-v4",
  "start_time": "2026-04-05T20:00:00Z",
  "end_time": "2026-04-06T12:12:00Z",
  "target_hours": 16,
  "actual_hours": 16.2,
  "goal_met": true,
  "plan": "16:8",
  "note": ""
}
```

### User Settings

```json
{
  "default_plan": "16:8",
  "custom_target_hours": null,
  "notifications": {
    "goal_reached": true,
    "reminder_enabled": false,
    "reminder_time": "20:00",
    "halfway": false
  },
  "theme": "system",
  "sounds_enabled": false,
  "haptics_enabled": true,
  "is_pro": false,
  "current_fast": {
    "active": true,
    "start_time": "2026-04-05T20:00:00Z",
    "target_hours": 16
  },
  "unlocked_milestones": [
    "streak_3", "streak_7", "streak_14",
    "duration_16", "duration_20",
    "total_10", "total_50"
  ],
  "last_weekly_recap_date": "2026-03-30"
}
```

### Milestone Check Logic

```
function checkMilestones(fasts, currentStreak, unlockedMilestones):
  newlyUnlocked = []

  // Streak milestones
  streakThresholds = {3, 7, 14, 21, 30, 60, 100, 365}
  for threshold in streakThresholds:
    id = "streak_" + threshold
    if currentStreak >= threshold AND id NOT in unlockedMilestones:
      newlyUnlocked.push(id)

  // Duration milestones (check latest fast)
  latestFast = fasts[0]
  durationThresholds = {16: "duration_16", 20: "duration_20", 
                        24: "duration_24", 36: "duration_36", 48: "duration_48"}
  for hours, id in durationThresholds:
    if latestFast.actual_hours >= hours AND id NOT in unlockedMilestones:
      newlyUnlocked.push(id)

  // Total fasts milestones
  totalFasts = fasts.length
  totalThresholds = {10, 50, 100, 500}
  for threshold in totalThresholds:
    id = "total_" + threshold
    if totalFasts >= threshold AND id NOT in unlockedMilestones:
      newlyUnlocked.push(id)

  return newlyUnlocked  // Show celebration overlay for each
```

### Streak Calculation

```
function calculateStreak(fasts):
  Sort fasts by start_time descending
  streak = 0
  expectedDate = today

  for each fast in fasts:
    fastDate = dateOnly(fast.start_time)
    if fastDate == expectedDate:
      if fast.goal_met:
        streak += 1
        expectedDate = expectedDate - 1 day
      else:
        break
    elif fastDate < expectedDate:
      // Missed a day
      break
    // Skip if multiple fasts on same day

  return streak
```

---

## Timer Logic

```
// Starting a fast
function startFast(targetHours):
  currentFast = {
    active: true,
    start_time: now(),
    target_hours: targetHours
  }
  saveToStorage(currentFast)
  scheduleNotification(now() + targetHours, "🎉 You hit your goal!")
  if settings.halfway:
    scheduleNotification(now() + targetHours/2, "💪 Halfway there!")

// Ending a fast
function endFast():
  elapsed = now() - currentFast.start_time
  actualHours = elapsed / 3600000  // ms to hours

  fastRecord = {
    id: uuid(),
    start_time: currentFast.start_time,
    end_time: now(),
    target_hours: currentFast.target_hours,
    actual_hours: round(actualHours, 1),
    goal_met: actualHours >= currentFast.target_hours,
    plan: currentPlan
  }

  appendToHistory(fastRecord)
  clearCurrentFast()
  cancelScheduledNotifications()

// Display timer (updates every second while app is foregrounded)
function getTimerDisplay():
  if !currentFast.active:
    return "Ready to fast"

  elapsed = now() - currentFast.start_time
  hours = floor(elapsed / 3600000)
  minutes = floor((elapsed % 3600000) / 60000)
  seconds = floor((elapsed % 60000) / 1000)

  return { hours, minutes, seconds }

// Progress ring percentage
function getProgress():
  elapsed = now() - currentFast.start_time
  target = currentFast.target_hours * 3600000
  return min(elapsed / target, 1.5)  // Cap at 150% for visual
```

---

## Design System

### Visual Identity
- **App name:** FastSimple
- **Tagline:** "Fasting timer. Nothing else."
- **Icon:** Minimalist circle with a subtle clock tick mark at the 16-hour position, gradient blue-to-green

### Colors

**Dark mode (default):**
- Background: #0A0A0F (near-black)
- Card background: #1A1A24
- Primary accent: #6366F1 (indigo)
- Success/goal: #22C55E (green)
- Progress ring gradient: #6366F1 → #06B6D4 → #22C55E
- Exceeded goal: #F59E0B (amber/gold)
- Text primary: #F8FAFC
- Text secondary: #94A3B8

**Light mode:**
- Background: #FAFBFC
- Card background: #FFFFFF (with subtle shadow)
- Same accent colors but slightly deeper
- Text primary: #0F172A
- Text secondary: #64748B

### Typography
- System fonts (SF Pro on iOS, Roboto on Android)
- Timer digits: 56px, bold, monospace-like weight
- Section headers: 18px, semibold
- Body text: 15px, regular
- Caption/secondary: 13px, regular

### Animation & Motion Design

**This is what separates FastSimple from every other timer app.** The animations should feel like a premium product — smooth, intentional, satisfying.

**Timer animations:**
- Progress ring: fluid liquid-fill animation with smooth easing (cubic-bezier), subtle glow on leading edge, updates every second
- Digit transitions: vertical slide/flip with overshoot bounce (odometer style). Each digit animates independently — when "14h 32m" becomes "14h 33m," only the last digit rolls
- Color shift: background and accent colors interpolate smoothly over the entire fasting window using `Animated.timing` with long durations (hours). The transition should be imperceptible in real-time but obvious when you check back after a few hours
- Ghost line ("Beat Yesterday"): translucent dashed arc that sits on the progress ring, pulsing gently

**Celebration animations:**
- Goal reached: confetti burst from center of ring (use react-native-confetti-cannon or custom particle system), 2-3 second duration, ring pulses with glow effect
- Milestone unlocked: badge scales from 0 → 1.2 → 1.0 with spring physics, background particles radiate outward
- Streak increment: fire component bounces with spring animation when streak count updates

**Micro-interactions:**
- Start fast button: scale down to 0.95 on press, spring back to 1.0 on release + haptic
- End fast button: same pattern
- Plan chip selection: selected chip scales up slightly with background color fill animation
- Tab bar transitions: crossfade between screens (no harsh cuts)
- Calendar heatmap cells: staggered fade-in on scroll (each cell delays 20ms after the previous)
- Share card: slides up from bottom with spring physics

**Haptic patterns:**
- Start fast: `Haptics.impactAsync(ImpactFeedbackStyle.Medium)`
- End fast: `Haptics.impactAsync(ImpactFeedbackStyle.Light)`
- Goal reached: `Haptics.notificationAsync(NotificationFeedbackType.Success)`
- Milestone: `Haptics.notificationAsync(NotificationFeedbackType.Success)`
- Button press: `Haptics.impactAsync(ImpactFeedbackStyle.Light)`

**Libraries:** Use `react-native-reanimated` for all animations (60fps on UI thread). Use `lottie-react-native` for the streak fire and confetti if custom animation is too complex to build from scratch — Lottie files are tiny (<50KB each).

### Design Principles
- **Generous whitespace.** The timer screen should feel calm, not cluttered.
- **No red.** Fasting apps shouldn't feel stressful. Use warm amber for "missed" rather than angry red.
- **Big touch targets.** Start/End buttons should be at least 56px tall.
- **Instant feedback.** Every tap gets haptic + visual response.

---

## App Store Optimization (ASO)

### App Name (30 chars)
**"FastSimple: Fasting Timer"**

### Short Description (80 chars)
"Clean fasting timer. No bloat, no subscription. Track 16:8, 18:6, 20:4, OMAD."

### Long Description Keywords

**Primary (high volume):**
- intermittent fasting app
- fasting timer
- fasting tracker
- 16:8 fasting
- intermittent fasting timer
- fasting app free
- IF tracker

**Secondary:**
- 18:6 fasting timer
- 20:4 fasting
- OMAD tracker
- fasting streak
- fasting calendar
- autophagy timer
- fasting hours tracker
- simple fasting app
- fasting timer no subscription
- free fasting tracker

**Long-tail (low competition, high intent):**
- "fasting app without subscription"
- "simple fasting timer free"
- "fasting tracker no account"
- "clean fasting app"
- "fasting app like Zero but free"
- "intermittent fasting timer no ads"

### Screenshots (5)
1. Timer screen mid-fast with fluid progress ring, odometer digits showing "14h 32m," ambient teal color shift — hero shot
2. Goal reached celebration: ring at 100% gold, confetti burst, "🎉 16:00 reached!" — the money shot for TikTok/IG appeal
3. History screen with calendar heatmap, roaring streak fire (🔥 30 days), and earned badge grid
4. Share card mockup showing the beautiful dark-mode Stories-ready card with progress ring and streak
5. Comparison graphic: "Zero: $70/year. Fastic: $50/year. FastSimple: Free forever." (bold positioning)

### Category
- **Primary:** Health & Fitness
- **Secondary:** Medical (for broader reach)

---

## Monetization

### Free Tier (ship this)
- Full timer functionality with all preset plans
- Complete history with calendar heatmap
- Streaks and stats
- All notifications
- Dark/light mode
- One small banner ad at bottom of history screen only (NOT on timer screen)

### Pro Tier — $3.99 one-time purchase
- Remove ads entirely
- Custom fasting durations (any number of hours)
- Home screen widget
- CSV data export
- Alternate app icons

### Revenue Projections (conservative)
- Month 1: 5,000 downloads, 5% Pro conversion = $750
- Month 3: 25,000 total downloads, 8% conversion = $7,500 cumulative
- Month 6: 100,000 total downloads, 10% conversion = $40,000 cumulative
- Plus ad revenue on free tier (~$0.50-1.00 eCPM)

### What We Will NEVER Do
- Subscription pricing
- Paywalled core features
- Interstitial ads
- Upsell popups
- "Free trial" dark patterns
- Social features
- Meal logging
- Water tracking
- "AI coaching"
- Articles/content
- Any feature that isn't directly about tracking a fasting window

---

## Tech Stack

### Recommended
- **Framework:** React Native with Expo
- **State:** Zustand (lightweight, perfect for this)
- **Storage:** AsyncStorage for settings, expo-sqlite for fast history (performant queries for calendar/stats)
- **Notifications:** expo-notifications (local only, no push server needed)
- **Timer:** useEffect interval while foregrounded + background time calculation from stored start_time
- **Charts/Visualization:** react-native-svg for progress ring, custom calendar heatmap component
- **Animation:** react-native-reanimated (60fps UI thread animations for ring, digits, color shift, celebrations)
- **Lottie:** lottie-react-native for streak fire and confetti (pre-built .json files, tiny bundle size)
- **Share cards:** react-native-view-shot (captures views as images) + expo-sharing
- **Sound:** expo-av for short sound effect playback (~50KB total for all 5 sounds)
- **Haptics:** expo-haptics
- **Navigation:** expo-router or React Navigation (bottom tabs: Timer, History, Settings)
- **IAP:** react-native-iap or expo-in-app-purchases for Pro unlock
- **Ads (optional):** react-native-google-mobile-ads (single banner placement)

### No Backend Required
Everything runs locally. No server, no database, no auth, no API calls. This keeps costs at $0 and privacy at maximum.

### Background Timer Strategy
**Critical implementation detail:** The timer does NOT actually run a background process. Instead:
1. Store `start_time` in persistent storage when fast begins
2. When app is foregrounded, calculate elapsed = now() - start_time
3. Update display every second using setInterval
4. Use local notifications scheduled at goal time for background alerts
5. This approach is battery-efficient and works on both iOS and Android without background task permissions

---

## File Structure

```
/src
  /screens
    TimerScreen.tsx        # Main timer with progress ring
    HistoryScreen.tsx      # Calendar heatmap + fast list + badges
    SettingsScreen.tsx     # Preferences
    ProScreen.tsx          # One-time purchase (non-intrusive)
  /components
    ProgressRing.tsx       # Animated circular progress with fluid fill (SVG + reanimated)
    GhostLine.tsx          # "Beat yesterday" translucent comparison arc
    OdometerDigit.tsx      # Single flip/roll digit animation
    TimerDisplay.tsx       # Composed odometer digits for "14h 32m 18s"
    FastingZoneLabel.tsx   # "Fat burning" / "Autophagy zone" label
    PlanSelector.tsx       # Horizontal chip selector for plans
    CalendarHeatmap.tsx    # GitHub-style contribution calendar
    FastCard.tsx           # Single fast entry in history list
    StatsBadge.tsx         # Streak, average, total stats
    StreakFire.tsx          # Animated growing fire (scales with streak tier)
    ConfettiBurst.tsx      # Particle explosion for goal reached
    MilestoneOverlay.tsx   # Fullscreen badge celebration overlay
    ShareCard.tsx          # Generates shareable image card (react-native-view-shot)
    WeeklyRecap.tsx        # Weekly summary card component
    BadgeGrid.tsx          # Grid of earned/locked badges in history
  /utils
    timer.ts               # Start/end/elapsed calculation logic
    streak.ts              # Streak calculation
    milestones.ts          # Badge/achievement check logic
    shareCard.ts           # Generate and share image cards
    storage.ts             # AsyncStorage/SQLite wrapper
    notifications.ts       # Schedule/cancel local notifications
    format.ts              # Time formatting helpers
    plans.ts               # Fasting plan definitions
    colorShift.ts          # Interpolate background/accent colors based on progress
    sounds.ts              # Play sound effects (expo-av)
  /hooks
    useTimer.ts            # Custom hook for timer state + interval
    useFastHistory.ts      # Custom hook for querying fast records
    useColorShift.ts       # Custom hook for ambient color interpolation
    useMilestones.ts       # Custom hook to check/trigger milestone unlocks
  /assets
    /sounds
      start.wav            # Lock click (~10KB)
      goal.wav             # Ascending chime (~15KB)
      end.wav              # Unlatch release (~10KB)
      milestone.wav        # Sparkle fanfare (~15KB)
      halfway.wav          # Soft bell (~8KB)
    /lottie
      fire-small.json      # Streak fire tier 1-2
      fire-medium.json     # Streak fire tier 3-4
      fire-large.json      # Streak fire tier 5-6
      confetti.json        # Goal reached celebration
  /constants
    plans.ts               # Plan definitions
    zones.ts               # Fasting zone thresholds and labels
    colors.ts              # Theme colors + color shift keyframes
    milestones.ts          # Badge definitions and thresholds
  /theme
    dark.ts
    light.ts
  App.tsx
```

---

## Fasting Plans Reference

```json
{
  "plans": [
    {
      "id": "16:8",
      "name": "16:8",
      "label": "Popular",
      "fast_hours": 16,
      "eat_hours": 8,
      "description": "Fast 16 hours, eat within 8 hours"
    },
    {
      "id": "18:6",
      "name": "18:6",
      "label": "Intermediate",
      "fast_hours": 18,
      "eat_hours": 6,
      "description": "Fast 18 hours, eat within 6 hours"
    },
    {
      "id": "20:4",
      "name": "20:4",
      "label": "Warrior",
      "fast_hours": 20,
      "eat_hours": 4,
      "description": "Fast 20 hours, eat within 4 hours"
    },
    {
      "id": "omad",
      "name": "OMAD",
      "label": "One Meal",
      "fast_hours": 23,
      "eat_hours": 1,
      "description": "One meal a day — 23 hour fast"
    },
    {
      "id": "custom",
      "name": "Custom",
      "label": "Pro",
      "fast_hours": null,
      "eat_hours": null,
      "description": "Set your own fasting window",
      "requires_pro": true
    }
  ]
}
```

---

## Fasting Zones Reference

These are displayed subtly on the timer screen. Keep the language factual, not preachy.

```json
{
  "zones": [
    {
      "min_hours": 0,
      "max_hours": 4,
      "name": "Fed state",
      "icon": "🍽️",
      "color": "#94A3B8",
      "description": "Body is digesting recent meal"
    },
    {
      "min_hours": 4,
      "max_hours": 12,
      "name": "Early fasting",
      "icon": "⏳",
      "color": "#6366F1",
      "description": "Blood sugar normalizing, insulin dropping"
    },
    {
      "min_hours": 12,
      "max_hours": 14,
      "name": "Fat burning starts",
      "icon": "🔥",
      "color": "#F97316",
      "description": "Body transitioning to fat as fuel"
    },
    {
      "min_hours": 14,
      "max_hours": 18,
      "name": "Fat burning",
      "icon": "🔥",
      "color": "#EF4444",
      "description": "Actively burning stored fat"
    },
    {
      "min_hours": 18,
      "max_hours": 24,
      "name": "Autophagy zone",
      "icon": "♻️",
      "color": "#22C55E",
      "description": "Cellular cleanup and renewal"
    },
    {
      "min_hours": 24,
      "max_hours": 999,
      "name": "Extended fast",
      "icon": "⭐",
      "color": "#F59E0B",
      "description": "Deep autophagy and ketosis"
    }
  ]
}
```

**Important:** Include a small disclaimer on the info screen: "Fasting zone times are approximate and vary by individual. Consult a doctor before starting any fasting regimen."

---

## MVP Scope — Ship This Weekend

### In Scope
- [x] Beautiful circular progress ring timer with fluid fill animation
- [x] Odometer-style digit animation on timer
- [x] Ambient color shift across the fasting window
- [x] "Beat Yesterday" ghost line on progress ring
- [x] Start/end fast with one tap
- [x] Preset plans: 16:8, 18:6, 20:4, OMAD
- [x] Timer runs via stored start_time (no background process)
- [x] Fasting zone labels on timer
- [x] Local notifications at goal time and halfway point
- [x] Goal reached confetti/particle celebration with haptic + chime
- [x] Growing streak fire animation (scales with streak tier)
- [x] Milestone badges and achievement system (streak, duration, total milestones)
- [x] Milestone celebration overlay with share option
- [x] Share card generator (Instagram/TikTok Stories-ready, 1080x1920)
- [x] Weekly recap card (auto-generated Sundays)
- [x] Sound effects for key moments (start, goal, end, milestone) — toggle in settings
- [x] History list with all past fasts
- [x] Calendar heatmap (current month + scrollable)
- [x] Streak counter (current + longest) with animated fire
- [x] Stats: average fast, total fasts
- [x] Badge grid showing earned/locked achievements
- [x] Edit/delete past fasts
- [x] Dark mode + light mode
- [x] Settings: default plan, notification toggles, sound toggle
- [x] Haptic feedback on all interactions
- [x] Works 100% offline, no account, no backend

### Out of Scope (V2 / Pro)
- Home screen widget
- Custom fasting durations
- CSV export
- Apple Health / Google Fit integration
- Weekly/monthly summary notifications
- Alternate app icons
- Apple Watch / Wear OS companion
- iCloud/Google backup and sync
- Notes on individual fasts
- Weight tracking integration
- Share streak as image

---

## Launch Strategy

### Day 1-2: Build + Submit
1. Build app with Expo / React Native
2. Generate app icon (minimal circle, indigo-to-green gradient)
3. Create 5 screenshots per platform
4. Write store listing (title, descriptions, keywords — all provided above)
5. Submit to Google Play (review: ~1-3 days)
6. Submit to App Store (review: ~1-2 days)

### Week 1: Seed Distribution
1. Post on r/intermittentfasting (1.5M members): "I was tired of paying $70/year for a timer, so I built a free one"
2. Post on r/fasting (400K members)
3. Post on r/androidapps, r/iOSapps
4. Post on r/sideproject, r/indiehackers
5. Tweet/X thread showing the app vs. competitor pricing

### Week 2-4: Iterate Based on Reviews
1. Respond to every review
2. Fix any bugs immediately
3. Add most-requested feature (likely: widget)
4. Push update to refresh store ranking

### Ongoing: Content Play
1. Title the app listing to rank for "Zero alternative" and "Fastic alternative"
2. Consider a simple landing page (fastsimple.app) for backlinks
3. ASO keyword updates monthly based on Play Console search data

---

## Success Metrics

| Timeframe | Downloads | Rating | Revenue |
|-----------|-----------|--------|---------|
| Week 1 | 500 | 4.5+ | $0 |
| Month 1 | 5,000 | 4.5+ | $500-1,000 |
| Month 3 | 25,000 | 4.5+ | $5,000 cumulative |
| Month 6 | 100,000 | 4.5+ | $20,000 cumulative |

**North star metric:** 7-day retention. If people open the app daily to start/end fasts, we've won. Target: 40%+ D7 retention.

---

## Legal / Health Disclaimer

Include in app (Settings > About) and in store listing:

> "FastSimple is a timer and tracking tool only. It does not provide medical advice. Intermittent fasting may not be appropriate for everyone, including pregnant or nursing women, individuals with eating disorders, and those with certain medical conditions. Consult your healthcare provider before beginning any fasting regimen. Fasting zone descriptions are based on general research and individual results may vary."

---

## Why This Wins

| Factor | Zero/Fastic | FastSimple |
|--------|-------------|------------|
| Price | $50-70/year | Free (Pro: $3.99 once) |
| Time to first fast | 5-10 min (onboarding, account creation, plan selection quiz) | 3 seconds (open → tap start) |
| Account required | Yes | No |
| Internet required | Yes (for account sync) | No |
| Features | Timer + meal log + water tracker + coaching + articles + community + body metrics | Timer + history + streaks |
| App size | 80-150 MB | <15 MB |
| Onboarding screens | 6-12 | 0 |
| Upsell popups per session | 2-5 | 0 |

The positioning is simple: **"It's just a timer. And it's free."**

# Assets Needed Before Store Submission

This file lists every image asset required for store submission and notes whether it already exists in `assets/images/`.

## Status legend

- ✅ Present — file exists at the path listed (dimensions still must be verified manually)
- ❌ Missing — must be created before submission

## App Bundle Assets

| Asset                       | Path                                        | Dimensions       | Notes                                                                                                             | Status                                   |
| --------------------------- | ------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| App icon                    | `assets/images/icon.png`                    | 1024×1024 px     | No transparency; used for both iOS and the Android adaptive icon foreground                                       | ✅ Present (verify size + no alpha)      |
| Adaptive icon foreground    | `assets/images/icon.png`                    | 1024×1024 px     | Currently reused from `icon.png`. Replace with a dedicated `adaptive-icon.png` if you want a different foreground | ❌ Dedicated `adaptive-icon.png` missing |
| Splash image                | `assets/images/splash.png`                  | 1284×2778 px     | Centered logo on `#7B3FF2` background, referenced from `app.json`'s top-level `splash` field                      | ❌ Missing                               |
| Splash icon (modern plugin) | `assets/images/splash-icon.png`             | ~200×200 px logo | Used by `expo-splash-screen` plugin (already configured)                                                          | ✅ Present                               |
| Favicon                     | `assets/images/favicon.png`                 | 48×48 px         | Web favicon                                                                                                       | ✅ Present (verify size)                 |
| Android adaptive background | `assets/images/android-icon-background.png` | 1080×1080 px     | Optional, only used if you switch to image background                                                             | ✅ Present                               |
| Android adaptive foreground | `assets/images/android-icon-foreground.png` | 1080×1080 px     | Optional dedicated foreground                                                                                     | ✅ Present                               |
| Android monochrome icon     | `assets/images/android-icon-monochrome.png` | 1080×1080 px     | Optional, for themed icons                                                                                        | ✅ Present                               |

## App Store (iOS) Screenshots

Required minimums for App Store Connect. All screenshots must show the actual app UI; marketing-only frames are rejected.

| Asset                                    | Dimensions   | Count                 | Status     |
| ---------------------------------------- | ------------ | --------------------- | ---------- |
| iPhone 6.9" (iPhone 15/16 Pro Max)       | 1320×2868 px | 3 minimum             | ❌ Missing |
| iPhone 6.5" (iPhone 11 Pro Max / XS Max) | 1242×2688 px | 3 minimum recommended | ❌ Missing |

## Google Play Screenshots

| Asset             | Dimensions   | Count      | Status     |
| ----------------- | ------------ | ---------- | ---------- |
| Phone screenshots | 1080×1920 px | 2 minimum  | ❌ Missing |
| Feature graphic   | 1024×500 px  | 1 required | ❌ Missing |

## How to Capture Screenshots

1. Run the app in the iOS Simulator at the device sizes above and use `Cmd+S` to save screenshots.
2. For Android, use Android Studio's emulator with a Pixel device profile, or run on a real device.
3. Show the Home / sobriety counter, Daily Reflection, Step Work, and the panic / support screen — these are the strongest narrative shots.

## Reminder

- Never put AA or NA logos or trademarked art in screenshots or icons. The non-affiliation disclaimer in the app does not extend protection to logo misuse.
- The splash background `#7B3FF2` (Recovery Purple) must match the splash image background exactly to avoid a visible seam during launch.

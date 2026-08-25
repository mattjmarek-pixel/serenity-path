# Pre-Submission Checklist — Serenity Path

## Environment & Config

- [ ] DATABASE_URL set in production environment
- [ ] STRIPE_SECRET_KEY set in production environment (server only)
- [ ] EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY set (client-safe)
- [ ] Google Places API key restricted to app bundle ID
- [ ] EAS Project ID set in app.json
- [ ] Apple Team ID set in eas.json
- [ ] App Store Connect App ID set in eas.json

## App Store Connect (Apple)

- [ ] App record created at appstoreconnect.apple.com
- [ ] Bundle ID com.serenitypath.app registered in Apple Developer portal
- [ ] Sign In with Apple capability enabled
- [ ] Push Notifications capability enabled
- [ ] Privacy Policy URL added
- [ ] Age rating questionnaire completed (expect 17+)
- [ ] Screenshots uploaded (6.9" and 6.5" required)
- [ ] Description, keywords, subtitle filled in
- [ ] Encryption question answered (Yes, HTTPS, select exemption)

## Google Play Console

- [ ] App created at play.google.com/console
- [ ] Package name com.serenitypath.app registered
- [ ] Data safety form completed
- [ ] Content rating questionnaire completed
- [ ] Privacy Policy URL added
- [ ] Screenshots uploaded
- [ ] Store listing filled in
- [ ] Internal test track set up

## Legal

- [ ] Privacy Policy live at your domain
- [ ] Terms of Service live at your domain
- [ ] AA/NA disclaimer on WelcomeScreen and Profile
- [ ] No AA or NA logos used in icon or screenshots

## Final Build Checks

- [ ] npm run lint passes
- [ ] npm run check:types passes
- [ ] npm test passes
- [ ] Production build tested on real iOS device via TestFlight
- [ ] Production build tested on real Android device via Internal Testing
- [ ] Crisis phone numbers (988, AA hotline) verified and dialable
- [ ] Push notifications tested on real device
- [ ] Meeting finder tested with real GPS location

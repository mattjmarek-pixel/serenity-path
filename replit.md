# Serenity Path - AA Support App

## Overview

Serenity Path is a mobile application designed to support individuals in Alcoholics Anonymous (AA) recovery. The app provides sobriety tracking, daily reflections, 12 Steps and Traditions reference, journal functionality, and emergency support resources.

Built as a cross-platform React Native application using Expo, with an Express backend server. The app targets iOS, Android, and web platforms with a focus on a calming, supportive user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation v7 with a hybrid structure:
  - Root stack navigator for modal screens (Support, Journal)
  - Bottom tab navigator with 5 tabs (Home, Reflections, Support FAB, Steps, Profile)
  - Nested stack navigators within each tab for screen-specific navigation
- **State Management**: TanStack React Query for server state, React useState for local UI state
- **Styling**: StyleSheet-based with a custom theme system supporting light/dark modes
- **Animations**: React Native Reanimated for smooth animations and gestures
- **Typography**: Custom fonts (Inter for body/UI text, Crimson Pro for headings)
- **Color Scheme**: Official Recovery Colors - WCAG AAA compliant
  - Primary: Recovery Purple (#7B3FF2)
  - Secondary: Healthcare Blue (#3A9BD9)
  - Accent: Growth Green (#06D6A0)
  - Highlight: Engagement Orange (#FB8500)
  - Emergency: Red (#C62828) - Reserved for crisis buttons only
- **Note**: App.tsx loading screen uses hardcoded colors because theme context is unavailable during initial load

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: REST endpoints prefixed with `/api`
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` for shared types between client and server
- **Current Storage**: In-memory storage (`MemStorage`) as placeholder, ready for PostgreSQL integration

### Project Structure
```
client/           # React Native app code
  ├── components/ # Reusable UI components
  ├── screens/    # Screen components
  ├── navigation/ # Navigation configuration
  ├── hooks/      # Custom React hooks
  ├── constants/  # Theme, colors, spacing, daily reflections data
  └── lib/        # API client, query configuration

server/           # Express backend
  ├── index.ts    # Server entry point
  ├── routes.ts   # API route registration
  └── storage.ts  # Data access layer

shared/           # Shared code between client/server
  └── schema.ts   # Drizzle database schema
```

### Authentication Strategy (Planned)
- SSO implementation with Apple Sign-In (required for iOS) and Google Sign-In
- Post-login onboarding flow for sobriety date setup
- Account management with logout confirmation and delete with double confirmation

### Data Persistence
- **Journal Entries**: Stored locally via AsyncStorage (`@serenity_path_journal_entries`)
- **Reflection Bookmarks**: Stored locally via AsyncStorage (`@serenity_path_bookmarks`)
- **Profile Data**: Persisted via AsyncStorage for offline-first experience
- **User Preferences**: Theme, sobriety date stored locally

### Payment System
- **Web**: Stripe integration for subscription payments ($1.99/month or $19.99/year)
- **iOS/Android**: Platform detection shows "Coming Soon" message; native in-app purchases (StoreKit/Play Billing) required for store compliance
- **Stripe Routes**: 
  - `GET /api/stripe/prices` - Fetch subscription prices
  - `POST /api/stripe/create-checkout-session` - Create checkout session

### Legal Compliance
- **Privacy Policy**: Available at `/privacy`
- **Terms of Service**: Available at `/terms`
- **AA Disclaimer**: Displayed in Profile screen footer
- **Support Contact**: Mattjmarek@gmail.com

### Key Features
1. **Sobriety Counter**: Real-time days/hours/minutes tracking with milestone indicators
2. **Sobriety Chips**: Traditional AA chip system with 15 milestone levels (24h through 25 years), progress tracking, animated entrance, and earned/locked states
3. **Daily Check-In**: "How are you feeling?" mood check-in (5 levels: Crisis to Great) with optional notes, persisted via AsyncStorage (`@serenity_path_checkins`)
4. **Mood History**: Visual bar chart showing mood trends over 7/30/90 days with average mood and trend indicators
5. **"I'm Struggling" Panic Button**: Crisis support screen with one-tap sponsor/crisis calls, animated guided breathing exercise (inhale/hold/exhale), grounding exercises (5-4-3-2-1 senses, body scan, safe place visualization)
6. **Daily Gratitude**: "3 things I'm grateful for" daily practice with history, persisted via AsyncStorage (`@serenity_path_gratitude`)
7. **Promises & Prayers**: Expandable cards with Serenity Prayer, AA Promises, Third Step Prayer, Seventh Step Prayer, St. Francis Prayer
8. **Step Work Companion**: Guided reflection questions (4-6 per step) for all 12 Steps with persisted answers via AsyncStorage (`@serenity_path_stepwork`)
9. **Accountability Streaks**: Consecutive-day tracking for check-ins, journal entries, and gratitude with current/longest streak stats
10. **Daily Reflections**: 366 date-based meditation reflections (one per day of year including Feb 29), auto-opens to today's date, with bookmarking (persisted). Data in `client/constants/reflections.ts`
11. **12 Steps & Traditions**: Expandable reference library with reflection tracking and step work progress
12. **Journal**: Mood-tagged personal entries (persisted to AsyncStorage)
13. **Support Resources**: Emergency contacts, sponsor management, crisis hotlines
14. **Support Us**: Platform-aware donation page (Stripe for web, placeholder for native)

## External Dependencies

### Third-Party Services
- **Expo Services**: Build, updates, and development tooling
- **PostgreSQL**: Primary database (via `pg` package and Drizzle ORM)

### Key Libraries
- **expo-blur**: Glass effect headers on iOS
- **expo-haptics**: Tactile feedback for interactions
- **expo-image**: Optimized image loading
- **react-native-gesture-handler**: Touch gesture handling
- **react-native-reanimated**: Smooth animations
- **react-native-keyboard-controller**: Keyboard-aware scroll views
- **zod**: Runtime type validation for API requests/responses

### Development Tools
- **drizzle-kit**: Database migration tooling
- **tsx**: TypeScript execution for server
- **ESLint + Prettier**: Code quality and formatting
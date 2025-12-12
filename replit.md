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
  ├── constants/  # Theme, colors, spacing
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

### Key Features
1. **Sobriety Counter**: Real-time days/hours/minutes tracking with milestone indicators
2. **Daily Reflections**: Date-based meditation content with bookmarking
3. **12 Steps & Traditions**: Expandable reference library with reflection tracking
4. **Journal**: Mood-tagged personal entries
5. **Support Resources**: Emergency contacts, sponsor management, crisis hotlines

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
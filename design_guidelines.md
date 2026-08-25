# Serenity Path - AA Support App Design Guidelines

## Architecture Decisions

### Authentication

**Auth Required**: Yes

- Users need accounts to save sobriety dates, journal entries, sponsor contacts, and track progress
- **SSO Implementation**:
  - Apple Sign-In (required for iOS)
  - Google Sign-In for cross-platform support
- **Onboarding Flow**:
  - After first login, prompt user to set their sobriety start date
  - Optional: Add sponsor contact information
  - Skip options available for all setup steps
- **Account Management**:
  - Profile screen includes log out with confirmation alert
  - Delete account nested under Settings > Account > Delete with double confirmation and warning about data loss

### Navigation Architecture

**Tab Navigation** (5 tabs with center action)

**Tab Structure**:

1. **Home** - Sobriety counter and daily overview
2. **Reflections** - Daily AA meditations and readings
3. **Support** (Center FAB) - Emergency resources and sponsor contacts
4. **Steps** - 12 Steps and 12 Traditions library
5. **Profile** - User settings, journal, and progress tracking

## Screen Specifications

### 1. Home Screen

- **Purpose**: Display sobriety progress and motivational overview
- **Layout**:
  - **Header**: Transparent, no title, right button (Settings gear icon)
  - **Content**: Scrollable view
    - Hero card: Large sobriety counter (days/hours/minutes)
    - Milestone indicator if approaching or achieved milestone
    - Quick stats: Total meetings attended (user input), days since last meeting
    - Today's reflection preview card (tappable to Reflections tab)
    - Upcoming meeting reminder (if user has saved meetings)
  - **Safe Area**: Top inset = headerHeight + Spacing.xl, Bottom inset = tabBarHeight + Spacing.xl
- **Components**: Large stat cards, progress rings, preview cards with right chevron

### 2. Reflections Screen

- **Purpose**: Daily AA meditations and inspirational content
- **Layout**:
  - **Header**: Transparent, title "Daily Reflections", right button (Bookmark icon)
  - **Content**: Scrollable view
    - Date selector (swipe or arrows to change day)
    - Reflection title (centered, large)
    - Reading text (readable typography, generous line spacing)
    - Bookmark button (heart icon, filled when saved)
    - Navigation to previous/next reflection
  - **Safe Area**: Top inset = headerHeight + Spacing.xl, Bottom inset = tabBarHeight + Spacing.xl
- **Components**: Date picker, reading card with serene background, bookmark toggle

### 3. Support Screen (Center FAB Modal)

- **Purpose**: Emergency resources and quick access to support contacts
- **Layout**:
  - **Header**: Modal header, "Support Resources", left button (Close X)
  - **Content**: Scrollable view
    - Emergency hotline card (large, prominent, one-tap call)
      - National AA Hotline: 1-800-XXX-XXXX
      - Crisis Helpline: 988
    - Sponsor contact card (if added)
      - Name, photo placeholder, Call/Text buttons
    - Add/Edit Sponsor button
    - Local resources section
  - **Safe Area**: Top inset = Spacing.xl, Bottom inset = insets.bottom + Spacing.xl
- **Components**: Large CTA buttons with phone icons, contact cards, emergency alert styling (calm but noticeable)

### 4. Steps & Traditions Screen

- **Purpose**: Reference library for 12 Steps and 12 Traditions
- **Layout**:
  - **Header**: Default, title "Steps & Traditions", segmented control (Steps/Traditions)
  - **Content**: Scrollable list
    - Each step/tradition as expandable card
    - Number badge (1-12) with title
    - Tap to expand full text
    - Checkbox to mark as "reflected upon"
  - **Safe Area**: Top inset = Spacing.xl, Bottom inset = tabBarHeight + Spacing.xl
- **Components**: Segmented control, expandable list items, numbered badges, checkboxes

### 5. Profile Screen

- **Purpose**: User settings, journal access, and progress tracking
- **Layout**:
  - **Header**: Transparent, title "Profile"
  - **Content**: Scrollable view
    - Avatar and name display
    - Edit profile button
    - Sobriety start date (editable with date picker)
    - Journal entry button (navigates to Journal screen)
    - Milestones achieved (visual badges)
    - Settings sections:
      - Notifications
      - Privacy
      - Account (with Delete Account)
  - **Safe Area**: Top inset = headerHeight + Spacing.xl, Bottom inset = tabBarHeight + Spacing.xl
- **Components**: Avatar circle, editable fields, list of settings options, achievement badges

### 6. Journal Screen (Stack Navigation from Profile)

- **Purpose**: Personal reflections and daily entries
- **Layout**:
  - **Header**: Default, title "Journal", right button "+ New Entry"
  - **Content**: List view
    - Chronological list of journal entries
    - Each entry shows date, preview text, optional mood indicator
    - Tap to view/edit full entry
  - **Safe Area**: Top inset = Spacing.xl, Bottom inset = tabBarHeight + Spacing.xl
- **Components**: List items with date headers, floating "+ New Entry" button option

### 7. Journal Entry Screen (Modal from Journal)

- **Purpose**: Create or edit journal entry
- **Layout**:
  - **Header**: Modal header, title "New Entry" or date, left button (Cancel), right button (Save)
  - **Content**: Scrollable form
    - Date field (defaults to today)
    - Mood selector (optional emoji/icon picker)
    - Text area for entry (multiline)
  - **Safe Area**: Top inset = Spacing.xl, Bottom inset = keyboard-aware
- **Components**: Form fields, mood picker, large text input

## Design System

### Color Palette

**Primary Theme**: Official Recovery Colors - WCAG AAA Compliant

#### Light Mode

- **Primary**: `#7B3FF2` (Recovery Purple) - For primary actions, active tabs, and app identity
- **Secondary**: `#3A9BD9` (Healthcare Blue) - For trust indicators and secondary actions
- **Accent**: `#06D6A0` (Growth Green) - For success states, milestones, and positive progress
- **Highlight**: `#FB8500` (Engagement Orange) - For engagement elements and call-to-actions
- **Background Root**: `#F8F7FC` (Light Gray) - Main app background
- **Background Default**: `#FFFFFF` (White) - Cards and elevated surfaces
- **Text Primary**: `#1A1A2E` (Near Black) - High contrast for readability
- **Text Secondary**: `#6B6B80` (Gray) - Secondary information
- **Emergency**: `#C62828` (Emergency Red) - Reserved ONLY for crisis/emergency buttons
- **Border**: `#E5E4EB` (Light Border) - Subtle card borders

#### Dark Mode (Enhanced Vibrancy)

- **Primary**: `#A581FF` (Soft Luminous Purple) - Brighter for dark backgrounds
- **Secondary**: `#57B8F0` (Vibrant Sky Blue) - Enhanced visibility
- **Accent**: `#34F0C3` (Vivid Mint Green) - Clear success states
- **Highlight**: `#FFB055` (Warm Amber) - Softer warning tone
- **Background Root**: `#0F0F1A` (Deep Navy) - Dark app background
- **Background Default**: `#1A1A2E` (Dark Purple-Gray) - Cards and surfaces
- **Text Primary**: `#F5F5F7` (Near White) - High contrast readability
- **Text Secondary**: `#A0A0B0` (Muted Gray) - Secondary information
- **Emergency**: `#EF4A45` (Bright Coral Red) - Clear emergency visibility
- **Border**: `#353555` (Dark Border) - Subtle card borders

### Typography

**Font Families**:

- **Headings**: Crimson Pro (Serif) - Elegant, calming aesthetic
- **Body/UI**: Inter (Sans-serif) - Clean, accessible readability

**Type Scale**:

- **Hero**: Crimson Pro, Bold (700), 48pt - Sobriety counter display
- **H1**: Crimson Pro, Semi-Bold (600), 32pt
- **H2**: Crimson Pro, Semi-Bold (600), 24pt
- **H3**: Crimson Pro, Medium (500), 20pt
- **H4**: Crimson Pro, Medium (500), 17pt
- **Body**: Inter, Regular (400), 16pt, line height 1.6
- **Body Bold**: Inter, Semi-Bold (600), 16pt
- **Small**: Inter, Regular (400), 14pt
- **Link**: Inter, Semi-Bold (600), 16pt

### Component Specifications

**Cards**:

- Background: Surface color (#FFFFFF)
- Border radius: 16px
- Padding: Spacing.lg (16-20px)
- NO drop shadow for standard cards
- Subtle border: 1px solid #E2E8F0

**Floating Action Button (Support)**:

- Size: 56x56px
- Border radius: 28px
- Background: Recovery Purple (#7B3FF2)
- Icon: Feather "life-buoy" icon, white
- **Drop Shadow**:
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2
- Press feedback: Scale animation (0.95)

**Buttons**:

- Primary: Background Recovery Purple (#7B3FF2), white text, 48px height, 16px border radius
- Secondary: Border 2px Healthcare Blue (#3A9BD9), Blue text, transparent background
- Success: Background Growth Green (#06D6A0), white text
- Emergency: Background Emergency Red (#C62828), white text, slightly larger (52px height) - ONLY for crisis situations
- Press feedback: Opacity 0.7

**List Items**:

- Height: 72px minimum
- Separator: 1px solid #E2E8F0
- Right chevron: Feather "chevron-right" icon
- Press feedback: Background #F7FAFC

**Tab Bar**:

- Height: 64px (iOS safe area aware)
- Background: White with subtle top border
- Active icon color: Recovery Purple (#7B3FF2)
- Inactive icon color: Text Secondary (#6B7280)
- Center FAB elevates 8px above bar

### Icons

- Use Feather icons from @expo/vector-icons
- Standard icons:
  - Home: "home"
  - Reflections: "book-open"
  - Support (FAB): "life-buoy"
  - Steps: "list"
  - Profile: "user"
  - Settings: "settings"
  - Emergency call: "phone"
  - Journal: "edit-3"
  - Bookmark: "heart"

### Visual Feedback

- All touchable elements have press feedback (opacity or scale)
- Haptic feedback on milestone achievements
- Subtle animation when sobriety counter updates
- Smooth transitions between screens (native stack default)

## Accessibility Requirements

**WCAG AAA Compliance**:

- Minimum touch target: 44x44px
- Color contrast ratio: 7:1 minimum for normal text (AAA standard)
- Color contrast ratio: 4.5:1 minimum for large text and UI components
- Support Dynamic Type (scalable text)
- VoiceOver labels for all interactive elements
- Emergency button clearly labeled and easily accessible with high visibility red (#C62828)
- Sensitive content warnings (optional privacy mode for journal)
- All interactive elements have visible focus states
- Font sizes never below 14pt for readability

## Assets Required

**Critical Assets** (to be generated):

1. **Achievement Badges** (8 total): 24-hour, 7-day, 30-day, 90-day, 6-month, 1-year, 5-year, 10-year milestones - Circular badges with serene aesthetic matching app theme
2. **App Icon**: Incorporating serene blue palette with subtle symbol of hope/growth (no AA logo due to trademark)
3. **Sponsor Avatar Placeholder**: Neutral, calming silhouette in app colors

**Standard System Icons**: Use for all navigation, actions, and UI controls (no custom asset generation needed)

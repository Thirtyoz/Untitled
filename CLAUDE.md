# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PinSeoul** - A mobile app for discovering and collecting AI-generated badges for Seoul landmarks. Built as a React + Vite prototype with Tailwind CSS and shadcn/ui components.

## Development Commands

```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

## Architecture

### Authentication
- **Supabase Auth** for Google OAuth login ([src/supabaseClient.ts](src/supabaseClient.ts))
- **Zustand** for global auth state management ([src/store/useAppStore.ts](src/store/useAppStore.ts))
- Environment variables required in `.env`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Auth state is automatically synced between Supabase sessions and app state in [App.tsx](src/App.tsx)
- Logout is handled via `supabase.auth.signOut()`

### State Management
The app uses **client-side routing via useState** in [App.tsx](src/App.tsx) - not React Router. Navigation is handled through screen state changes:
- Main state: `currentScreen` controls which screen component to render
- Navigation: Screens receive `onNavigate` or specific navigation callbacks (e.g., `onBack`, `onComplete`)
- Local UI state lives in [App.tsx](src/App.tsx) and is passed down as props
- Global auth state managed by Zustand store

### Screen Flow
1. **LoginScreen** → **OnboardingScreen** → **HomeMapScreen** (main hub)
2. From Home, users can navigate to:
   - BadgeDetailScreen
   - CreateBadgeScreen → BadgeResultScreen
   - AIRecommendScreen
   - MyPageScreen
   - RankingScreen

### Theme Implementation
- Light/dark theme is managed via a simple `theme` state in [App.tsx](src/App.tsx)
- No theme provider - theme is passed as props to each screen
- Screens manually handle theme-specific styling with conditional classes

### UI Components
- Located in `src/components/ui/` - these are shadcn/ui components
- Custom wrapper: [ImageWithFallback.tsx](src/components/figma/ImageWithFallback.tsx) handles image loading errors gracefully
- Components use Tailwind CSS v4 with custom CSS variables defined in [src/index.css](src/index.css)

### Path Aliases
Vite is configured with `@` alias pointing to `./src` directory ([vite.config.ts](vite.config.ts#L49)):
```typescript
'@': path.resolve(__dirname, './src')
```

## Adding New Features

### Creating a New Screen
1. Create component in `src/components/[ScreenName].tsx`
2. Add screen type to the `Screen` union type in [App.tsx](src/App.tsx#L13)
3. Add case to `renderScreen()` switch statement in [App.tsx](src/App.tsx#L56)
4. Add navigation callbacks as needed
5. Include theme prop in component interface and pass it through

### Navigation Patterns
```typescript
// In parent component (usually App.tsx)
const handleSomeAction = () => {
  setCurrentScreen("target-screen");
};

// In child screen component
interface MyScreenProps {
  onBack: () => void;
  theme: "light" | "dark";
}
```

### Theme Styling Pattern
```typescript
className={`base-classes ${
  theme === "dark"
    ? "dark-specific-classes"
    : "light-specific-classes"
}`}
```

## TypeScript Configuration

- Strict mode enabled
- Bundler module resolution
- Target: ES2020
- Unused locals and parameters are errors

## Styling

- Tailwind CSS v4 (using `@tailwindcss/postcss`)
- Design system uses custom CSS variables (see `:root` and `.dark` in [src/index.css](src/index.css))
- Primary accent color: `#FF6B35` (orange)
- No Tailwind config customization - using defaults with CSS variable overrides

## Dependencies

Key packages:
- **@supabase/supabase-js** - Authentication and backend services
- **zustand** - Lightweight state management
- **@tailwindcss/postcss** - Tailwind CSS v4
- **lucide-react** - Icon library
- **shadcn/ui components** - Radix UI based component library

## Component Library Attribution

This project uses components from [shadcn/ui](https://ui.shadcn.com/) under MIT license (noted in [src/Attributions.md](src/Attributions.md))

## Environment Setup

1. Copy environment variables:
   ```bash
   # .env file required with:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Configure Supabase OAuth:
   - Add Google as OAuth provider in Supabase dashboard
   - Set redirect URL to `http://localhost:3000/` for development

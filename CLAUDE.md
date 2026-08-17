# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TrueRankValidation** (branded as "ParkRankr") is a React-based web application that allows users to rank U.S. National Parks through pairwise comparisons. It's a single-page application using a sophisticated ranking algorithm without requiring user authentication.

## Code Architecture

### Application Flow
The app follows a step-based navigation system:
1. **Selection**: Choose parks to rank (`/src/components/section-components/Selection.tsx`)
2. **Ranking**: Pairwise comparison algorithm (`/src/components/section-components/Ranking.tsx`)
3. **Results**: Display final ranked list (`/src/components/section-components/Results.tsx`)

### State Management Architecture
- **Redux Store** (`/src/store/store.ts`): Global application state
- **Parks Slice** (`/src/store/parksSlice.ts`): Parks data and ranking state
- **UI Slice** (`/src/store/uiSlice.ts`): UI state (theme, etc.)
- **Custom Hooks**: Complex business logic abstracted into hooks

### Key Custom Hooks
- **`useRankingState`** (`/src/hooks/useRankingState.ts`): Core ranking algorithm with duplicate prevention
- **`useRankingNavigation`** (`/src/hooks/useRankingNavigation.ts`): Browser navigation handling
- **`useDuplicateTracking`** (`/src/hooks/useDuplicateTracking.ts`): Debugging duplicate comparisons
- **`trackingHooks.ts`** (`/src/hooks/trackingHooks.ts`): Analytics tracking

### Ranking Algorithm
The core ranking system uses:
- Binary search insertion for efficient ranking
- Duplicate comparison prevention via `tried` sets
- Redux-compatible serializable state (arrays instead of Sets)
- Undo functionality with proper state restoration
- Shuffled park order to avoid bias

### Component Organization
```
/src/components/
├── section-components/     # Main page sections (Landing, Selection, Ranking, Results)
├── ranking/               # Ranking-specific UI (ParkComparison, ProgressBar, etc.)
├── 3d-components/         # Three.js 3D Earth visualization
└── dev-components/        # Development/debugging tools
```

### Data Layer
- **Parks Data** (`/src/data/parks.ts`): Complete dataset of 63 U.S. National Parks
- **Park Images** (`/src/data/rectangle-photos/`): 63 JPG files for park visuals
- **Supabase Integration** (`/src/supabase/`): Backend API endpoints and client configuration

## Development Guidelines

### Code Quality
- TypeScript strict mode is enabled
- ESLint configuration enforces code standards
- Components are modular and follow single responsibility principle
- Business logic is separated from UI through custom hooks

### Styling Approach
- CSS with custom properties for theming
- Dark/light mode support via CSS variables
- Component-specific styles in `/src/styles/components/`
- Global styles in `/src/styles/global.css`

### State Management Patterns
- Use Redux Toolkit for global state
- Custom hooks for complex business logic
- Local component state for UI-only concerns
- Maintain Redux serialization compatibility (avoid Sets, Maps in state)

### Important Implementation Details

#### Ranking Algorithm State
The ranking algorithm maintains state in a Redux-compatible format:
- Uses arrays in Redux state for serialization
- Converts to Sets internally for performance
- Tracks "tried" comparisons to prevent duplicates
- Maintains job queue for efficient binary search insertion

#### Analytics Integration
- Page tracking via Supabase on route changes
- Google Analytics integration in `index.html`
- Custom analytics hooks for user interaction tracking

#### Environment Setup
- Requires `.env.local` with Supabase credentials
- Vercel deployment configuration in `vercel.json`

## File Structure Highlights

- `/src/App.tsx`: Main routing and step-based rendering logic
- `/src/main.tsx`: Application entry point with providers
- `/src/hooks/useRankingState.ts`: Core ranking algorithm (350+ lines refactored into focused hook)
- `/src/data/parks.ts`: Complete National Parks dataset
- `/REFACTORING.md`: Detailed documentation of component refactoring approach

## Testing Considerations

While no formal testing framework is currently configured, the architecture supports easy testing:
- Custom hooks can be tested in isolation
- Pure utility functions are easily unit testable
- Component separation enables focused component testing
- Redux state is easily mockable for testing

## Deployment

- **Platform**: Vercel with automatic Git-based builds
- **Build Command**: `npm run build` (TypeScript + Vite)
- **Environment Variables**: Supabase credentials required
- **Analytics**: Automatic Google Analytics and Supabase page tracking
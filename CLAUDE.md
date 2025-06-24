# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrueRankValidation is a National Parks ranking web application that allows users to select and rank U.S. National Parks through pairwise comparisons. The app includes both individual ranking functionality and global community rankings powered by an Elo-style algorithm.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint on the entire codebase
- `npm run preview` - Preview production build locally

### Environment Setup
- Copy environment variables from `SUPABASE_SETUP.md` to `.env.local`
- Required variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after changing environment variables

## Architecture Overview

### State Management Architecture
The app uses **Redux Toolkit** with a clear separation of concerns:

- **`parksSlice.ts`**: Core app state (selected parks, ranking progress, current step)
- **`uiSlice.ts`**: UI-specific state (modals, loading states)
- **Custom Hooks**: Business logic abstraction (see Refactoring section)

The app follows a **step-based flow**: selection → ranking → results, managed through Redux state.

### Ranking Algorithm Architecture
The ranking system has been **recently refactored into modular components**:

**Core Algorithm (`src/utils/elo/`)**:
- **`ranking.ts`**: Main `applyEloRanking()` orchestrator function
- **`config.ts`**: Centralized configuration (weights, metrics, types)
- **`statistics.ts`**: Park statistics aggregation and range calculations  
- **`elo.ts`**: Core Elo score calculation and park ranking
- **`consistency.ts`**: Rank consistency calculations using standard deviation
- **`normalization.ts`**: Metric normalization utilities

**Algorithm Features**:
- Elo-inspired scoring system combining multiple metrics
- Configurable weights: base score (50×), position bonus (10×), achievement bonuses (500/250/100/20)
- True rank consistency calculation (replaces previous placeholder)
- Normalized statistics for fair comparison across different metrics

### Component Architecture

**Main Sections** (`src/components/section-components/`):
- **`Landing.tsx`**: Entry point with app introduction
- **`Selection.tsx`**: Park selection checklist (63 National Parks)
- **`Ranking.tsx`**: Pairwise comparison interface with sophisticated binary search algorithm
- **`Results.tsx`**: Final ranked results display
- **`GlobalRanking.tsx`**: Community rankings powered by Elo algorithm

**Ranking Components** (`src/components/ranking/`):
The ranking system is highly modularized:
- **`ParkComparison.tsx`**: Two-park comparison UI
- **`ProgressBar.tsx`**: Ranking progress indicator
- **`SortedParksGrid.tsx`**: Current ranking display
- **`UndoButton.tsx`**: Undo functionality

**Custom Hooks** (`src/hooks/`):
Critical business logic abstraction - **read `REFACTORING.md` for detailed explanations**:
- **`useRankingState.ts`**: Core ranking algorithm with duplicate prevention
- **`useRankingNavigation.ts`**: Browser navigation and history management
- **`useDuplicateTracking.ts`**: Debugging utility for ranking algorithm
- **`useGlobalRankings.ts`**: Global rankings data fetching and processing
- **`trackingHooks.ts`**: Supabase analytics tracking

### Data Flow Architecture

**Individual Ranking Flow**:
1. User selects parks in `Selection.tsx` → stored in Redux `selectedParks`
2. `Ranking.tsx` uses `useRankingState` hook → binary search algorithm with duplicate prevention
3. Algorithm tracks tried comparisons to prevent duplicate questions
4. Final results stored in Redux → displayed in `Results.tsx`

**Global Ranking Flow**:
1. User rankings stored in Supabase via `supabaseEndpoints.ts`
2. `GlobalRanking.tsx` fetches all user data via `useGlobalRankings` hook
3. `applyEloRanking()` processes all rankings using modular Elo algorithm
4. Results displayed with top 20 parks, statistics, and "How it works" modal

## Key Implementation Details

### Ranking Algorithm Sophistication
The binary search ranking algorithm includes **sophisticated duplicate prevention**:
- Each `InsertJob` maintains a `tried` Set to track attempted pivot indices
- Redux serialization uses arrays while maintaining Set performance internally
- **Critical**: This prevents infinite loops and improves user experience

### Supabase Integration
- **Analytics tracking**: Automatic page view tracking via `trackingHooks.ts`
- **Global rankings**: Community data storage and retrieval
- **Environment**: Uses Vite environment variables with `VITE_` prefix
- **Security**: Only anon key exposed client-side (see `SUPABASE_SETUP.md`)

### CSS Architecture
- **Global styles**: `src/styles/global.css` with CSS custom properties for theming
- **Component styles**: Individual CSS files in `src/styles/components/`
- **Responsive design**: Mobile-first approach with consistent breakpoints
- **Design system**: Uses CSS custom properties for colors, spacing, and typography

### Build System
- **Vite**: Fast development and optimized production builds
- **TypeScript**: Strict type checking with `tsc -b` before build
- **ESLint**: Code quality enforcement
- **No test framework currently**: Architecture supports easy test addition

## Critical Files to Understand

1. **`REFACTORING.md`**: Essential reading for understanding the ranking algorithm refactoring
2. **`src/hooks/useRankingState.ts`**: Core ranking logic with duplicate prevention
3. **`src/utils/elo/`**: Modular Elo ranking algorithm implementation
4. **`src/supabase/supabaseEndpoints.ts`**: All Supabase data operations
5. **`src/store/parksSlice.ts`**: Central Redux state management

## Development Notes

### Working with Rankings
- Individual rankings use binary search algorithm with `useRankingState` hook
- Global rankings use Elo algorithm in `src/utils/elo/` modules
- Both systems are completely independent and can be modified separately

### Adding New Features
- UI components: Follow existing pattern in `src/components/`
- Business logic: Create custom hooks in `src/hooks/`
- Styling: Add component-specific CSS files in `src/styles/components/`
- State: Extend Redux slices or create new ones as needed

### Performance Considerations
- Ranking algorithm runs in <50ms for typical use cases
- Images are optimized JPEGs for all 63 National Parks
- Vite provides automatic code splitting and optimization

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for React and TypeScript
- Component-based architecture with clear separation of concerns
- Custom hooks abstract complex business logic from UI components
# Ranking Component Refactoring

This document outlines the refactoring of the `Ranking.tsx` component to improve code organization, testability, and maintainability.

## Overview

The original `Ranking.tsx` component was a large, monolithic component with over 350 lines of code mixing business logic, state management, and UI rendering. The refactoring breaks this down into focused, reusable pieces.

## Recent Updates

### Duplicate Comparison Fix

- **Issue**: The ranking algorithm was showing duplicate comparisons due to random pivot selection and bounds reset effects
- **Solution**: Added a `tried` set to each `InsertJob` to track already-seen pivot indices
- **Redux Serialization**: Used arrays for Redux state storage while maintaining Set performance internally
- **Benefits**:
  - Eliminates duplicate comparisons entirely
  - More efficient ranking process
  - Better user experience
  - Redux-compatible serializable state

## Refactoring Structure

### Custom Hooks

#### `useRankingState` (`src/hooks/useRankingState.ts`)

- **Purpose**: Manages the core ranking algorithm state and logic
- **Responsibilities**:
  - Managing sorted parks and jobs state with duplicate prevention
  - Computing next comparisons using tried pivot tracking
  - Handling user choices and updating algorithm state
  - Managing undo functionality with proper state restoration
  - Progress calculation
- **Benefits**:
  - Isolates complex ranking algorithm logic
  - Prevents duplicate comparisons
  - Easily testable in isolation
  - Reusable across different UI implementations

#### `useRankingNavigation` (`src/hooks/useRankingNavigation.ts`)

- **Purpose**: Handles browser navigation and history management
- **Responsibilities**:
  - Managing browser back/forward button behavior
  - Transitioning between app steps
  - Setting up history states
- **Benefits**:
  - Separates navigation concerns from ranking logic
  - Reusable for other components that need similar navigation

#### `useDuplicateTracking` (`src/hooks/useDuplicateTracking.ts`)

- **Purpose**: Tracks and logs duplicate comparisons for debugging
- **Responsibilities**:
  - Monitoring comparison uniqueness
  - Logging duplicate comparisons
- **Benefits**:
  - Isolated debugging functionality
  - Easy to enable/disable
  - No impact on core ranking logic

### Utility Functions

#### `arrayUtils.ts` (`src/utils/arrayUtils.ts`)

- **Purpose**: Pure utility functions for array operations
- **Functions**:
  - `shuffleArray`: Fisher-Yates shuffle implementation
- **Benefits**:
  - Pure functions are easily testable
  - Reusable across the application
  - No side effects

### UI Components

#### `ProgressBar` (`src/components/ranking/ProgressBar.tsx`)

- **Purpose**: Displays ranking progress
- **Props**: `percentage: number`
- **Benefits**: Focused, reusable progress indicator

#### `ParkComparison` (`src/components/ranking/ParkComparison.tsx`)

- **Purpose**: Renders the two parks being compared
- **Props**: Parks, comparison ID, choice handlers
- **Benefits**: Encapsulates comparison UI logic

#### `SortedParksGrid` (`src/components/ranking/SortedParksGrid.tsx`)

- **Purpose**: Displays the current ranking as a grid
- **Props**: `parks: Park[]`
- **Benefits**: Reusable ranking display component

#### `UndoButton` (`src/components/ranking/UndoButton.tsx`)

- **Purpose**: Provides undo functionality
- **Props**: Undo handler and disabled state
- **Benefits**: Focused button component with clear responsibility

## Benefits of the Refactoring

### 1. **Improved Testability**

- Each hook and utility function can be tested in isolation
- Pure functions like `shuffleArray` are easily unit tested
- Business logic is separated from UI rendering

### 2. **Better Code Organization**

- Clear separation of concerns
- Related functionality is grouped together
- Easier to navigate and understand

### 3. **Enhanced Reusability**

- Hooks can be reused in other components
- UI components are modular and composable
- Utility functions are available throughout the app

### 4. **Easier Maintenance**

- Changes to ranking logic only affect the relevant hook
- UI changes are isolated to specific components
- Debugging is more focused

### 5. **Improved Readability**

- The main `Ranking` component is now ~50 lines instead of 350+
- Each piece has a single, clear responsibility
- Intent is more obvious from the structure

## File Structure

```
src/
├── hooks/
│   ├── useRankingState.ts
│   ├── useRankingNavigation.ts
│   └── useDuplicateTracking.ts
├── utils/
│   └── arrayUtils.ts
├── components/
│   ├── Ranking.tsx (refactored)
│   └── ranking/
│       ├── ProgressBar.tsx
│       ├── ParkComparison.tsx
│       ├── SortedParksGrid.tsx
│       ├── UndoButton.tsx
│       └── index.ts
```

## Testing Strategy

With this structure, you can now easily test:

1. **Algorithm Logic**: Test `useRankingState` hook with different scenarios
2. **Utility Functions**: Unit test `shuffleArray` and other pure functions
3. **UI Components**: Test individual components with different props
4. **Integration**: Test how hooks work together

## Migration Notes

- The refactored component maintains the same external API
- All existing functionality is preserved
- No breaking changes to parent components
- Performance characteristics remain the same

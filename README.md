# TrueRankValidation

# PRD: National Park One-Time Ranking App

## 1. Purpose & Overview

A lightweight, front-end-only web app that lets a user pick from a list of U.S. National Parks, run through a simple ranking flow, and view their final sorted list—all in one session, with no login or backend required.

## Technologies

- **React** + **TypeScript**
- **Radix UI** primitives for accessible components
- **Redux Tool Kit** global state
- **Vite** for build & dev tooling (or Create React App)
- **localStorage** for persisting state within a session
- **CSS** (global stylesheet) for basic styling

## 2. Scope

**In Scope**

- Selection of any subset of the 63 U.S. National Parks
- Pairwise (or drag-and-drop) ranking of the selected parks
- Display of the final ordered list

**Out of Scope**

- User accounts or persistence beyond the current session
- Global leaderboards or sharing URLs
- Analytics, comments, or social features

## 3. User Stories

1. **As a visitor**, I want to choose which parks I’ve visited or care about so I only rank those.
2. **As a visitor**, I want to go through a simple ranking flow (pairwise comparisons or drag-and-drop) to express my preferences.
3. **As a visitor**, I want to see my final list sorted from most to least favorite.

## 4. Functional Requirements

| ID       | Requirement      |
| -------- | ---------------- |
| **FR-1** | **Landing Page** |

- Brief intro & “Start Ranking” button.  
  | **FR-2** | **Selection Screen**
- Show checklist of all National Parks.
- “Next” button becomes enabled once ≥ 2 parks are selected.  
  | **FR-3** | **Ranking Flow**
- Present two parks at a time (“Which do you prefer?”), OR
- Provide a drag-and-drop list to reorder.
- Continue until full ranking is determined.  
  | **FR-4** | **Results Page**
- Display the user’s sorted list in ranked order.
- Offer a “Restart” button to begin again.  
  | **FR-5** | **Client-Side State**
- All selections and rankings held in-memory (e.g. React state/localStorage).
- No external API calls. |

## 5. UX Flow

1. **Landing** → “Start Ranking”
2. **Select Parks** → click “Next”
3. **Rank Parks** → click through comparisons or drag list
4. **View Results** → click “Restart” or close

## 6. Non-Functional Requirements

- **Performance**: All screens load instantly; ranking logic runs in <50 ms.
- **Responsive**: Works on desktop and mobile.
- **Accessibility**: Keyboard-navigable comparisons; proper ARIA labels.

---

my-park-ranker/
├── public/
│ └── index.html
├── src/
│ ├── data/
│ │ └── parks.ts # List of all 63 park names & metadata
│ ├── components/
│ │ ├── Landing.tsx # “Start Ranking” screen
│ │ ├── Selection.tsx # Park checklist UI
│ │ ├── Ranking.tsx # Pairwise or drag-drop ranking flow
│ │ └── Results.tsx # Final sorted list display
│ ├── styles/
│ │ └── global.css # Basic resets & typography
│ ├── App.tsx # Routes & top-level state management
│ └── index.tsx # React entry point
├── package.json
├── tsconfig.json
└── README.md

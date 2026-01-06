# Hacker News UI Components

This directory contains the React components for the enhanced Hacker News interface.

## Architecture

The HN enhancement uses a two-script approach:

1. **Content Script** (`src/assets/scripts/hn.ts`)
   - Hides the original HN design
   - Scrapes story data from the page
   - Creates a root container for React
   - Dispatches data to the React UI

2. **React UI** (`src/ui/hacker-news/index.tsx`)
   - Renders the enhanced interface
   - Receives data from content script
   - Built with Vite and injected as IIFE

## Components

- `index.tsx` - Main app component and entry point
- `Header.tsx` - HN header with branding
- `StoryList.tsx` - Container for story cards
- `StoryCard.tsx` - Individual story card with metadata
- `types.ts` - Shared TypeScript interfaces
- `styles.css` - Tailwind CSS imports

## Data Flow

```
Original HN Page
    ↓
Content Script (hn.ts)
    ↓ (scrapes & hides)
window.__ENHANCER_AI_STORIES__
    ↓ (event: enhancer-ai-data-ready)
React UI (index.tsx)
    ↓
Rendered Components
```

## Build Process

Both scripts are built separately by `src/lib/scripts/build-content.ts`:

- Content script → `dist/assets/hn.js`
- React UI → `dist/assets/hn-ui.js`

Both are loaded via manifest.json content_scripts.

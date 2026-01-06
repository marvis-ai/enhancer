# Enhancer AI Architecture

## Overview

The Hacker News enhancement uses a **two-script architecture** that separates content scraping from UI rendering:

1. **Content Script** - Hides original design and extracts data
2. **React UI** - Renders the enhanced interface using Vite

## File Structure

```
src/
├── assets/
│   └── scripts/
│       └── hn.ts              # Content script (data scraper)
├── ui/
│   └── hacker-news/
│       ├── index.tsx          # React app entry point
│       ├── Header.tsx         # Header component
│       ├── StoryList.tsx      # Story list container
│       ├── StoryCard.tsx      # Individual story card
│       ├── types.ts           # Shared TypeScript types
│       ├── styles.css         # Tailwind imports
│       └── README.md          # Component documentation
└── lib/
    └── scripts/
        └── build-content.ts   # Build script for content scripts
```

## Data Flow

```mermaid
Hacker News Page (news.ycombinator.com)
    ↓
Content Script (hn.ts)
    ├─ Hides <center> element
    ├─ Scrapes story data
    ├─ Creates #enhancer-ai-root div
    └─ Stores data in window.__ENHANCER_AI_STORIES__
    ↓
Custom Event: 'enhancer-ai-data-ready'
    ↓
React UI (index.tsx)
    ├─ Listens for data event
    ├─ Renders components
    └─ Displays enhanced interface
```

## Build Process

### Scripts

- `pnpm dev` - Watch mode for development
- `pnpm build` - Production build

### Build Steps

1. Vite builds popup and styles
2. `build-content.ts` builds:
   - Content script → `dist/assets/hn.js` (IIFE)
   - React UI → `dist/assets/hn-ui.js` (IIFE)

### Manifest Configuration

Both scripts are injected via `manifest.json`:

```json
{
  "content_scripts": [{
    "matches": ["https://news.ycombinator.com/*"],
    "js": [
      "assets/hn.js",      // Content script (runs first)
      "assets/hn-ui.js"    // React UI (runs second)
    ],
    "run_at": "document_start"
  }]
}
```

## Key Technologies

- **Vite** - Build tool and dev server
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **TypeScript** - Type safety
- **tsx** - TypeScript execution for build scripts

## Benefits of This Architecture

1. **Separation of Concerns** - Data scraping is isolated from UI rendering
2. **Vite Integration** - Full React development experience with HMR
3. **Type Safety** - Shared types between content script and UI
4. **Maintainability** - Clear boundaries between responsibilities
5. **Scalability** - Easy to add more sites (Reddit, etc.)

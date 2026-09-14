# Design Coach for Non-Designers

A frontend-only React and TypeScript tool that helps non-designers make clearer design decisions. It guides users through a design task, audience and goal definition, relevant design principles, a mock review, and an improved prompt.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open http://localhost:5173 in a browser.

## Verify and build

```bash
npm run build
npm run preview
```

The app stores the current flow in browser `localStorage` and does not require a backend, database, API key, or Python runtime.

## Project structure

- `src/App.tsx`: wizard flow and UI
- `src/data/designCoachData.ts`: task, principle, and review data
- `src/services/reviewService.ts`: local mock review service and future AI integration point
- `src/App.css` and `src/index.css`: application styling

## Current review behavior

The review step uses local sample feedback so the application works offline. The service boundary is kept separate so a vision-capable API can be added later without changing the primary UI flow.

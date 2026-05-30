# Project Directory Structure

> Directory layout for the AI-Explorers AIID Hackathon 2025 documentation website.

```
.
├── components/        # Reusable React components
│   ├── Header.tsx     # Site-wide navigation bar
│   ├── Footer.tsx     # Site-wide footer
│   ├── TeamMemberCard.tsx  # Individual team member profile cards
│   └── ...            # Other shared components (Icons, Modals, command palette, etc.)
├── pages/             # Top-level page components for each route
│   ├── HomePage.tsx   # Main landing page
│   ├── ProjectPage.tsx     # Template for individual project showcases
│   ├── TeamPage.tsx
│   ├── TutorialPage.tsx    # Live Vibe Coding playground
│   ├── JournalPage.tsx     # Developer logs
│   ├── ProgressPage.tsx    # Timeline view of development progress
│   ├── GlossaryPage.tsx
│   └── CommunicationPage.tsx
├── App.tsx            # Main application component (routing, theme, layout)
├── data.ts            # Single source of truth: all text, project details, team bios
├── types.ts           # Centralized TypeScript type definitions
├── index.html         # HTML entry point
├── index.tsx          # React app root
├── metadata.json      # Hosting metadata
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript compiler configuration
├── vite.config.ts     # Vite bundler configuration
├── README.md          # Project overview (this repo)
└── STRUCTURE.md       # This file
```

## Layer overview

- **components/** : Reusable UI primitives. Header, Footer, TeamMemberCard, modals, command palette, icon set. Each component is self-contained and consumes data via props.
- **pages/** : Route-level views. Each page composes components and pulls its content from `data.ts`. No business logic lives here.
- **App.tsx** : Routing, theme, and layout shell. Reads route params and renders the corresponding page.
- **data.ts** : The single source of truth. To update a project description, team bio, or tutorial step, edit this file - no component logic needs to change. This pattern is what makes the site "exceptionally easy to update, maintain, and scale" (see README).
- **types.ts** : Shared TypeScript types - `Project`, `TeamMember`, `JournalEntry`, etc.

## Architectural decisions

1. **Single source of truth (`data.ts`).** Content and presentation are deliberately separated. Anyone on the team can update content without touching React.
2. **Static-first deployment.** The site builds to plain HTML/JS for hosting on Zeabur, Vercel, Netlify, or GitHub Pages. The current production deployment runs on Google Cloud Run.
3. **Animation as content.** Framer Motion is treated as part of the documentation, not decoration - constellation backgrounds, 3D-tilt cards, and the clickable architecture diagram are how complex ideas get communicated.
4. **Keyboard-driven navigation.** Command palette (Cmd/Ctrl + K) is first-class, not an afterthought.

For the full project overview, see [README.md](./README.md). For the solo Sovereign School OS source archive, see [SSO-final](https://github.com/Samielakkad/ai-edtech-sovereign-school-os).

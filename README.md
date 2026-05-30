# AI + EdTech · AIID Hackathon 2025 - AI-Explorers Documentation Website

> A comprehensive documentation website built for the Tsinghua AIID Hackathon 2025, showcasing our team's collaboration, development processes, and project outcomes. This platform serves as a centralized hub for presenting our hackathon projects, team profiles, and a technical tutorial based on our experience.

![status](https://img.shields.io/badge/status-shipped-2ea44f) ![stack](https://img.shields.io/badge/stack-React%20%2B%20TS%20%2B%20Framer-blue) ![hackathon](https://img.shields.io/badge/hackathon-Tsinghua%20AIID%202025-purple) ![team](https://img.shields.io/badge/team-AI--Explorers-orange) ![award-target](https://img.shields.io/badge/built--for-Best%20Documentation%20Award-gold)

**[View the Live Website](https://aiid-hackathon-group-documentation-438148500299.us-west1.run.app/#/project1)**

---

## Key Features & Documentation Philosophy

To win the "Best Documentation Award," a website must do more than just present information - it must teach, inspire, and tell a compelling story. We built this site around a core philosophy of making complex ideas accessible and engaging.

- **Immersive & Interactive UI.** Go beyond static pages. The site features a dynamic, GPU-accelerated constellation background, responsive aurora effects, and 3D-tilting glassmorphic cards that react to your cursor. The result is a deeply engaging, futuristic user experience that makes exploring documentation a memorable journey.
- **Interactive Technical Storytelling.** Complex concepts are brought to life with interactive visualizations. The flagship project's system architecture diagram is a fully clickable navigation tool, seamlessly connecting high-level design to in-depth feature explanations.
- **Live Vibe Coding Playground.** The tutorial is hands-on. We embedded an interactive "Vibe Coding" playground where you can describe a UI in plain English and watch the AI generate code in real time - not just a tutorial, but a demonstration of our core development philosophy.
- **Comprehensive Journey-Oriented Content.** The site tells the complete story of our hackathon: developer journal, visual progress tracker, detailed glossary, and a showcase of our global community engagement.
- **Rapid & Accessible Navigation.** The entire site is navigable via a fast, keyboard-driven command palette (Cmd/Ctrl + K) for instant access to any page.
- **Clean & Scalable Architecture.** React + TypeScript + Framer Motion. All content centralized in a single `data.ts` file - a single source of truth that makes the platform exceptionally easy to update, maintain, and scale.

---

## Project Overview

This website demonstrates modern web development practices using React, TypeScript, and Tailwind CSS to create an elegant, responsive documentation platform. It features a clean architecture with component-based design and client-side routing to deliver a smooth user experience.

---

## Team & Credits

This project was a collaborative effort by the members of the **AI-Explorers** learning circle.

- **EL AKKAD SAMI** - Creator of S.S.O. (Sovereign School OS)
  - LinkedIn: [sami-el-akkad](https://www.linkedin.com/in/sami-el-akkad-%E8%90%A8%E7%B1%B3-361296188/)
  - GitHub: [Samielakkad](https://github.com/Samielakkad)
  - Email: elakkadsami00@gmail.com
- **CHUTIRAT SAENGYINGYONGWATTANA** - Creator of Miscellaneous Tutor
- **Camellia Yip** - Founder of Ask Smart

---

## Website Structure

### Main Sections

- **Home** - Introduction and overview of our hackathon mission and projects.
- **Team** - Profiles of team members and their roles.
- **Projects** - Detailed pages for each of our three hackathon projects:
  - **Sovereign School OS (S.S.O.)** - A gamified AI learning OS that crafts personalized adventures for students and generates instant, game-based presentations for teachers. (Solo source archive: [SSO-final](https://github.com/Samielakkad/SSO-final))
  - **Miscellaneous Tutor** - An AI-powered educational chatbot that uses the DeepSeek API to generate interactive HTML lessons and quizzes on any topic, right in your chat window.
  - **Ask Smart** - An AI-powered communication coach for ROKID glasses that provides real-time, subtle guidance to help you navigate high-pressure conversations.
- **Communication** - A showcase of promotional efforts, social media presence, and community feedback.
- **Journal** - Developer logs, sharing challenges and breakthroughs.
- **Progress** - A timeline view of development progress across all projects.
- **Glossary** - Definitions of key technical terms.
- **Tutorial** - A live "Vibe Coding" playground demonstrating rapid AI-powered prototyping.

---

## Technology Stack

### Frontend

- **React** - JavaScript library for building user interfaces.
- **TypeScript** - Static typing for code quality and maintainability.
- **Tailwind CSS** - Utility-first CSS framework used via CDN for rapid UI development.
- **React Router** - Client-side routing and navigation.
- **Framer Motion** - Fluid animations and transitions.
- **@google/genai** - Google Gemini API SDK powering all generative AI features.

---

## Project Architecture

### Directory Structure

```
.
├── components/       # Reusable React components
│   ├── Header.tsx    # Site-wide navigation bar
│   ├── Footer.tsx    # Site-wide footer
│   ├── TeamMemberCard.tsx # Displays individual team member profiles
│   └── ...           # Other shared components (Icons, Modals, etc.)
├── pages/            # Top-level page components for each route
│   ├── HomePage.tsx  # The main landing page
│   ├── ProjectPage.tsx # Template for individual project showcases
│   └── ...           # All other pages (Team, Tutorial, etc.)
├── App.tsx           # Main application component. Manages routing, theme, and layout.
├── data.ts           # The "single source of truth". All text, project details, team bios, etc.
├── types.ts          # Centralizes all TypeScript type definitions.
├── index.html        # Main HTML entry point.
├── index.tsx         # Root of the React application.
└── metadata.json     # Application metadata for the hosting environment.
```

### Key Patterns

- **Centralized Data.** All content (project details, team bios, etc.) is managed in `data.ts` for easy updates.
- **Component-First Architecture.** The UI is broken down into small, reusable components.
- **Type Safety.** Full TypeScript implementation ensures robust and error-free code.
- **Responsive Design.** Mobile-first styling ensures a great experience on all devices.

---

## Responsive Design

The website is fully responsive across all device sizes:

- **Desktop** - Full-featured layout with hover effects and animations.
- **Tablet** - Optimized navigation and content layout.
- **Mobile** - Touch-friendly interface with a collapsible navigation menu.

---

## Design System

### Visual Identity

- **Color Palette** - Modern dark theme with cyan, fuchsia, and amber accents.
- **Typography** - Inter, modern and readable.
- **Spacing** - Consistent spacing system for visual harmony.
- **Interactions** - Smooth transitions and hover effects powered by Framer Motion.

---

## Deployment

This project is built as a static website, easy to deploy on any platform that supports static hosting (Zeabur, Vercel, Netlify, GitHub Pages). Live site is hosted on Google Cloud Run.

---

## Contributing

This project serves as a template for hackathon documentation websites. When contributing or adapting:

- Follow the established component patterns.
- Maintain type safety with TypeScript.
- Update `data.ts` with your own project and team information.
- Test responsive design across devices.

---

## License

This project is open source under the MIT License.

---

## Acknowledgments

- **Tsinghua AIID Hackathon 2025** - Organizers, mentors, and participants.
- **Google Gemini Team** - For the generative AI models and API.
- **React & Framer Motion teams** - For the frontend libraries.


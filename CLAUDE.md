# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Astro 3, React, and Tailwind CSS. The site showcases professional work experience, side projects, photography, and personal interests. It includes interactive features like an AI chatbot (powered by Cohere) and data visualizations for music preferences and coding statistics.

## Development Commands

### Core Commands
- `bun dev` or `bun start` - Start development server at http://localhost:4321
- `bun run build` - Build for production (outputs to `dist/`)
- `bun run preview` - Preview production build locally
- `bun run pretty` - Format code with Prettier

### Resume Generation
- `bun run gen-resume-pdf` - Generate PDF from `src/pages/work/resume.md` and place it in `public/work/resume.pdf`

### Docker
- Build: `docker build --build-arg GUAC_URL=<url> --build-arg GUAC_USER=<user> --build-arg GUAC_PASS=<pass> -t portfolio .`
- Uses Bun for building, serves via Apache httpd

## Architecture

### Framework & Tooling
- **Astro 3**: Main framework using Islands Architecture for optimal performance
- **React 18**: Used for interactive components via Astro's React integration
- **Tailwind CSS + DaisyUI**: Styling with DaisyUI component library (themes: `pastel`, `dim`)
- **TypeScript**: Type-safe development across `.astro`, `.tsx`, and `.ts` files

### Project Structure

```
src/
├── assets/           # Images and static assets
│   ├── styles/       # CSS files (e.g., resume.css)
│   └── work/         # Work-related images
├── components/       # Reusable UI components
│   ├── CodingStats/  # Wakatime data visualization
│   ├── MusicGenres/  # Spotify genre word cloud
│   └── *.astro       # Astro components (PhotoGrid, Navigation, Footer, etc.)
├── data/             # Static data files (e.g., travelImages.ts)
├── layouts/          # Page layouts
│   ├── Layout.astro           # Main layout with Navigation and Footer
│   ├── ResumeLayout.astro     # Layout for resume markdown
│   └── PhotographyLayout.astro
├── pages/            # File-based routing
│   ├── index.astro            # Home page
│   ├── work/
│   │   ├── index.astro        # Work experience showcase
│   │   ├── story.astro        # Career story
│   │   └── resume.md          # Markdown resume
│   └── play/
│       ├── index.astro        # Personal interests
│       └── photography/       # Photo galleries by year
└── types/            # TypeScript type definitions
```

### Key Components & Patterns

**Layouts**
- `Layout.astro`: Main wrapper with theme switching, navigation, footer, and chat modal
- Uses Astro's `ViewTransitions` for smooth page navigation
- Theme persistence via `localStorage` with DaisyUI themes (`pastel`, `dim`)

**Interactive Components (React)**
- `ChatWithHistory.tsx`: AI chatbot with streaming responses, conversation history stored in `localStorage`
  - Connects to Cloudflare Worker endpoint (`personal-portfolio-chat-worker.mtanzim.workers.dev`)
  - Uses `client:only="react"` directive in Astro
- `Carousel.tsx` / `FullCarousel.tsx`: Image carousels
- `WordCloud.tsx`: Spotify genre visualization using `react-d3-cloud`
- `Coding.tsx`: Wakatime coding stats using Chart.js

**Data Fetching**
- S3 bucket (`https://tm-photo-portfolio.s3.amazonaws.com/website-assets`) hosts static data like Spotify artists JSON
- `CodingWrapped.astro`: Fetches Wakatime data from external Guac API (requires auth via env vars)
  - Hidden in development mode to avoid API costs
- Photography images stored in `src/data/travelImages.ts` and S3

**Astro Islands Pattern**
- React components hydrated selectively with `client:*` directives
- `client:only="react"`: For components requiring browser APIs (ChatWithHistory)
- `client:visible`: For components that should hydrate when visible (Coding chart)

### Environment Variables

The `.env` file is required for:
- `GUAC_URL`, `GUAC_USER`, `GUAC_PASS`: Wakatime API authentication for coding stats
- These are build-time variables accessed via `import.meta.env`

### Styling Conventions
- Tailwind utility classes throughout
- DaisyUI components for UI elements (badges, cards, buttons, modals, collapse, etc.)
- Theme switching uses `data-theme` attribute on `<html>` element
- Custom CSS in `src/assets/styles/resume.css` for PDF generation

### Content Management
- Work tiles configured in `src/pages/work/index.astro` as an array of objects
- Photo galleries use typed arrays from `src/data/travelImages.ts`
- Resume content in markdown (`src/pages/work/resume.md`) with frontmatter layout

## Important Notes

- **Resume PDF generation**: The `gen-resume-pdf` script uses `md-to-pdf` with custom CSS, requires the markdown file at `src/pages/work/resume.md`
- **Chat API**: Development server expects chat API at `http://127.0.0.1:8787/`, production uses Cloudflare Worker
- **Coding stats**: Only shown in production builds to avoid hitting the Guac API unnecessarily
- **Image optimization**: Astro's built-in `<Image>` component used for optimized assets
- **Node version**: Uses `.nvmrc` file (check for specified version)
- **Package manager**: Uses Bun as the primary package manager (see `bun.lockb`)

## Common Patterns

**Adding a new page**: Create `.astro` file in `src/pages/`, wrap content in `<Layout>` component

**Adding interactive React component**:
1. Create `.tsx` file in `src/components/`
2. Import in `.astro` page
3. Use appropriate `client:*` directive

**Updating photography galleries**:
1. Add images to S3 or local assets
2. Update image arrays in `src/data/travelImages.ts`
3. Create/update year-specific pages in `src/pages/play/photography/`
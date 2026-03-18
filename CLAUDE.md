# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build (also runs TypeScript check)
npm run start    # serve production build
```

No linter or test runner is configured.

## Architecture

**Data flow**: `app/page.tsx` is a server component that fetches `icons-metadata.json` from the Vectra Icons GitHub repo at build time (ISR, revalidates every 24h). It passes the full `IconRecord[]` array as a prop to `<Gallery>`, which is the only client component entry point.

**Icon source**: All SVGs and metadata come from `https://raw.githubusercontent.com/abhishekshankr/vectra-icons/main/`. No files are copied locally. `lib/data.ts` owns the base URL and `getSvgUrl(name, style)` helper. The metadata JSON is the single source of truth — 313 icons, each with `name`, `category`, `description`, `tags[]`, `aliases[]`.

**State**: All interactive state (`style: Fill|Stroke`, `size: 16–64px`, `query`, `selectedIcon`) lives in `Gallery.tsx`. The Fuse.js index is initialized once with `useMemo`. Components below Gallery are purely presentational.

**SVG rendering**: Icons are loaded via `<img src={githubRawUrl}>` in `IconCard`. The modal (`IconDetailModal`) fetches SVG text on open for inline rendering and download. `lib/download.ts` uses `DOMParser` to mutate `width`/`height` attributes before triggering a browser download.

**Dark mode**: CSS variables in `globals.css` flip via `@media (prefers-color-scheme: dark)`. Icons invert via `.icon-img { filter: invert(1) }` — note this only works reliably in Chrome; Safari blocks CSS filters on cross-origin `<img>` elements.

**Styling**: Tailwind v4 (via `@import "tailwindcss"`) plus inline styles for component-specific rules. Design tokens are CSS custom properties on `:root` (`--canvas`, `--ink`, `--chrome`, `--accent`, etc.). Fonts are `Instrument Sans` (UI) and `DM Mono` (labels/metadata), loaded from Google Fonts in `globals.css`.

**`next.config.ts`**: `remotePatterns` allows `raw.githubusercontent.com` for Next.js `<Image>` (currently unused — components use plain `<img>`).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build (also runs TypeScript check)
npm run start    # serve production build
npm run lint     # run ESLint on .ts/.tsx files
```

## Architecture

**Data flow**: `app/page.tsx` is a server component that fetches `icons-metadata.json` from the Vectra Icons GitHub repo at build time (ISR, revalidates every 24h). It passes the full `IconRecord[]` array as a prop to `<Gallery>`, which is the only client component entry point.

**Icon source**: All SVGs and metadata come from `https://raw.githubusercontent.com/abhishekshankr/vectra-icons/main/`. No files are copied locally. `lib/data.ts` owns the base URL and `getSvgUrl(name, style)` helper. The metadata JSON is the single source of truth — 313 icons, each with `name`, `category`, `description`, `tags[]`, `aliases[]`.

**State**: All interactive state (`style: Fill|Stroke`, `size: 20–64px`, `query`, `selectedIcon`, `theme`) lives in `Gallery.tsx`. The Fuse.js index is initialized once with `useMemo`. Components below Gallery are purely presentational.

**SVG rendering**: Icons are lazy-loaded via `InlineSvgIcon` (IntersectionObserver, 200px rootMargin). SVGs are fetched, parsed via DOMParser, and cached in a module-level Map (`lib/svgCache.ts`). `applyCurrentColor()` rewrites fill/stroke to `currentColor` so icons theme correctly in light/dark mode. The modal fetches SVG text on open for inline rendering and download.

**Icon detail modal**: Renders as a floating card anchored to the bottom of the screen (`position: fixed, bottom: 24px`). Stays mounted (never unmounts) so switching icons updates content in place without re-animating. Uses `displayIcon` state (last non-null icon) to keep content visible during the slide-out animation.

**Dark mode**: CSS variables in `globals.css` default to light mode. Dark mode applies via `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `[data-theme="dark"]`. Gallery initializes theme from `matchMedia` after mount (to avoid SSR hydration mismatch), listens for system changes, but respects manual user overrides via a `manualOverride` flag.

**Theming**: Icons use `currentColor` via `.icon-img { color: var(--ink) }`. The toggle button in the header shows a sun icon (dark→light) or moon icon (light→dark), and renders `null` until theme is known to prevent hydration mismatch.

**Styling**: Tailwind v4 (via `@import "tailwindcss"`) plus inline styles for component-specific rules. Design tokens are CSS custom properties on `:root` (`--canvas`, `--ink`, `--chrome`, `--accent`, etc.). Fonts are `Instrument Sans` (UI) and `DM Mono` (labels/metadata), loaded via `next/font/google` in `app/layout.tsx` (NOT Google Fonts `@import` — Safari ITP blocks that on localhost).

**Responsive toolbar**: Three-row mobile layout (style toggle / size slider / search), collapses to single row on desktop (≥600px). Implemented via inline `<style>` tag in `Toolbar.tsx` to avoid Tailwind v4 specificity conflicts.

**Range slider**: Two-tone track implemented with absolute-positioned divs behind a transparent `<input type="range">`. `touch-action: pan-x` enables dragging on mobile. Thumb is 16px on mobile, 10px on desktop.

**Linting**: ESLint with `@eslint/js`, `typescript-eslint`, and `eslint-plugin-react-hooks`. Config in `eslint.config.mjs`. `eslint-disable` directives used where intentional setState-in-effect patterns are needed (e.g. reading `window` after mount, tracking `displayIcon` from props).

**Version**: Hardcoded as `v1.6.2` in `Gallery.tsx` header.

**`next.config.ts`**: `remotePatterns` allows `raw.githubusercontent.com` for Next.js `<Image>` (currently unused — components use plain `<img>`).

## Key lessons learned

- Safari ITP blocks Google Fonts `@import` on localhost — use `next/font/google` instead
- Two-tone range slider track requires real DOM elements behind the input, not CSS gradients or pseudo-elements
- CSS `:hover` approach for icon cards breaks layout due to inline style specificity — use JS `useState` hover instead
- Tailwind v4 media queries in `globals.css` can conflict with component styles — move component-specific media queries into inline `<style>` tags
- SSR hydration mismatches from `window`/`matchMedia` — always initialize browser-only state as `null` and set in `useEffect`

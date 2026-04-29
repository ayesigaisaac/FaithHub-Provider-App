# FaithHub Provider App

Plug-and-play FaithHub Provider workspace built with **Vite + React + TypeScript + MUI + Tailwind CSS**.

This project wraps the attached FaithHub Provider page files into a real runnable application with:

- a responsive MUI app shell for desktop, tablet, and mobile
- all attached FaithHub Provider pages registered as routes
- EVzone / FaithHub brand colors wired into both the MUI theme and Tailwind tokens
- lazy-loaded page routing so the workspace can scale without loading every page at once
- image and video fallbacks for attached pages that reference remote media
- global toast notifications and async action helpers for pages that depended on Creator-style shared utilities
- SPA rewrite helpers for common hosting targets

## Stack

- React 18
- TypeScript
- Vite
- MUI
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React

## Brand colors

The app theme is centered on these tokens:

- Primary green: `#03cd8c`
- Accent orange: `#f77f00`
- Medium grey: `#a6a6a6`
- Light grey: `#f2f2f2`

They are defined in:

- `src/theme/tokens.ts`
- `src/theme/index.ts`
- `tailwind.config.ts`

## Run locally

```bash
npm install

npm run dev
```
flo
Open the local Vite URL shown in the terminal.

## Production build

```bash 
npm run build
npm run preview
```

## Testing


Run the test suite:

```bash
npm test
```

Current automated coverage includes:

- app routing smoke tests (`src/App.test.tsx`)
- layout accessibility and mobile nav dialog behavior (`src/layout/AppLayout.test.tsx`)
- sidebar grouping, active-state behavior, and close callback (`src/layout/Sidebar.test.tsx`)
- reusable nav item rendering and active semantics (`src/components/ui/NavItem.test.tsx`)

## Button navigation standard

Raw page CTAs should route through the shared action registry:

- Registry: `src/navigation/buttonActions.ts`
- Raw handler: `src/pages/provider/raw/placeholderActions.ts`

Preferred usage in raw pages:

```tsx
onClick={handleRawPlaceholderAction("open_live_dashboard")}
```

This keeps CTA routing deterministic, testable, and consistent across provider pages.

A production build was generated successfully in `dist/` during packaging.

## Routing

- Public landing page: `/`
- Provider dashboard: `/faithhub/provider/dashboard`
- Provider shell preview: `/faithhub/provider/preview-shell`

All attached provider pages are registered in `src/navigation/providerPages.tsx`.

The original attached screen files are preserved under:

- `src/pages/provider/raw/`
- `src/pages/provider/previews/`
- `src/pages/public/`

## Responsive structure

The responsive workspace shell lives in `src/components/shell/` and includes:

- permanent desktop sidebar
- temporary mobile drawer
- mobile bottom navigation
- page search dialog
- floating quick-create speed dial

## Shared infrastructure added around the attached pages

To make the imported pages run as a complete app, these shared pieces were added:

- `src/contexts/NotificationContext.tsx`
- `src/hooks/useAsyncAction.ts`
- `src/components/ErrorBoundary.tsx`
- `src/components/MediaFallbackContainer.tsx`
- `src/components/PageHeader.tsx`

## Hosting notes

Because several attached pages navigate using full path changes such as `/faithhub/provider/live-dashboard`, the project includes SPA rewrite helpers for common deployments:

- `public/.htaccess`
- `public/_redirects`
- `public/404.html`
- `netlify.toml`
- `vercel.json`

## Important implementation notes

- The attached page files were preserved as closely as possible and wrapped rather than rewritten from scratch.
- A few small compile fixes were applied to resolve missing shared utilities and minor TypeScript mismatches from the attached inputs.
- Some attached screens use remote sample imagery. The app now falls back to a local placeholder asset if those files fail to load.

## Project structure

```text
src/.
  components/
    shell/
  contexts/
  hooks/
  navigation/
  pages/
    provider/
      raw/
      previews/
    public/
  theme/
```

## Quick page inventory

See `ROUTES.md` for the full route list.

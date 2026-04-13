# Phase 1 Audit - FaithHub Provider Shell

Date: 2026-04-14

## Current route inventory

- Total mapped provider pages in `src/navigation/providerPages.tsx`: 47
- Route pattern: `/faithhub/provider/*`
- Routing source of truth: `providerPages` metadata array

## Existing content preserved

- All provider raw screens remain in:
  - `src/pages/provider/raw/`
- Preview shell remains in:
  - `src/pages/provider/previews/`
- Public landing remains in:
  - `src/pages/public/`

## Shell scaffold target

- Keep all route content components unchanged.
- Replace only shell chrome:
  - Left sidebar
  - Topbar
  - Main content frame
- Maintain:
  - Route-driven page mounting via `Outlet`
  - Search command dialog for quick page jump
  - Error boundary and media fallback wrappers

## Phase 2 scaffold status

- New EVzone-style shell scaffold applied in:
  - `src/components/shell/ProviderShellLayout.tsx`
  - `src/components/shell/ProviderSidebar.tsx`
  - `src/components/shell/ProviderTopbar.tsx`

Next: iterate visual tuning page-by-page without changing core page content modules.

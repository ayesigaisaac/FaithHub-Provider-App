# FaithHub Release Quality Checklist

Use this before merging or releasing UX-heavy changes.

## 1) Code Health

- `npm run lint`
- `npm run check`
- `npm test`
- `npm run build`
- `npm run test:visual` (after Playwright install and baseline generation)

## 2) Visual Identity Regression

- Open `/faithhub/home-landing` and confirm:
  - hero gradients and brand surfaces render correctly
  - CTA hierarchy is clear and primary actions stand out
  - cards use soft shadows and modern spacing
- Open `/faithhub/provider/dashboard` and confirm:
  - quick actions are visible and clearly prioritized
  - content lanes (published, drafts, archives) are readable
  - analytics cards and interaction states are polished
- Open `/faithhub/provider/design-system-showcase` and compare:
  - button states (default, hover, focus, disabled)
  - KPI and card spacing, typography, and contrast

## 3) Accessibility

- Keyboard-only navigation:
  - topbar controls
  - sidebars (desktop + mobile)
  - key CTA buttons
- Check focus ring visibility on light and dark surfaces.
- Ensure meaningful labels for search and action controls.

## 4) Mobile Responsiveness

- Validate key routes at narrow viewport widths:
  - `/faithhub/home-landing`
  - `/faithhub/provider/dashboard`
  - `/faithhub/provider/live-dashboard`
- Confirm no clipped buttons, collapsed text overlap, or horizontal overflow.

## 5) Performance Spot Check

- Check hero images and heavy sections for smooth scroll.
- Ensure no excessive visual jitter from transitions.
- Confirm reduced motion preference still renders usable UI.

## 6) Visual Regression Baselines

- First-time setup:
  - `npx playwright install`
  - `npm run test:visual:update`
- Day-to-day verification:
  - `npm run test:visual`
- Baselines covered:
  - home landing
  - login page
  - not found page
  - provider dashboard (mock-auth seeded)
  - design system showcase (mock-auth seeded)
  - analytics event health preview (mock-auth seeded)

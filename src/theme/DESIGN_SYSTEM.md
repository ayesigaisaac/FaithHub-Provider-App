# FaithHub Provider Design System

This project uses a shared token and utility layer for color, spacing, radius, shadows, typography, and motion.

## Token Sources

- `src/theme/tokens.ts`
- `src/theme/index.ts`
- `src/index.css`
- `tailwind.config.ts`

## Primary Usage Rules

1. Prefer semantic classes and CSS variables:
   - `var(--fh-brand)`, `var(--fh-ink)`, `var(--fh-line)`
   - `var(--fh-radius-*)`
   - `var(--fh-shadow-*)`
   - `var(--fh-font-size-*)`
   - `var(--fh-duration-*)`, `var(--fh-ease-premium)`

2. Prefer shared utility surfaces:
   - `.page-surface`
   - `.command-panel`
   - `.ds-card`
   - `.ds-title`
   - `.ds-subtitle`
   - `.fh-brand-shell`
   - `.fh-brand-hero`
   - `.fh-brand-panel`
   - `.fh-interactive`

3. In Tailwind, prefer theme keys over raw hex values:
   - `text-faith-ink`, `text-faith-slate`
   - `bg-brand`, `bg-accent`
   - `shadow-faith`, `shadow-soft`, `shadow-medium`
   - `rounded-xl`, `rounded-2xl`, `rounded-3xl`

## Accessibility Guardrails

- Always keep visible focus states on keyboard-reachable controls.
- Default to button min-height around `40px+` for mobile usability.
- Use `prefers-reduced-motion` fallback for non-essential motion.
- Keep semantic heading order and clear button labels.

## QA Reference Page

- Route: `/faithhub/provider/design-system-showcase`
- Purpose: Visual check for buttons, cards, typography, spacing, and interaction states.

## Rule

Avoid adding new hardcoded design values unless there is a true one-off visual need.
When a one-off repeats on more than one page, convert it into a token.

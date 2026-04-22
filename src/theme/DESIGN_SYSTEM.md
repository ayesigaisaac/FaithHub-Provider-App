# FaithHub Provider Design System (Foundation)

This project now uses a shared token layer for color, spacing, radius, shadows, and typography.

## Token Sources

- `src/theme/tokens.ts`
- `src/theme/index.ts`
- `src/index.css`
- `tailwind.config.ts`

## How To Use

1. Prefer semantic classes and CSS variables:
   - `var(--fh-brand)`, `var(--fh-ink)`, `var(--fh-line)`
   - `var(--fh-radius-*)`
   - `var(--fh-shadow-*)`
   - `var(--fh-font-size-*)`

2. Prefer shared utility surfaces:
   - `.page-surface`
   - `.command-panel`
   - `.ds-card`
   - `.ds-title`
   - `.ds-subtitle`

3. In Tailwind, prefer theme keys over raw hex values:
   - `text-faith-ink`, `text-faith-slate`
   - `bg-brand`, `bg-accent`
   - `shadow-faith`, `shadow-soft`, `shadow-medium`
   - `rounded-xl`, `rounded-2xl`, `rounded-3xl`

## Rule

Avoid adding new hardcoded design values unless there is a true one-off visual need.
When a one-off repeats on more than one page, convert it into a token.

# Phase 1 Foundation (Implemented)

This phase introduces baseline architecture to support future delivery in stable layers.

## Implemented in code

1. Environment configuration and validation
- `src/config/env.ts`
- Centralized runtime env resolution
- Validation for Supabase-required variables when `VITE_USE_SUPABASE=true`
- Safe defaults for local development

2. Core error model
- `src/core/errors.ts`
- `AppError` type for normalized cross-layer failures
- `normalizeError` helper for safe UI/API handling

3. HTTP client structure
- `src/core/http.ts`
- Typed fetch wrapper with consistent error conversion

4. Reusable async UX states
- `src/components/feedback/AsyncStates.tsx`
- `LoadingState`, `ErrorState`, and `EmptyState`

5. API/service layer for live sessions
- `src/api/live/types.ts`
- `src/api/live/localLiveSessionsApi.ts`
- `src/api/live/index.ts`
- Added adapter boundary between UI and persistence implementation

6. First UI integration to the new API boundary
- `src/pages/provider/raw/FH-P-030_LiveBuilder.tsx`
- Live Builder now uses `liveSessionsApi` abstraction instead of direct store mutation for key actions

## Why this matters

- Makes backend migration incremental (local storage -> Supabase/API) without rewriting feature pages.
- Reduces tight coupling between UI and storage implementation.
- Establishes shared primitives for errors and async UX behavior.

## Next Phase 1 follow-ups

1. Move `Live Schedule` and `Live Dashboard` reads/writes to the same `liveSessionsApi` abstraction.
2. Add remote adapter (`supabaseLiveSessionsApi`) behind `VITE_USE_SUPABASE`.
3. Introduce shared query/action hooks to standardize loading/error UX usage across pages.


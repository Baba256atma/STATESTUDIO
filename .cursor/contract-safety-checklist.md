# Nexora — Contract Safety Checklist

Protects frontend/backend integration and the canonical data pipeline (backend → canonical → adapter → panel).

## Backend Output Safety

- [ ] **Response shape** is unchanged unless the change is intentional, versioned, and mirrored on the frontend.
- [ ] **Required fields** for the consuming panel/adapter are present or explicitly defaulted in one place.
- [ ] **No silent field removal** — deprecated fields are migrated, not dropped without adapter updates.

## Frontend Contract Safety

- [ ] **Zod (and related) schema** still validates for all paths that feed the panel.
- [ ] **Adapters** normalize backend quirks into canonical shapes without losing semantics.
- [ ] **Panel data** stays **canonical** — one obvious path from API to `RightPanelHost` consumers.

## Pipeline Safety

- [ ] **backend → canonical → adapter → panel** is intact end-to-end for the changed flow.
- [ ] **Scanner / scenario** output aligns with expected panel slices (advice, risk, timeline, executive, etc.).
- [ ] No panel reads **raw** backend fields that bypass normalization without an explicit, audited exception.

## Failure Prevention

- [ ] **No fallback ambiguity** — if data is missing, behavior is explicit (message, status, trace).
- [ ] **No invalid empty object slices** passed as “success” panel payloads.
- [ ] **No silent schema mismatch** — validation failures are visible in dev and traced, not swallowed.

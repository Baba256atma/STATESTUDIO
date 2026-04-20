# Nexora — Production Readiness

## A. Production Readiness Goals

- **Stable panel behavior** — Right panel opens, stays visible, and resolves to the intended view without flash or post-action collapse.
- **Stable scene behavior** — Scene updates are partial and intentional; objects, highlights, and continuity are preserved unless explicitly forced.
- **Correct CTA execution** — Simulate, compare, explain/why-this, and related CTAs trigger the right intent, router resolution, and panel content.
- **Preserved frontend/backend contracts** — Canonical shapes, Zod validation, and adapters stay aligned; no silent drift.
- **Predictable state transitions** — Single authoritative paths for panel and scene state; no duplicate or racing updates.
- **Observable failures** — Sensitive flows emit identifiable traces; ambiguous fallbacks are avoided.
- **Safe bug fixing** — Fixes are minimal, architecture-preserving, and validated against regressions.
- **Demo-safe behavior** — Critical paths tell a coherent story without blank panels, mystery resets, or wrong routing.

## B. Core Readiness Dimensions

| Dimension | Meaning for Nexora |
|-----------|-------------------|
| **Stability** | Panel, scene, and CTA flows complete without flicker, disappearance, or unintended resets. |
| **Correctness** | Intent → router → resolver → RightPanelHost matches product expectations; scene reactions match policy. |
| **Contract Safety** | Backend → canonical → Zod → panel pipeline stays valid and explicit. |
| **Render Safety** | Host receives renderable data; no empty or ambiguous panel slices. |
| **UX Continuity** | Focus, context, and post-success state remain coherent after updates. |
| **Observability** | Traces and labels allow pinpointing layer (panel / router / reaction / scene / contract). |
| **Regression Resistance** | Changes are small, scoped, and checked against stability and demo criteria. |

## C. Nexora-Specific Product Risks

- Panel flash / disappear after CTA or chat success.
- Blank panel after CTA or “success” when data should exist.
- Wrong panel routing (intent vs resolved view mismatch).
- Full or unintended **scene overwrite** instead of partial updates.
- Object reset or broken highlight/dim continuity.
- Unstable post-success state (panel or scene “wins” unexpectedly).
- **Contract drift** between backend output and frontend schema/adapters.
- Silent fallback ambiguity (empty panels, vague fallbacks without logs).

## D. Release Mindset

Nexora should **not** be treated as ready for a milestone (demo, internal rollout, or external reliability) unless:

- **Key flows are stable** — Primary CTA and panel paths complete without disappearance or blank critical UI.
- **No blank states on critical paths** — Executive/advice/simulation surfaces show meaningful content or an explicit, logged fallback.
- **No architecture drift** — No parallel panel systems, no duplicate state paths, RightPanelHost remains final render authority.
- **Debug traces exist for sensitive areas** — Panel flow, router, reaction, scene, contract, and CTA paths are traceable when issues occur.

Keep patches **minimal** and **contract-preserving**; expand observability before expanding features.

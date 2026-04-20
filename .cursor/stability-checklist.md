# Nexora — Stability Checklist (pre-merge / major patch)

Use before approving a significant change. All items should pass for the touched surfaces.

## Panel Stability

- [ ] Panel remains **open** after the triggering action (CTA, chat success, navigation) where product intent is “stay open.”
- [ ] Panel does **not flicker** (no rapid mount/unmount of the same view).
- [ ] Panel does **not silently reset** to an unrelated view without an explicit user or policy reason.
- [ ] Panel renders **meaningful content** (not empty resolver output when data pipeline should populate).

## Scene Stability

- [ ] Scene is **not fully overwritten** unless `force_scene_update` (or equivalent explicit guard) allows it.
- [ ] **Objects remain continuous** across updates (IDs, selection story, no surprise mass removal).
- [ ] **Highlight / dim** behavior stays logical and consistent with reaction policy.
- [ ] **Motion** (if any) is subtle and stable — no jarring resets tied to panel updates.

## State Stability

- [ ] **No duplicate state path** introduced for the same concern (single authority for panel visibility and view).
- [ ] **No destructive reset** of unrelated UI state as a side effect of one action.
- [ ] **No post-success invalidation surprise** — success handlers do not close or blank the panel without intent.
- [ ] **Focus / context preserved** across updates where the product expects continuity (object focus, scenario context).

## CTA Stability

- [ ] **Simulate** opens/shows the expected panel with data or a clear, non-silent fallback.
- [ ] **Compare** same as above for comparison flow.
- [ ] **Explain / why-this** resolves to advice/explanation surfaces without blank panel.
- [ ] **No blank executive panel** on paths that should have decision/cockpit/simulation context.

## Router Stability

- [ ] **Correct view** resolves from intent (legacy tab / action → canonical `RightPanelView`).
- [ ] **Fallback is safe** — non-empty, schema-valid, logged if degraded.
- [ ] **Host** receives **renderable** data for the resolved view (resolver + contract path).

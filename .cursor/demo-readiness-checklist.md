# Nexora — Demo Readiness Checklist

Use before enterprise demos, stakeholder review, or recorded walkthroughs.

## Demo-Critical Flows

- [ ] **Fragility scan** returns a **visible** result (panel or inline — not empty when scan ran).
- [ ] **Correct object reaction** appears (highlight/dim/focus aligned with the narrative).
- [ ] Panel shows a **meaningful explanation** (advice, risk, timeline — not a blank shell).
- [ ] **CTA opens the correct panel** (simulate/compare/explain paths match the story).
- [ ] User can **follow the story visually** — scene + panel reinforce the same decision thread.

## Demo-Breaking Failures

Treat as **blockers** for demo approval if observed on the demo path:

- **Empty panel** when the user just took a meaningful action.
- **Panel disappears** immediately after click or “success.”
- **Full scene reset** without a clear, intentional narrative reason.
- **Confusing object behavior** (wrong highlight, everything dimmed, objects vanishing).
- **No visible response** to a meaningful input (chat, CTA, or scan).

## Demo Approval Rule

A flow is **demo-ready** only if:

- It behaves **consistently** across repeats (same inputs → same visible story).
- It **tells a visible story** — the audience sees cause and effect without reading logs.
- It does **not** require the presenter to **excuse bugs** (“ignore that flash,” “refresh if blank”).

If any item in **Demo-Breaking Failures** appears on the golden path, fix or scope the demo before calling it ready.

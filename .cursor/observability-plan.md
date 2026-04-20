# Nexora — Observability Plan (dev-stage, production-minded)

Lightweight traceability so engineers can see **where** a flow broke without adding heavy external tooling yet.

## Logging Priorities

1. **Panel resolution** — view chosen, open/close, preserve vs block decisions, host alignment.
2. **CTA execution** — which CTA fired, target view, and whether panel state applied.
3. **Router mapping** — legacy tab / intent → canonical view, fallbacks.
4. **Scene mutation / reaction** — partial vs full update, policy outcome, highlight/dim.
5. **Backend contract normalization** — adapter entry/exit shape, validation pass/fail (not secrets).

## Required Debug Labels

Use consistently so grepping and Cursor sessions stay aligned:

- `[Nexora][PanelFlow]`
- `[Nexora][Router]`
- `[Nexora][Reaction]`
- `[Nexora][Scene]`
- `[Nexora][Contract]`
- `[Nexora][CTA]`
- `[Nexora][PostSuccess]`

## Observability Goals

- **Identify where a flow broke** — panel vs router vs reaction vs contract vs post-success handler.
- **Detect silent regressions faster** — same action should produce comparable trace signatures.
- **Support safer patching** — small changes include a trace story before/after.
- **Help enterprise demo stabilization** — demo paths have enough signal to debug under time pressure.

## Practical Guidance

- Prefer **structured, sparse logs** at decision points over logging entire payloads.
- **Do not** log PII, tokens, or full scene JSON in production-minded traces.
- Favor **one label + compact object** per step over noisy always-on dumps.
- External APM/metrics stacks are **out of scope** here; keep to **console/dev traces** and documented labels until product asks for more.

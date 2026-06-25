# INT-1.3 Executive Time Context Contract Report

**Project:** Nexora Type-C  
**Phase:** INT-1.3  
**Title:** Unified Executive Time Context  
**Status:** COMPLETE

**Tags:** `[INT13_TIME_CONTEXT]` `[EXECUTIVE_TIME_CONTEXT]` `[TIME_CONTEXT_BUILDER]` `[TIME_CONTEXT_REGISTRY]` `[PAST_NOW_FUTURE]` `[IMMUTABLE_TIME_CONTEXT]` `[INT13_COMPLETE]`

---

## Scope

INT-1.3 establishes one unified Executive Time Context used by every intelligence request. Presentation layers must never determine time meaning themselves — only the Executive Time Context layer owns time interpretation. Architecture contracts only — no UI, Assistant, Timeline, Scenario, Dashboard, Workspace, or DS engine implementation.

---

## Target Architecture

```
Manager
        │
        ▼
Executive Time Context (INT-1.3)
        │
        ▼
Unified Intelligence Context (INT-1.2)
        │
        ▼
Single Intelligence Gateway (INT-1.1)
        │
        ▼
Dashboard Intelligence Runtime (INT-1)
        │
        ▼
Certified DS Engines
```

---

## Artifacts

Created under `frontend/app/lib/dashboardIntelligence/`:

| File | Purpose |
|------|---------|
| `executiveTimeContextContract.ts` | Time context types, events, version contract, reserved extensions |
| `executiveTimeContextBuilder.ts` | **Only** time context creator — collect, normalize, freeze |
| `executiveTimeContextValidator.ts` | State, version, timestamp, timeline compatibility validation |
| `executiveTimeContextRegistry.ts` | Current/previous time context, change counter |
| `executiveTimeContextDiagnostics.ts` | Dev-only time context diagnostics |
| `executiveTimeContextGateway.ts` | Time context → gateway metadata bridge |
| `executiveTimeContextCertification.ts` | Architecture certification |
| `executiveTimeContext.test.ts` | Contract and certification tests |

Integration touchpoints (contracts only):

| File | Change |
|------|--------|
| `intelligenceContextContract.ts` | `executiveTimeContext` field on unified context |
| `intelligenceContextBuilder.ts` | Composes Executive Time Context on every build |
| `intelligenceContextValidator.ts` | Validates embedded time context |
| `intelligenceContextGateway.ts` | Attaches time metadata to gateway requests |

No forbidden layers were modified (Dashboard UI, Assistant, Scene, Timeline UI, Scenario UI, Workspace stores, DS Engines, Executive Registry).

---

## Executive Time Context Fields

| Field | Description |
|-------|-------------|
| `timeState` | `past` \| `now` \| `future` |
| `referenceTimestamp` | ISO anchor for the time interpretation |
| `requestedTime` | Manager-requested time phrase or ISO (nullable) |
| `timelinePosition` | Timeline index/label compatibility (reserved-ready) |
| `source` | Contract source identifier |
| `confidence` | Always `null` in INT-1.3 — no calculations |
| `version` | Active contract version (`INT-1.3`) |
| `futureExtension` | Reserved extension map |

All fields are immutable. Consumers may read; only the Time Context Builder creates new time contexts.

---

## Supported Time States (v1)

| State | Meaning |
|-------|---------|
| **PAST** | Already happened — historical, timeline, completed |
| **NOW** | Current business state — live status, current risks, KPIs, relationships |
| **FUTURE** | Hypothetical — simulation, prediction, what-if, planned |

Default when omitted: **NOW**.

---

## Time Context Events

| Event | When |
|-------|------|
| `TimeContextCreated` | New immutable time context built |
| `TimeContextUpdated` | Time context updated via builder |
| `TimeContextChanged` | Registry recorded a change |
| `TimeContextValidated` | Post-build validation passed |
| `TimeContextRejected` | Input or context validation failed |

---

## Reserved Future Extensions

No implementation in INT-1.3 — contract reservation only:

- Historical Replay
- Executive Timeline
- Planning Horizon
- Forecast Window
- Quarter Comparison
- Year Comparison
- Multi-period Analysis
- Scenario Horizon
- Scheduled Plans

---

## Integration Rules

1. **Unified Intelligence Context** — every `UnifiedIntelligenceContext` includes `executiveTimeContext`.
2. **Single Intelligence Gateway** — gateway requests carry time metadata via `EXECUTIVE_TIME_METADATA_KEYS`.
3. **Dashboard Runtime** — receives intelligence through the gateway with time metadata attached; presentation layers read only.
4. **Presentation layers** — must not infer PAST/NOW/FUTURE themselves.

---

## Certification Gates

| Gate | Requirement |
|------|-------------|
| One time context layer | Single Executive Time Context contract |
| PAST / NOW / FUTURE | All three states build and validate |
| Immutable context | `Object.freeze` on all time contexts |
| Builder sole creator | Invalid states rejected |
| Unified context includes time | INT-1.2 context embeds time context |
| Gateway receives time | Metadata keys populated |
| Runtime receives time | Gateway routes with time metadata |
| Registry tracks version | Change counter and active version |
| No forbidden mutations | DS, Scene, Workspace, Executive Registry unchanged |

---

## Test Results

Run from `frontend/`:

```bash
node --test app/lib/dashboardIntelligence/executiveTimeContext.test.ts
node --test app/lib/dashboardIntelligence/intelligenceContext.test.ts
npm run build
```

**INT-1.3:** 9/9 tests pass  
**INT-1.2:** 10/10 tests pass (regression)  
**Build:** pass

---

## Phase Completion

INT-1.3 Executive Time Context Contract is **COMPLETE**. Every intelligence request can express whether the manager refers to PAST, NOW, or FUTURE through one immutable, builder-owned layer integrated into Unified Intelligence Context and the Single Intelligence Gateway.

**Next ready:** INT-1.4 or downstream intelligence consumers that read `executiveTimeContext` without interpreting time locally.

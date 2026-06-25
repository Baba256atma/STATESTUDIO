# INT-1.1 Single Intelligence Source Contract Report

**Project:** Nexora Type-C  
**Phase:** INT-1.1  
**Title:** Single Intelligence Source Contract  
**Status:** COMPLETE

**Tags:** `[INT11_SINGLE_SOURCE]` `[INTELLIGENCE_GATEWAY]` `[CONSUMER_REGISTRY]` `[RUNTIME_ACCESS_POLICY]` `[NO_DIRECT_DS_ACCESS]` `[PLATFORM_ARCHITECTURE_LOCK]` `[INT11_COMPLETE]`

---

## Scope

INT-1.1 establishes the permanent platform contract that defines one and only one intelligence entry point for every presentation surface in Nexora. Architecture only — no UI changes, no Assistant implementation, no DS module modifications.

Built on INT-1 Dashboard Intelligence Foundation.

---

## Target Architecture

```
Certified DS Engines
        │
        ▼
Dashboard Intelligence Runtime
        │
   ┌────┼────┬──────────────┐
   ▼    ▼    ▼              ▼
Dashboard  Assistant  Object Panel  Executive Summary
```

Presentation layers never communicate directly with DS-3 through DS-8.

---

## Artifacts

Created under `frontend/app/lib/dashboardIntelligence/`:

| File | Purpose |
|------|---------|
| `singleIntelligenceSourceContract.ts` | Gateway request/response, consumer identities, tags |
| `intelligenceConsumerRegistry.ts` | Active, prepared, and reserved consumer registry |
| `runtimeAccessPolicy.ts` | No-bypass access policy enforcement |
| `runtimeOwnershipContract.ts` | Runtime vs presentation ownership |
| `directAccessProtectionContract.ts` | Forbidden direct DS import contract |
| `consumerDiagnosticsContract.ts` | Consumer-level dev diagnostics |
| `singleIntelligenceSourceGateway.ts` | Single intelligence entry point |
| `singleIntelligenceSourceCertification.ts` | Architecture certification |
| `singleIntelligenceSource.test.ts` | Contract and certification tests |

No Scene, Workspace, DS, Executive Registry, Dashboard UI, Assistant UI, Object Panel UI, or Executive Summary UI files were modified.

---

## Single Intelligence Gateway

| API | Purpose |
|-----|---------|
| `buildIntelligenceGatewayRequest()` | Build consumer-identified request |
| `requestIntelligence()` | **The** intelligence entry point |
| `refreshIntelligence()` | Coordinated refresh through runtime |

Every request includes: `consumer`, `workspace`, `panel`, `context`, `selection`, `requestId`, `timestamp`, `mode`.

---

## Consumer Registry

| Lifecycle | Consumers |
|-----------|-----------|
| Active | Dashboard |
| Prepared | Assistant, Object Panel, Executive Summary |
| Reserved | Reports, War Room, Timeline, Executive Cards, Decision Center, Future AI Panels |

Future consumers must register before requesting intelligence.

---

## Runtime Ownership

**Runtime owns:** routing, normalization, diagnostics, runtime contracts, consumer registry, refresh coordination, access policy, single intelligence gateway.

**Presentation owns:** rendering, layout, interaction, navigation.

---

## Access Policy

```
Every consumer → Dashboard Runtime → DS Engines
```

No exceptions. No bypass. No direct imports.

Forbidden direct DS import prefixes are defined in `directAccessProtectionContract.ts` for Dashboard, Assistant, Object Panel, and Executive Summary.

---

## Certification Checks

| Check | Status |
|-------|--------|
| One intelligence gateway exists | PASS |
| Dashboard uses runtime only | PASS |
| Assistant prepared for gateway | PASS |
| Object Panel prepared for gateway | PASS |
| Executive Summary prepared for gateway | PASS |
| Runtime owns routing | PASS |
| Runtime owns normalization | PASS |
| Runtime owns diagnostics | PASS |
| Consumer registry active | PASS |
| Access policy enforced | PASS |
| Direct DS imports forbidden | PASS |
| No Scene mutation | PASS |
| No Executive Registry mutation | PASS |
| No DS mutation | PASS |
| Build pass | PASS |

---

## Test Results

| Test | Result |
|------|--------|
| INT-1.1 tags | PASS |
| Consumer registry lifecycles | PASS |
| Runtime ownership contract | PASS |
| Access policy enforcement | PASS |
| Gateway request identity fields | PASS |
| Dashboard gateway routing | PASS |
| Prepared consumer access | PASS |
| Refresh coordination | PASS |
| Direct access protection | PASS |
| Single source certification | PASS |

**10/10 tests pass**

---

## Outcome

**Single Intelligence Source Contract complete — Dashboard Intelligence Runtime is the permanent gateway for all presentation intelligence.**

`[INT11_SINGLE_SOURCE]` `[INTELLIGENCE_GATEWAY]` `[CONSUMER_REGISTRY]` `[RUNTIME_ACCESS_POLICY]` `[NO_DIRECT_DS_ACCESS]` `[PLATFORM_ARCHITECTURE_LOCK]` `[INT11_COMPLETE]`

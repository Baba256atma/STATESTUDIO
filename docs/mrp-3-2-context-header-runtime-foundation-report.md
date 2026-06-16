# MRP:3:2 — Context Header Runtime Foundation Report

**Phase:** MRP:3:2  
**Verdict:** COMPLETE  
**Date:** 2026-06-13

**Brake tags:** `[MRP_CONTEXT_SYNC]` · `[MRP_CONTEXT_GUARD]`

---

## 1. Objective

Connect Section B (Context Header) to live runtime state via a unified MRP Context Store before additional panel development.

---

## 2. Architecture

### Unified MRP Context Store

| Layer | Path | Role |
|-------|------|------|
| Contract | `frontend/app/lib/ui/mrpContext/mrpContextStoreContract.ts` | Types, defaults, brake tags |
| Resolver | `frontend/app/lib/ui/mrpContext/mrpContextResolver.ts` | Pure Panel Name / Active Mode / Selected Object resolution |
| Runtime | `frontend/app/lib/ui/mrpContext/mrpContextStoreRuntime.ts` | Publish, subscribe, guards |
| Sync hook | `frontend/app/lib/ui/mrpContext/useSyncMrpContextStore.ts` | Publishes from MainRightPanelShell props |
| Read hook | `frontend/app/lib/ui/mrpContext/useMrpContextHeader.ts` | `useSyncExternalStore` consumer |
| UI | `frontend/app/components/main-right-panel/MainRightPanelContextHeader.tsx` | Section B render |

### Header fields

| Field | Updates when | Example |
|-------|--------------|---------|
| **Panel Name** | Workspace / dashboard context changes | `Risk`, `War Room` |
| **Active Mode** | Sub-workspace / status context changes | `Forecast`, `Response Plan` |
| **Selected Object** | Object selection changes | `Factory A`, `Supply Chain` |
| **Back Navigation** | Dedicated workspace or history depth | `← Back` |

### Skeleton placement

```text
Section A — Top Runtime Tabs (Insight | Assistant)
Section B — Context Header (this phase)
Section C — Dynamic Workspace Area
```

Frozen in `docs/architecture/mrp-3-1-skeleton-blueprint-freeze.md`.

---

## 3. Runtime Protection

| Guard | Mechanism |
|-------|-----------|
| No stale context | Signature dedupe + monotonic revision |
| No undefined values | `normalizeDisplayString` + canonical defaults |
| No hydration mismatch | Server snapshot via `getMrpContextStoreServerSnapshot()` |
| No render loops | Publish-rate brake (`[MRP_CONTEXT_GUARD]`) + unchanged signature skip |

---

## 4. Acceptance Gates

| Gate | Result |
|------|--------|
| Object Selection → Header Update | **PASS** |
| Workspace Change → Header Update | **PASS** |
| Sub Workspace Change → Header Update | **PASS** |
| No undefined header values | **PASS** |
| Hydration-safe read path | **PASS** |
| Render loop guard active | **PASS** |

**Automated tests:** `frontend/app/lib/ui/mrpContext/mrpContextStore.test.ts`

---

## 5. Integration

- `MainRightPanelShell` publishes context on prop changes and renders `MainRightPanelContextHeader`.
- `HomeScreen` passes `dashboardContext` alongside existing workspace/object props.
- Back navigation routes to `onReturnToDashboardHome`.

---

## 6. Dev Traces

On context publish (dev only):

```text
[MRP_CONTEXT_SYNC] { panelName, activeMode, selectedObject, revision, ... }
```

On guard violation (dev only):

```text
[MRP_CONTEXT_GUARD] { reason, ... }
```

---

## 7. Related Documents

- `docs/architecture/mrp-3-1-skeleton-blueprint-freeze.md`
- `docs/nexora-constitution.md`
- `docs/mrp-context-sync-contract-report.md`

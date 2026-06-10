# MRP:7:1 — Assistant → Dashboard Bridge Report

**Date:** 2026-06-07  
**Scope:** Executive Action Handoff Contract — bridge architecture only. No AI, agents, or intelligence engines.

---

## 1. Bridge Architecture

### Principle

**Assistant suggests. Dashboard Runtime decides and executes.**

Assistant never owns execution. Dashboard Runtime remains the single authority.

### Flow

```
Executive
     ↓
Assistant (conversation / suggestion)
     ↓
emitAssistantExecutiveActionRequest()
     ↓
nexora:assistant-dashboard-action (CustomEvent)
     ↓
HomeScreen Dashboard Action Consumer
     ↓
routeAssistantExecutiveActionRequest() — validation
     ↓
applyObjectPanelRouteRef() — shared execution path
     ↓
setDashboardMode + routeObject
     ↓
Dashboard workspace opens (Focus / Analyze / Compare / Scenario / War Room)
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `assistantDashboardBridgeContract.ts` | Action types, payload, emit, brakes |
| Runtime | `assistantDashboardBridgeRuntime.ts` | Validation, mapping to object panel input |
| Consumer | `HomeScreen.tsx` | Event listener → validate → dispatch |
| Execution | `objectPanelActionRouterRuntime.ts` | Shared dashboard mode routing (MRP:2:1) |

Bridge owns **action transport only**. It never owns dashboard, scene, selection, or timeline state.

---

## 2. Authority Ownership Map

| Concern | Owner | Assistant / Bridge role |
|---------|-------|-------------------------|
| Dashboard mode | `NexoraWorkspaceState.dashboardMode` | Bridge requests via consumer dispatch only |
| Workspace rendering | Dashboard Runtime | Unchanged |
| Object selection | `HomeScreen.selectedObjectIdState` | Bridge reads fallback context; never writes |
| Conversation state | Assistant (future) | Assistant owns |
| Action suggestions | Assistant (future) | Assistant emits requests only |
| Action transport | Bridge contract + event | Emit + validate + route |
| Execution | Dashboard consumer + reducer | Validates then `setDashboardMode` |

---

## 3. Action Contract Specification

### Executable actions (MRP:7:1)

| Assistant Action | Dashboard Mode | Object Panel Action |
|------------------|----------------|---------------------|
| `FOCUS_OBJECT` | `focus` | `focus` |
| `OPEN_ANALYZE` | `analyze` | `analyze` |
| `OPEN_COMPARE` | `compare` | `compare` |
| `OPEN_SCENARIO` | `scenario` | `scenario` |
| `OPEN_WARROOM` | `war_room` | `war_room` |

### Future actions (validated, not executable)

`OPEN_RISK`, `OPEN_TIMELINE`, `OPEN_RECOMMENDATIONS`, `OPEN_SIMULATION`, `OPEN_DECISION_CENTER`

### Payload

```typescript
{
  action: AssistantExecutiveActionKind;
  objectId: string;
  objectName: string;
  source: "assistant";  // required
  timestamp: number;
  requestId?: string;
}
```

### Event

- Name: `nexora:assistant-dashboard-action`
- Emitter: `emitAssistantExecutiveActionRequest()`
- Consumer: `HomeScreen` listener on `ASSISTANT_DASHBOARD_ACTION_EVENT`

### Aliases supported at normalization

`analyze` → `OPEN_ANALYZE`, `war_room` → `OPEN_WARROOM`, etc.

---

## 4. Runtime Validation Flow

1. **Emit (Assistant side):** Normalize action; reject future/unauthorized actions; require `objectId`; dispatch CustomEvent only.
2. **Consume (Dashboard side):** Verify `source === "assistant"`; resolve object from payload or `selectedObjectIdStateRef` (read-only fallback).
3. **Validate:** `routeAssistantExecutiveActionRequest()` checks action, object, contract shape.
4. **Execute:** Map to `objectPanelInput`; call `applyObjectPanelRouteRef()` → `setDashboardMode` with dedupe guard.
5. **Failure:** Brake log; current dashboard mode preserved; no crash.

---

## 5. Safety Protections

### Brake logs — `[AssistantBridge][Brake]`

| Message | Trigger |
|---------|---------|
| Invalid action | Unknown action kind |
| Missing object | No objectId at emit or validate |
| Missing dashboard runtime | Dispatch unavailable at consumer |
| Unauthorized execution request | Future action or emit of non-executable action |
| Invalid bridge contract | Malformed payload / wrong source |

### Performance guards

- Stable refs for dispatch (`applyAssistantDashboardActionRef`, `applyObjectPanelRouteRef`)
- Empty dependency `useEffect` listeners — no ping-pong
- Reducer dedupe on identical mode + route object (MRP:2:1)
- No scene, camera, timeline, topology, AI, or simulation invocation

### HUD / UI

- No changes to Object Panel, Timeline, Scene HUD, Dashboard layout, Assistant layout, or MRP shell
- Assistant placeholder unchanged (bridge is API + consumer only)

---

## 6. Future Assistant Integration Roadmap

1. **Chat intent mapping:** Map NL intents ("Analyze this object") → `OPEN_ANALYZE` via future assistant layer; always call `emitAssistantExecutiveActionRequest`, never `setDashboardMode` directly.
2. **Suggestion chips:** Assistant UI renders suggested actions; click emits bridge request with current object context.
3. **Future actions:** Enable `OPEN_RISK`, `OPEN_TIMELINE`, etc. when corresponding dashboard modes/shells exist; extend validation allowlist only.
4. **Request correlation:** Use `requestId` for assistant conversation turn tracking without bridge state ownership.
5. **Decouple chat analyze:** Retire or redirect `nexora:request-object-analyze` chat path for workspace Analyze; bridge `OPEN_ANALYZE` is canonical for dashboard handoff.
6. **LeftCommandAssistant / ExecutiveAssistantPanel:** Wire through bridge contract when suggesting workspace navigation.
7. **MRP-HUD:1:** Complete HUD zoning repair before MRP Freeze.

---

## Legacy Findings

| Surface | Finding |
|---------|---------|
| `nexora:request-object-analyze` | Chat sendText path — separate from bridge Analyze |
| `LeftCommandAssistant` | Legacy simulate/compare dispatch — must not bypass bridge |
| `RightPanelHost` | Legacy panel opens — bridge routes to Dashboard only |
| `runDecisionAssistant` | Enrichment merge — not workspace routing |
| Object Panel router | Shared execution path — intentional reuse |

---

## Files Added / Modified

**New**

- `frontend/app/lib/assistant-bridge/assistantDashboardBridgeContract.ts`
- `frontend/app/lib/assistant-bridge/assistantDashboardBridgeRuntime.ts`
- `frontend/app/lib/assistant-bridge/assistantDashboardBridgeContract.test.ts`
- `frontend/app/lib/assistant-bridge/assistantDashboardBridgeLegacyFindings.ts`

**Modified**

- `frontend/app/screens/HomeScreen.tsx` — bridge consumer + `applyAssistantDashboardActionRef`

---

## Verification

- `node --test app/lib/assistant-bridge/assistantDashboardBridgeContract.test.ts`
- `npm run build`
- Programmatic: `emitAssistantExecutiveActionRequest({ action: "OPEN_ANALYZE", objectId: "..." })` with object selected → Dashboard switches to Analyze mode

---

## Architecture Rule (Enforced)

War Room, Scenario, Compare, Analyze, and Focus are **Dashboard modes**. Assistant is an **Advisor**. Assistant never executes. Dashboard Runtime remains the **single authority**.

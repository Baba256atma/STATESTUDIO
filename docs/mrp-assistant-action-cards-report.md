# MRP:7:2 — Assistant Action Cards Report

**Date:** 2026-06-07  
**Scope:** Executive Action Cards as Assistant launch surfaces. Bridge transport + Dashboard execution unchanged in authority.

---

## 1. Card Architecture

### Principle

**Action Cards suggest. Bridge transports. Dashboard decides and executes.**

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `assistantActionCardContract.ts` | Card models, validation, launch, brakes |
| Card UI | `ExecutiveActionCard.tsx` | Single executive command card |
| Group | `AssistantActionCardGroup.tsx` | Recommended actions + notifications |
| Surface | `AssistantExecutiveLaunchSurface.tsx` | Insight summary + card group |
| Assistant tab | `MainRightPanelAssistantPlaceholder.tsx` | Additive integration |
| Context | `HomeScreen.tsx` | Read-only `assistantActionCardContext` |

### Card catalog (MRP:7:2)

**Available (executable via bridge):**

| Card | Bridge Action | Dashboard Mode |
|------|---------------|----------------|
| Focus | `FOCUS_OBJECT` | `focus` |
| Analyze | `OPEN_ANALYZE` | `analyze` |
| Compare | `OPEN_COMPARE` | `compare` |
| Scenario | `OPEN_SCENARIO` | `scenario` |
| War Room | `OPEN_WARROOM` | `war_room` |

**Coming soon (placeholders):** Risk, Timeline, Simulation, Recommendations, Decision Center

---

## 2. Launch Flow

```
Executive clicks card Launch button
        ↓
validateAssistantActionCardLaunch()
        ↓
launchAssistantActionCard() → emitAssistantExecutiveActionRequest()
        ↓
nexora:assistant-dashboard-action
        ↓
HomeScreen applyAssistantDashboardActionRef
        ↓
routeAssistantExecutiveActionRequest → applyObjectPanelRouteRef
        ↓
setDashboardMode + routeObject
        ↓
emitAssistantActionCardLaunchAck() → card group notification
        ↓
Dashboard workspace opens
```

Assistant never calls `setDashboardMode` or opens workspaces directly.

---

## 3. Ownership Boundaries

| Concern | Owner |
|---------|-------|
| Conversation / card rendering | Assistant |
| Action suggestions | Assistant (cards) |
| Action transport | Bridge |
| Mode switching / execution | Dashboard Runtime |
| Object selection | `HomeScreen.selectedObjectIdState` (read-only in cards) |

Cards receive `AssistantActionCardContext` as read-only props — no local selection or dashboard stores.

---

## 4. Validation Lifecycle

1. **Card status:** `coming_soon` → fail with "Route not ready."
2. **Action type:** Must map to executable bridge action.
3. **Target object:** From `dashboardRouteObjectId` or `selectedObjectId`; fail with "Object not available."
4. **Route preview:** `routeAssistantExecutiveActionRequest()` before emit.
5. **Bridge emit:** `emitAssistantExecutiveActionRequest()` — fails if bridge unavailable.
6. **Dashboard consumer:** Re-validates and executes; emits launch ack event.

### Brake logs — `[AssistantActionCard][Brake]`

Invalid action type, invalid target object, missing bridge, route unavailable, unauthorized launch.

---

## 5. Failure Handling

| Condition | User message |
|-----------|--------------|
| No object selected | Object not available. |
| Future / coming soon card | Route not ready. |
| Bridge emit failure | Workspace unavailable. |
| Dashboard runtime missing | Workspace unavailable. |
| Dashboard execution failed | Workspace unavailable. |

Notifications appear inline in `AssistantActionCardGroup` — lightweight, non-blocking. Assistant and Dashboard state are never reset.

Launch ack event: `nexora:assistant-action-card-launch-ack`

---

## 6. Future Expansion Model

1. **Chat-rendered cards:** Map assistant NL responses to `AssistantActionCardModel[]` and reuse `AssistantActionCardGroup`.
2. **Grouped suggestions:** Multiple card groups (Recommended, Strategic, Incident) via `cards` prop override.
3. **Future actions:** Change card `status` from `coming_soon` to `available` when dashboard modes exist; extend bridge allowlist.
4. **Confidence / target metadata:** Optional fields on card model — presentation only.
5. **Insight summary:** `AssistantExecutiveLaunchSurface` accepts dynamic `insightSummary` from future assistant layer.
6. **LeftCommandAssistant migration:** Route legacy commands through card contract + bridge.

---

## Legacy Findings

| Surface | Finding |
|---------|---------|
| Chat renderer | Parallel surface — future cards should reuse contract |
| LeftCommandAssistant | Direct simulate/compare — migrate to bridge |
| Bridge (MRP:7:1) | Canonical transport — cards use exclusively |
| Dashboard consumer | Shared execution with Object Panel router |

---

## Files Added / Modified

**New**

- `frontend/app/lib/assistant-bridge/assistantActionCardContract.ts`
- `frontend/app/lib/assistant-bridge/assistantActionCardContract.test.ts`
- `frontend/app/lib/assistant-bridge/assistantActionCardLegacyFindings.ts`
- `frontend/app/components/assistant/ExecutiveActionCard.tsx`
- `frontend/app/components/assistant/AssistantActionCardGroup.tsx`
- `frontend/app/components/assistant/AssistantExecutiveLaunchSurface.tsx`

**Modified**

- `frontend/app/components/main-right-panel/MainRightPanelAssistantPlaceholder.tsx`
- `frontend/app/components/main-right-panel/MainRightPanelShell.tsx`
- `frontend/app/screens/HomeScreen.tsx`

---

## Verification

- `node --test app/lib/assistant-bridge/assistantActionCardContract.test.ts`
- `npm run build`
- Manual: Select object → Assistant tab → Launch Analyze card → Dashboard switches to Analyze workspace

---

## Architecture Rule (Enforced)

War Room is a **Dashboard mode**, not a separate panel. Action Cards **suggest**. Bridge **transports**. Dashboard Runtime **executes**.

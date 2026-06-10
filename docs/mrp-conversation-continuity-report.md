# MRP:7:4 — Executive Conversation Continuity + Workspace-Aware Assistant Report

**Date:** 2026-06-07  
**Scope:** Runtime awareness and conversation continuity contracts only. No AI memory, agents, engines, or UI redesign.

---

## 1. Awareness Architecture

### Principle

**Assistant remembers context. Dashboard owns execution. Assistant assists. Dashboard decides.**

The conversation continuity layer sits above the MRP:7:3 context synchronization contract. It transforms read-only sync summaries into workspace-aware assistant runtime state without acquiring execution ownership.

### Flow

```
Dashboard Runtime (authority)
     ↓
publishDashboardExecutiveContextSummary()  [MRP:7:3]
     ↓
nexora:dashboard-assistant-context-sync
     ↓
useAssistantConversationContinuity()
     ↓
mergeConversationContinuityFromSync() — session preserved
     ↓
ExecutiveWorkspaceAwareness (read-only copy)
     ↓
AssistantConversationContinuityPanel + workspace-aware messages
```

### Awareness Levels

| Level | Name | Signal |
|-------|------|--------|
| L1 | Current Object Awareness | `currentObjectId` present |
| L2 | Current Workspace Awareness | Dedicated workspace active |
| L3 | Route Awareness | `lastAction` / route type known |
| L4 | Executive Intent Awareness | Intent derived from workspace mode |

No deeper intelligence. No recommendations. No autonomous actions.

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `conversationContinuityContract.ts` | Awareness types, build, validate, format |
| Runtime | `conversationContinuityRuntime.ts` | Session merge, lifecycle preservation |
| Hook | `useAssistantConversationContinuity.ts` | React consumer — stable sessionId |
| Panel | `AssistantConversationContinuityPanel.tsx` | Read-only awareness display |
| Legacy | `conversationContinuityLegacyFindings.ts` | Inspection notes |

---

## 2. Conversation Lifecycle

```
Session Created (stable sessionId — never reset on tab switch)
     ↓
Sync Event Received
     ↓
mergeConversationContinuityFromSync()
     ↓
Awareness Updated (copy only)
     ↓
Conversation Continues — no reset, no duplication
```

### Survives

- Dashboard tab changes
- Workspace changes (Focus → Analyze → War Room)
- Object changes
- Route changes (object panel, assistant bridge, passive return)
- MRP mode changes

### Does NOT

- Reset conversation session on tab switch
- Recreate session on workspace open
- Duplicate dashboard state
- Trigger route refresh or workspace relaunch

---

## 3. Workspace Awareness Model

### Assistant receives (read-only)

| Field | Source |
|-------|--------|
| Current Workspace | Sync summary `workspaceType` |
| Current Object | Sync summary `objectId` / `objectName` |
| Last Workspace | Sync summary `lastWorkspaceType` |
| Last Action | Sync summary `lastRouteType` |
| Current Dashboard Mode | Sync summary `currentDashboardMode` |
| Workspace Status | Sync summary `workspaceStatus` |
| Lifecycle Phase | Mapped from `completionStatus` |

### Executive Intent Contract

Intent is inferred from workspace mode only — no reasoning engine:

| Workspace | Intent | Conversation Tone |
|-----------|--------|-------------------|
| Focus | `focus` | Focused |
| Analyze | `analyze` | Analytical |
| Compare | `compare` | Comparative |
| Scenario | `scenario` | Exploratory |
| War Room | `war_room` | Operational |
| Overview | `overview` | General |

Tone adjusts prompt hints (e.g., analytical questions in Analyze mode). No decision making. No recommendations. No action execution.

### Workspace Lifecycle Awareness

| Completion Status | Lifecycle Phase |
|-------------------|-----------------|
| `opened` | `open` |
| `active` | `active` |
| `returned_passive` | `exit` |
| `completed` | `complete` |

Assistant observes lifecycle. Assistant never modifies lifecycle state.

### Future placeholders (no implementation)

`risk`, `timeline`, `simulation`, `decision_center`, `recommendations`

---

## 4. Ownership Boundaries

| Concern | Owner | Assistant role |
|---------|-------|----------------|
| Routes | Dashboard Runtime | Read-only route type in awareness |
| Execution | Dashboard consumer | Never executes |
| Workspace state | `NexoraWorkspaceState` | Observes via sync copy |
| Dashboard state | Dashboard reducer | Never writes |
| Conversation | Assistant continuity session | Owns `sessionId` + awareness copy |
| Contextual awareness | Assistant runtime | Builds from sync — no authority |
| Context transport | MRP:7:3 sync layer | Upstream only |

### Assistant cannot

- Switch workspace
- Change route
- Open dashboard views
- Modify object, scene, or timeline state

Assistant may only suggest (via existing action cards, MRP:7:2).

---

## 5. Failure Handling

### Brake logs

`[ConversationContinuity][Brake]`

- Missing workspace context
- Missing object context
- Invalid awareness state
- Unauthorized dashboard mutation
- Context ownership violation
- Conversation reset detected

### Fallback behavior

- Preserve conversation session
- Preserve workspace and object selection (Dashboard authority unchanged)
- Ignore invalid awareness updates
- Never crash
- Never reset executive session

### Performance guarantees

- No rerender loops — state updates only on sync events
- No synchronization loops — merge is idempotent per event
- No recursive state updates
- No route refresh, workspace relaunch, scene refresh, or polling

---

## 6. Future Assistant Evolution Roadmap

1. **MRP:7:5+** — Wire workspace-aware prompt hints into consultant input (when AI layer exists)
2. **Future workspaces** — Extend `FUTURE_CONVERSATION_WORKSPACE_AWARENESS` with intent/tone mappings when modes ship
3. **Message history** — Keep decoupled from `ExecutiveAssistantPanel`; continuity session provides context injection only
4. **Explicit completion signals** — Dashboard may publish `completed` status; continuity maps to `complete` lifecycle
5. **No memory engine** — Continuity remains event-driven copies; persistent memory is out of scope

---

## 7. Legacy Inspection Findings

| System | Status |
|--------|--------|
| MRP Assistant shell | Session preserved via hook — no tab-reset |
| Context sync (7:3) | Upstream transport — continuity consumes copies |
| ExecutiveAssistantPanel | Decoupled message history |
| Dashboard Runtime | Authority preserved |
| Workspace lifecycle | Read-only mapping from completion status |
| NexoraWorkspaceState | Tab decoupled from conversation sessionId |

---

## 8. Definition of Done

| Criterion | Status |
|-----------|--------|
| Assistant understands current workspace context | ✅ |
| Conversation survives workspace changes | ✅ |
| Conversation survives tab changes | ✅ |
| Ownership remains clean | ✅ |
| No duplicated state | ✅ |
| No routing loops | ✅ |
| No synchronization loops | ✅ |
| No workspace relaunches | ✅ |
| Build passes | ✅ |

---

## 9. Files Created / Modified

**Created**

- `frontend/app/lib/assistant-bridge/conversationContinuityContract.ts`
- `frontend/app/lib/assistant-bridge/conversationContinuityRuntime.ts`
- `frontend/app/lib/assistant-bridge/conversationContinuityContract.test.ts`
- `frontend/app/lib/assistant-bridge/conversationContinuityLegacyFindings.ts`
- `frontend/app/lib/assistant-bridge/useAssistantConversationContinuity.ts`
- `frontend/app/components/assistant/AssistantConversationContinuityPanel.tsx`
- `docs/mrp-conversation-continuity-report.md`

**Modified**

- `frontend/app/components/main-right-panel/MainRightPanelAssistantPlaceholder.tsx`
- `frontend/app/components/assistant/AssistantExecutiveLaunchSurface.tsx`

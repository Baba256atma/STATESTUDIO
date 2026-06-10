# MRP:8:3 — Single Active Workspace Enforcement + Transition Controller Report

**Date:** 2026-06-07  
**Scope:** Transition coordination architecture only. No workspace features, engines, or UI redesign.

---

## 1. Transition Architecture

### Principle

**Registry describes. Lifecycle governs. Transition Controller coordinates. Dashboard executes.**

**Exactly one executive workspace is active at any moment.**

### Stack

```
Workspace Registry (metadata)
        ↓
Lifecycle Manager (state transitions)
        ↓
Transition Controller (single-active enforcement + handoff)
        ↓
Dashboard Runtime (setDashboardMode — authority)
        ↓
Workspace UI (renders)
```

### Components

| Layer | File | Role |
|-------|------|------|
| Contract | `executiveWorkspaceTransitionControllerContract.ts` | Transition states, validation, single-active rules |
| Runtime | `executiveWorkspaceTransitionControllerRuntime.ts` | Request, commit, pause, resume coordination |
| Legacy | `executiveWorkspaceTransitionLegacyFindings.ts` | Bypass paths, migration notes |
| Router | `objectPanelActionRouterRuntime.ts` | Mandatory controller gate before route |
| Dashboard | `HomeScreen.tsx` | Commit after dispatch; passive pause/resume on tab switch |

---

## 2. Single Active Workspace Rules

### Enforced workspaces

Focus · Analyze · Compare · Scenario · War Room

### Allowed

Exactly **one** of the above active at any time.

### Never allowed

Analyze + Compare · Scenario + War Room · Focus + Analyze · Any combination

### On new workspace activation

Previous workspace transitions: `active → completed → closed` (via lifecycle settle inside controller request path).

Lifecycle layer now **rejects** duplicate active transitions (`duplicate_active_workspace`).

---

## 3. Transition Lifecycle

### Controller states

| State | Meaning |
|-------|---------|
| idle | No transition in progress |
| requested | Transition initiated |
| validating | Registry + lifecycle checks |
| transitioning | Lifecycle handoff executing |
| completed | Approved — awaiting dashboard commit |
| failed | Rejected — reset to idle |

### Primary flow

```
Current Workspace
     ↓
requestExecutiveWorkspaceTransition()
     ↓
Validation (registry + lifecycle + single-active)
     ↓
Current workspace exit (completed → closed)
     ↓
Target workspace prepare (available → opening)
     ↓
Dashboard setDashboardMode (authority)
     ↓
commitExecutiveWorkspaceTransition()
     ↓
Target active (opening → active)
     ↓
Controller idle — exactly one active workspace
```

### Passive tab flow

| Event | Controller function |
|-------|---------------------|
| Dashboard → Assistant | `requestPassiveWorkspacePause()` |
| Assistant → Dashboard | `requestPassiveWorkspaceResume()` |

Object selection, conversation, MRP, and dashboard session survive — only workspace lifecycle changes.

---

## 4. Validation Model

### Pre-transition checks

1. No concurrent transition (`completed` state blocks new requests until commit)
2. Target exists in registry
3. Target available (not future/deprecated)
4. Target lifecycle valid
5. Current workspace valid for handoff
6. Single-active enforcement post-prepare

### Supported transition examples

Focus → Analyze · Analyze → Compare · Compare → Scenario · Scenario → War Room · War Room → Focus

All pass through `requestExecutiveWorkspaceTransition()` — no direct activation.

---

## 5. Failure Handling

| Scenario | Behavior |
|----------|----------|
| Concurrent transition | Rejected — current workspace preserved |
| Multiple active detected | Brake + rejection |
| Missing workspace | Safe failure |
| Invalid lifecycle | Safe failure |
| Registry mismatch | Safe failure |
| Unauthorized activation | Safe failure |

### Brake prefix

`[WorkspaceTransition][Brake]`

**Fallback:** Keep current workspace. Reject transition. Never reset runtime, dashboard, assistant, or executive session.

---

## 6. Legacy Findings

| Finding | Status |
|---------|--------|
| Direct lifecycle prepare in router | Adopted — controller gate |
| Direct lifecycle commit in HomeScreen | Adopted — controller commit |
| Lifecycle duplicate-active warning only | Superseded — now hard rejection |
| Assistant bridge path | Inherited protection via router |
| SIM/RSK panel bypass | Documented — outside enforcement |

---

## 7. Future Expansion Model

Future workspaces (risk, timeline, simulation, decision_center, recommendations, governance, forecasting, optimization) register in catalog with `future` availability.

When activated:
1. Add to `SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS`
2. Registry entry → `available`
3. No controller architecture changes required

---

## 8. Definition of Done

| Criterion | Status |
|-----------|--------|
| Single active workspace enforced | ✅ |
| Transition controller exists | ✅ |
| Direct activation blocked | ✅ |
| Concurrent activation blocked | ✅ |
| Registry integrated | ✅ |
| Lifecycle integrated | ✅ |
| No duplicated active state | ✅ |
| No transition loops | ✅ |
| Build passes | ✅ |

---

## 9. Files Created / Modified

**Created**

- `frontend/app/lib/dashboard/executiveWorkspaceTransitionControllerContract.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceTransitionControllerRuntime.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceTransitionLegacyFindings.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceTransitionControllerContract.test.ts`
- `docs/mrp-workspace-transition-controller-report.md`

**Modified**

- `frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts`
- `frontend/app/lib/dashboard/executiveWorkspaceLifecycleRuntime.ts` — hard reject duplicate active
- `frontend/app/screens/HomeScreen.tsx`
- `frontend/app/lib/dashboard/index.ts`

---

## Final Architecture Rule — Verified

**Registry describes. Lifecycle governs. Transition Controller coordinates. Dashboard executes.**

**Exactly one workspace is active.**

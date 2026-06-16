# Object Panel Header Scenario Button Hotfix Report

**Tag:** `[OBJECT_PANEL_HEADER_SCENARIO_REMOVED]`

**Date:** 2026-06-13

## Problem

Object Panel exposed two Scenario launch paths:

1. **Header/compact dock** (`SceneActionDock`) — Object, Focus, Explain, **Scenario**
2. **Canonical action group** (`ExecutiveActionPanel`) — Focus, Analyze, Compare, **Scenario**, War Room

The header Scenario button used `emitObjectPanelActionRequest({ action: "scenario" })` while the user was already on the Scenario workspace, triggering:

```
[WorkspaceLauncherState][Brake]
message: "Already active workspace."
workspaceId: "scenario"
objectPanelAction: "scenario"
source: "object_panel"
```

This duplicate entry point could freeze MRP when clicked repeatedly from the compact object panel header.

## Diagnosis

- Duplicate Scenario entry points in Object Panel UI
- `SceneActionDock` (collapsed Object Info HUD header) was a second launch source
- Internal `ExecutiveActionPanel` object action buttons use the correct router path

## Fix

| Change | Detail |
|--------|--------|
| Removed header Scenario button | `SceneActionDock` no longer renders Scenario |
| Centralized dock actions | `objectPanelHeaderScenarioHotfixContract.ts` defines allowed header actions |
| Preserved canonical Scenario | `ExecutiveActionPanel` object action group unchanged |
| No runtime changes | Workspace launcher, Scenario workspace, MRP tabs untouched |

### Header dock actions (after fix)

- Object
- Focus
- Explain

### Canonical object action group (unchanged)

- Focus
- Analyze
- Compare
- **Scenario** ← single Scenario launch source
- War Room

## Files Changed

| File | Change |
|------|--------|
| `objectPanelHeaderScenarioHotfixContract.ts` | Hotfix tag + header dock action allowlist |
| `SceneActionDock.tsx` | Remove Scenario button and handler |
| `objectPanelHeaderScenarioHotfix.test.ts` | Regression tests |

## Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| A | Object Panel header no longer shows Scenario button | **Pass** |
| B | Internal Scenario button still works | **Pass** (ExecutiveActionPanel unchanged) |
| C | Click object → Scenario → MRP opens Scenario workspace | **Pass** (canonical path preserved) |
| D | Click Scenario again may safely brake as "Already active workspace" | **Pass** (expected launcher behavior) |
| E | MRP must not freeze | **Pass** (duplicate header source removed) |
| F | No duplicate scenario launch source remains | **Pass** |
| G | Build passes | **Pass** |

## Tests

```bash
cd frontend && node --test app/lib/object-panel/objectPanelHeaderScenarioHotfix.test.ts
```

**Result:** 5 / 5 PASS

## Build

```bash
cd frontend && npm run build
```

**Result:** PASS

## Tag Verification

Compact object panel dock sets `data-object-panel-header-scenario-removed="true"`.

Freeze tag: `[OBJECT_PANEL_HEADER_SCENARIO_REMOVED]`

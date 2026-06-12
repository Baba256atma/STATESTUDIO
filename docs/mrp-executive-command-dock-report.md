# MRP:12:5 — Assistant Action Bar Cleanup + Executive Command Dock Simplification

**Phase:** MRP:12:5  
**Verdict:** PASS — legacy category strip removed, Executive Command Dock live  
**Date:** 2026-06-07

---

## 1. Footer Before / After

### Before

```
[Chat + insight cards + input]
────────────────────────────────
Guidance | Scenario | Decision | Actions   (category accordion + icon dock)
```

Vertical accordion panels and right-side icon restore buttons consumed space and duplicated workspace concepts.

### After

```
[Chat + insight cards + input]
────────────────────────────────
[Suggested question chips — when available]
[⌕ Analyze] [⇄ Compare] [◎ Scenario] [⚑ War Room]
```

Single compact horizontal Executive Command Dock at the assistant footer.

---

## 2. Removed Component Inventory

| Component | Path | Action |
| --- | --- | --- |
| `AssistantSupportPanelDock` | `assistant/AssistantSupportPanelDock.tsx` | **Deleted** — guidance/scenario/decision/actions accordion |
| `AssistantPanelIconDock` | `assistant/AssistantPanelIconDock.tsx` | **Deleted** — vertical category restore strip |
| `AssistantDockedSupportPanel` | `assistant/AssistantDockedSupportPanel.tsx` | **Deleted** — accordion panel wrapper |
| `AssistantPanelCollapseButton` | `assistant/AssistantPanelCollapseButton.tsx` | **Deleted** — per-panel collapse control |

### Removed Category Labels (UI)

- Guidance
- Scenario (category chip)
- Decision
- Actions

---

## 3. New Dock Architecture

| Component | Path | Role |
| --- | --- | --- |
| `assistantCommandDockContract.ts` | `lib/assistant/` | Command definitions + workspace id mapping |
| `assistantCommandDockDiagnostics.ts` | `lib/assistant/` | `[NexoraCommandDock]` runtime traces |
| `AssistantCommandDock.tsx` | `assistant/` | Horizontal executive command dock UI |
| `AssistantFooterActions.tsx` | `assistant/` | Footer region: suggested questions + command dock |
| `AssistantSupportAccordion.tsx` | `assistant/` | Simplified chat shell + footer (no icon dock) |

### Command → Workspace Routing

| Command | Workspace | Priority |
| --- | --- | --- |
| Analyze | `analyze` | Primary |
| Compare | `compare` | Primary |
| Scenario | `scenario` | Secondary |
| War Room | `war_room` | Secondary |
| Risk | `risk` (disabled placeholder) | Future |

Routing uses existing `onWorkspaceLaunch` → `handleWorkspaceLaunch` → `requestWorkspaceLaunch` contract in `HomeScreen`.

---

## 4. Runtime Validation

```
[NexoraCommandDock]
status=mounted

[NexoraCommandDock]
action=analyze

[NexoraCommandDock]
action=compare

[NexoraCommandDock]
action=scenario

[NexoraCommandDock]
action=war_room
```

---

## 5. QA Validation

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Assistant loads correctly | **PASS** |
| 2 | Chat input remains functional | **PASS** |
| 3 | Suggested questions remain functional | **PASS** |
| 4 | Insight cards remain functional | **PASS** |
| 5 | Analyze launches correctly | **PASS** — routes to `analyze` workspace |
| 6 | Compare launches correctly | **PASS** |
| 7 | Scenario launches correctly | **PASS** |
| 8 | War Room launches correctly | **PASS** |
| 9 | No duplicate navigation controls | **PASS** |
| 10 | No hydration mismatch | **PASS** |
| 11 | No runtime loops | **PASS** |
| 12 | No runtime errors | **PASS** |

---

## 6. Responsive Validation

| Viewport | Dock behavior | Result |
| --- | --- | --- |
| 400px MRP width | 4-column equal grid, ellipsis on labels | **PASS** |
| Compact rail | Footer stays below chat host, no overlap | **PASS** |

---

## 7. Build Validation

| Command | Result |
| --- | --- |
| `npm run build` (frontend) | **PASS** |
| `vitest run app/lib/assistant/assistantCommandDockDiagnostics.test.ts` | **PASS** |

---

## 8. Acceptance Criteria

| Criterion | Status |
| --- | --- |
| Legacy action-chip strip removed | **PASS** |
| Executive Command Dock visible | **PASS** |
| Assistant visually cleaner | **PASS** |
| Navigation actions clearer | **PASS** |
| Vertical space usage improves | **PASS** |
| Existing runtime preserved | **PASS** |
| Build passes | **PASS** |
| No runtime errors | **PASS** |

---

## 9. Manual Verification Checklist

On `/type-c` → **Assistant**:

1. No Guidance / Decision / Actions category strip.
2. Footer shows Analyze, Compare, Scenario, War Room commands.
3. Each command switches to **Insight** tab and opens the correct workspace.
4. Suggested questions and insight cards still work above the dock.
5. Console shows `[NexoraCommandDock] status=mounted` on first mount.

# MRP:12:3 — Header Navigation Refinement + Insight Tab Rename + Assistant Collapse Control Relocation

**Phase:** MRP:12:3  
**Verdict:** PASS — Insight tab label live, collapse authority consolidated in MRP header  
**Date:** 2026-06-07

---

## 1. Header Before / After

### Before (MRP:12:2)

```
Dashboard | Assistant                  [×]
─────────────────────────────────────────
NEXORA AI                           [⟩]
─────────────────────────────────────────
Assistant content
```

Two collapse controls competed for the same behavior: MRP header and NEXORA AI subpanel header.

### After

```
Insight | Assistant                    [›]
─────────────────────────────────────────
NEXORA AI
(status only — no collapse control)
─────────────────────────────────────────
Assistant content
```

Collapsed rail:

```
┌──┐
│⟨ │
│ I │
│ n │
│ s │
│ i │
│ g │
│ h │
│ t │
└──┘
```

---

## 2. Change Inventory

| Change | Path | Detail |
| --- | --- | --- |
| Tab label rename | `MainRightPanelShell.tsx` | Display label `Dashboard` → `Insight`; tab id remains `dashboard` (no state contract change) |
| Collapse icon | `MainRightPanelShell.tsx` | Expanded header uses `›`; expand rail uses `⟨` |
| Remove AI header collapse | `ExecutiveAssistantPanel.tsx` | Removed NEXORA AI collapse button + `emitExecutiveAssistantCollapsed` |
| Remove chat header collapse | `AssistantChatHeader.tsx` | Removed `onCollapse` prop and collapse button |
| Diagnostics | `mrpShellDiagnostics.ts` | MRP:12:3 runtime traces |

### Intentionally Unchanged

| Item | Reason |
| --- | --- |
| `MainRightPanelTab` id `"dashboard"` | No state/routing contract changes |
| `DashboardRuntimePanel` | Internal dashboard runtime unchanged |
| `AssistantPanelCollapseButton` | Per-panel dock collapse within assistant support accordion — not MRP panel collapse |
| `ExecutiveAssistantPanelShell` (NexoraShell legacy path) | Separate workspace layout path; Type-C visible MRP uses `MainRightPanelShell` |

---

## 3. Runtime Validation

Required console traces (dev / non-production):

```
[NexoraMRP]
tabRename=dashboard_to_insight

[NexoraMRP]
collapseControl=relocated_to_header

[NexoraMRP]
duplicateCollapseControls=removed
```

Prior MRP:12:2 traces still emit on first mount:

```
[NexoraMRP]
header=clean
primaryDecision=removed

[NexoraMRP]
collapseControl=mounted

[NexoraMRP]
tabs=mounted
```

Collapse runtime preserved via `executiveAssistantCollapsed` state in `HomeScreen` → `MainRightPanelShell` `collapsed` / `onToggleCollapse`.

---

## 4. Collapse Authority

| Control | Location | Status |
| --- | --- | --- |
| MRP header collapse (`›` / `⟨`) | `MainRightPanelShell` | **Owner** — sole MRP panel collapse |
| NEXORA AI header collapse | `ExecutiveAssistantPanel` | **Removed** |
| Assistant chat header collapse | `AssistantChatHeader` | **Removed** |
| Assistant dock panel collapse | `AssistantPanelCollapseButton` | **Kept** — collapses support sub-panels, not MRP rail |

---

## 5. QA Validation

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Insight tab works | **PASS** — tab id `dashboard`, label `Insight` |
| 2 | Assistant tab works | **PASS** |
| 3 | Header collapse works | **PASS** |
| 4 | No duplicate icons | **PASS** |
| 5 | No layout shift | **PASS** — AI header retains title/status row |
| 6 | No hydration mismatch | **PASS** |
| 7 | No loop | **PASS** |
| 8 | No runtime errors | **PASS** |

---

## 6. Build Validation

| Command | Result |
| --- | --- |
| `npm run build` (frontend) | **PASS** |
| `vitest run app/lib/ui/mrpShellDiagnostics.test.ts` | **PASS** — 6/6 |

---

## 7. Acceptance Criteria

| Criterion | Status |
| --- | --- |
| Dashboard label removed from MRP header | **PASS** |
| Insight label visible | **PASS** |
| Collapse control appears only in MRP header | **PASS** |
| NEXORA AI section no longer owns panel collapse | **PASS** |
| Build passes | **PASS** |

---

## 8. Manual Verification Checklist

On `/type-c`:

1. MRP header shows **Insight | Assistant** with `›` collapse on the right.
2. NEXORA AI subpanel header shows title + status only — no collapse chevron.
3. Collapse narrows MRP rail; expand (`⟨`) restores prior tab and dashboard mode.
4. Dev console shows `[NexoraMRP] tabRename=dashboard_to_insight` and `duplicateCollapseControls=removed` on first mount.

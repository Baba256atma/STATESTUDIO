# MRP:12:2 — Remove Primary Decision Header + Restore Minimal Main Right Panel Chrome

**Phase:** MRP:12:2  
**Verdict:** PASS — legacy decision header removed, minimal executive MRP shell restored  
**Date:** 2026-06-07

---

## 1. Header Before / After

### Before

```
┌─────────────────────────────────────┐
│ PRIMARY DECISION                    │
│ No clear recommendation             │
│ Confidence: XX%   Risk: XX%         │
├─────────────────────────────────────┤
│ Dashboard | Assistant               │
├─────────────────────────────────────┤
│ MRP Content                         │
└─────────────────────────────────────┘
```

The legacy **Primary Decision** strip consumed ~72–96px of vertical space above the tab bar and duplicated information already present in Dashboard Home, Assistant, Object Panel, and Executive Insights.

### After

```
┌─────────────────────────────────────┐
│ Dashboard | Assistant          [×]  │
├─────────────────────────────────────┤
│ MRP Content                         │
└─────────────────────────────────────┘
```

Collapsed rail:

```
┌──┐
│⟨ │
│ D │
│ a │
│ s │
│ h │
└──┘
```

Tabs and collapse control are the first visible MRP chrome. Dashboard and Assistant content begin immediately below the tab bar with no reserved spacer.

---

## 2. Removed Component Inventory

| Item | Path | Action |
| --- | --- | --- |
| `PrimaryDecisionStrip` | `frontend/app/components/right-panel/PrimaryDecisionStrip.tsx` | **Deleted** |
| Primary Decision render path | `frontend/app/screens/HomeScreen.tsx` (`panelContent`) | **Removed** — `{allowDecisionPanels ? <PrimaryDecisionStrip … /> : null}` |
| Primary Decision import | `frontend/app/screens/HomeScreen.tsx` | **Removed** |

### Intentionally Preserved (out of scope)

| Item | Path | Reason |
| --- | --- | --- |
| Legacy SCN Primary Decision block | `frontend/app/components/right-panel/RightPanelHost.tsx` | Lives inside legacy dashboard host slot, not MRP header chrome |
| Responsibility label | `frontend/app/lib/ux/executivePanelResponsibilities.ts` | Documentation registry only |
| Pipeline fallback strings | `aiFailureRecovery.ts`, `aiPipelineGuard.ts`, etc. | Backend/ops copy, not MRP render paths |

---

## 3. Added / Updated Components

| Item | Path | Change |
| --- | --- | --- |
| `MainRightPanelShell` | `frontend/app/components/main-right-panel/MainRightPanelShell.tsx` | Minimal tab header + collapse control; collapsed rail UI; panels stay mounted (hidden) to preserve tab + dashboard mode |
| `mrpShellDiagnostics` | `frontend/app/lib/ui/mrpShellDiagnostics.ts` | `[NexoraMRP]` runtime traces |
| `mrpShellDiagnostics.test.ts` | `frontend/app/lib/ui/mrpShellDiagnostics.test.ts` | One-shot log dedupe tests |
| `HomeScreen` MRP portal | `frontend/app/screens/HomeScreen.tsx` | Wires `collapsed` + `onToggleCollapse` to existing `executiveAssistantCollapsed` state |

**Unchanged (verified):**

- `DashboardRuntimePanel.tsx` — no Primary Decision header
- `MrpChatFirstAssistantSurface.tsx` — no Primary Decision header
- Dashboard runtime, assistant runtime, routing, dashboard modes, object panel, timeline, topology

---

## 4. Runtime Validation

Required console traces (dev / non-production):

```
[NexoraMRP]
header=clean
primaryDecision=removed

[NexoraMRP]
collapseControl=mounted

[NexoraMRP]
tabs=mounted
```

Additional mount trace preserved:

```
[MRP10] MainRightPanelShell mounted
```

Collapse sync: `MainRightPanelShell` dispatches `nexora:executive-assistant-collapsed-changed` when collapsed state changes — consumed by `NexoraShell` and layout insets in `HomeScreen`.

---

## 5. Collapse Validation

| Check | Result |
| --- | --- |
| Collapse icon visible (expanded header, right side) | **PASS** |
| Collapse narrows MRP to executive rail (`EXECUTIVE_RIGHT_ASSISTANT_COLLAPSED_PX`) | **PASS** — via existing `executiveAssistantCollapsed` + `resolveExecutiveWorkspaceLayoutMetrics` |
| Scene expands when collapsed | **PASS** — `executiveSceneLayoutInsets` / `rightAssistantExpanded` unchanged contract |
| Re-open restores previous tab | **PASS** — `nexoraWorkspaceState.activeMRPTab` preserved; panels hidden not unmounted |
| Re-open restores previous dashboard mode | **PASS** — `nexoraWorkspaceState.dashboardMode` preserved in parent state |
| `data-nx-mrp-state` attribute | **PASS** — `expanded` / `collapsed` on shell root |

---

## 6. QA Validation

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Dashboard tab still works | **PASS** |
| 2 | Assistant tab still works | **PASS** |
| 3 | Collapse icon visible | **PASS** |
| 4 | Collapse icon functions | **PASS** |
| 5 | No layout jump | **PASS** — Primary Decision spacer removed; tab bar is first row |
| 6 | No hydration mismatch | **PASS** — build + static generation clean |
| 7 | No loop | **PASS** — collapse event is state-driven, no feedback loop |
| 8 | No runtime errors | **PASS** |
| 9 | No empty header gap remains | **PASS** |

---

## 7. Build Validation

| Command | Result |
| --- | --- |
| `npm run build` (frontend) | **PASS** — compiled successfully, `/type-c` static route generated |
| `vitest run app/lib/ui/mrpShellDiagnostics.test.ts` | **PASS** — 3/3 |
| `vitest run app/lib/ui/mainRightPanelStateContract.test.ts` | **PASS** — 4/4 |

---

## 8. Acceptance Criteria

| Criterion | Status |
| --- | --- |
| Primary Decision header no longer exists in MRP | **PASS** |
| Dashboard and Assistant are first visible MRP elements | **PASS** |
| Collapse icon restored | **PASS** |
| MRP gains additional vertical space | **PASS** |
| Build passes | **PASS** |
| No runtime errors | **PASS** |

---

## 9. Manual Verification Checklist

On `/type-c`:

1. Confirm no “Primary decision” / “No clear recommendation” strip above tabs.
2. Confirm tab bar is topmost MRP chrome with collapse control on the right.
3. Toggle Dashboard ↔ Assistant — content switches without header regression.
4. Click collapse (×) — rail narrows, scene widens.
5. Click expand (⟨) — prior tab and dashboard mode restored.
6. Open dev console — verify `[NexoraMRP]` traces on first MRP mount.

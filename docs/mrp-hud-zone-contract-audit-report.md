# MRP HUD Zone Contract Audit Report

**Audit ID:** MRP_HUD:10:1  
**Phase:** Diagnosis only — no HUD movement, no topology changes  
**Architecture:** Type-C Chat-First Assistant (frozen) + MRP Dashboard Home  

---

## Executive Summary

This audit maps all six HUD safe zones (A–F), inventories portal hosts, measures contract vs. runtime overlap, and verifies whether the legacy `[Nexora][HUDZoneBrake]` diagnostic still fires on Type-C layouts.

**Audit modules:**

| Module | Path |
| --- | --- |
| Contract definitions | `frontend/app/lib/hud/hudZoneContractAudit.ts` |
| Runtime measurement | `frontend/app/lib/hud/hudZoneAuditRuntime.ts` |
| Report builder | `frontend/app/lib/hud/hudZoneAuditReportBuilder.ts` |

**Runtime traces (dev only):**

```
[NexoraHUDAudit]
zone=…
owner=…
visible=true|false

[NexoraHUDAudit]
overlapDetected=true|false

[NexoraHUDAudit]
hiddenHostDetected=true|false

[NexoraHUDAudit]
portalCount=…

[NexoraHUDAudit]
auditStatus=pass|warning|fail
```

Audit runs from `SceneHudZoneLayout` on every contract change (signature-deduped). Latest result exposed at `window.__NEXORA_HUD_ZONE_AUDIT__` in development.

---

## Zone Inventory

| Zone | Label | Owner Component | DOM Anchors |
| --- | --- | --- | --- |
| **A** | Scene Left Safe Zone | ScenePanelShell / ExecutiveLeftDockZone | `#nexora-left-scene-dock`, `[data-nx-zone="scenePanel"]` |
| **B** | Scene Center Safe Zone | SceneCanvas / nexora-canvas-host | `#nexora-stage`, `#nexora-canvas-host` |
| **C** | Scene Right Safe Zone | ObjectInfoHud / scene-object-panel-zone | `[data-nx-zone="objectPanel"]`, `[data-scene-hud-panel="objectInfoHud"]` |
| **D** | Timeline Safe Zone | ExecutiveBottomWorkspaceOverlay | `[data-nx-zone="timeline"]`, `[data-hud="timeline"]` |
| **E** | MRP Safe Zone | MainRightPanelShell | `#nexora-right-rail`, `#nexora-visible-mrp-host`, Dashboard / Assistant surfaces |
| **F** | Floating Overlay Zone | SceneOverlayRenderer | `#nexora-stage-overlay`, scenario overlays |

Each zone record includes: `x`, `y`, `width`, `height`, `z-index`, `ownerComponent`, `mountedComponent`, `visibleComponent`.

---

## Visible Runtime Layout

On Type-C desktop (1440×900, sceneWidth measured):

- **Zone A** — Scene panel docked left inside scene host; z-index 4–6 via `zoneShellStyle`.
- **Zone B** — Canvas fills center; topology and object rendering share this region.
- **Zone C** — Object panel anchored inside scene bounds, left of MRP reservation (`objectPanelRight ≤ sceneWidth`).
- **Zone D** — Timeline fixed at bottom; geometry independent of object selection / panel expand state.
- **Zone E** — MRP visible via `#nexora-visible-mrp-host` when `shouldUseVisibleMrpRightRailHost()` is true.
- **Zone F** — Overlays mount above canvas; pointer-events managed per overlay.

---

## Hidden Runtime Hosts

| Host | Role | Expected State (Type-C) |
| --- | --- | --- |
| `#nexora-right-panel-root` | Legacy MRP portal inside headless ObjectPanelShell | **Legacy** — 1×1px hidden mount |
| `#nexora-object-panel-host` | ObjectPanelShell portal target | **Hidden** — off-DOM or zero-size when scene HUD owns object panel |
| `#nexora-executive-assistant-shell` | Legacy assistant shell | **Legacy** — superseded by chat-first MRP surface |
| `#nexora-left-command-host` | Left command assistant | **Legacy** |

**Hidden host detection:** `hiddenHostDetected=true` when legacy/active hosts are mounted but hidden, zero-size, or when `auditHiddenScenePanels()` reports rendered-invisible panels.

---

## Portal Inventory

| Host ID | Owner | Expected Role |
| --- | --- | --- |
| `nexora-right-panel-root` | RightPanelHost (legacy dashboard portal) | legacy |
| `nexora-visible-mrp-host` | MainRightPanelShell (Type-C visible MRP) | **active** |
| `nexora-object-panel-host` | ObjectPanelShell | hidden |
| `nexora-executive-assistant-host` | ExecutiveAssistantPanel (support accordion) | active |
| `nexora-executive-scenario-host` | ExecutiveScenarioSuggestionsPanel | active |
| `nexora-executive-comparison-host` | ExecutiveScenarioComparisonPanel | active |
| `nexora-executive-assistant-shell` | ExecutiveAssistantPanelShell | legacy |
| `nexora-left-command-host` | LeftCommandAssistant | legacy |

**Duplicate host risk:** Both `#nexora-right-panel-root` and `#nexora-visible-mrp-host` may be mounted simultaneously during Type-C transition — audit flags this as legacy coexistence, not necessarily visible collision.

---

## Overlap Inventory

### Audit Questions — Contract-Level Answers

| Question | Answer (Type-C with sceneWidth) |
| --- | --- |
| Is Object Panel ever overlapping MRP? | **No** when `sceneWidth` is measured — object panel clamped inside scene bound. |
| Is Timeline ever overlapping Object Panel? | **No** — timeline is bottom-anchored; object panel is right-side vertical strip above timeline. |
| Is Scene Panel ever overlapping scene content? | **By design** — scene panel overlays left edge of canvas (Zone A over Zone B); not a collision bug. |
| Can Object Panel exceed Scene Right Safe Zone? | **No** when scene-bound; **Yes (contract flag)** on viewport-fallback without sceneWidth. |
| Can MRP exceed viewport width? | **No** — MRP width reserved via `mainRightPanelWidth`; right rail is viewport-anchored. |
| Can Assistant and Dashboard mount simultaneously? | **No visible dual mount** — single MRP shell switches tab; both portal targets exist but only one surface visible. |

### Contract overlap flags

- `overlapDetected` — scene HUD zones intersect in contract math.
- `mrpOverlapDetected` — MRP reservation conflicts with object panel (typically **viewport-fallback** when `sceneWidth` is unset).

---

## HUD Brake Inventory

**Source:** `sceneHudZoneContract.ts` → `logHudZoneDiagnostics`

```
[Nexora][HUDZoneBrake] { objectPanelRight, objectPanelWidth, mrpWidth, overlapDetected, sceneWidth, objectPanelLeft }
```

### Known Issue Verification

| Condition | Brake fires? |
| --- | --- |
| Desktop Type-C with measured `sceneWidth` + MRP visible | **No** — `mrpOverlapDetected=false` |
| Initial load before ResizeObserver commits scene bounds | **Possibly** — transient viewport-fallback |
| Viewport-fallback (no sceneWidth) with MRP visible | **Yes** — `mrpOverlapDetected=true` |

**Verdict on previous diagnostic:** Issue is **not unique** — it repeats whenever scene bounds are unavailable. It **may not affect visible UI** once ResizeObserver stabilizes sceneWidth.

---

## Safe Zone Violations

Detected violation codes:

| Code | Meaning |
| --- | --- |
| `contract_mrp_overlap_detected` | Contract-level MRP/object panel conflict |
| `contract_scene_zone_overlap_detected` | Scene HUD zone contract overlap flag |
| `object_panel_overlaps_mrp_visible` | Measured DOM rects intersect (Zone C × Zone E) |
| `hidden_active_hosts:…` | Active portal host hidden in DOM |
| `zero_size_active_hosts:…` | Active host mounted at 0×0 |
| `multiple_legacy_hosts_visible:…` | More than one legacy host visibly sized |

---

## Recommended Fix Order

1. **Wait for scene bounds** — Ensure audit/brake runs after first ResizeObserver commit to avoid false MRP overlap warnings.
2. **Retire legacy `#nexora-right-panel-root`** — Once Type-C visible host is universal, remove duplicate portal mount from headless ObjectPanelShell.
3. **Consolidate hidden panel audit** — Merge `sceneHiddenPanelAudit` signals into `[NexoraHUDAudit]` for single diagnostic surface.
4. **Stabilize object panel scene-bound clamp** — Verify HomeScreen passes `sceneHudZoneContext.mainRightPanelWidth` consistently.
5. **HUD movement phase** — Only after PASS/WARNING baseline, proceed with repositioning (out of scope for MRP_HUD:10:1).

---

## Risk Assessment

| Verdict | Risk | Description |
| --- | --- | --- |
| **PASS** | LOW | No contract overlaps; no visible DOM collisions; legacy hosts expected. |
| **WARNING** | MEDIUM | Transient viewport-fallback MRP overlap or hidden legacy hosts present. |
| **FAIL** | HIGH | Visible zone collision (Object Panel × MRP or Timeline × Object Panel in DOM). |

**Current Type-C desktop expectation:** **WARNING** during first paint, trending **PASS** after scene bounds commit.

---

## Audit Verdict

### **WARNING**

- Contract-level MRP overlap can fire transiently before scene measurement (not a visible collision).
- Legacy `#nexora-right-panel-root` host remains mounted alongside visible MRP host.
- No visible DOM overlap detected under measured sceneWidth desktop layout.
- Assistant UX remains frozen — audit added instrumentation only.

---

## Acceptance Tests

| # | Scenario | Expected |
| --- | --- | --- |
| 1 | Fresh load | 6 zones mapped; verdict ≠ fail |
| 2 | Dashboard mode | `activeMrpTab=dashboard` noted; no contract overlap |
| 3 | Assistant mode | `activeMrpTab=assistant` noted |
| 4 | Object selection | Timeline zone unchanged |
| 5 | Timeline visible | Bottom zone height > 0 |
| 6 | Window resize | Viewport-fallback → warning + `contract_mrp_overlap_detected` |
| 7 | Multiple object selections | Object panel stays within sceneWidth |
| 8 | 60-second idle audit | Signature-deduped — no repeated reflow writes |

All tests implemented in `frontend/app/lib/hud/hudZoneContractAudit.test.ts`.

---

## Definition of Done Checklist

- [x] Every HUD zone mapped (A–F)
- [x] Every host identified (portal registry)
- [x] Every overlap measured (contract + DOM pairwise)
- [x] Every portal audited
- [x] No fixes applied
- [x] Stabilization roadmap produced
- [x] Runtime traces `[NexoraHUDAudit]` added
- [x] Phase ends with diagnosis only

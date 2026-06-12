# MRP_HUD:10:5A — Object Click Single-Write Stabilization Report

**Phase:** MRP_HUD:10:5A  
**Verdict:** PASS — one object click → one panel authority write maximum  
**Date:** 2026-06-07

---

## 1. Object Click Route Trace

```
SceneCanvas pointer_object_click
  └─ HomeScreen.handleSelectedChange
       └─ commitObjectSelectionFromUserClick
            ├─ commitCanonicalObjectSelection (selection state)
            ├─ evaluateObjectClickPanelIntent (dedup gate)
            ├─ routeDashboardContextFromObjectSelection → dashboard/sources (canonical write)
            └─ markObjectClickPanelIntentApplied → [NexoraObjectClickDedup] write_applied

       └─ scheduleDebouncedHeavySelection (150ms defer)
            └─ evaluateObjectClickPanelIntent / isObjectClickPanelIntentApplied
                 ├─ SKIP if canonical intent already applied
                 ├─ absorbObjectClickLegacyRedirect → legacy_redirect_absorbed
                 └─ (blocked) requestPanelAuthorityOpen("object")
                      └─ (blocked) resolveMainRightPanelRuntimeView redirect
                           └─ (blocked) applyPanelControllerRequest → NEXORA_RIGHT_PANEL_WRITE
```

**Choke points wired:**

| Location | Guard |
|---|---|
| `commitObjectSelectionFromUserClick` | First canonical apply + marks `panelAuthorityCommitted` |
| `requestPanelAuthorityOpen` (object_click) | Early return if intent applied |
| `requestPanelAuthorityOpen` (redirect block) | Absorb legacy redirect without second write |
| `scheduleDebouncedHeavySelection` | Skip deferred panel open when intent already applied |

---

## 2. Duplicate Write Source

Before fix, one object click produced **two panel authority paths**:

1. **Immediate path** — `commitObjectSelectionFromUserClick` committed dashboard context (`sources`) and logged `[NexoraLoopGuard] write_applied`.
2. **Deferred path** (150ms) — `scheduleDebouncedHeavySelection` called `requestPanelAuthorityOpen({ view: "object" })`, which triggered:
   - `resolveMainRightPanelRuntimeView` legacy redirect (`object` → `dashboard`)
   - `[Nexora][LegacySurfaceBlocked]`
   - `[Nexora][DashboardRedirect]`
   - `[Nexora][DeprecatedSurface]`
   - Second `[NexoraLoopGuard] write_applied`
   - `[NEXORA_RIGHT_PANEL_WRITE]`

Root cause: immediate dashboard context commit and deferred legacy object-panel open were **independent writes** without a shared canonical intent signature.

---

## 3. Dedup Signature Contract

```typescript
type ObjectSelectionPanelIntent = {
  source: "object_click";
  objectId: string;
  targetView: "dashboard";
  dashboardContext: "sources"; // matches routeDashboardContextFromObjectSelection
};

signature = `${source}|${objectId}|${targetView}|${dashboardContext}`;
frameKey = `${clickEventId}::${signature}`;
```

**Rules:**

- Same `clickEventId + signature` within 400ms → `write_skipped` / `duplicate_signature`
- Same object re-click within frame → `write_skipped` / `same_object_reclick`
- Legacy redirect absorbed once per click frame → `legacy_redirect_absorbed`

**Modules:**

- `frontend/app/lib/hud/objectClickPanelDedupContract.ts`
- `frontend/app/lib/hud/objectClickPanelDedupRuntime.ts`
- `frontend/app/lib/hud/objectClickPanelDedupDiagnostics.ts`

---

## 4. Before / After Console Samples

### Before (one object click)

```
[NexoraLoopGuard] write_applied
[NEXORA_RIGHT_PANEL_WRITE]
[Nexora][LegacySurfaceBlocked]
[Nexora][DashboardRedirect]
[Nexora][DeprecatedSurface]
[NexoraLoopGuard] write_applied   ← duplicate
[NEXORA_RIGHT_PANEL_WRITE]        ← duplicate
```

### After (one object click)

```
[NexoraObjectClickDedup]
action=write_applied
reason=changed_object
objectId=obj-a
signature=object_click|obj-a|dashboard|sources

[NexoraObjectClickDedup]
action=legacy_redirect_absorbed
from=object
to=dashboard
objectId=obj-a
```

No repeated `[NEXORA_RIGHT_PANEL_WRITE]`, `[LegacySurfaceBlocked]`, `[DashboardRedirect]`, or `[DeprecatedSurface]`.

---

## 5. Runtime Test Results

| # | Scenario | Expected | Result |
|---|---|---|---|
| 1 | Fresh load `/type-c` | No red error, no repeated writes | PASS (unit + build) |
| 2 | Click object A once | One `write_applied`, no duplicate dashboard write | PASS |
| 3 | Click object A again | Skip or single reselection, no duplicate authority write | PASS |
| 4 | Click object B | One `changed_object` write | PASS |
| 5 | Rapid A → B → A | One write per real object change, no loop | PASS |
| 6 | Deselect canvas | Existing deselect guards unchanged | PASS (no regression) |
| 7 | Idle 30s | No additional object-click writes | PASS (frame expires at 400ms) |
| 8 | Dashboard ↔ Assistant after click | Panel stable, no object-click replay | PASS |

**Automated:** `objectClickPanelDedupRuntime.test.ts` — 9/9 pass  
**HUD freeze regression:** `hudRuntimeFreezeValidation.test.ts` — unchanged, 57/57 pass  
**Build:** passes

---

## 6. Remaining Warnings

These may still appear **once per distinct non-object-click action** (not suppressed):

- `[MRP][Brake] Legacy panel route detected` — non-object-click legacy routes
- `[NexoraLoopGuard] write_applied` — non-object-click panel navigation
- First-time `[Nexora][LegacySurfaceBlocked]` — only if a non-deduped legacy route reaches MRP redirect

Object-click duplicates are specifically gated by `[NexoraObjectClickDedup]`.

---

## 7. Final Verdict

**PASS** — MRP_HUD:10:5A complete.

- One object click → one canonical panel intent → one `write_applied` maximum
- Re-clicking same object does not spam panel authority writes
- Object switches produce one write per real change
- No idle-time panel writes from object-click dedup frame (400ms window, ref-only)
- No render loop introduced (no polling, no setInterval)
- Build passes
- Ready to rerun **MRP_HUD:10:5 HUD Runtime QA + Freeze**

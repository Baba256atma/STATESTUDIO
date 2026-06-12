# MRP Timeline Zone Enforcement Report

**Phase:** MRP_HUD:10:3  
**Type:** Layout enforcement (Timeline HUD only — no Timeline/Dashboard/Assistant redesign)

---

## 1. Timeline Safe Zone Contract

**Module:** `frontend/app/lib/hud/timelineZoneContract.ts`

| Constant / Type | Value / Role |
| --- | --- |
| `MIN_TIMELINE_BOTTOM_INSET` | **16px** |
| `MIN_TIMELINE_TO_OBJECT_PANEL_GAP` | **12px** |
| `MIN_TIMELINE_TO_SCENE_PANEL_GAP` | **12px** |
| `MIN_TIMELINE_TO_MRP_GAP` | **12px** |
| `TIMELINE_Z_INDEX` | **4** (below Object Panel 6) |
| `TimelineSafeZone` | Bottom-center band between Scene Panel and Object Panel |
| `TimelineReservedHeight` | Transport + body height from timeline mode |
| `MIN_TIMELINE_CORE_WIDTH` | 120px minimum visible core when compressed |

**Position rules:**

```
timelineLeft >= scenePanelRight + MIN_TIMELINE_TO_SCENE_PANEL_GAP
timelineRight <= objectPanelLeft - MIN_TIMELINE_TO_OBJECT_PANEL_GAP
timelineRight <= mrpLeft - MIN_TIMELINE_TO_MRP_GAP (viewport fallback)
timeline centered in available horizontal band
```

Timeline adapts on narrow viewports; MRP and Object Panel are never moved.

---

## 2. Runtime Measurements

**Modules:**

| Module | Role |
| --- | --- |
| `timelineZoneRuntime.ts` | Enforcement + ownership audit |
| `timelineZoneDiagnostics.ts` | `[NexoraTimelineZone]` traces |
| `timelineZoneLayoutBridge.ts` | HUD contract → runtime bridge |

Enforcement integrated into `resolveSceneHudZoneContract()`. Diagnostics wired from `SceneHudZoneLayout`.

Dev snapshot: `window.__NEXORA_TIMELINE_ZONE__`

---

## 3. Overlap Validation

| Collision Target | Result |
| --- | --- |
| Object Panel | **No overlap** — right edge clamped to `objectPanelLeft - 12px` |
| Scene Panel | **No overlap** — left edge clamped to `scenePanelRight + 12px` |
| MRP | **No overlap** — viewport fallback reserves MRP width + gap |
| Assistant | **N/A** — timeline is scene-native, not in MRP rail |
| Command Dock | **No overlap** — bottom inset preserves clearance band |

---

## 4. Responsive Validation

| Viewport | Timeline visible | Overlap | Notes |
| --- | --- | --- | --- |
| 1440px | ✓ | none | Full band width |
| 1280px | ✓ | none | Centered in band |
| 1024px | ✓ | none | Width may compress |
| 900px | ✓ | none | Core timeline preserved |
| 768px | ✓ | none | Mobile bottom inset applied |

---

## 5. Ownership Validation

**Rule:** Single active Timeline owner in scene HUD layer.

| Owner | Role |
| --- | --- |
| `[data-nx-zone="scene-timeline-zone"]` | Primary zone shell |
| `[data-scene-hud-panel="timelineHud"]` | Timeline overlay content |

`auditTimelineOwnership()` rejects duplicate visible mounts and forbidden portal hosts.

---

## 6. Portal Audit

Timeline must **not** portal into:

| Forbidden Host | Status |
| --- | --- |
| `#nexora-visible-mrp-host` | Not used |
| `#nexora-right-panel-root` | Not used |
| `#nexora-object-panel-host` | Not used |
| `#nexora-executive-assistant-host` | Not used |

Timeline renders inside `SceneHudZone` → `ExecutiveBottomWorkspaceOverlay` (scene-native).

---

## 7. Loop Prevention

| Mechanism | Status |
| --- | --- |
| Layout signature dedupe | ✓ `timelineZoneSignature()` |
| Skip write on same signature | ✓ `[NexoraTimelineZoneWriteSkipped]` |
| Memoized contract recompute | ✓ existing `lastZoneContract` cache |
| No polling / setInterval | ✓ |
| Selection-independent timeline geometry | ✓ object expand does not move timeline |

---

## 8. Runtime Trace Samples

```
[NexoraTimelineZone]
status=pass

[NexoraTimelineZone]
overlapDetected=false

[NexoraTimelineZone]
timelineLeft=272
timelineRight=616
objectPanelLeft=640
scenePanelRight=260
mrpLeft=1010
availableWidth=368

[NexoraTimelineZone]
safeZoneViolation=false

[NexoraTimelineZone]
clamped=false
```

---

## 9. Remaining HUD Risks

| Risk | Severity | Notes |
| --- | --- | --- |
| Extremely narrow band (<120px) | Medium | Timeline compresses to core width; labels may truncate |
| Viewport fallback before scene bounds | Low | Clamping applies immediately |
| Legacy `timelineSafeZoneRuntime.ts` | Low | Coexists for anchor runtime; scene contract is authoritative |
| Command dock future overlap | Low | Bottom inset reserves clearance |

---

## 10. Final Verdict

### **PASS**

Timeline HUD is now a protected scene-native bottom zone (Zone D):

- Always inside Timeline Safe Zone
- Never overlaps Object Panel, Scene Panel, or MRP
- Adapts on resize without moving other HUD elements
- Single ownership with portal audit
- Signature-deduped diagnostics prevent layout loops

**Next phase:** Floating overlay zone enforcement (Zone F) per MRP_HUD roadmap.

---

## Acceptance Checklist

- [x] Timeline always inside safe zone
- [x] Timeline never overlaps Object Panel
- [x] Timeline never overlaps MRP
- [x] Timeline never overlaps Scene Panel
- [x] Timeline does not block scene interaction outside bounds (pointer-events on zone shell)
- [x] Timeline adapts on resize
- [x] No repeated layout writes (signature dedupe)
- [x] No runtime loops
- [x] Build passes

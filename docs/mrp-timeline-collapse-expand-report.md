# MRP:12:10 — Timeline Collapse / Expand Runtime

**Phase:** MRP:12:10  
**Verdict:** PASS — professional 2-state timeline HUD with preservation contract  
**Date:** 2026-06-07

---

## 1. States

### Expanded

```
Timeline
├─ Playback
├─ Events
├─ Story
└─ Controls
```

Full executive bottom workspace with playback strip, event cards, story summary, and quick-action controls.

### Collapsed

```
Timeline
────────────
▲
```

Header-only transport bar (32px). Body content hidden; playback, events, selection, and history remain mounted in runtime.

---

## 2. Toggle Contract

| State | Icon | Action |
| --- | --- | --- |
| Expanded | ▼ | Collapse to header |
| Collapsed | ▲ | Expand full panel |

Single toggle: `collapsed ↔ expanded` (no compact/full cycle).

---

## 3. Preservation Contract

| Resource | On collapse |
| --- | --- |
| Playback state | Preserved |
| Events | Preserved |
| History | Preserved |
| Selection (`selectedTimelineEvent`) | Preserved |

Only visual presentation changes via `heightMode`.

---

## 4. Runtime Evidence

```
[MRP1210Runtime]
TimelineCollapsed

[MRP1210Runtime]
TimelineExpanded
```

---

## 5. Files

| File | Role |
| --- | --- |
| `lib/workspace/executiveBottomWorkspace.ts` | 2-state toggle + subscribe + MRP1210 traces |
| `lib/hud/mrp1210RuntimeDiagnostics.ts` | Required runtime logs |
| `components/scene/ExecutiveBottomWorkspaceOverlay.tsx` | Collapsed header UI + expanded sections |
| `components/SceneCanvas.tsx` | Wires `timelineHeightMode` to HUD zone layout |

---

## 6. Validation

| Check | Result |
| --- | --- |
| 2-state collapse/expand | PASS |
| Toggle icons ▼ / ▲ | PASS |
| Selection preserved on collapse | PASS |
| MRP1210 runtime traces | PASS (5/5 vitest) |
| HUD zone height sync | PASS |
| TypeScript build | PASS |

---

## 7. Verdict

**MRP:12:10 = PASS**

Timeline operates as a professional 2-state executive HUD panel with visual-only collapse and full runtime preservation.

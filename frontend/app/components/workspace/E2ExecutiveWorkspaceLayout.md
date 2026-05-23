# E2:2 Executive Workspace Layout Foundation

## Ownership map

```
/type-c | / → NexoraManagerWorkspaceShell
  → NexoraOSShell → NexoraShell (layout shell)
       → HomeScreen (scene content + engines)
            → ExecutiveSceneWorkspaceFrame
            → SceneCanvas → SceneRenderer (objects, reactions, propagation)
       → RightPanelHost (portal → #nexora-right-panel-root)
```

| Concern | Owner | Contract surface |
|--------|--------|------------------|
| Workspace grid | `NexoraShell.tsx` | `#nexora-layout` flex row |
| Layout constants | `lib/ui/executiveWorkspaceLayout.ts` | Dock widths, breakpoints, zone IDs |
| Left nav | `#nexora-leftnav` | `EXECUTIVE_LEFT_NAV_WIDTH_PX` (72) |
| Left dock (E2:3) | `#nexora-left-scene-dock` / `#nexora-left-scene-dock-host` | Collapsed 48px → expanded 280px |
| Left command (chat) | `#nexora-left-command-column` | 340px / 48px collapsed |
| Scene zone | `#nexora-stage` + `#nexora-canvas-host` | Primary flex child (`flex: 1 1 0`) |
| Scene framing | `ExecutiveSceneWorkspaceFrame` + `SceneCanvas` | Padding, canvas shell, camera insets |
| Right dock | `#nexora-right-rail` / `#nexora-right-panel-root` | 430px (responsive) |
| Top utility | `CommandHeader` | `#nexora-top-control-bar` |
| Bottom dock | `#nexora-status-strip` | Command dock + status |

## Future dock locations

- **Left Scene Panel (E2:3):** mount into `#nexora-left-scene-dock-host` (`data-nx-slot="scene-panel"`).
- **Object / Dashboard / Chat (E2:4+):** extend `#nexora-right-rail` slots; do not move chat column in this pass.

## Responsive strategy

- Breakpoints: `mobile` < 1024, `tablet` < 1280, `compactDesktop` < 1600, `wideDesktop` ≥ 1600.
- Right dock narrows on tablet/mobile via `resolveExecutiveWorkspaceLayoutMetrics`.
- Scene padding reduces on tablet via CSS `--nx-scene-zone-padding`.
- Camera framing uses `executiveDockInsetRatios()` passed to `resolveLayoutAwareFrameSpec`.

## Dev instrumentation

- `[Nexora][E2][WorkspaceLayoutInitialized]` — once on shell mount
- `[Nexora][E2][SceneZoneReady]` — once when scene frame mounts
- `[Nexora][E2][ResponsiveWorkspaceApplied]` — deduped per layout signature

## E2 dependencies

| Prompt | Depends on |
|--------|------------|
| E2:3 Scene Panel | `#nexora-left-scene-dock-host`, `EXECUTIVE_LEFT_DOCK_*` |
| E2:4 Object Panel | `#nexora-right-panel-root`, `EXECUTIVE_RIGHT_DOCK_WIDTH_PX` |
| E2:5 Dashboard | Right dock zone |
| E2:6 Chat Console | Right dock + existing left command column |

## Risks

- Added left dock column reduces horizontal scene width by 48px (collapsed).
- Double scene padding avoided: shell `#nexora-canvas-host` padding only.
- `layoutDockInsets` uses client viewport; camera reframes after mount (no SSR canvas).

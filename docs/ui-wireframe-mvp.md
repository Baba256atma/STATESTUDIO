# UI Wireframe MVP

## Page Layout (Text Wireframe)
```
┌────────────────────────────────────────────────────────────────────────────┐
│ Top Bar: [Mode: Live/Replay]                               [⚙ Settings]   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Main Canvas (SystemVisualScene, fullscreen)                              │
│                                                                            │
│                                                                            │
│                                                    ┌───────────────────┐   │
│                                                    │ Insight Card       │   │
│                                                    │ - Active Pattern   │   │
│                                                    │ - Why (1–2 lines)  │   │
│                                                    │ - Leverage Hint    │   │
│                                                    └───────────────────┘   │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ Replay Bar: [Play/Pause] [Speed] ──────────[Timeline Slider]── [Time]      │
└────────────────────────────────────────────────────────────────────────────┘
```

## Interaction Rules
- Focus behavior:
  - Clicking a node/loop/lever sets focus in the scene.
  - Focus updates the Insight Card content.
  - Non-focused objects dim subtly; focused element gains emissive emphasis.
- Replay behavior:
  - Scrubbing the timeline updates the scene immediately.
  - Play advances through stored frames only; no recompute.
- Settings behavior:
  - Toggles for day/night/background style.
  - Orbit mode toggle (auto/manual).
  - Show/hide grid lines.

## Component Breakdown (React)
- `<AppShell>`
  - Layout wrapper: top bar, scene viewport, insight card, replay bar.
- `<TopBar>`
  - Mode indicator (Live/Replay), settings button.
- `<SceneViewport>`
  - Wraps `<Canvas>` + `<SystemVisualScene>`.
- `<InsightCard>`
  - Collapsible panel: active pattern, rationale, leverage hint.
- `<ReplayBar>`
  - Play/Pause, speed selector, timeline slider, time label.
- `<SettingsPanel>`
  - Minimal toggles for background and orbit mode.

## State Management Plan
- `visualState`: current VisualState (from live analysis or replay frame).
- `focusId`: currently focused node/loop/lever id.
- `replay`: `{ isPlaying, speed, t, index }` for frame playback.
- `ui`: `{ backgroundMode, orbitMode, showAxes }` for simple toggles.

## MVP Constraints
- No complex routing.
- No user authentication.
- No advanced analytics or telemetry.
- UI is minimal, readable, and non-intrusive.

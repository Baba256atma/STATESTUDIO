# E2:69 — Runtime Flow Map (Stabilization Cycle)

## Observed cycle (pre-fix, idle `/type-c`)

```
PanelContractSalvaged
  → NEXORA_RIGHT_PANEL_WRITE
  → SceneParity[HomeScreen]
  → SceneHudDriftDetected (scene-activity)
  → (repeat)
```

## Event paths

| Event | Trigger | Source | Target | State mutation | Reason |
|-------|---------|--------|--------|----------------|--------|
| `SceneHudDriftDetected` | `sceneActivitySignature` change | `SceneCanvas` effect | `sceneHudDriftGuard.detectSceneHudDrift` | Baseline rects updated every detect | DOM layout sub-pixel drift; baseline advanced on every pass |
| `PanelContractSalvaged` | Panel data validation cache miss | `validatePanelSharedDataWithDiagnostics` | Salvage + cache | Cached validation result | Full cache flush at 50 entries; salvage re-ran before skip guard |
| `NEXORA_RIGHT_PANEL_WRITE` | Panel authority commit | `setRightPanelState` | React state | `rightPanelState` | Log emitted before view-close guard; peek passed but updater returned `prev` |
| `SceneParity` | `sceneParitySignature` effect | `HomeScreen` dev effects | Console only | None (observer) | Effect re-ran on deps; `traceParityAlreadyStable` on unchanged signature |

## Fix summary

1. **Right panel** — resolve final state before commit; log/write only when signature changes.
2. **Panel salvage** — LRU cache; early return when `contractSignature === lastSalvagedContractSignatureRef`; skip propagation when output signature unchanged.
3. **HUD drift** — `lastDriftSignatureRef` suppresses identical drift; baseline updates only when converged.
4. **Scene parity** — silent return on unchanged signature (no diagnostic churn).
5. **Cycle detector** — `runtimeCycleDetector.ts` emits `[Nexora][CycleDetected]` if sequence repeats 4+ times in 2s.

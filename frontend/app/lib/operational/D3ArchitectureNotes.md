# D3 Live Operational Intelligence — Architecture Notes

## Pipeline order (read models)

1. **Monitoring snapshot** — `toMonitoringSnapshotInput` → `deriveOperationalMonitoringSnapshot` (normalized signals + pipeline HUD brief).
2. **Change detection** — `detectOperationalChanges(previousSnapshot, currentSnapshot)` (requires prior snapshot ref; ordering handled in `HomeScreen` via `useLayoutEffect`).
3. **Propagation preview** — `deriveOperationalPropagationPreview` (scene graph: loops, relations, dependencies; bounded BFS).
4. **Risk-impact map** — `deriveOperationalRiskImpactMap` (merges monitoring + changes + propagation + optional scene fragility hints).
5. **Operational alerts** — `evaluateOperationalAlerts` + `defaultOperationalAlertRules` (rule engine; per-record dedupe keys; bundle signatures for diagnostics).

All stages are **pure**, **synchronous**, and **read-only** with respect to `sceneJson` (no in-place mutation).

## Memoization expectations (`HomeScreen`)

- Heavy work runs inside `useMemo` with **primitive/stable** dependencies where possible.
- Propagation and risk-impact consume **`stableVisibleSceneJson`** so object-level churn that does not change the stable visible snapshot reuses the same scene reference, reducing unnecessary recomputation.
- `defaultOperationalAlertRules` is a module constant and intentionally omitted from the dependency array (stable identity).

## Dedupe & signatures

- **HUD / dev churn:** `d3SignatureDeduplication.ts` builds deterministic signatures per stage; `logD3OperationalDiagnosticsDeduped` logs only when the **composite** signature changes.
- **Alerts:** `buildOperationalAlertRecordSignature` keys individual rows; `buildOperationalAlertSignature` fingerprints the whole evaluation after dedupe.

## Traversal & caps

- Propagation: `MAX_BFS_STEPS`, `MAX_GRAPH_DEPTH`, `MAX_PREVIEW_NODES`, neighbor caps; seed list capped via `safeOperationalTraversalLimit` / `d3StabilityGuards`.
- Risk-impact: candidate ids deduped and sliced before node materialization.

## Connector / streaming stance

- D3 **does not** open sockets, poll, or call connector transports from derivations.
- `monitoringInputAdapter` maps already-ingested pipeline/dev artifacts into normalized signals; execution stays upstream.

## Intentional limitations

- Stable visible scene optimization may lag **non–object-graph** scene edits until the visible snapshot updates.
- Alert rules are in-memory defaults only (no persistence layer in D3).

## Future streaming readiness

- Signature layer is designed so a future incremental feed can **coalesce** updates by comparing composite signatures before touching React state.

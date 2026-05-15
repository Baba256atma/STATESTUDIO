# D3 Integration Verification Checklist

Use before merging D3-related PRs or promoting to D4 intelligence work.

- [ ] **No direct `sceneJson` mutation** inside operational derivations or D3 HUD paths.
- [ ] **No routing / right-panel contract changes** introduced for D3-only features.
- [ ] **No render loops** — D3 memos depend on stable inputs; no `setState` inside derivations.
- [ ] **No connector auto-run** from `useMemo`, render, or D3-only `useEffect` bodies.
- [ ] **HUD remains read-only** — no mutations back into pipeline or scene from `D3StatusHud`.
- [ ] **No panel flashing** — avoid unstable object/array literals in memo deps where signatures exist.
- [ ] **No alert spam** — `dedupeOperationalAlerts` + record signatures; bundle signature for diagnostics.
- [ ] **No recursive propagation explosion** — BFS step cap, depth cap, preview node cap, seed cap.
- [ ] **No unbounded graph traversal** — adjacency neighbor limits respected in propagation builder.
- [ ] **`npx tsc --noEmit`** — no new errors in `app/lib/operational/**` and D3 touchpoints.
- [ ] **Tests** — `node --test` for `app/lib/operational/__tests__/*.test.ts` including `d3ProductionSmoke.test.ts`.
- [ ] **Manual** — app loads, scene renders, right panels work, D3 HUD calm under repeated identical pipeline states.

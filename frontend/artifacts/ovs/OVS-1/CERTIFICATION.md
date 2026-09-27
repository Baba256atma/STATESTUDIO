# NPA-T OVS:1 — CERTIFICATION

## Stop condition

Bounded live `/executive` runtime on the existing port-3000 server, plus reused automated evidence. No geometry redesign. OVS:2 not started.

## Verdict

**NPA-T OVS:1 — CERTIFIED**

## Runtime environment

- Existing Next.js listener on **port 3000** (PID observed via `lsof`; HTTP 200 for `/executive`).
- Route: `http://127.0.0.1:3000/executive?ovs1=1`
- Viewport: 1440 × 900 desktop.
- Browser: Playwright against **system Chrome** (`channel: "chrome"`), headless, **~5–6 s** per pass. Cursor browser MCP was not used after prior multi-hour hangs. Playwright’s bundled Chromium was missing; one recovery used installed Chrome. No second `next dev`. No port 3010.

## Reused automated evidence

- OVS:1 focused tests: **10/10 PASS**
- Affected owner bundle: **113/113 PASS**
- TypeScript: **PASS**
- Production build: **PASS**
- `git diff --check`: **PASS**
- Duplicate-authority audit: **PASS**

These were not rerun in this certification.

## Live checks

### A. Stage load — PASS

One R3F `<canvas>`. Host `data-ovs-1-contract="ovs-1"`, identity `NPA-T OVS:1/Executive3DObjectVisualLanguage`, `data-ovs-1-enabled="true"`. No application alerts. Center Stage rendered.

### B. Geometry visibility — PASS with documented live-taxonomy limit

Host observability after focus:

| Object | Catalog `kind` | OVS family | Primitive | Manager-visible form |
| --- | --- | --- | --- | --- |
| Revenue | `object` | operational | rounded-block | Rounded plate with depth |
| Capacity | `object` | operational | rounded-block | Rounded plate with depth |
| Risk | `object` (id/label contain “risk”) | **risk** | **diamond** | **Octahedron, clearly distinct** |

Overview of Customer Watch + Capacity Watch showed two similar gold-rimmed plates because both resolve as **operational rounded-block**, not because every primitive collapsed to a slab.

When Risk is focused, the diamond is immediately distinguishable from supporting Delivery / Capacity / Customer rounded plates. Labels `RISK` / `UNRESOLVED` remain upright and readable. Materials stay quiet, shared, non-game-like. PRIMARY Risk is larger and higher than SUPPORTING plates.

Live catalog kinds on this scene are generic `object`. KPI/Goal/Decision/Execution/Outcome primitives were **not all present as distinct live kinds**. Advisor copy can call Capacity a KPI while OVS still maps `obj-capacity Capacity object` to operational. That is resolver-input / catalog-kind limitation, not a camera or mesh-orientation failure for families that do cue-match.

### C. Screenshot concern — not a renderer collapse defect

Cause: (1) the default overview pair is the same OVS family; (2) most executive objects have `kind: "object"` so they fall through to rounded-block unless the id/label cue contains a family word such as `risk`. Risk proves intended non-block geometry is live and recognizable.

### D. Canonical selection — PASS

Selecting Revenue set `data-focused-subject=obj-revenue`, Stage selection `obj-revenue`, Advisor subject Revenue. Selecting Risk set `obj-risk` on Stage host OVS family `risk` and Advisor subject Risk.

### E. NMI → Stage → Right — PASS (map-node path)

NMI opened (`data-nmi-panel-open=true`). Map node `goal-capacity-availability` kept Stage/Advisor on `obj-capacity`. Collapsing NMI left `obj-capacity` and `data-nmi-panel-open=false`.

(First pass clicked a queue-list control without a canonical id and cleared focus; that was a test-control miss, not used as the certification path.)

### F. Relationships — PASS

Risk focus showed existing connectors from Risk to Delivery (and nearby Capacity/Customer). Single connection presentation. No second relationship renderer.

### G. Workspace integrity — PASS

`scrollWidth === innerWidth` (1440) and `scrollHeight === innerHeight` (900). Stage remained center. NMI collapsed by default then toggled. Right Advisor usable. Detail did not leak. Geometry stayed inside the Stage disc.

### H. Reduced motion — SOURCE-VERIFIED

OVS modules have no `useFrame` / decorative loop. STAGE-MOTION:1 and `prefers-reduced-motion` remain the motion authority (focused OVS test F). OS preference was not toggled in this live pass.

## Files changed during CERT

Certification artifacts only under `frontend/artifacts/ovs/OVS-1/`:

- `CERTIFICATION.md`
- `live-cert.mjs` / `live-cert-2.mjs` (bounded Chrome harness)
- `live-report.json` / `live-report-2.json`
- `live-stage.png` / `live-selected.png` / `live-risk.png` / `live-capacity.png`

No production geometry or renderer edits.

## Remaining OVS:1 debt (non-blocking)

- Generic catalog `kind: "object"` does not activate KPI cylinder / Goal orb / Decision hex unless the id or label cue contains those family words. Advisor may still describe Capacity as a KPI.
- Scenario vs execution still share rounded-block (by design).
- OVS:2 still owns richer state/attention visuals.

No blocking OVS:1 defect was found on the live Stage.

## Next-phase boundary

OVS:2 owns canonical management-state visual mapping. This certification does not start OVS:2.

## Verdict

**NPA-T OVS:1 — CERTIFIED**

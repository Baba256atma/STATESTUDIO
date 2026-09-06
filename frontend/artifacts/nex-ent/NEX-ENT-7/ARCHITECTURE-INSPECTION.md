# NEX-ENT:7 — Architecture inspection (before implementation)

Inspection date: 2026-09-04. No second `/executive`, Stage, Director, or Advisor.

## Authorities inspected

| Surface | Location | Finding |
| --- | --- | --- |
| EVE Chart & Metric Visualization | `app/lib/eve/chartMetricVisualization*` | **Metadata-only inventory.** `metadataOnly: true`, `runtimeBehavior: "None"`, `rendering: false`. Tests forbid importing recharts/d3. Not a runtime resolver or renderer. |
| EVE timeline / graph / dashboard visualization | `app/lib/eve/timelineVisualization*`, `graphVisualization*`, `dashboardExecutiveWorkspaceVisualization*` | Same freeze: declarative inventory, no runtime charts. |
| DTH:3 NexoGraph visual grammar | Decision Theatre object/state/line/halo | Object identity and status color. Must not be reused as chart “bad/good” encoding. |
| DTH Scene Intent / Scene Script | Theatre projection | Scene composition, not a chart engine. |
| DTH:7 Decision Comparison | Canonical executive comparison | Visual compare must present evidence only; must not pick a winner. |
| DTH director `mayNot` | Theatre expansion policy | Charts are not Theatre expansion work. |
| DIR:GA | `nexoraGuidedAttentionPresentation.ts` | Reuse `STAGE` cue. No chart-specific attention. |
| DATA-UX / DATA-ADV / RDI | csv parse, semantics, Data Library | Evidence/source truth. Visuals may reference; must not write. |
| ENT:6 example fixture | `DT,ORD_QTY,OTD,CAP_AV,BKL` — two monthly rows | Real temporal points for a **two-period** trend. Not six months. Do not fabricate extra periods. |
| NEX-ENT:1–6 | `nexora-entrance/*` | Lesson state only. Must not own visual resolver. |
| CC:5 | `conversationalExperienceOrchestrator.ts` | LOCATE_UI already precedes entrance. Visual resolve must not precede collection/object/GA. |
| NCA / Manager–Object | meaning, focus, collection | “Show me the problems” / object show remain non-visual. |

## What already exists vs what ENT:7 needs

1. Canonical chart/view **runtime** model — **no**. EVE is inventory only.
2. Visual evidence type — **no** runtime type.
3. Chart renderer — **no** (and DRI forbids chart generators in some director runtime files).
4. Time-series presentation — **no** reusable Stage chart.
5. Comparison presentation — DTH:7 owns **decision** comparison, not metric bars.
6. Data-to-visual resolver — **no**.
7. Stage placement — Director / Stage frame overlay exists; reuse overlay, do not add `Ent7StageChartManager`.
8. Visual selection semantics — **no**.
9. Title/axis/legend authority — EVE metadata only.
10. Missing-data handling — not a visual resolver concern yet.
11. Provenance inside visuals — Data Reality/source provenance exists; visuals must consume it, not invent it.

## Decision

Introduce the smallest reusable capability **outside NEX-ENT**:

- Identity: `DIR:VI/NexoraVisualIntelligence`
- `requiresNexEnt: false`
- Intent + evidence → `SUPPORTED` | `INSUFFICIENT_EVIDENCE` | `AMBIGUOUS`
- Presentation spec only (SVG/HTML in Stage overlay)
- Never writes evidence, Objects, Decisions, or Data Reality

NEX-ENT:7 teaches it via `guidedIntroduction.visualEducation`.

Do not start NEX-ENT:8.

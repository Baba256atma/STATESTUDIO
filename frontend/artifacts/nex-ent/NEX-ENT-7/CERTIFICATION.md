# NEX-ENT:7 — Visual Intelligence — CERTIFICATION

**Status: NEX-ENT:7 — CERTIFIED**

**Stop.** Do not start NEX-ENT:8 Decision Loop Experience.

Date: 2026-09-04.

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`. EVE chart/metric visualization is metadata-only (`rendering: false`). DTH owns object grammar and Decision Comparison. DIR:GA owns attention. No reusable runtime visual resolver existed.

## Existing visual architecture

Frozen EVE inventory only. No second chart library. ENT:7 added `DIR:VI/NexoraVisualIntelligence` outside NEX-ENT (`requiresNexEnt: false`).

## New reusable capability

| Piece | Identity | ENT-owned? |
| --- | --- | --- |
| Visual resolver + example evidence + copy | `DIR:VI/NexoraVisualIntelligence` | no |
| Visual vs collection/object/GA routing | `resolveNexoraVisualGuidanceIntent` | no |
| Stage overlay renderer | `NexoraEvidenceVisualView` | no (presentation of DIR:VI spec) |
| Lesson state | `guidedIntroduction.visualEducation` | yes (lesson only) |

## Authority table

| Responsibility | Canonical authority | ENT:7 role |
| --- | --- | --- |
| Manager meaning | CC:5 / NCA / canonical meaning | observes |
| Visual purpose | `resolveNexoraVisualGuidanceIntent` + DIR:VI | teaches |
| Evidence values | Data Reality / Object / example fixture (not accepted) | none |
| Semantic field meaning | DATA-ADV / `applyCsvSemanticClarification` | none |
| Representation | DIR:VI (`TREND_LINE`, `COMPARISON_BARS`) | teaches |
| Stage placement | Director / Stage overlay | none |
| Object focus | NEX-MVP / Manager–Object | none |
| Guided Attention | DIR:GA | reuses STAGE |
| Comparison business semantics | DTH / EXP comparison | presentation only |
| Chart rendering | Stage overlay from DIR:VI spec | teaches |
| Education state | `visualEducation` | owns lesson only |

## Visual intent

`TREND` when the manager asks how a supported measure changed over time. `COMPARE` when they ask to compare supported observations/periods with evidence language. `NONE` for Show problems, Show Object, Where is Data, Show Delivery, Compare them/scenarios, improve delivery performance.

## Representation

Intent + evidence shape. Two monthly OTD points (2026-05 89.8, 2026-06 90.1) from the ENT:6 example CSV. Not six fabricated months. LIKELY OTD label is not upgraded to confirmed On-Time Delivery. UNKNOWN `value` is not a named trend.

## Boundary proofs

- Visual ≠ Object / Data Object / Decision / Focus / evidence writer — `isBusinessObject/isDataObject/isDecision/mutatesFocus` false; `shouldCommitRuntime` false; dismiss does not delete sources.
- Trend: two real periods. Missing history: refuse 6 months, no extra points.
- Comparison: two OTD periods, copy states it does not pick a winner.
- Provenance: example operations source + OTD field labels.
- Causality: pattern, not cause.
- Routing: Show problems, Show Capacity Problem, Where is Data, Show Delivery remain non-visual.

## Director / Stage

One overlay view. Replacement overwrites. Close/dismiss clears presentation only. DIR:GA STAGE on PURPOSE. No Ent7StageChartManager.

## Guided Attention

DIR:GA remains sole attention authority.

## Accessibility / reduced motion

Accessible `aria-label` on the view. Advisor text explains the evidence. Line/bar SVG is static (no grow-from-zero animation). Neutral accent; not DTH status red.

## State safety

Visual presentation writes zero business Objects. Example evidence `acceptedIntoDataReality: false`.

## Refresh / re-entry

Live: refresh does not duplicate the view. Skip leaves no visual. Default `/executive` does not auto-open visuals.

## Files created

- `app/lib/director/nexoraVisualIntelligence.ts` + test
- `app/lib/manager-object/nexoraVisualGuidanceIntent.ts` + test
- `app/lib/nexora-entrance/nexoraVisualEducationExperience.ts` + test
- `app/executive/nex-mvp/stage/NexoraEvidenceVisualView.tsx`
- `scripts/nex-ent7-visual-intelligence-certify.mjs`
- `artifacts/nex-ent/NEX-ENT-7/*`

## Files modified

- `nexoraGuidedEntranceTypes.ts`, `nexoraGuidedEntranceExperience.ts`, `nexoraEntranceExperience.ts`
- `conversationalExperience.ts`, `conversationalExperienceOrchestrator.ts`
- `NexoraExecutiveShell.tsx`
- `nxaTestFunnel.ts` (L4 omnibus includes DIR:VI + DIR:GA tests)

## Tests

- Visual + guidance + ENT:7 proofs A–U: passing
- Entrance pack including ENT:1–6, EXP, E2E, MVP-FINAL: **green** with CC conversational tests (**600** in the combined CC+entrance+visual+DIR:GA run)
- TypeScript `noEmit`: pass
- Production build: pass
- Live `/executive?entrance=1&reset=1`: pass (`frontend/.certification/nex-ent7-visual-intelligence/live-browser.json`)

Live used production `next start` on port **3002** so the hung `:3000` dev server was not killed.

## Regressions noted

Routing had to be tightened so visual intelligence does not steal:

- `improve` via substring `prove`
- inspect-without-view causality
- `Compare them` / scenario compare
- `Show Delivery` / `show delivery`
- `delivery performance` as a Goal utterance

Those are product requirements, not weakened tests.

## NEX-ENT:1–6

Remain green in the entrance pack. ENT:7 does not replace their authorities.

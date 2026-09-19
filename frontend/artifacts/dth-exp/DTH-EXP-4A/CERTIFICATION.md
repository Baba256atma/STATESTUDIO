# NPA-T DTH-EXP:4A — Director Nexo Selection

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:4B.

## Status

**NPA-T DTH-EXP:4A — CERTIFIED**

## 1. Architecture inspected

DIR:1 Semantic Director, DTH:1–12, DTH-EXP:1–3B, NEX-MVP:3/4 Stage, CC:5, NMI, VAI:1–8. See `ARCHITECTURE-INSPECTION.md`.

## 2. DIR:1 extension point

`selectNexoraDirectorNexoFamily` overlays DIR:1 `directNexoraPresentation` plans plus interpreted management need / DTH:5 scene intent / collection kind. No Director2, NexoDirector, TheatreDirector, or conversation router. DIRECTOR-1:9 public index is unchanged.

## 3. Selection contract

`DthExpDirectorNexoSelection`: management need, selected family or null, reason, support/selection state, DIR:1 source identity, canonical subject, optional current family, fallback `preserve-current-scene-without-guessing`. Empty actors/evidence. No business writes.

## 4. Nine intent → Nexo semantics

| Need | Family |
| --- | --- |
| PORTFOLIO_COMPARISON | NEXO_BUBBLE |
| MAGNITUDE_COMPARISON | NEXO_BARS |
| OPERATIONAL_FLOW / BOTTLENECK_LOCATION | NEXO_FLOW |
| VARIABLE_LEVER | NEXO_IMPACT |
| RISK_FOCUS | NEXO_RISK |
| TEMPORAL_DEVELOPMENT | NEXO_TIME |
| CAUSE_INVESTIGATION | NEXO_CAUSE |
| EXECUTION_STATUS | NEXO_EXECUTION |
| OUTCOME_ASSESSMENT | NEXO_OUTCOME |

No NexoBottleneck. No Timeline family.

## 5. Subject / referent preservation

`canonicalSubjectId` is copied from input. Selection does not resolve or replace referents.

## 6. Continuation / stale perspective

CONTINUATION + current family + DIR:1 `NO_CHANGE`/`PRESERVE` preserves family. Explicit management need overrides stale current family.

## 7. Ambiguity / fallback

UNSPECIFIED or unsupported continuation → `selectedFamily: null`, `selectionState: unresolved`. No conversational clarification inside the selector. NMI hints do not select.

## 8. Authority boundaries

VAI, CC:8/10/11, CORE-OUT, Stage, and 3B recipe engine unchanged. 3B `automaticDirectorSelection` remains false. `startsDthExp4B: false`.

## 9. Files

Created: identity, boundary, contract, `selectNexoraDirectorNexoFamily`, tests, `artifacts/dth-exp/DTH-EXP-4A/*`.

Modified: `dthExpPublicIndex.ts` (4A exports only).

## 10. Focused tests

DTH-EXP:4A + :3B + :3A + :2 + :1 — **102 pass / 0 fail**. ESLint 0. Typecheck pass.

## 11. Regressions

None observed in DTH-EXP:1–3B focused suite.

## 12. Remaining debt

See `KNOWN-DEBT.md`.

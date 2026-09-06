# NEX-STAGE-CARD:1 — CERTIFIED

Status: **NEX-STAGE-CARD:1 — CERTIFIED**

Date: 2026-09-06.

Live proof: `frontend/.certification/nex-stage-card1-semantic-role-card/live-browser.json`  
Port: **3016** (temporary production `next start`; stopped after proof). Historical `:3000` was left running.

Classified (not owned by this phase):

- NCA:4 test M — NCA-POST multi-entity clarification.
- NXA:3 test A — `Why does Capacity matter?` FIX1 `GOAL_RELEVANCE` routing.

No NEX-CONV:3.

## Root Cause

Stage selection preserved entity identity, but DTH:6 `projectNexoraDecisionTheatreObjectInvestigation` normalized every selected Stage entity into the generic business-object investigation contract. Educational actor catalog metadata (`status: "stable"`, ANCHOR presence reason) was treated as manager-facing business current state, evidence UNKNOWN, and empty business relationships. Role was never resolved before composing sections.

## Click/Presentation Chain

1. HTML `nexora-stage-object-control-${id}` / mesh `onSelect` (generic Stage click)
2. `NexoraExecutiveShell.onSelectSubject` → `selectNexoraMVPInteractionSubject`
3. `projectNexoraDecisionTheatreFoundation` → `mapObject` / `catalogProvenanceOf`
4. `projectNexoraDecisionTheatreObjectInvestigation`
5. `resolveStageEntityPresentationRole` (read-only)
6. Role-aware glance/advisor/actions
7. `NexoraDecisionTheatreInvestigationSurface` (single shell; empty N/A paragraphs omitted)

## Source of stable

Entrance education catalog fixture `status: "stable"` on the educational product actor (`nexoraEntranceExperience.ts` / guided catalog). `mapObject` copies it to `lifecycleStatus`. That catalog value is **preserved**. DTH:6 no longer projects it as `Current state: stable` when `businessStatus` is `NOT_APPLICABLE` (`statusSource: not-applicable`).

## Generic Evidence Fallback

Composer `evidenceUnknownCopy`: `Nexora does not yet have enough evidence to determine this.` Previously written into both `uncertainty` and `advisorReadable.evidence` whenever `!hasEvidence`. Duplicate UNKNOWN. Now only when `businessEvidence` is APPLICABLE.

## Generic Relationship Fallback

Composer `advisorReadable.related` when `relationships.length === 0`: `No supported relationships are shown for this object.` Now only when `businessRelationships` is APPLICABLE.

## Semantic Role Resolution

`resolveStageEntityPresentationRole` from DTH:2 visual family, catalog `catalogProvenance` (`entrance-education` | `object-education`), and ENT:3 `isNexoraEducationalObjectId` as object-education fallback. Not from id `obj-nexora-entrance`, label, DOM, CSS, or icon.

## Existing Taxonomy Reused

DTH:2 `EXECUTIVE_OBJECT` / `ICONIC_OBJECT` / `DATA_OBJECT`. ENT catalog provenance. ENT:3 educational object ids. Presentation-role enum is projection-only, not a second object ontology.

## Card Projection

One DTH:6 investigation surface. Sections follow applicable capabilities. Educational actor: identity (`NEXORA_GUIDED_ENTRANCE_WHAT_IS_COPY`), purpose (`CAPABILITY_INTRODUCTORY_COPY`), lesson role (`Role in this Stage:` + existing ANCHOR reason). Educational examples: identity + `NEXORA_EDUCATIONAL_EXAMPLE_PROVENANCE`. Executive objects keep status / evidence / relationships. Data Objects stay on DATA-UX inspection (`data-source:` family), not executive investigation copy.

## Unknown vs Not Applicable

APPLICABLE + missing → existing UNKNOWN copy remains. NOT_APPLICABLE → omit section; no UNKNOWN fallback. Applicability is read-only projection logic, not persisted N/A store state.

## NEXORA

Live `/executive?entrance=1&reset=1`, click NEXORA after Why / Show me / focus / Explain first:

- selected `obj-nexora-entrance`
- role `EDUCATIONAL_ACTOR`
- `statusSource=not-applicable`, evidence/relationships `NOT_APPLICABLE`
- Card: executive decision workspace identity, capability purpose, `Role in this Stage: Organizes the current scene.`
- Absent: `Current state: stable`, evidence insufficiency, relationship absence, `is a object`
- Catalog `stable` still present in the entrance catalog fixture

## Educational Objects

Goal/KPI cards: `Educational example`, provenance copy, not manager Goal/KPI truth. `goalState=none`. Advisor `What is this?` remains educational Goal copy. CONV/Stage subject `obj-nex-ent3-goal` then `obj-nex-ent3-kpi`.

## Executive Objects

Live `show problems` → click `ctx-problem-margin` (Margin Pressure): `EXECUTIVE_OBJECT`, `Current state: risk`, Understand / related / investigate. Investigation depth preserved.

Default MVP fixtures such as Risk / Capacity Gap remain **demo catalog fixtures**, not manager-confirmed truth.

## Data Objects

Live CSV was not present. Focused fixture: `data-source:` id → `DATA_OBJECT`, `dataSource` applicable, business status not applicable. DATA-UX inspection path unchanged (no duplicate Data Object).

## Iconic/Presentation Entities

DTH iconic ids resolve `ICONIC_ENTITY`. Iconic meshes are not newly selectable. Classified **N/A** for live click (no new selectability).

## Advisor/Card Parity

Educational Goal card + Advisor `What is this?` both treat it as an educational Goal example, not manager Goal truth. NEXORA card + CONV subject `obj-nexora-entrance`.

## Stage/Card Parity

Card `data-theatre-investigation-object-id` matches selected Stage entity (NEXORA, Goal, KPI, Margin Pressure).

## FIX2 Transition Parity

Goal card open → `Show me the next one` → KPI card `obj-nex-ent3-kpi`, not stale Goal. CONV subject KPI.

## FIX3 Entrance Isolation

Background click while card open: `experience=GUIDED_ENTRANCE`. No business Overview fallthrough.

## Decision/Execution/Data Safety

Live `goalState` / `decisionState` / `executionState` = `none` across NEXORA/Goal/KPI. Composer `mutatedDecision` / `startedExecution` false. Opening Data inspection does not confirm semantics. Relationship copy remains non-causal.

## Duplicate Taxonomy Audit

No EntityTypeV2. Reused DTH families + ENT provenance. Presentation role is a resolver result only.

## Duplicate Card Authority Audit

One investigation overlay. No ObjectCardV2. Data Objects remain on existing DATA-UX surface.

## Duplicate Product Knowledge Audit

NEXORA copy from `NEXORA_GUIDED_ENTRANCE_WHAT_IS_COPY` and `CAPABILITY_INTRODUCTORY_COPY`. No second capability registry.

## Files Created

- `frontend/app/lib/decision-theatre/nexoraStageEntityPresentationRole.ts`
- `frontend/app/lib/decision-theatre/nexoraStageEntityPresentationRole.test.ts`
- `frontend/scripts/nex-stage-card1-semantic-role-card-certify.mjs`
- `frontend/artifacts/nex-stage-card/NEX-STAGE-CARD-1/ARCHITECTURE-INSPECTION.md`
- `frontend/artifacts/nex-stage-card/NEX-STAGE-CARD-1/CERTIFICATION.md`
- `frontend/.certification/nex-stage-card1-semantic-role-card/`

## Files Modified

- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts`
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigationComposer.ts`
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts`
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts`
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreStageCompatibility.ts`
- `frontend/app/lib/decision-theatre/nexoraDecisionTheatreVisualGrammarFixtures.ts`
- `frontend/app/executive/nex-mvp/stage/NexoraDecisionTheatreInvestigationSurface.tsx`
- `frontend/app/executive/nex-mvp/NexoraStageMount.tsx`
- `frontend/app/lib/nex-mvp/nexoraMVPStageFixtures.ts`
- `frontend/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts`
- `frontend/app/lib/nexora-entrance/nexoraEntranceExperience.ts`
- `frontend/app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts`
- `frontend/app/lib/nexora-entrance/nexoraObjectEducationExperience.ts`
- `frontend/app/lib/nexora-entrance/nexoraConversationEducationExperience.ts`

## Tests

| Suite | Count |
| --- | --- |
| NEX-STAGE-CARD:1 focused | 9 pass |
| STAGE-CARD + DTH:2/3/6 + Theatre foundation + Data Object projection | 69 pass |
| NEX-ENT `*.test.ts` + NEX-CONV `*.test.ts` | 381 pass |
| MO explain/investigate + DATA-UX:3 + DATA-ADV semantic + BCA + EI outcome/learning + Decision/Execution/Outcome/Learning theatre + Director + Stage/MVP interaction | 350 pass |

CONV:1, CONV:2, CONV:2-FIX1, CONV:2-FIX2, ENT:1–10, ENT-FIX1–3 are included in the 381. DTH:6 object investigation is included in the 69.

## TypeScript

`tsc --noEmit` — pass.

## ESLint

STAGE-CARD files — 0 errors.

## Production Build

Prior `npm run build` serving **3016** — pass (live current-build proof).

## Live Port

**3016**. Stopped after proof. Did not disturb `:3000`.

## Runtime Errors

**0**

## Unauthorized Business Writes

**0**

STOP. No NEX-CONV:3, NEX-ENT:11, E2E, RAG, memory, card visual redesign, or new ontology program.

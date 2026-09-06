# NEX-ENT:10 — Personal Demo Handoff — CERTIFICATION

**Status: NEX-ENT:10 — CERTIFIED**

**STOP.** Do not start NEX-ENT:11, NEX-ENT:E2E, a second Demo product, or automatic Issue/Scenario/Decision work.

Date: 2026-09-05.

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`. ENT:10 orchestrates handoff pacing only.

## NEX-ENT:1–9 preservation

`tsx --test app/lib/nexora-entrance/*.test.ts app/lib/director/nexoraVisualIntelligence.test.ts app/lib/director/nexoraGuidedAttentionPresentation.test.ts` — **292/292**.

Focused ENT:10: **11/11**.

## Handoff authority

`guidedIntroduction.personalDemoHandoff.state` only.

States: `NOT_STARTED` → `INTRO` → `MANAGER_CONTEXT` → `WORK_CONTEXT` → `WORKSPACE_IDENTITY` → `GOAL` → `DATA_CHOICE` → `READY` → `HANDOFF` → `COMPLETED` | `SKIPPED`

Identity: `NEX-ENT:10/PersonalDemoHandoff`.

Handoff state is not business state. `GOAL` does not mean a Goal exists. `DATA_CHOICE` does not mean Data is accepted.

After `COMPLETED` or `SKIPPED`, `shouldNexoraGuidedEntranceOwnUtterance` returns false. Ordinary CC/NCA owns the turn.

## Identity authority

Writer: NEX-EXP:1 `applyManagerIdentityUtterance`. Persistence: `writeStoredEntranceIdentity` when sufficiency is `SUFFICIENT` (`NEXORA_ENTRANCE_SESSION_STORAGE_KEY`, sessionStorage). ENT:10 does not write identity. OS/email/hostname are not used.

## BCA authority

BCA:1–8 remain interpretive. `persistsState: false`. No BCA writer was added. “This is a business.” falls through to NEX-EXP:1 `contextKind` (`COMPANY` / `PROJECT` / …). UNKNOWN (“I’m not sure”) does not block. Role is not RBAC.

## Central workspace authority

**REUSED CANONICAL AUTHORITY:** `NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID` (`obj-executive-context`) when identity is sufficient. Live complete path showed **Alex · Operations** on the same Stage. Display name comes from identity (`resolveDisplayName`), not a new object family.

**MISSING — FEATURE SAFELY OMITTED:** there is no generic rename-any-object writer. Workspace naming is identity phrasing (`the company is BAHA Doors`), not arbitrary Object rename.

## Goal authority

Writer: NEX-EXP:2 Goal Discovery when `READY_FOR_GOAL_DISCOVERY`. `inventsTargets: false`. ENT:10 does not call `applyGoalUtterance`. Existing Goal is not duplicated by ENT.

**Durability limitation (existing, not a new store):** Goal lives on the entrance session in memory. Refresh keeps sufficient identity via sessionStorage; Goal is not a separate durable store. Do not add `demoGoalStore`.

## Data authority

DATA-UX / RDI Use/Cancel only. “Use my data” offers DIR:GA `DATA_ENTRY` and does not open a file picker. “Start without data” is valid. ENT:6 example data is not Data Library (`acceptedIntoDataReality` remains educational). Pending sources are not treated as accepted. ENT performs no ingestion write.

## Educational data isolation

Completion copy states example introduction data is not the manager’s Data Library. Live complete path: no accepted manager source; `DATA · LOCAL` remains educational/local, not promoted.

## Stage transition

Same `/executive`, same Stage mount. Educational object/conversation overlays are suppressed once handoff leaves `NOT_STARTED`. On `COMPLETED`/`SKIPPED`, interaction runtime resets to overview (no second Stage). Director still presents; ENT does not construct business Objects into Stage.

## Advisor continuity

Same Advisor/conversation system. No Demo Advisor. After completion, ENT does not own ordinary turns.

## First personal conversation

After completion the Advisor operates without the ENT:10 intro script. Suggested chips may concatenate into `textContent` in live harvest (same as prior ENT scripts). Stage showed canonical executive context **Alex · Operations**. Completion copy distinguished known identity/context from missing Goal and missing accepted Data.

## Skip

`Skip for now` uses ENT:10 skip, **not** `skipGuidedEntrance` (that path still wipes identity). Live: “I didn’t invent identity, a Goal, or Data.”

## Partial handoff

Canonical writes already made (identity) remain; skip does not roll them back. Missing Goal/Data stay missing.

## Refresh

Identity persists per existing sessionStorage rules. No duplicate Goal/Data stores. Educational actors are not promoted. Goal session object is not independently durable (existing limitation).

## Returning manager

Default `/executive` does not start ENT:10 (`NOT_STARTED`). `?entrance=1&reset=1` re-enters education **without** deleting identity sessionStorage or CSV IndexedDB (`educationalReentry: true`). `reset=1` is educational re-entry, not business wipe.

## Canonical writer audit (live complete path on :3006)

| Manager action | Canonical authority | Mutation | Durable? |
| --- | --- | --- | --- |
| Let’s do it | ENT:10 pacing | `personalDemoHandoff` INTRO | session only |
| I’m Alex. I run operations… | NEX-EXP:1 | identity sufficient → `obj-executive-context` **Alex · Operations** | sessionStorage when SUFFICIENT |
| Start without data | ENT:10 pacing | COMPLETED; no Data Use | n/a |
| Skip for now (separate run) | ENT:10 pacing | SKIPPED; no invented identity/Goal/Data | n/a |

ENT:10 direct writes of identity/BCA/Goal/Data/Issue/Scenario/Decision/Execution/Outcome/Learning: **0**.

Issue/Scenario/Decision/Execution/Outcome/Learning: **not created** by ENT:10.

## Duplicate-authority audit

No `ent10IdentityStore`, `personalDemoStore`, `demoGoalStore`, `demoDataStore`, `demoObjectStore`, `onboardingBusinessContext`, second Stage, or second Advisor.

## State isolation

Educational pacing (`personalDemoHandoff`) ≠ manager identity/Goal ≠ Data Reality. Example ENT:6 data is not promoted.

## Files created

- `frontend/app/lib/nexora-entrance/nexoraPersonalDemoHandoffExperience.ts`
- `frontend/app/lib/nexora-entrance/nexoraPersonalDemoHandoffExperience.test.ts`
- `frontend/scripts/nex-ent10-personal-demo-handoff-certify.mjs`
- `frontend/artifacts/nex-ent/NEX-ENT-10/ARCHITECTURE-INSPECTION.md`
- `frontend/artifacts/nex-ent/NEX-ENT-10/CERTIFICATION.md`
- `frontend/artifacts/nex-ent/NEX-ENT-10/TEST-EVIDENCE.md`

## Files modified

- `nexoraGuidedEntranceTypes.ts` — ENT:10 session/boundary
- `nexoraGuidedEntranceExperience.ts` — route ENT:10 first; scene ends after handoff
- `nexoraEntranceExperience.ts` — `educationalReentry`; suppress educational overlays; freeze default
- `nexoraTrustReviewExperience.ts` — READY actions start handoff
- `NexoraExecutiveShell.tsx` — `data-nex-ent10-state`; reset does not clear identity/CSV
- `csvRealDataImportDurability.test.ts` — reset must not call CSV clear
- `conversationalExperienceOrchestrator.ts` — NXA GUIDE/ASK/WAIT/CHALLENGE respect `lockPresentedResponse`

## Tests

Focused ENT:10 **11/11**. Entrance + visual + DIR:GA **292/292**. TypeScript **pass**. Production build **pass**.

## Live proof

Current production build `next start` **:3006**. `frontend/.certification/nex-ent10-personal-demo-handoff/live-browser.json` — **passed: true**. Hung `:3000` was not used and was not killed.

## Runtime errors

Product runtime errors: **0**. Pre-existing minified React hydration **#418** observed in production (classified environmental/pre-existing; not used as a skip of product gates).

## Regressions

- Product: none known on ENT:1–9 pack run here.
- Architectural prerequisite: BCA remains non-persistent; Goal has no separate durable store.
- Pre-existing: React #418 hydration in production.

NEX-ENT:10 is the final planned implementation phase of the current Entrance program. Next *future* activity is NEX-ENT:E2E certification, not ENT:11.

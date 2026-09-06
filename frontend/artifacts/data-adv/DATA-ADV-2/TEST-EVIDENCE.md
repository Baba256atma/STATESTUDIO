# DATA-ADV:2 test evidence

## Focused semantic suite

Command: `npx tsx --test app/lib/data-reality/semanticCandidateIntelligence.test.ts app/lib/manager-object/nexoraAdvisorDataInquiry.test.ts app/lib/data-reality/csvSemanticUnderstanding.test.ts app/lib/data-reality/csvSemanticClarificationHandoff.test.ts`

Result: 25 passed, 0 failed, 0 skipped. Covers authoritative and manager-confirmed meaning, likely/ambiguous/unknown, domain/source/neighbor context, correction/rejection/unknown, dialogue continuity, source isolation, restore, normalization, opaque identifiers, and pure no-write behavior.

## Test funnel

- Level 1 Focused: passed; 1/1 required, 0 failed/skipped/running/uninspected.
- Level 2 Layer: passed; 1/1 required, 0 failed/skipped/running/uninspected.
- Level 3 Integration: passed; 1/1 required, 0 failed/skipped/running/uninspected.
- Level 4 Milestone Certification: passed in 252023 ms; 7/7 required, 0 failed/skipped/running/uninspected. Includes production build and live smoke.

The first Level 4 attempt correctly stopped on two widened literal-array types. After correction, default-heap standalone TypeScript runs hit an environmental Node 4 GB OOM. `NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck` passed, and final Level 4 passed with the same heap allocation. These OOM attempts are not counted as passing gates.

Targeted ESLint passed with no findings. `git diff --check` passed.

## Live `/executive` manager proof

Actual source: restored pending `data-ux3-ambiguous.csv`.

1. “What is CAP_AV?” → field identity stated; candidates `Available Capacity` and `Capacity Availability`; neither confirmed; manager asked which meaning is correct.
2. “Why do you think that?” → “The term structure supports Available Capacity or Capacity Availability. This is evidence, not confirmation.”
3. “No, it means Capacity Availability.” → “Confirmed for this source: CAP_AV means Capacity Availability.”
4. “What does it mean now?” → confirmed source-local meaning returned.
5. Refresh, restore source, then “What is CAP_AV?” → confirmed `Capacity Availability` returned without candidate inference.
6. “What is BKL?” → field identity retained; no safe candidate; manager asked what it represents.
7. “I don't know.” → BKL remained unresolved and unrelated usable fields could continue.

Live proof found and drove one generic safety correction: every term token must contribute to a candidate concept. Before that correction CAP_AV could include candidates derived only from AV; after correction exactly the two capacity candidates remained. The complete funnel was rerun after this change.

One environmental observation: immediately after refresh, a question submitted before restored store hydration fell through to generic not-found copy. Opening Data completed hydration; subsequent questions and the deliberate restore proof passed. This pre-hydration startup race predates semantic candidate resolution and is recorded as a remaining limitation, not attributed to adjacent code.

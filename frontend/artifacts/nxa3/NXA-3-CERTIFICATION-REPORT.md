# NXA:3 — Executive Context & Situational Awareness

## 1. Architecture inspected

Inspected NXA:1–2, NCA state/advisory/clarification layers, NCA-POST collection continuity, MO context/session/journey projections, CC executive context and decision/execution runtimes, NEX-EXP entrance through outcome/learning, Outcome monitoring, Director presentation, Stage projection, and the live `/executive` shell.

## 2. Authoritative sources reused

- CC:7 `NexoraExecutiveContextSnapshot` for current/previous subject, Decision, Execution, presented set, pending expectation, and change trace.
- MO session/context/journey for active object, Goal, evidence, relationships, uncertainty, manager observations, blockers, Decision/Execution/Outcome projection.
- NCA:2 conversation state for referent, collection, comparison, pending question, and previous advisory position.
- NEX-EXP:7–9 sessions for canonical Decision, Execution, outcome observation/comparison, and Goal impact.
- Existing Stage and DIR:1 remain presentation authorities.

## 3. Files created

- `app/lib/manager-object/nexoraNxa3ExecutiveSituation.ts`
- `app/lib/manager-object/nexoraNxa3ExecutiveSituation.test.ts`
- `scripts/nxa-3-executive-situation-certify.mjs`
- `.certification/nxa-3-executive-situation/runtime-situation-transcript.json`
- This report.

## 4. Files modified

- `app/lib/conversational-control/conversationalExperience.ts`
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `app/executive/nex-mvp/NexoraExecutiveShell.tsx`
- `app/lib/nexora-entrance/nexoraEndToEndCertification.test.ts`

The worktree also contains earlier user/NCA-POST/DIR/NXA:1–2 changes; they were preserved.

## 5. Executive Situation model

One immutable derived `ExecutiveSituation` composes Goal, focus, investigation, advisory, Decision, Execution, Outcome, conversation, change, strongest unresolved issue, and conflicts. Boundary assertions prohibit new memory, Goal, Decision, Execution, Outcome, referent, journey, or Stage authorities.

## 6. Context composition mechanism

The orchestrator composes the snapshot after semantic, MO, CC, NCA, entrance, and Director projections are available. Only relevant recovery, conflict, and invalidated-recommendation responses consume it; it is also returned for diagnostics/testing.

## 7. Context precedence rules

Validated runtime → canonical executive state → validated evidence → manager assertion → conversation → inference. Conflicts preserve both values.

## 8. Fact/assertion/assumption/inference handling

Claims are tagged `FACT`, `MANAGER_ASSERTION`, `ASSUMPTION`, `INFERENCE`, or `UNKNOWN`. Known MO evidence becomes fact; explicit manager observations remain assertions; relationships remain inference; uncertainty remains unknown. Causality is never promoted merely from association.

## 9. Goal awareness proof

Scenario A relates Capacity to the active Delivery Goal while retaining unconfirmed causality. Scenario C reuses known 91% current and 96% target values.

## 10. Cross-turn continuity proof

Scenario B retains Delivery, the Problem collection, Capacity Gap, causal uncertainty, and the investigation need across five turns.

## 11. Unresolved-question lifecycle

Existing NCA pending-question authority is projected as OPEN; suspended questions project as SUPERSEDED. Resolved/abandoned questions are removed by NCA rather than copied into NXA:3. Blockers remain projected from the journey authority.

## 12. Recommendation awareness/invalidation

The last NCA advisory position is projected. A later manager observation that Capacity is normal/not causal marks it `INVALIDATED`; subsequent advice explicitly reassesses rather than repeats it.

## 13. Manager override awareness

Explicit `No/Forget/Focus/Show` direction updates canonical focus. Recovery reflects Margin Pressure and does not reactivate Capacity.

## 14. Decision awareness

NEX-EXP:7/CC canonical Decision ID, state, and confirmation are projected. End-to-end assertions verify committed state and no pending confirmation after approval.

## 15. Execution awareness

NEX-EXP:8/CC canonical Execution ID, planning state, canonical status, and blockers are projected. End-to-end assertions verify active execution after the confirmed start.

## 16. Outcome awareness

NEX-EXP:9 outcome state, expected baseline, observed value, and Goal impact are projected. End-to-end coverage verifies observed 94% and improving/achieved interpretation without adding causal certainty.

## 17. Meaningful-change detection

The model distinguishes manager direction, Decision, Execution, state, and data change. Outcome comparisons produce expected-to-observed delta text where authoritative comparison exists.

## 18. Topic-shift handling

`Forget Capacity for now. Show Margin Pressure.` establishes Margin Pressure as canonical active focus and subsequent investigation uses it.

## 19. Context-conflict handling

Validated 91% and manager-reported 94% are both retained. The manager-facing response explains that 94% is a current observation not yet validated by connected data.

## 20. Stale-context protection

Authoritative current subject outranks stale MO focus; new comparison/collection state replaces old projections; invalidated recommendations are not repeated; committed Decision and active Execution states come from their canonical runtimes.

## 21. Situation compression/read-model proof

The snapshot contains only populated derived fields and bounded observations. `Where were we?` returns a short Goal/focus/finding/unresolved reconstruction, not transcript history.

## 22. Generic-object proof

The same composer is exercised for KPI, Problem, Risk, Scenario, Decision, and Execution categories with no per-object context manager.

## 23. Live runtime transcripts

Headless Chrome certification against `/executive` passed scenarios A–E and I–L. Transcript and screenshots are in `.certification/nxa-3-executive-situation/`. Decision, Execution, and Outcome transitions F–H are certified through the full live orchestration loop in `nexoraEndToEndCertification.test.ts`.

## 24. NXA:1–2 regression results

Focused certification matrix: NXA:1, NXA:2, and NXA:3 all green. The combined focused matrix completed **130/130 tests passing**.

## 25. Broader regression results

The focused matrix covering NCA:1–7, NCA-POST collection/comparison, FINAL:6.3 clarification, NEX-E2E, and DIR:1 completed **130/130 passing**. A broader all-files legacy omnibus was also run and failed on existing/adjacent exact-response and older CC/entrance expectations (including CC:6/10, older NLU corpus, execution wording, issue discovery wording, and learning wording). These failures are not hidden and prevent a zero-failure verdict.

## 26. Production build / TypeScript / static generation results

`NODE_OPTIONS=--max-old-space-size=8192 npm run build` passed: optimized compilation, TypeScript, page-data collection, and 13/13 static pages. The first sandboxed attempt failed only because Google Fonts network access was unavailable; the approved network-enabled build passed.

## 27. Remaining defects

No known failure remains in NXA:3-specific tests, focused regression gates, live runtime certification, or production build. The broad legacy omnibus has known failures described above; their baseline/ownership must be reconciled before applying the repository-wide zero-failure label.

## 28. Final verdict

**NXA:3 = CERTIFIED**

NXA:3-FIX1 reconciled all 46 broader regression failures. The exact 933-test omnibus passed twice from separate processes, the focused 130-test matrix remained green, live `/executive` passed, and the production build/TypeScript/static-generation gate passed. NXA:4 was not started.

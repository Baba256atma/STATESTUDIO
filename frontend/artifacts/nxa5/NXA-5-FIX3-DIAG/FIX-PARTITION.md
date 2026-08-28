# Fix partition recommendation

Do **not** implement here. Three separate Fix prompts.

## 1. NXA:5-FIX3A — Knowledge-verb typo must not become focus

- Root cause: CC:1 leaves `exlpain` unknown; POST:1 recovers the entity; FINAL:6.1 defaults FOCUS when a subject is present without an EXPLAIN cue; overlay replaces unknown with focus.
- Owner: FINAL:6.1 overlay and/or CC:1 verb recovery (POST:1 already recovers names).
- Permitted: `canonicalManagerMeaningInterpreter.ts`, `nexoraMvpFinal61NaturalLanguageUnderstanding.ts` overlay policy, optionally CC:1 normalize / POST:1 filler verbs.
- Forbidden: object-name patches; making every unknown+entity explain; timers; second intent engine.
- Focused proof: `exlpain Demand Surge` after show scenarios; control `explain Demand Surge`; other verb typos; knowledge still must not navigate.
- Integration: NXA:1, POST:1, FIX2 collection, Stage no-mutation for explain.
- Funnel: L1 then L2/L3; L4 only if this Fix is the NXA:5-FIX3 milestone.
- Stop: typo-explain stays read-only; correctly spelled explain unchanged; no NXA:6.

**Required before NXA:6** if real-manager conversation will include verb typos.

## 2. NXA:5-FIX3B — Ambiguous “important” continuation (optional quality)

- Root cause: POST:4 maps `important` to OVERALL_SIGNIFICANCE; NXA:5 then emits the certified terminal insufficiency when investigation also does not discriminate. Collection binding is correct. No false ranking.
- Owner: POST:4 criterion vs NCA:3/NXA:5 response composition.
- Permitted: criterion clarification using NCA:3, or NXA:5 next-step copy that does not pick a winner without evidence.
- Forbidden: picking Capacity Gap or Margin Pressure; merging importance with urgency/Goal; new dialogue authority.
- Funnel: L1 NXA:5/POST:4 + L3 FIX1 judgment continuity.
- Stop: still no invented rank; optional clarification; Stage still read-only.

Not the same owner as A. Do not combine with A.

## 3. NXA:5-FIX3C — Empty Goals continuation (optional)

- Root cause: POST:3 GOAL membership is empty in current context; empty copy is truthful; DIR preserves Stage; Queue has no Goals presenter.
- Owner: POST:3 empty-collection reply composition, optionally NEX-EXP:2 Goal Discovery as read-only offer.
- Forbidden: inventing a Goal; converting Scenario to Goal; focusing Close Capacity Gap from the Goals utterance; new collection store.
- Funnel: L1 POST:3 + L3 NEX-EXP:2; Stage preservation.
- Stop: empty remains truthful; any continuation is non-mutating.

Do not combine with A. Combine with B only if both are framed as “empty/insufficient continuation copy” under one reply-composition owner; they are not—B is NXA:5/POST:4, C is POST:3/NEX-EXP:2.

## Milestone

A separate **NXA:5-FIX3** certification is required before NXA:6 **if FIX3A is implemented**. B and C are quality follow-ons and should not be bundled into A.

# NXA:5-FIX3-DIAG — Knowledge-typo routing, insufficient-evidence guidance, empty-Goals continuation

## Verdict

**NXA:5-FIX3-DIAG = COMPLETE**

No Fix was implemented. NXA:6 was not started. NXA:5 / FIX1 / FIX2 / NXA:6-PREP certifications were not recertified, revoked, or changed. Combined 1355 baseline was not re-run (Diagnosis Funnel Level 1 only).

## Per-conversation results

### A — `exlpain Demand Surge`

- **Verdict:** REPRODUCED  
- **Impact:** UNCOVERED_CAPABILITY_GAP  
- **Expected:** knowledge/explain of Demand Surge; Scenarios collection preserved  
- **Actual:** `Focused on Demand Surge.`; Stage `object-focus`  
- **First divergence:** FINAL:6.1 overlay of CC:1 `unknown` → `focus` because NLU assigned FOCUS to a recovered entity without an EXPLAIN cue. CC:1 did not recover the verb (`exlpain` stays `exlpain`). POST:1 recovers names, not verbs.  
- **Owner:** FINAL:6.1 overlay (+ optional CC:1 verb recovery)  
- **Evidence:** `reproduction-traces.json` A vs A_control; `live-A.png` / `live-stage.json`  
- **Smallest Fix:** stop unknown+named-object from overlaying FOCUS when the first token is an explain-class misspelling; do not object-patch Demand Surge.

### B — `which one of prolems is important?`

- **Verdict:** EXPECTED_BEHAVIOR (epistemic safety + collection bind)  
- **Impact:** ADVISORY_QUALITY_GAP  
- **Expected:** Problems bind; no invented rank; optional criterion/next step  
- **Actual:** Problems bound; OVERALL_SIGNIFICANCE; preferred null; terminal insufficiency copy; Stage unchanged  
- **First divergence:** none vs certified safety. Productivity gap: POST:4 maps `important` to OVERALL_SIGNIFICANCE; NXA:5 terminal when investigation also does not discriminate. `prolems` is not CC:1-corrected; binding is `which one` + active collection.  
- **Owner:** POST:4 criterion + NXA:5 insufficiency composition  
- **Evidence:** traces B; live-B collection unchanged; comparisonCue `PRIORITIZE` / `OVERALL_SIGNIFICANCE`  
- **Smallest Fix:** NCA:3 criterion question or NXA:5 non-ranking next-step copy. Do not pick Capacity Gap or Margin Pressure.

### C — `show me all goals`

- **Verdict:** EXPECTED_BEHAVIOR (empty truth + Stage preserve)  
- **Impact:** EXPECTED_BUT_INCOMPLETE (no Goal-discovery offer)  
- **Expected:** no invented Goal; empty copy; preserve Demand Surge  
- **Actual:** empty Goals copy; DIR `canonical-collection-empty`; focus remains Demand Surge; Queue has no Goals row. Independent of A (`show Demand Surge` then Goals).  
- **First divergence:** none vs empty-collection safety. Membership is POST:3 contextual GOAL `[]`. Catalog still has a Goal-labelled subject; collection query correctly does not present it as current-context Goals.  
- **Owner:** POST:3 empty reply; CC:4 `reveal-goals` unsupported; optional NEX-EXP:2 offer  
- **Evidence:** traces C_independent; live-C  
- **Smallest Fix:** optional non-mutating Goal Discovery continuation. Do not create a Goal or focus Close Capacity Gap.

## Fix plan

Three Fix prompts. **Do not combine A with B or C.** B and C share only “continuation copy” thematically; owners differ.

1. **NXA:5-FIX3A** — required before NXA:6 if real-manager typos are in scope.  
2. **NXA:5-FIX3B** — optional quality.  
3. **NXA:5-FIX3C** — optional quality.  

A dedicated NXA:5-FIX3 milestone certification is required before NXA:6 **if FIX3A is implemented**.

## Gates

- Focused: harness 10/10 smoke; executor reproduction; live Stage  
- Live: 0 page errors  
- Files written: `frontend/artifacts/nxa5/NXA-5-FIX3-DIAG/*` only  
- Production files modified: **0**  
- Test files modified: **0**  
- Required tasks: started 3, passed 3, failed 0, running 0, uninspected 0  
- Nonessential: existing `npm run dev`

`nxaConversation` console scope remained **disabled**.

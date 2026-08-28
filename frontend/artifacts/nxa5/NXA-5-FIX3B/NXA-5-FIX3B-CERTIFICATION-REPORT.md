# NXA:5-FIX3B Certification Report

## Verdict

**NXA:5-FIX3B = CERTIFIED**

## Root cause and correction

- **Original route:** Problems collection → POST:4 `important` as OVERALL_SIGNIFICANCE → NXA:5 terminal insufficiency, preferred null, DIR NO_CHANGE.
- **Why safe:** no invented ranking; Stage preserved.
- **Why incomplete:** no criterion clarification; no executable continuation.
- **New ambiguity:** POST:4 `criterionAmbiguous` / `MATERIAL_IMPORTANCE_AMBIGUITY` when importance language has no named criterion.
- **Clarification:** existing NCA:3 `buildNca3ComparisonCriterionClarification`.
- **Pending:** NCA:2 `comparison-criterion` / PRIORITY + `activeComparison` IDs.
- **Explicit criteria:** skip the importance question; evaluate the named criterion.
- **Insufficiency:** criterion-specific NXA:5 copy + explicit-criterion continuation (risk exposure / evidence strength).
- **Stage:** NO_CHANGE / Problems collection throughout reasoning turns.

`prolems` is still uncorrected; `which one` + active collection bind the set.

## Behavior matrix

| Case | Required result | Actual |
| --- | --- | --- |
| Ambiguous important | Clarify; no ranking | PASS (B1 + live) |
| Clarification answer | Resume same comparison | PASS (`urgency` → URGENCY, same IDs) |
| Explicit urgency | No redundant clarification | PASS (B3) |
| Explicit Goal impact | Authoritative Goal only | PASS (B4; missing Goal stated) |
| Investigation priority | Distinct semantics | PASS (B5; live may pick Margin Pressure on that criterion only) |
| Overall importance | No fabricated universal ranking | PASS (B6) |
| Evidence-sufficient criterion | Narrow comparison | PASS (B7 RISK fixture; conversation evidence-strength no overall claim) |
| Evidence-insufficient criterion | No preference + continuation | PASS (B2 + live urgency) |
| No active collection | Clarify subjects | PASS (B8) |
| Unrelated command while pending | Existing interruption | PASS (B9 `show decisions`) |
| FIX3A typo Explain | Read-only Stage-preserving | PASS (B10) |

## Gates

- Focused: 58/58, 0 skipped
- Funnel L1–L3: PASS
- Broad regression: 1318/1318, 0 skipped
- TypeScript: PASS
- Production build: 13/13 pages
- ESLint: 0 errors on FIX3B files; 0 targeted warnings
- git diff --check: PASS
- Live: PASS, page errors 0
- Artifacts: `frontend/artifacts/nxa5/NXA-5-FIX3B/`
- Required tasks: 12 started / 12 passed / 0 failed / 0 running / 0 uninspected
- Nonessential: PID 62339 left running

## Scope preservation

- FIX3A not reopened or weakened (B10 green)
- FIX3C not implemented
- FIX3D1–D4 not implemented
- Final NXA:5-FIX3 milestone not run
- NXA:6 not started
- Previous certifications not revoked
- Unrelated worktree changes preserved

NXA:5-FIX3B-DIAG2 documented separate pre-existing 6.3/NCA:2 defects (`executive` / false evidence copy). They are **outside this certification contract** and were not used to weaken B1–B10.

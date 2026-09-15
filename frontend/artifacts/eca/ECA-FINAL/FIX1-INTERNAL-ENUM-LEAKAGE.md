# NPA-T ECA:FINAL-FIX1 — Manager-Facing Internal Enum Leakage

**Status: CERTIFIED**

Date: 2026-09-14
Parent: ECA:FINAL NOT CERTIFIED (S2 architecture leakage only)

## Diagnosis

| Item | Finding |
| --- | --- |
| Source field | `criterion = "UNSPECIFIED"` (NCA-POST:4 / comparison decisionContext sentinel) |
| Consumer | `judgeEcaExecutiveRecommendation` (ECA:7) |
| Presentation leak | `managerFacingNote`: `because it better matches ${criterion}` when criterion is truthy |
| Meaning of UNSPECIFIED | Internal “no applicable comparison criterion” sentinel — not executive vocabulary |
| Reasoning defect? | No — presentation-only |

NCA-POST:4 already translates the same sentinel (`the requested criterion`). ECA:7 note composition did not.

## Repair

Owning layer: ECA:7 manager-facing note composition (`ecaExecutiveRecommendation.ts`)

- Added `managerFacingCriterionPhrase()` — omits internal sentinels (`UNSPECIFIED`, `UNKNOWN`, `NOT_APPLICABLE`, `NONE`, `UNRESOLVED`, `null`/`undefined` strings); humanizes legitimate criteria (`DELIVERY_IMPACT` → `delivery impact`)
- Applied only to manager-facing note / supporting phrase / change-condition phrasing
- Internal `judgment.criterion` remains `UNSPECIFIED` when that is the contract value
- No second composer/sanitizer engine; no recommendation selection change

## Evidence

| Gate | Result |
| --- | --- |
| Focused FIX1 A–F | PASS (suite 63/63 incl. prior ECA:7) |
| Journey A leakage segment | PASS — `UNSPECIFIED` absent; page errors 0 |
| TypeScript | 0 |
| ESLint (affected) | PASS |
| Production build | Reused prior L4 PASS (presentation-only; live segment verified on next dev with fix) |
| git diff --check | PASS |
| New S0 / S1 | 0 / 0 |
| Remaining S2 leakage | 0 |

## Reused ECA:FINAL evidence (unaffected)

Journey B/C/D · Refresh · Direct probe · NXA L4 7/7 · Data/Causal/Decision/Execution/Outcome/Learning PASS

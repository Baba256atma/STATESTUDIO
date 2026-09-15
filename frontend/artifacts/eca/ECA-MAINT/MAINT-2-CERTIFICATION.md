# NPA-T ECA:MAINT-2 — Awaiting-Decision State & Candidate Parity

**Status: CERTIFIED**

Date: 2026-09-15
Baseline: ECA:FINAL FINAL CERTIFIED · ECA:MAINT-1 CERTIFIED

## Diagnosis

| Question | Answer |
| --- | --- |
| Who creates `Awaiting decision`? | MO-INT compact context from journey `AWAITING_DECISION` |
| Journey rule | `scenariosAvailable && !decisionCommitted` → `AWAITING_DECISION` |
| Canonical meaning | **A — Decision needed** (scenarios available). Not “candidate under review.” |
| Why ECA:8 said no candidate | Correct: no theatre/review/commitment candidate existed |
| Defect type | Misleading manager-facing label (implied B), not a missing candidate |

## Canonical semantics (preserved)

| Concept | Meaning |
| --- | --- |
| `AWAITING_DECISION` (journey) | Decision needed — scenarios available, Decision not committed |
| Compact label (fixed) | **Decision needed** |
| `awaiting-confirmation` (decisionState) | Specific candidate awaiting confirmation → **Awaiting confirmation** |
| `committed` | **Decision approved** |
| Commitment candidate | Theatre review / pending / recommendation option — not implied by journey alone |

Recommendation ≠ commitment candidate ≠ Decision. No candidate fabrication.

## Repair

1. `compactJourneyStatusLabel` / compact context — stop saying “Awaiting decision”
2. ECA:8 no-candidate note when `decisionNeeded` — “A decision is needed on {subject}, but no specific option is currently under review yet.”
3. Orchestrator passes `decisionNeeded` + subject label into ECA:8

No second candidate store/resolver. CC:10/CC:11 untouched.

## Evidence

| Gate | Result |
| --- | --- |
| Focused MAINT-2 | 11/11 PASS |
| MAINT-1 | 10/10 PASS |
| ECA:8 focused | 69/69 PASS |
| Live proof | PASS · page errors 0 · review writes 0 · Approve → 1 Decision |
| TypeScript | 0 |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS |
| NXA L4 | Reused 7/7 |
| New S0 / S1 | 0 / 0 |

ECA:FINAL history preserved.

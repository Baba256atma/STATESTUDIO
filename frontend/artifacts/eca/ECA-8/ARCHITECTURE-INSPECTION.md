# NPA-T ECA:8 — Architecture Inspection

**Phase:** Commitment Dialogue & Pre-Decision Challenge
**Date:** 2026-09-14
**Stop condition:** Inspect + reuse; certify ECA:8 only. Do not start ECA:9.

## Existing ownership (reuse)

| Concept | Authority | Role for ECA:8 |
| --- | --- | --- |
| Subject / context | ECA:1 | Consume fidelity |
| Intent / next action | ECA:2 | Consume; owns next conversational action |
| Initiative | ECA:3 | Consume; ECA:8 is not initiative |
| Information need / ask | ECA:4 | Challenge may surface need; ECA:4 owns ask |
| Answer meaning | ECA:5 | Challenge Yes/No / acceptance interpretation |
| Dialogue objective | ECA:6 | May prepare commitment; ECA:8 owns commitment dialogue |
| Recommendation / readiness | ECA:7 | Consume; do not rerank |
| Decision create/approve | CC:10 / CC:10R | Sole Decision writer |
| Confirmation theatre | DTH:8 | Not replaced |
| Execution | CC:11 | Sole Execution writer |
| Data semantics | DATA-ADV | Risk acceptance ≠ semantic confirmation |
| Preference / proposal / cancel | Existing ECA:2 / CC:10 paths | Reused |

## ECA:8 module

- `frontend/app/lib/nexora-conversation/ecaExecutiveCommitment.ts`
- Entry: `judgeEcaExecutiveCommitment`
- Session: ephemeral `EcaCommitmentSession` (pending target + acknowledged challenge only)
- Overlay: `applyEcaCommitmentToPresentedResponse`

## Commitment / challenge (existing terms)

**Commitment states:** `NONE` | `PREFERENCE` | `INTENT` | `EXPLICIT_COMMITMENT` | `AWAITING_CONFIRMATION` | `CANCELLED`

Maps to prompt EVALUATING / PREFERENCE_EXPRESSED / READY_FOR_COMMITMENT / EXPLICIT_COMMITMENT without a second vocabulary.

**Pre-decision challenges:** `NONE` | `CHALLENGE_CRITICAL_UNKNOWN` | `CHALLENGE_CONFLICT` | `CHALLENGE_UNACKNOWLEDGED_RISK` | `CHALLENGE_TARGET_AMBIGUITY` | `CHALLENGE_RECOMMENDATION_STALE` | `CHALLENGE_CRITERIA_CHANGE` | `CHALLENGE_AUTHORITY_BOUNDARY`

## Boundaries (hard)

- Preference ≠ commitment
- Recommendation acceptance ≠ Decision
- Challenge acceptance ≠ Decision approval
- Uncertainty accepted ≠ uncertainty resolved / DATA write
- No second commitment / confirmation / Decision engine
- No Decision / Execution / Stage / Data / Risk / Goal / Outcome / Learning writes
- Stale Yes / ambiguous `it` / subject switch: no mutation
- CC:10 remains sole Decision writer; CC:11 sole Execution start

## Not introduced

- Second commitment engine
- Second confirmation engine
- Second Decision writer / store
- Autonomous approval mechanism
- Generic challenge workflow

## Layering

ECA:7 owns recommendation + Decision readiness.
ECA:8 consumes that judgment for commitment dialogue and one material challenge.
Valid explicit commitment → handoff to CC:10 only.
ECA:8 mutation count = 0.

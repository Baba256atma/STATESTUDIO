# NPA-T ECA:11 — Architecture Inspection

**Phase:** Outcome Dialogue & Result Assessment
**Date:** 2026-09-14
**Stop condition:** Inspect + reuse; certify ECA:11 only. Do not start ECA:12 / Learning.

## Existing ownership (reuse)

| Concept | Authority | Role for ECA:11 |
| --- | --- | --- |
| Live Execution | ECA:10 / CC:11 / DTH:10 | Precondition context; not Outcome |
| Outcome observation | CORE-OUT:1 / 1A / DTH:11 | Sole Outcome observation authority |
| Learning / reassessment Theatre | DTH:12 | Boundary only; ECA:11 does not write Learning |
| Goal / KPI | Canonical Goal/KPI | Compare only; no write |
| Decision | CC:10 | No revoke / rewrite |
| Data semantics | DATA-ADV | CAP_AV / unknown meaning preserved |
| Causal constraint | CORE-INT:3 / existing causal safety | Attribution stays NOT_ESTABLISHED unless confirmed |
| Answer intake | ECA:5 | Manager report ≠ canonical measurement |
| Ask | ECA:4 | Missing fact may feed ask |
| Dialogue objective | ECA:6 | ASSESS_OUTCOME etc.; ECA:11 supplies assessment |
| Initiative | ECA:3 | Not an alert engine |

## ECA:11 module

- `frontend/app/lib/nexora-conversation/ecaExecutiveOutcome.ts`
- Entry: `judgeEcaExecutiveOutcome` + `projectEcaOutcomeEvidence`
- Session: ephemeral `EcaOutcomeSession`
- Overlay: `applyEcaOutcomeToPresentedResponse`

## Models (existing terms)

**Observation:** `NOT_YET_OBSERVED` | `PARTIALLY_OBSERVED` | `OBSERVED` | `CONFLICTED` | `STALE` | `UNKNOWN`

NOT_YET_ASSESSABLE ≈ `NOT_YET_OBSERVED`; interim ≈ `PARTIALLY_OBSERVED`.

**Overall:** `FAVORABLE` | `UNFAVORABLE` | `MIXED` | `INCONCLUSIVE` | `UNKNOWN`

**Comparisons:** baseline IMPROVED/DETERIORATED/UNCHANGED/UNKNOWN; target MET/EXCEEDED/NOT_MET/UNKNOWN

**Attribution:** always `NOT_ESTABLISHED` in ECA:11 (no causal inflation)

**KPI direction:** higher-is-better default; invert for cost/delay/days measures

## Boundaries (hard)

- COMPLETED ≠ SUCCESS
- Outcome ≠ Execution performance ≠ Decision correctness ≠ Learning
- AFTER ≠ CAUSED_BY
- Learning writes = 0
- No second Outcome / KPI / causal / Learning authority
- Do not start ECA:12

## Minimal extension this phase

Primary/secondary baseline+target comparison invert for `cost|delay|days` measures (reuses existing invert helper; no new engine).

# NXA:5-FIX3B-DIAG2 — Authoritative before/after (Turn B)

Utterance: `I am asking of Executions`  
Machine: `state-audit-turn-B.json`

## Audit table

| Authority | Before | After | Changed? | Authorized? |
| --- | --- | --- | --- | --- |
| Manager assertions / observations | [] | [] | NO | n/a |
| Raw observations | [] | [] | NO | n/a |
| Validated facts (trusted FACT claims) | Status is Risk; Margin Pressure needs attention because Risk | same texts | NO | n/a |
| Evidence records (explanation evidence) | Status is Risk. | same | NO | n/a |
| Hypothesis / causal-candidate **store** | 4 HYPOTHESIS claims about Margin Pressure | same texts/confidence | NO | n/a |
| Assumption/uncertainty | UNKNOWN “No outcome has been measured yet.” | same | NO | n/a |
| Problem investigation thread | null | null | NO | n/a |
| Active subject | Margin Pressure | Margin Pressure (id ctx-problem-margin) | NO | leftover from show problems |
| Active collection | problem | problem | NO | leftover |
| 6.3 pending | Problems choice loop 0 | same question loop 1 | YES | 6.3 re-ask only |
| NCA:2 pending | FREE_TEXT ACTIVE | null | YES | **NO** |
| NCA:2 lastAnswer | null | FREE_TEXT display of the utterance | YES | **NO** |
| Active comparison | inactive | inactive | NO | n/a |
| Dialogue move | ASK_MANAGER | ANSWER_NEXORA | YES | **NO** for this utterance class |
| Goal context | persisted false, constraints Margin Pressure | same | NO | n/a |
| Data Reality | not written | not written | NO | n/a |
| Decision / Execution executive context | execution null | execution null | NO | n/a |
| Session memory (NCA:2 answeredMissing) | [] | [advisory-context] | YES | **NO** |
| Durable memory | persisted false | persisted false | NO | n/a |
| Advisor copy | — | capacity-pressure sentences | YES | **NO** |
| Presentation instruction | — | NONE / NO_CHANGE | NO | yes |
| Navigation trail / DIR | — | NO_CHANGE | NO | yes |

## Persistence

No evidence ID, provenance timestamp, or Data Reality write. Change does **not** require rollback of evidence. NCA:2 lastAnswer is session conversation state; it does not survive a new empty session. **No containment blocker.** Do not run destructive cleanup.

## Answers required by the mission

- Authoritative evidence state change: **NO**
- Hypothesis state change: **NO**
- Durable memory change: **NO**
- Only Advisor copy: **NO** (NCA:2 dialogue mutated; evidence/hypothesis did not)

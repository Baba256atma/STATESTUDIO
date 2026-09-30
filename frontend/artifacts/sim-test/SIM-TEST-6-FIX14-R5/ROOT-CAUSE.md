# SIM-TEST:6-FIX14-R5 Root Cause

## Stop condition

R5 is certifiable only if `Show the risk problem.` remains unresolved at FINAL:6.1, cold-start FOCUS clarifies rather than silently selecting Margin Pressure or Risk, established bare-kind deictics remain unchanged, FIX10–R4 regression stays green, and NXA Levels 1–4 are run before FIX14 status is decided. Smart Clarification and Trusted Communication remain out of scope unless the same 6.1 seam is proven.

## Pre-repair (R4 Level 4) vs post-repair NLU

| Case | Expected 6.1 | Actual before R5 | Actual after existing R5 interpreter repair | First wrong seam before R5 |
| --- | --- | --- | --- | --- |
| `Show the risk problem.` | FOCUS, unresolved `multiple-objects`, candidates `[ctx-problem-capacity, ctx-problem-margin, obj-risk]` | Unique wrong referent (Margin Pressure) | Unresolved; candidates `obj-risk`, `ctx-problem-margin`, `ctx-problem-capacity` | `isDeicticKindAlias` treated `the risk` as a complete kind alias even when the next token was another kind (`problem`) |
| Cold-start run of the same utterance | `clarify` | Silent unique proceed | `clarify` | Same 6.1 alias collapse, then 6.3 had nothing to gate |
| `Show the risk.` | Unique `obj-risk` | Unique `obj-risk` | Unique `obj-risk` | None |
| `Show the problem.` | Unresolved problems only | Unresolved problems | Unresolved `[ctx-problem-capacity, ctx-problem-margin]` | None |
| `Show Risk.` then `Show the risk problem.` | NLU still unresolved (3 mixed-kind candidates) | N/A (compound already collapsed at 6.1) | NLU unresolved, 3 candidates, `objectReference=null` | NLU is repaired. Clarification `proceed` / reason `NONE` is 6.3 `TYPE_AMBIGUITY` skip when a continuity thread already exists |

## Layer audit

- FINAL:6.1 `interpretCanonicalManagerMeaning` now refuses a deictic kind alias when the token after `the <kind>` is itself a kind token (`KIND_TOKEN`). Adjacent kind words therefore keep every materially plausible canonical candidate.
- Cold-start 6.3 still clarifies that mixed-kind FOCUS set (`TYPE_AMBIGUITY` with empty thread).
- After `Show Risk.`, NLU is still unresolved. `evaluateClarificationGate` then returns `required: false` because mixed subject kinds classify as `TYPE_AMBIGUITY` and the existing skip fires when `activeSubjectId` or `continuity.thread.length > 0`.
- That skip is the same 6.3 owner as R4 Level 4 `Explain that.` false-negative proceeds. It is not the 6.1 alias function.

## Classification

- A/B for the original R4 NLU blocker (`Show the risk problem.` unique Margin Pressure): **SAME-ROOT**, repaired at `canonicalManagerMeaningInterpreter.ts` (`isDeicticKindAlias` + `KIND_TOKEN`). No additional production change in this validation pass.
- After-Risk `clarify` vs `proceed`: **INDEPENDENT** 6.3 `TYPE_AMBIGUITY` skip-with-thread. Same cluster as remaining Smart Clarification Level 4 failures. Not repaired here.
- Trusted communication verbosity: **INDEPENDENT** 6.4. Not repaired here.
- New authority/store: **NO**.
- Phrase/turn/journey hard coding: **NO**.
- Ground Truth leakage: **NO**.

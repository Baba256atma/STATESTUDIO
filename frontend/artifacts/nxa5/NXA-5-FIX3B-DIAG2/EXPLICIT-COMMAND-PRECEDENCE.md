# NXA:5-FIX3B-DIAG2 — Explicit-command precedence

## Vocabulary (existing CC:1 / POST:2)

Supported when the noun is `execution` / `executions`: `show execution`, `show executions`, `show me execution`, `show me executions`, `show all executions` (and open/list/see variants).

**Not** matched: `show all executive` (noun `executive`).

Singular `execution` **is** normalized to collection kind EXECUTION in POST:2.

## Precedence order actually observed

1. FINAL:6.3 `interpretClarificationTurn` **before** command mapping when `pendingClarification` is set.  
   Collection intents are **not** treated as `isNewCompleteRequest`.  
   `show-execution` is **not** in the pending-cancel intent list (`commit|prefer-option|start-execution|confirm-decision`).
2. NCA:2 short-answer **does** yield to `show…` prefixes.
3. After 6.3 `proceed`/`fail` still reaches `finish()`, POST:3 + DIR can apply. Fail copy can still be the Advisor text while DIR mutates Stage (`shouldCommitRuntime || mutationRequired`).

## Traces

| Utterance | Pending 6.3 before | CC:1 | 6.3 action | DIR | Advisor |
| --- | --- | --- | --- | --- | --- |
| show me execution (seq) | Problems choice loop 1 | show-execution | fail | SHOW_COLLECTION | fail sentence |
| show executions (D1) | none | show-execution | clarify COMMITMENT | SHOW_COLLECTION | Which decision do you want to approve? |
| show executions (D7) | none (FIX3B NCA:2 PRIORITY) | show-execution | clarify COMMITMENT with Problem names | SHOW_COLLECTION | Which decision do you mean — Margin Pressure or Capacity Gap? |

Explicit current-turn collection **must not** be weakened only to preserve a stale 6.3 pending question. NCA:2 already implements a weaker form of that rule for `show`.

# Clarification Lifetime (as implemented)

Existing owners: FINAL:6.2 continuity + FINAL:6.3 `interpretClarificationTurn`. No second state machine.

Created: 6.3 gate `required: true` (including named historical return with `provenance: UNRESOLVED` → `MISSING_SUBJECT`).

Continued: pending exists, turn is not a complete/superseding request, and the utterance does not match a candidate.

Resolved: manager names a candidate / supplies the missing subject / 6.3 `resume`.

Superseded: pending exists and the turn is independently resolvable (COMPARE; evidence/data-change; empty-candidate `MISSING_SUBJECT` plus decision/execution/outcome or return/go-back; canonical collection/status intents). Action `proceed` with `cancelled: true`, `pending: null`.

Cancelled: existing cancel utterances (`never mind`, `forget it`, `forget that`, …).

Does not use turn-count TTL. Does not clear after every Nexora answer. Does not clear on every topic switch.

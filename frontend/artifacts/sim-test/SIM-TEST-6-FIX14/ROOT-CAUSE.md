# SIM-TEST:6-FIX14 Root Cause

## Pre-repair trace

| Turn | Utterance | S1 | Canonical subject | Resolver provenance | NCA/Advisor subject | Expected | First failure point |
|---|---|---|---|---|---|---|---|
| T3 | `Capacity. Details.` | SUBJECT_LOSS | null | FINAL:6.2 `EXPLICIT_CURRENT_TURN` → Capacity | Capacity | Select Capacity without clarification | CC:1 returned `unknown` with no target hint; CC:2 therefore received no target |
| T8 | `Go with B.` | MISSING_DECISION | null | `UNRESOLVED` | Advisor name Capacity; no referent ID | Commit only after a valid scenario candidate reaches CC:10 | Independent CC:1 gaps: T6 `Options.`, T8 `Go with B.`, and T9 `Yes. Decide.` were `unknown`; no scenario candidate or Decision handoff existed |
| T16 | `Capacity again.` | STALE_REFERENT | Delivery | FINAL:6.2 `EXPLICIT_CURRENT_TURN` → Capacity | Capacity | Return to Capacity | Independent terse-return gap begins at T14 `Back to capacity.`; CC:1 stayed `unknown`, so canonical/Stage remained Delivery |
| T30 | `The previous one.` | ADVISOR_DIVERGENCE | Capacity | FINAL:6.2 `CONTEXT_PREVIOUS_SUBJECT` / `backtrack` → Inventory | Inventory | Canonical selection and Advisor both move to Inventory | Independent post-CC:2 synchronization gap: CC:2, FINAL, Manager Object, and Advisor select Inventory, but next executive canonical/Stage remain Capacity |
| T31 | `Anything else?` | ADVISOR_DIVERGENCE | Capacity | FINAL:6.2 `CONTEXT_ACTIVE_SUBJECT` with stale Inventory referent | Inventory | Consume the same canonical subject | Downstream of T30's split state |

## Clusters

### Cluster A — repaired in FIX14

- Turns: T3.
- Root cause: CC:1 did not recognize the generic terse grammar `<named subject>. Details.` even though FINAL:6.1/6.2 correctly resolved the explicit current-turn subject.
- Earliest failure: T3 at CC:1.
- Owning seam: `matchFocusOrOpen` in the existing CC:1 intent authority.
- Classification: profile-specific stress exposure of a core continuity defect.

### Cluster B — independent, not repaired

- Turns: T8, with causal precursors at T6 and T9.
- Root cause: terse scenario/commitment turns remain unrecognized by CC:1, so no valid scenario candidate reaches existing CC:9/CC:10 authorities.
- Earliest failure: T6 `Options.`; observed S1 at T8.
- Owning seam: existing CC:1 scenario/commitment grammar and its existing CC:9/CC:10 handoff.
- Decision-layer shortcut is not justified; CC:10 correctly refuses to create a Decision without a valid handoff.

### Cluster C — independent, not repaired

- Turns: T16, with first authoritative divergence at T14.
- Root cause: terse named return forms are understood by FINAL/NCA but do not reach canonical selection; Delivery remains canonical.
- Earliest failure: T14 `Back to capacity.`; observed S1 at T16.
- Owning seam: existing CC:1/canonical named-return path.

### Cluster D — independent plus downstream, not repaired

- Turns: T30 root, T31 downstream.
- Root cause: T30 resolves Inventory in CC:2, FINAL continuity, Manager Object, and Advisor, while the executive canonical context and Stage remain Capacity.
- Earliest failure: T30 after CC:2 resolution, at canonical executive-context/runtime synchronization.
- Owning seam: existing canonical context update path; Advisor is only the observed symptom.

No Observer or test-expectation errors were found. The manager supplied enough information at T3, T8, T16, and T30 for the indicated semantics; these are core weaknesses exposed by terse profile behavior.

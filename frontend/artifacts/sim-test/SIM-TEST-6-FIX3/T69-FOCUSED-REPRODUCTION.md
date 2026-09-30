# T69 focused reproduction

## Signatures

- Manufacturing pre-FIX3: `fnv1a32:3a9632c8`
- Manufacturing post-FIX3: `fnv1a32:f699cf3e`
- Focused T69 pre-FIX: `fnv1a32:ebe7d36d` (S1 T69 STALE_REFERENT + T71 WRONG_REFERENT)
- Focused T69 post-FIX: `fnv1a32:75cb0657` (T69 gone; T71 remains)

## Minimum required history

Turns 1–68 of manufacturing-long, especially:

- T64 locative Delivery (FIX2)
- T65 return to Capacity
- T68 unknown Schedule clarification (`Which one do you want me to look at?`)

## T69

- Utterance: Go back to the supplier problem.
- Canonical subject before: obj-capacity
- Referent before: Capacity
- Expected: unknown Supplier → clarify / not-found; do not silently keep Capacity as if it were the named return
- Candidate referents: no catalog Supplier; 6.2 named return UNRESOLVED
- Selected referent pre-FIX: Capacity (conversation continued)
- Selection reason pre-FIX: 6.3 superseded T68 pending via `go back` and proceeded without re-running the named-target gate
- First divergence: FINAL:6.3 `isNewCompleteRequest` proceed/cancel skipped `namedTargetUnresolved` clarification
- Earliest owner: FINAL:6.3 clarification resolver
- Repair: unresolved previous-referent after pending supersession re-enters the gate
- Referent after: still Capacity (not fabricated Supplier); `clarificationRequired=true`
- Result: no STALE_REFERENT; Decision 1; Execution 1

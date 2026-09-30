# Root cause

## Why T69 occurred

T68 asked for an unknown Schedule and opened empty-candidate MISSING_SUBJECT clarification. T69 “Go back to the supplier problem.” matched FIX1 independently-resolvable `go back`, so 6.3 cleared pending and proceeded. 6.2 had already marked the Supplier return UNRESOLVED. Proceed skipped that gate, so Capacity remained current without acknowledging the unknown name. Observer `STALE_REFERENT` (RETURN_TO_SUBJECT intended Supplier, referent Capacity, no clarification).

## Where the stale referent originated

Not a new referent store. Current Capacity remained current because the unresolved named return never reached clarification.

## Why short sessions hid it

Unit tests for unknown Supplier often start without a live pending clarification, so the namedTargetUnresolved gate already fires. The long session stacked FIX1 supersession in front of that gate.

## Why the seam is 6.3

The 6.2 unresolved named-return contract already existed. FIX1’s proceed-on-go-back was correct for known returns and comparison, but must not skip the unresolved-named-return clarification path.

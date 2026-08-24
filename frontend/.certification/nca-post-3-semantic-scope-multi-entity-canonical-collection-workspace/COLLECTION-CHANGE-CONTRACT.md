# Collection change contract

`ExecutiveCollectionDelta` is conversational, not a durable history database.

- previousMembers / currentMembers from NCA:2 `lastCollection` snapshot vs canonical membership
- added / removed / retained
- explanationAvailability KNOWN | PARTIAL | UNKNOWN

Change questions (disappear, removed, no longer, what changed) are `COLLECTION_CHANGE_EXPLANATION`, not investigate-the-object.

If no previous snapshot: cannot verify removal.

If membership unchanged but the named item is still canonical: presentation/filter/focus change, not “no longer a Problem.”

If membership changed and reason unknown: observe the delta; do not invent a cause; do not append investigation, NCA:3, or NCA:4.

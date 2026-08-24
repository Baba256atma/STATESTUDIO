# Multi-reference contract

`ManagerReferenceSet` extends (does not replace) single-subject continuity:

- `primary`, `secondary`
- `references[]` (longest-name-first, nested names such as Capacity vs Capacity Gap de-duplicated)
- `relationshipIntent` when a relation cue is present and at least two references survive

When the manager intentionally names multiple references, interpretation preserves them. Silent collapse to one reference is forbidden unless the manager asks for clarification.

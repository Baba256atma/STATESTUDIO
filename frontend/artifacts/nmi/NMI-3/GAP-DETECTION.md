# NPA-T NMI:3 — Gap detection

`ManagementRelationshipGapReport` lists incomplete management understanding around a focal node.

Reasons:

- MISSING_RELATIONSHIP
- MISSING_EVIDENCE
- AMBIGUOUS_TARGET
- UNKNOWN_CONTEXT
- UNSUPPORTED_CAUSAL_LINK
- CANONICAL_REFERENCE_MISSING

Example: three Scenarios exist with no `addresses` edge to a Problem → MISSING_RELATIONSHIP. NMI does not connect them.

Disconnected valid nodes remain listed and valid.

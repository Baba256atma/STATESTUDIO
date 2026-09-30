# SIM-TEST:6-FIX9 Certification

Status: **CERTIFIED**

SIM-TEST:6 recertification: **STILL NOT CERTIFIED**

- T89 `The first one.` after T88 Inventory switch had no legitimate ordinal collection; NCA:2 still resolved `lastCollection[0]` as Capacity Gap
- Expected semantics before patch: **ORDINAL_HAS_NO_VALID_COLLECTION** (clarify; do not guess Inventory or stale Capacity Gap)
- Repair: NCA:2 lastCollection ordinal eligibility + explicit-switch supersession of `establishedAtTurn`; ECA no longer uses stale listed/scenario pools as a generic first-one fallback
- Return utterances such as `Go back to the first decision…` are not treated as collection ordinals
- T88 Inventory subject/referent/Stage preserved; Decision/Execution identity unchanged
- Manufacturing remaining S1: T92 WRONG_REFERENT
- Production build / browser: NOT RUN — final certification deferred

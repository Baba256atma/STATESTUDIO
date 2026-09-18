# NPA-T NMI:6 — Projection budget

`NMI_STAGE_PROJECTION_BUDGET`:

- PRIMARY: 1
- DIRECT: 8
- ROADMAP: 8
- SUPPORTING: 6
- maxNodes: 16

Fill order: PRIMARY → DIRECT → ROADMAP → SUPPORTING, IDs sorted lexicographically.

If more relevant nodes exist:

- preserve canonical identity
- truncate deterministically
- record `omittedNodeIds` / `omittedCount`
- never silently replace the anchor

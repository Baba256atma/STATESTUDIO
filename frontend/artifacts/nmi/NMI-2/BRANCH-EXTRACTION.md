# NPA-T NMI:2 — Branch extraction

`extractNmiManagementBranch` is a bounded, deterministic neighborhood projection around a selected map node.

It is not the NMI:4 Decision Roadmap and not NMI:6 Stage projection.

Rules:

- traverse only existing map relationships (undirected neighborhood, directed records preserved)
- configurable `maxDepth` (default 6)
- canonical IDs preserved
- no invented nodes or relationships
- unresolved relationship IDs from the source map remain unresolved
- already-visited nodes are not re-expanded; a distinct closing edge sets `cycleEncountered`
- depth limit sets `truncatedByDepth`
- missing origin returns `originPresent: false` and an empty branch

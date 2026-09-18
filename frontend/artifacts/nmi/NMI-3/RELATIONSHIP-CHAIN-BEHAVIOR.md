# NPA-T NMI:3 — Relationship-chain behavior

`extractNmiRelationshipChain` is a bounded, deterministic neighborhood of existing edges.

- configurable `maxHops`
- optional kind filter
- no invented intermediate relationships
- each hop keeps original semantic direction
- missing origin yields an empty chain

This is not the NMI:4 Decision Roadmap.

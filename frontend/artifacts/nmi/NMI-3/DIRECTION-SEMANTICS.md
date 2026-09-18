# NPA-T NMI:3 — Direction semantics

Canonical direction is `fromId → toId`.

`Problem → threatens → Goal` is not equivalent to `Goal → threatens → Problem`.

NMI:2 branch extraction may walk either endpoint for discovery.

NMI:3 chain hops record:

- `traversal`: FORWARD or REVERSE relative to the walk
- `semanticSourceId` / `semanticTargetId`: original NMI:1 direction
- interpretation meaning always uses the original direction

Reverse navigation is exploration, not semantic inversion.

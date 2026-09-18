# NPA-T NMI:1 — Unified Business/Project contract

`UnifiedManagementModel` is a read-oriented representation of the current Business or Project.

- Context kinds: `BUSINESS` | `PROJECT` | `HYBRID` | `UNKNOWN` from BCA:1.
- Nodes are `NmiCanonicalRef` (id, kind, authority, sourceRef). Full entities are not copied into an NMI store.
- Missing node kinds remain listed in `missingNodes`. They are not fabricated.
- Decision roadmap is reserved (`implemented: false`) and allows incomplete, multiple, competing, and unresolved paths.

Composer: `composeNmiUnifiedManagementModel`.

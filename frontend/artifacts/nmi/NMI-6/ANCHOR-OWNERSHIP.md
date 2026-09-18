# NPA-T NMI:6 — Anchor ownership

Invariant: `selectedCanonicalId === projectionAnchorId` unless the manager explicitly selects another subject.

Newest valid explicit canonical selection wins (`resolveNmiExplicitSelection`).

Stale Queue, Stage, Advisor, and comparison IDs are ignored.

Director receives the same ID. Stage CENTER/focus must remain that ID after handoff.

Do not substitute another Problem, first Scenario, latest Decision, stale Queue member, prior conversation referent, or collection default.

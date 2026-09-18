# NPA-T NMI:2 — Scope behavior

Scope is a read filter over the same `UnifiedManagementModel`. It is not a second Focus authority.

Supported scopes:

- ENTIRE_CONTEXT
- ENTIRE_BUSINESS (BUSINESS and HYBRID-lane nodes)
- ENTIRE_PROJECT (PROJECT and HYBRID-lane nodes)
- GOAL / PROCESS / PROBLEM / RISK / SCENARIO / DECISION / EXECUTION

A node-scoped map with `nodeId` includes that node and existing 1-hop neighbors. It does not invent a connected graph.

Relationships with an endpoint outside the scoped node set are listed in `outOfScopeRelationshipIds` and are not deleted from the source model.

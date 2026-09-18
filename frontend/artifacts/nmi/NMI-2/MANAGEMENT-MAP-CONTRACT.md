# NPA-T NMI:2 — Management Map contract

`ManagementMap` is a read-only projection of a certified NMI:1 `UnifiedManagementModel`.

Composer: `composeNmiManagementMap`.

Identity: `NPA-T NMI:2/BusinessProjectManagementMap`.

The map:

- references canonical IDs already present on the model
- does not copy canonical entities into an NMI store
- does not invent nodes or relationships
- preserves `unresolvedRelationshipIds`
- records `missingSections` when a section has no nodes
- is scoped as a filter over the same model (`NmiManagementMapScope`)

NMI:2 does not implement Decision Roadmap, Attention, or Queue UI.

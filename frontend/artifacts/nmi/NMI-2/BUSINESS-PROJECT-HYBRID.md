# NPA-T NMI:2 — Business / Project / Hybrid behavior

Context kinds remain BCA:1:

- BUSINESS: nodes inherit BUSINESS unless annotated otherwise. Sections may describe operations, Goals, and performance.
- PROJECT: nodes inherit PROJECT. Sections may describe project Goals, work/process, Risks, Scenarios, and Decisions.
- HYBRID: `hybridLanes` keep BUSINESS, PROJECT, HYBRID, and UNKNOWN node IDs distinct (`flattened: false`). Unannotated HYBRID nodes stay UNKNOWN. They are not guessed into Business or Project.
- UNKNOWN: map `contextKind` stays UNKNOWN. No Business/Project promotion.

Manager-readable projection for HYBRID renders separate context lanes rather than one collapsed tree.

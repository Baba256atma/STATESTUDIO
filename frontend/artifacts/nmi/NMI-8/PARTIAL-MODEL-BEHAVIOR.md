# NPA-T NMI:8 — Partial Model Behavior

The live model renders with incomplete company knowledge.

- Business known, Goals unknown: CONTEXT/GOAL sections empty or Goal omitted if MO association is absent
- Goal known, KPI missing: `missingNodes` includes KPI; roadmap KPI_DATA is MISSING
- Problem known, relationship unresolved: no invented edges from Stage context links
- Scenarios / Decision / Execution / Outcome absent: kinds omitted; roadmap uses MISSING / NOT_REACHED as NMI:4 already does

Nexora does not wait for a complete company model and does not manufacture missing structure.

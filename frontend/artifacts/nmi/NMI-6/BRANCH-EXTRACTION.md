# NPA-T NMI:6 — Branch extraction behavior

Reuse `extractNmiManagementBranch` (NMI:2) with `maxDepth: 4`.

Then:

1. Classify 1-hop as DIRECT.
2. Compose NMI:4 roadmap for the same anchor; keep only element IDs already in the branch (except CONTEXT dump).
3. Remaining evidence/analysis kinds become SUPPORTING.
4. Interpret included edges with NMI:3. Do not invent missing edges.

Conceptual patterns (not hard-coded scene templates):

- Goal → KPI/Data → Problems/Risks
- Problem → Goal / KPI / Variables / Scenarios / Decision state
- Decision → Scenario → Execution → Outcome
- Execution → Decision → KPI/Data → Outcome

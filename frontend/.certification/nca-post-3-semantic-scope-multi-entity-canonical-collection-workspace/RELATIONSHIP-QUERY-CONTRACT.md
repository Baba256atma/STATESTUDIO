# Relationship-query contract

Need conceptually: `UNDERSTAND_RELATIONSHIP` with Reference A and Reference B.

Truth kinds (existing catalog edges only; no invented graph):

- DIRECT_RELATIONSHIP — Stage `relationships`
- ASSOCIATED — context links
- INDIRECT_RELATIONSHIP — one-hop path, labeled indirect
- NO_REGISTERED_RELATIONSHIP
- CAUSALITY_UNKNOWN — connection is never stated as cause

A connected to B ≠ A causes B. The authority must evaluate A ↔ B, not substitute a convenient neighbor of A.

# NPA-T NMI:6 — Relevance rules

Deterministic tiers:

| Tier | Meaning |
| --- | --- |
| PRIMARY | The selected canonical subject. Never omitted. |
| DIRECT | 1-hop neighbors through supported NMI:1 relationships that also appear in the NMI:2 branch. |
| ROADMAP | NMI:4 Decision Roadmap elements that are already in the bounded branch and are not PRIMARY/DIRECT. CONTEXT/company dump is excluded. |
| SUPPORTING | Remaining branch KPI / Data / Variable / Learning needed to understand the subject. |

Unrelated nodes in the same company (no canonical relationship into the branch) are excluded.

No arbitrary priority scoring.

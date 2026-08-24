# Semantic scope contract

Classification happens in NCA:1 before NCA:3 gap reasoning.

`NexoraSemanticScope`:

| Scope | Meaning | NCA:3 |
| --- | --- | --- |
| BUSINESS | Outcomes, KPIs, problems, scenarios, decisions | eligible |
| NEXORA_PRODUCT | What Nexora / Stage / Advisor / object / menu is | blocked |
| CURRENT_WORKSPACE | What is on Stage, focused, visible, in queue | blocked |
| PRODUCT_ACTION | Can you / add / create / delete (capability or action) | blocked |
| HELP_TEACH | How do I use… (existing NCA:6 / NEX-EXP teach copy) | blocked |
| MIXED | Compatible clauses (e.g. explain Stage + what is on it) | blocked for the non-business clauses |
| UNKNOWN | Empty / unclassifiable | not a generic outcome fallback |

NCA:3 eligible only when `scope === BUSINESS`.

Business-outcome copy is allowed only when the need family is UNKNOWN, the scope is BUSINESS, and existing copy is unknown-intent — not as a generic fallback.

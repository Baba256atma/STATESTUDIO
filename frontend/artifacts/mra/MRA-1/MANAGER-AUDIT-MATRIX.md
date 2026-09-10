# MRA:1 — Manager Audit Matrix

Date: 2026-09-09

Each row is a manager workflow, not a phrase table. Seeds are from the MRA:1 brief. Results are from `runtime-turns.json`.

Legend: **Pass** = manager-usable; **Partial** = works with material friction; **Fail** = manager cannot reliably complete.

| ID | Dimension | Workflow | Result | Failure IDs |
| --- | --- | --- | --- | --- |
| A1 | Natural conversation | `show me all problems` | Pass | — |
| A2 | Natural conversation | `what is Capacity Gap?` / `explain it` / `why?` | Partial | 030 |
| A3 | Natural conversation | `which one is important?` | Partial | asks criterion (good) then later routing fails |
| A4 | Natural conversation | `what should I do?` | Fail | 013 |
| A5 | Natural conversation | `no, I mean the execution` | Fail | 015 |
| A6 | Natural conversation | `show me what is on Stage` after mixed thread | Fail | 005 |
| A7 | Natural conversation | Typos `show problms`, `capcity gap` | Partial | 006, 016 |
| A8 | Natural conversation | Bare `Capacity Gap`, `why`, `and the other one?`, `now risks` | Fail | 007, 017 |
| B1 | Context continuity | Show problems → focus Capacity Gap → why it | Partial | leftover recommendation on focus |
| B2 | Context continuity | Switch to Demand Surge → `investigate it` | Fail | 008 |
| B3 | Context continuity | `the first problem` | Fail | 009 |
| B4 | Context continuity | Explain Capacity Gap → scenarios → back to problems → `explain it` | Fail | 018 |
| C1 | Stage ↔ Advisor | `what is on stage?` Overview | Pass | — |
| C2 | Stage ↔ Advisor | Focus Risk → `what is on stage?` | Pass | — |
| C3 | Stage ↔ Advisor | `show me what is on Stage` after Risk focus | Fail | 005 |
| C4 | Stage ↔ Advisor | Problems collection vs leftover Risk Watch actor | Partial | 024 |
| D1 | Collections | Problems, Scenarios, Decisions, Executions SHOW | Pass | — |
| D2 | Collections | Count / critical filter | Partial / Fail | 023, 028 |
| D3 | Collections | Goals, KPIs, Evidence, Outcomes, Data Objects | Fail | 012 |
| D4 | Collections | Risks SHOW | Partial | 029 |
| D5 | Collections | Collection vs focus (`show me all problems` while focused) | Pass | — |
| D6 | Collections | Related-to filter | Partial | related list is self-only |
| D7 | Collections | Unknown problem name | Fail | 003 |
| E1 | Knowledge vs nav | `What is Capacity Gap?` no focus write | Pass | — |
| E2 | Knowledge vs nav | `Show Capacity Gap.` focuses | Partial | 021 |
| E3 | Knowledge vs nav | Why happening | Partial | stacked copy |
| E4 | Knowledge vs nav | `Add this as a Risk` | Partial | 019 |
| E5 | Knowledge vs nav | `Approve Scenario B` | Partial | asks which option + challenge (good) |
| F1 | Missing information | Hire for Capacity Gap | Partial | broken slots 022 |
| F2 | Missing information | `I don't know` on demand persistence | Pass | proceeds with uncertainty |
| F3 | Missing information | Blocking delivery + I don't know owner | Fail | 025 |
| G1 | Recommendation | Cold `What should I do?` | Fail | 013 |
| G2 | Recommendation | After named catalog compare | Partial | compare honest; recommend still temporary capacity |
| G3 | Recommendation | Scenario A/B language | Fail | 014 |
| G4 | Recommendation | `Are we ready to decide?` | Partial | 026 |
| H1 | Mutation | Add Supplier Delay / Add it | Pass | canonical Risk writer |
| H2 | Mutation | Reject `No.` | Pass | — |
| H3 | Mutation | Correction of proposal | Fail | 020 |
| H4 | Mutation | Topic change after proposal | Partial | collection SHOW; proposal dropped in snapshot |
| H5 | Mutation | `yes` after proposal | Pass (writer) | process-global Risk may already exist |
| H6 | Mutation | Casual `this is also a risk` | Pass (no silent write) | not understood |
| H7 | Mutation | `make Capacity Gap a goal` | Partial | 027 |
| H8 | Mutation | `delete Margin Pressure` | Fail | 004 |
| I1 | Decision path | Problem → evidence → scenarios → compare | Partial | evidence/compare weak |
| I2 | Decision path | `Approve Demand Surge` | Fail | 001, 002 |
| I3 | Decision path | Preference `I prefer Scenario A` | Pass | preference ≠ Decision |
| I4 | Decision path | `Choose it` / `Yes` | Pass | no false commit |
| I5 | Decision path | Approve without evidence (`Scenario B`) | Partial | clarification + challenge |
| J1 | Execution | `start it` with no Decision | Pass | refuses |
| J2 | Execution | After conversational Approve | Fail | 001 |
| J3 | Execution | Owner / blocker / off track / what changed | Fail | Outcome clarification / not-found |
| K1 | Outcome | Manager 91%→94% observation | Pass | not verified evidence |
| K2 | Outcome | `did the decision cause that?` | Pass | not causality |
| K3 | Outcome | `what did we learn?` / `are we done?` | Partial | honest insufficient; extra Outcome ask |
| L1 | Adversarial | Invented object | Fail | 003 |
| L2 | Adversarial | Causal overclaim + approve | Pass | hypothesis, no cause |
| L3 | Adversarial | Unrelated then `explain it` | Partial | returns to Margin Pressure |
| L4 | Adversarial | Architecture leak on weather / first problem | Fail | 009 |
| L5 | Adversarial | Contradictory importance | Fail | never records manager judgment |
| L6 | Adversarial | Repeat show problems | Pass | — |
| M1 | Data | Inventory pending/committed/empty | Pass | — |
| M2 | Data | Explain pending CSV, BKL, KPI math | Pass | — |
| M3 | Data | Follow-ups on fields / “from it” | Fail | 011 |
| M4 | Data | Support Capacity Gap | Fail | 010 |
| M5 | Data | `explian Data` | Pass | — |

## Trust audit (dimension 12)

| Question | Finding |
| --- | --- |
| Clarity | Frequent template holes and internal codes (`MANAGER AUTHORITY REQUIREMENT`). |
| Relevance | Stage SHOW, data-support, and “first problem” answers the wrong question. |
| Context | Pronouns and topic switches often lose the last valid subject. |
| Evidence | Causality and pending CSV are often honest; Problem “support” questions are not data-grounded. |
| Uncertainty | Compare-insufficient is honest; ECA:7 READY vs spoken uncertainty conflict. |
| Actionability | “Temporary capacity” is not a Stage object the manager can open. |
| Safety | No silent Execution; Risk create is confirmation-gated; Decision Apply on Approve is the main action risk. |
| Consistency | Stage META vs SHOW; CC:10 applied vs ECA:9 none; collection vs leftover Stage actors. |
| Professionalism | Debugger/architecture vocabulary reaches the manager. |

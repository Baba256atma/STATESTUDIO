# MRA:3 — Manager Trust Scores

Date: 2026-09-09

Scale: 5 Manager-ready · 4 minor friction · 3 material friction · 2 major difficulty · 1 largely unusable · 0 unsafe/broken.

Dimensions not heavily exercised in a journey are scored from observed related turns in that same conversation (not assumed 5).

| Simulation | Understanding | Context | Data | Stage | Rec | Evidence | Decision | Execution | NL quality | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| J1 orientation (C) | 2 | 3 | 3 | 4 | 2 | 3 | 3 | 3 | 2 | **2** |
| J2 investigation (A) | 2 | 2 | 3 | 3 | 2 | 2 | 3 | 3 | 2 | **2** |
| J3 data (A) | 3 | 2 | 4 | 3 | 3 | 3 | 3 | 3 | 3 | **3** |
| J4 scenarios (B) | 3 | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | **2** |
| J5 rec challenge (B) | 4 | 3 | 3 | 3 | 4 | 4 | 3 | 3 | 4 | **4** |
| J6 decision (C) | 3 | 3 | 3 | 3 | 3 | 3 | 4 | 3 | 3 | **3** |
| J7 execution (C) | 3 | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 3 | **4** |
| J8 deviation (B) | 2 | 2 | 3 | 3 | 2 | 3 | 3 | 2 | 2 | **2** |
| J9 outcome (C) | 3 | 2 | 3 | 3 | 2 | 3 | 3 | 3 | 3 | **3** |
| J10 mutation (A) | 3 | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | **2** |
| LONG-50 | 2 | 2 | 4 | 4 | 3 | 3 | 3 | 3 | 2 | **2** |
| NAV-stress | 2 | 2 | 3 | 2 | 3 | 3 | 3 | 3 | 3 | **2** |
| Live CSV (B) | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 3 | **3** |
| Live Decision/Execution | 3 | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 3 | **4** |

**Average overall (14 rows): 2.8.**  
**Lowest overall: 2.**

## Evidence for every score below 4 (overall or driving dimension)

- **J1 Understanding/NL 2:** Entrance “I'm Sam. I own this business.” asked which outcome; “whats the goal here” matched “Goal Here”; “no I mean the problems we actually have” attached to Margin Pressure as an observation.
- **J2 Context 2:** `look at capcity` focused KPI Capacity; after correctly naming the first Problem, `explain it` explained Margin Pressure.
- **J3 Context 2:** Required CSV explain succeeded; `what fields are confirmed?` and manager semantic correction left the Data path.
- **J4 Context 2:** `explain the second one` described Capacity Expansion Plan (first listed Scenario).
- **J6 NL 3:** After Approve, `is that approved?` asked scenario vs KPI.
- **J8 Execution/NL 2:** Delay utterance not absorbed; `Should we change the plan?` leaked `ECA:10`.
- **J9:** 91/94/96 treated as observation about Close Capacity Gap; cause question investigated a Scenario, not Outcome vs Goal.
- **J10:** `forget that` offered `cc9:scenario:do-nothing:do-nothing:v1`; later `yes` after `show me problems` added a Risk named “Risk”.
- **LONG-50:** Internal `INSUFFICIENT_REALITY`; Approve overlay contradiction; `investigate it` failed; ECA:10 leak.
- **NAV:** After synthetic Stage click to Margin Pressure, `explain it` explained Capacity Gap.

J5 scored 4: challenge turns (Why / sure / missing / do nothing) stayed on Margin Pressure with causal humility.

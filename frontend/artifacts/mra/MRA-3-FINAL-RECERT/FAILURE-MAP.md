# Failure map

Independent recertification. Validation only.

## Counts

| Class | Count | IDs |
| --- | --- | --- |
| S0 | 0 | — |
| S1 | 1 | MRA-3-RECERT-001 |
| S2 | 6 | 002–007 |
| S3 | 3 | 008–010 |

---

## MRA-3-RECERT-001 (blocker)

| Field | Value |
| --- | --- |
| Severity | **S1** |
| Journey | Cross-domain C; also isolated J4 |
| Turns | `Demand Surge` (focus + referent) → `tell me more about it` |
| Expected | Demand Surge remains the composition subject |
| Actual | Investigate **Capacity Expansion Plan** as a possible contributor |
| Repro | Live `/executive` and isolated CC:5 |
| Likely authority | Composition / investigation follow-up vs resolved Scenario (related Scenario still winning `tell me more`) |
| Manager impact | Manager just named Demand Surge and is told about a different Scenario |
| Certification | **Blocks MRA:3** |

`explain it` on the same objects is correct. The defect is a remaining knowledge follow-up (`tell me more`), not Stage focus.

---

## S2 (non-blocking)

| ID | Issue |
| --- | --- |
| 002 | Execution follow-ups (`Did it start?`, ownership) still ask which business outcome |
| 003 | Cause/status overlay names Approve Repricing while Demand Surge was approved |
| 004 | LONG/live leftover “already the committed Decision” wording |
| 005 | `look at capcity` now disambiguates multiple matches (isolated still maps to Capacity Gap) |
| 006 | `Explain this one` / collection “this one” awkwardness (historical) |
| 007 | Some Data field follow-ups can leave the file |

## S3

| ID | Issue |
| --- | --- |
| 008 | Repeated causal-uncertainty boilerplate |
| 009 | “a reversible Demand Surge action” grammar |
| 010 | Greeting is short; still little situation lead |

No S0. No unauthorized mutation. No invented Execution. No architecture-name leakage on live.

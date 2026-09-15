# Failure map

Validation only. No production patch in this run.

## Counts

| Class | Count | IDs |
| --- | --- | --- |
| S0 | 0 | — |
| S1 | 1 | MRA-3-FINAL-001 |
| S2 | 6 | 002–007 |
| S3 | 3 | 008–010 |

---

## MRA-3-FINAL-001

| Field | Value |
| --- | --- |
| Severity | **S1** |
| Surface | Live `/executive` crossDomain |
| Turns | `show me scenarios` → CSV inventory → `explain it` (CSV OK) → `Capacity Gap` (Focused on Capacity Gap) → `explain it` |
| Expected | Explain Capacity Gap |
| Actual | Scenario: Capacity Expansion Plan |
| Owner | Live DATA-ADV early-return + surviving Scenario collection vs 6.2 recency |
| Blocks certification | **Yes** — required cross-domain path on the manager surface |
| Isolated CC:5 J4 | Passes (orchestrator path) |

---

## S2

| ID | Issue |
| --- | --- |
| 002 | `Explain this one` after Problems SHOW: no match instead of which-Problem clarify |
| 003 | `What fields do you understand?` can leave DATA-ADV |
| 004 | Execution follow-ups (`Did it start?`, ownership) mix “which outcome” with correct active Execution |
| 005 | Cause / “is that a decision” sometimes names Approve Repricing |
| 006 | LONG T36 leftover “Capacity Gap is already the committed Decision” on Demand Surge Approve (counts=1) |
| 007 | LONG T53 after first-problem listing, `explain it` returns scenario-projection language |

## S3

| ID | Issue |
| --- | --- |
| 008 | Greeting asks which business outcome |
| 009 | Repeated causal-uncertainty sentences |
| 010 | Second live CSV import timeout; first import and library conversation still worked |

No S0. No unauthorized mutation. No fabricated CSV. No invented Execution.

# Failure map

Independent recertification after MRA:3-RECERT-FIX1. Validation only. No production patch.

## Counts

| Class | Count | IDs |
| --- | --- | --- |
| S0 | 0 | — |
| S1 | 1 | MRA-3-RECERT-2-001 |
| S2 | 8 | 002–009 |
| S3 | 4 | 010–013 |

---

## MRA-3-RECERT-2-001 (blocker)

| Field | Value |
| --- | --- |
| Severity | **S1** |
| Journey | Live deictic family (clean reset, no CSV) |
| Turns | `Demand Surge` → `explain it` → `tell me more about it` → `investigate it` (then `look deeper into it`, `what else do we know about it?`) |
| Expected | Demand Surge remains the primary subject; related objects may add context |
| Actual | Advisor recommends **Margin Pressure** while Stage/MO stay `ctx-scenario-demand` |
| Repro | Live `/executive` dedicated deictic journey. Isolated `J-deictic` `investigate it` stayed Demand Surge. Live long session `look deeper` after a richer path stayed Demand Surge. |
| Likely authority | Conversational INVESTIGATE / recommendation composition vs active Scenario referent (attention-ranked Problem outranking established subject). Not Stage click. Not CSV. |
| Manager impact | After focusing Demand Surge, “investigate it” is a normal follow-up. Answering with a different Problem is materially misleading and Stage/Advisor diverge. |
| Certification | **Blocks MRA:3** |

`explain it` and `tell me more about it` on this object are correct on live. Do not reopen a global Scenario suppress.

---

## S2 (non-blocking)

| ID | Issue |
| --- | --- |
| 002 | After Approve Demand Surge, `is that approved?` / some Execution follow-ups compose **Approve Repricing** investigation. Canonical approved count = 1; Execution starts once. Misleading naming, not a silent extra Decision. |
| 003 | Leftover “already the committed Decision” / “Capacity Gap is already the committed Decision” after Demand Surge approval. |
| 004 | `look at capcity` on a clean live page asks which “Capcity”; isolated and the long session map to Capacity Gap. |
| 005 | Collection `Explain this one` unmatched. |
| 006 | Some Data field questions (`What fields do you understand?`) leave the file (`Which item do you mean?`). |
| 007 | `look at Capacity` then `what's going on with that?` clarifies Problem vs KPI instead of assuming KPI. Safe; friction vs spec D. |
| 008 | Execution follow-ups sometimes ask which business outcome while Execution is already active. |
| 009 | Recommendation copy includes `UNSPECIFIED` as a priority token (manager-facing leftover, not an architecture code in the leak regex). |

## S3

| ID | Issue |
| --- | --- |
| 010 | Greeting / “Hi I’m Sam” can ask which business outcome. |
| 011 | Repeated causal-uncertainty boilerplate. |
| 012 | “a reversible Demand Surge action” grammar. |
| 013 | Duplicate-command “No change — that command was already applied” on legitimate knowledge follow-ups. |

No S0. No stale mutation write. Delete did not become Add. No invented Execution. Live page errors 0. No NCA/NXA/ECA/CC leakage in manager replies.

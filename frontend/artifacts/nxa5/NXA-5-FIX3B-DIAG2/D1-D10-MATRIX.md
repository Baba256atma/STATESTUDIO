# NXA:5-FIX3B-DIAG2 — D1–D10 independent matrix

Machine: `d1-d10-matrix.json`  
Live extras: `live-stage.json`

Cases were **not** added to the permanent green suite.

| ID | Setup | Executor Advisor | DIR / Stage | Live notes |
| --- | --- | --- | --- | --- |
| D1 | clean `show executions` | `Which decision do you want to approve?` | SHOW_COLLECTION / execution / 2 | same Advisor; Stage executions |
| D2 | clean `show execution` | same COMMITMENT overlay | SHOW_COLLECTION / execution / 2 | **INTERMITTENT:** live listed `Current Executions: Capacity Expansion, Pricing Rollout.` |
| D3 | clean `show me all executions` | COMMITMENT overlay | SHOW_COLLECTION / execution / 2 | live same as D1 |
| D4 | clean overview `show all executive` | not-found `All Executive` | NO_CHANGE / overview | live same. No Problem/KPI |
| D5 | `show problems` then `show all executive` | `Do you mean Margin Pressure or Capacity Gap?` | NO_CHANGE / problem | live same. **Problems context required** |
| D6 | D5 then `I mean Executions` | capacity-pressure copy | NO_CHANGE / problem | same as turn B; CORRECT phrasing does not escape 6.3 pending |
| D7 | problems + `which one is important?` + `show executions` | criterion question then `Which decision do you mean — Margin Pressure or Capacity Gap?` | last turn SHOW_COLLECTION / execution | live Stage executions; Advisor still Problem names. NCA:2 move ASK_MANAGER not ANSWER_NEXORA |
| D8 | problems + important? + `urgency` | insufficient comparable urgency evidence… | NO_CHANGE / problem | FIX3B intended path **works** |
| D9 | problems + `why is Capacity Gap happening?` + `orders increased 20%` | explain then `That 20% increase makes persistent demand pressure more likely. Was that increase driven mainly by more orders or slower throughput?` | NO_CHANGE / problem | intent `evidence`; structurally distinct from turn B |
| D10 | `show scenarios` + `exlpain Demand Surge` | full scenario Explain; DIR NO_CHANGE | scenario / 3 | FIX3A preserved; Stage stays scenarios |

## Distinctions

- **Clean-session collection:** CC:1 singular/plural `executions?` works; Advisor often blocked by 6.3 COMMITMENT mapping of `show-execution`.
- **Problems-context:** only then does `executive` become a Problems-member clarification.
- **FIX3B pending:** D8 OK; D7 Stage escapes collection, Advisor still hijacked by 6.3 COMMITMENT + leftover Problem candidates.
- **Assertion control:** D9 writes evidence-class copy from a percent observation; turn B writes capacity copy from FREE_TEXT meta-text with **no** observation record.
- **Stage:** collections apply when POST:3+DIR run (D1–D3, D7 last, turn C). Turn A/B Stage stay Problems.

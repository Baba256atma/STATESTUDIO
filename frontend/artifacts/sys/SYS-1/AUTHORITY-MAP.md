# SYS:1 — Authority map

Audit of existing owners. No new authority.

| Fact / action | Canonical owner | Readers | Writers | Projection |
| --- | --- | --- | --- | --- |
| active Problem | EI / Manager–Object canonical Problem | ECA, NPS, Stage, Theatre | MO / conversation-named + click activation (session), not NPS | Advisor, Stage focus, Theatre focal |
| Goal / KPI | MO presentation / EI | ECA, NPS, Theatre | existing Goal owner | Advisor, Stage |
| Data | Data Reality | DATA-ADV, Advisor | CSV import store | Data library, Advisor |
| semantic confirmation | DATA-ADV / existing confirmation | ECA, NPS:3 | manager confirmation only | Advisor |
| Evidence | CC:8 / Data Reality | NPS:3, ECA | CC:8 | Advisor, Theatre investigation |
| Scenario | CC:9 | NPS:4, NCA-POST:4, Theatre | CC:9 only | Stage scenarios, Advisor options |
| recommendation | ECA:7 / NCA:4 | NPS:5, Theatre | none as Decision | Advisor |
| manager preference | ECA:8 session | NPS:6 | ECA session only | Advisor |
| commitment | ECA:8 | CC:10, NPS:6 | confirmation handoff, not NPS | Advisor, Theatre commitment |
| Decision | CC:10 | ECA:9, NPS:6–8, Theatre | CC:10 only | Advisor, Theatre |
| Execution | CC:11 | ECA:10, NPS:7–8, Theatre | CC:11 only | Advisor, Theatre |
| progress / blocker / risk | CC:11 + ECA:10 interpretation | NPS:7, Theatre | CC:11 for execution facts | Advisor, Theatre |
| Outcome | CORE-OUT / ECA:11 | NPS:8, Theatre | existing Outcome owner | Advisor, Theatre |
| Learning | CORE-OUT:2 / ECA:12 | NPS:8 | **no durable write** (`learningDurable=false`) | Advisor |
| Stage focus | Director / Stage interaction | ECA stage read model, Theatre | Stage click / Director | Stage, Theatre |

## Flags

- **Shadow state (S1):** After a Problems collection, Stage click sets `focusedSubject` / click session to Capacity Gap, but the next deictic Advisor turn (`Explain it`) recomposes Margin Pressure. Stage and Advisor then disagree.
- Duplicate writers for Scenario/Decision/Execution: **not observed**. NPS remains zero-write on the audited conversational path.
- Theatre remains projection. It did not write canonical Decision/Execution in this audit.

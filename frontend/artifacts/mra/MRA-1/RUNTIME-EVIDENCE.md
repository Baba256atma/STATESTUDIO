# MRA:1 — Runtime Evidence

Date: 2026-09-09

## Instruments (diagnostic only)

| Instrument | What it proves |
| --- | --- |
| `frontend/scripts/mra-1-runtime-audit.ts` | 33 journeys, 150 turns through production `executeNexoraConversationalExperience` and default catalog. Seeds CSV pending/committed/empty for Data journeys. |
| `frontend/artifacts/mra/MRA-1/runtime-turns.json` | Full snapshots: reply, ECA:2–12, NCA-POST:3 owner, Director intent, Stage visibility, mutation, CC:10 status. |
| `frontend/scripts/mra-1-live-audit.mjs` | Playwright `/executive?reset=1` using FINAL:3 chat harness (same Advisor authority as production). |
| Existing POST-ECA:2 / NCA-POST:3 / DATA-ADV / ECA:8–12 tests | Certified invariants reused, not weakened. |

No phrase-specific production handlers were added to make the audit look green.

## Coverage executed

| Area | Journeys |
| --- | --- |
| Natural / imperfect / short | `A-natural-conversation`, `A-imperfect-english`, `A-short-followups` |
| Continuity | `B-context-continuity`, `B-stale-hijack` |
| Stage | `C-stage-advisor` |
| Collections | `D-collections`, `D-collection-vs-focus` |
| Knowledge / nav / action | `E-*` |
| Missing information | `F-*` |
| Recommendation | `G-*` |
| Mutation | `H-*` |
| Decision / Execution | `I-*`, `J-*` |
| Outcome / Learning | `K-outcome-learning` |
| Adversarial | `L-*` |
| Data | `M-data-ambiguous`, `M-data-ready`, `M-data-empty` |

## Representative traces

### Collection SHOW (working)

`show me all problems` → NCA-POST:3 `COLLECTION_QUERY`, DIR `SHOW_COLLECTION`, reply “Current Problems: Capacity Gap, Margin Pressure.” `shouldCommitRuntime=true`.

### Stage META vs SHOW (divergent)

`what is on stage?` Overview → “Capacity Watch and Risk Watch are currently visible on Stage.” `owner=WORKSPACE_STATE`.

After `Focus on Risk.`, same question lists focus + other visible actors.

`show me what is on Stage` → BUSINESS clarification (“Margin Pressure or Risk?”), Stage still FOCUS.

### Decision split truth

`Approve Demand Surge` → `decisionStatus=applied`, spoken Approved.

`are we ready to execute?` / `start it` → “no committed Decision yet.” ECA:9 `NOT_APPLICABLE`.

### Data honesty vs Data follow-up

Pending CSV: inventory, unresolved fields, BKL unknown, KPI “cannot calculate business-valid KPI” — DATA-ADV.

`What fields are confirmed?` → Outcome clarification.

`Can this data support the Capacity Gap?` → generic Problem investigation + temporary capacity.

### Mutation

`Add Supplier Delay as a Risk.` → proposal, “Add it?”

`Add it.` → “Supplier Delay has been added as a Risk.” Canonical Risk writer (ECA handoff). `shouldCommitRuntime=false` (not a Stage writer).

`delete Margin Pressure` → “I can add “Margin”. Add it?”

### Safety that held

`start it` without Decision refuses.

`I prefer Scenario A` → preference only.

Causal overclaim → hypothesis, not cause.

Delivery 91%→94% → manager-reported observation; cause refused.

## Regression evidence (authorities preserved)

Focused suites run during MRA:1 (77 tests, 0 fail):

- `ecaPostEca2StageAwareness.test.ts`
- `nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.test.ts`
- `ecaMutationProposal.test.ts`
- `ecaRiskMutationHandoff.test.ts`
- `ecaPostEca3Fix1DataLibraryInventory.test.ts`

Additional gates are recorded in `CERTIFICATION-READINESS.md`.

## Live `/executive`

Isolated `next start` on a free port, `?reset=1`, zero page errors. Artifact: `live-audit.json`, screenshot `live-audit.png`. URL recorded in the JSON.

Live confirmed the same natural-conversation and Stage-SHOW defects as CC:5. Additional live-only facts:

- Overview Stage META named **Capacity Watch and Customer Watch** (runtime default catalog named Capacity Watch and Risk Watch). Membership still comes from NXA:5-FIX4, not Problems.
- After Prefer + Approve Demand Surge, Advisor said Execution started; Stage thread Decision/Execution counts stayed **0**.
- Isolated live `What is Capacity Gap?` used the investigation template, unlike isolated CC:5 runtime definition.

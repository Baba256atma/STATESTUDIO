# NPA-T VAI:FINAL — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: End-to-end certification of VAI:1–8 only. Do not start VAI:9.

## Canonical pipeline (implemented)

Trusted Data / Objects / Evidence
→ VAI:1 Variable (`resolveVaiVariables`)
→ VAI:2 Contextual Role (`resolveVaiObjectVariableRoles`)
→ VAI:3 Evidence / Causal Status (`resolveVaiCausalSafety`)
→ VAI:4 Advisor Explanation (`composeVaiAdvisorAnalysis`, CC:5 overlay)
→ VAI:5 Variable Symbol (`projectVaiTheatreSymbols`)
→ VAI:6 Impact Analysis Scene (`composeVaiImpactScene`)
→ VAI:7 WHAT_IF_EXPERIMENT (`createVaiWhatIfExperiment`, session overlay)
→ VAI:8 EXPERIMENT_SCENARIO_PROPOSAL (`resolveVaiExperimentScenarioHandoff`)
→ CC:9 canonical Scenario (`resolveNexoraExecutiveScenarioConversation`)
→ existing recommendation / ECA:8 challenge
→ CC:10 Decision
→ CC:11 Execution
→ existing observed Outcome / Learning

No VAI phase writes those later canonical stores.

## Authority map (canonical owners)

| Concept | Owner | VAI role |
| --- | --- | --- |
| Executive Objects | MO:1 / NEX-MVP catalog | Related IDs only |
| Variables as Objects | none — Variables are not `MANAGER_OBJECT_KINDS` | Identity stays Variable |
| Data Reality | RDI / Data Reality | Read baseline; no mutation |
| Semantic truth | DATA-ADV / DATA-UX:3 / manager confirmation | CAP_AV stays unconfirmed |
| Evidence | CC:8 | Provenance refs only |
| Causality | CORE-INT:3 gate via VAI:3 ladder | Association ≠ cause; cause ≠ effect size |
| Stage | existing Stage interaction | No Variable Stage Objects |
| Director | DIR:1 / DTH arrangement | Arrangement only |
| Advisor | NXA / NCA / ECA / CC:5 | VAI:4 overlay, not a second Advisor |
| Scenario | CC:9 | VAI:8 proposal only until confirmation |
| Decision | CC:10 | VAI cannot approve |
| Execution | CC:11 | VAI cannot start |
| Outcome | existing Outcome observation | Estimate ≠ observed |
| Learning | existing Learning / DTH:12 | Difference ≠ automatic causal learning |

No duplicate writers found for those concerns.

## Certification-blocking repairs made during FINAL

1. VAI:7 `what if` matching was too broad and a missing-bundle apply=true overlay replaced CC:9 (“What if we do nothing?”). Repair: Variable-scoped what-if detection; missing bundle idles (`apply: false`).
2. DTH:12 “Should we change the goal?” was overwritten by ECA mutation clarification. Repair: Learning-owned goal question is not replaced by PROPOSE_MUTATION copy.
3. Advisor “Does staffing cause…” now mapped. Repair: bounded `does .+ cause` intent.
4. Compare-this / what-would-happen-to-OTD utterances now not claimed by VAI:7. Repair: bounded utterance patterns on existing what-if composition.

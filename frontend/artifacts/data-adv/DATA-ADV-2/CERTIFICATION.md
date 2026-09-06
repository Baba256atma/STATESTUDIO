# DATA-ADV:2 certification report

1. **Architecture inspected.** DATA-ADV:1 context/inquiry, shell/NCA routing, DATA-UX:3 semantics, clarification handoff/writer, RDI mapping/store/restore, ESI/Data Reality/Object boundaries, mapping targets, source descriptions, and funnel artifacts were inspected.
2. **Existing Likely mechanism discovered.** DATA-UX:3 expands tokens/acronyms against `CSV_MAPPING_TARGETS`; DATA-ADV:1 called only exact canonical target proposals “likely.” OTD is an acronym-derived target candidate, not a hard-coded Advisor answer.
3. **CAP_AV diagnostic finding.** DATA-UX:3 produced an abbreviated material proposal/state, but DATA-ADV:1 collapsed non-target ambiguity to unresolved and discarded candidates. Live proof also found an unsafe compact substring identity match and later an extra-token candidate leak; both were repaired generically.
4. **Semantic Candidate Intelligence architecture.** One pure `resolveSemanticCandidates(term, context)` capability returns candidates, categorical state, evidence, explanation, and confirmation requirement.
5. **Existing authorities reused.** RDI mapping owns confirmed meaning; Advisor Data Context is projection; NCA owns dialogue; `applyCsvSemanticClarification` owns conversational writes; the existing candidate store owns persistence.
6. **Semantic evidence ladder.** Authoritative mapping → same-source manager confirmation → complete canonical concept/term structure → confirmed neighbors → domain → source label. Candidate evidence never becomes truth.
7. **Semantic state model.** `AUTHORITATIVE`, `MANAGER_CONFIRMED`, `LIKELY`, `AMBIGUOUS`, and `UNKNOWN` are explicit and manager-facing precision remains categorical.
8. **Candidate-generation strategy.** Camel/separator/compact normalization, compositional lexemes, complete canonical concept coverage, every input token required to contribute, bounded contextual ranking, and valid zero-candidate output. No CAP_AV/ORD_QTY raw-field mapping exists.
9. **Deterministic/model-assisted decision.** Deterministic-only. No calibrated semantic LLM boundary exists; UNKNOWN is safer. Future model output may only enter as non-authoritative candidates behind this contract.
10. **Domain-context reasoning.** Domain terms rank concepts and never confirm them; finance AV selects Actual Value while production capacity context preserves capacity ambiguity.
11. **Source-context reasoning.** Only the relevant source label is read; filename can support ranking but never establishes truth.
12. **Neighbor-field reasoning.** Confirmed neighboring meanings are bounded evidence and are mentioned only when used.
13. **Manager-confirmed vocabulary behavior.** Same-source confirmation wins immediately and is not re-inferred.
14. **Cross-source learning boundary.** Confirmation is source-local. This phase does not persist cross-source hints and never promotes one confirmation to global truth.
15. **Known behavior.** Authoritative and manager-confirmed meanings are stated directly without confirmation.
16. **Likely behavior.** A single bounded candidate is presented as “may mean” and followed by a confirmation question.
17. **Ambiguous behavior.** Tied safe candidates are listed and the manager is asked to choose or correct; no arbitrary winner.
18. **Unknown behavior.** Opaque or unsupported terms return no candidate and explicitly request meaning.
19. **Manager confirmation.** Bare affirmative for a single proposal uses the existing semantic writer.
20. **Manager correction.** Natural correction is recorded source-locally through the existing writer; live CAP_AV correction passed.
21. **Manager “I don't know”.** Meaning remains unresolved, no candidate is confirmed, and unrelated conversation/data can continue.
22. **Explain-why behavior.** Advisor returns the resolver's actual evidence explanation; live response cited term structure and its non-confirming status.
23. **Advisor integration.** `projectAdvisorDataContext` projects resolver results; `answerAdvisorDataInquiry` composes known/likely/ambiguous/unknown language without becoming authority.
24. **NCA integration.** Existing shell routing, pending clarification, unrelated-question handling, and dialogue references are reused; no second conversation engine.
25. **Data Reality safety.** Resolver is pure, has no store import, and cannot publish candidates as evidence or change lifecycle/readiness.
26. **ESI safety.** No ESI writer or relation API is imported or called.
27. **Stage/Object safety.** No Stage mutation, focus mutation, relationship creation, or Object creation exists in resolver/Advisor paths.
28. **Decision/Execution/Outcome/Learning safety.** No corresponding writer is imported or called; full regression funnel passed.
29. **Restore continuity.** Live refresh returned manager-confirmed Capacity Availability before candidate inference; automated restore coverage passed.
30. **Business/Project generality.** Tests cover Gross Margin Percent, Revenue Variance, Schedule Variance, compact/camel capacity forms, and finance-context AV.
31. **Files created.** `semanticCandidateIntelligence.ts`, its focused test, and DATA-ADV:2 architecture/test/certification artifacts.
32. **Files modified.** `nexoraAdvisorDataContext.ts`, `nexoraAdvisorDataInquiry.ts`, its test, and generated certification funnel evidence.
33. **Focused tests.** 25/25 passed across DATA-ADV:2, DATA-ADV:1, DATA-UX:3, and semantic clarification handoff; final funnel Level 1 passed.
34. **Regression tests.** Funnel Levels 2 and 3 passed; final Level 4 passed 7/7 with no failures/skips/running/uninspected tasks.
35. **TypeScript / ESLint / build.** TypeScript passed with 8 GB Node heap; targeted ESLint passed; production build passed inside Level 4; `git diff --check` passed.
36. **Live manager proof.** CAP_AV ambiguity → grounded why → manager correction → confirmed response → refresh persistence; BKL unknown → “I don't know” preservation. Real `/executive`, not unit-only.
37. **Remaining limitations.** Vocabulary is intentionally bounded; unsupported terms return UNKNOWN. Cross-source hints and model assistance are not implemented. A pre-existing startup hydration window can route a question submitted immediately after refresh to generic not-found before the restored source becomes available; deliberate post-hydration restore proof passes.

DATA-ADV:2 — CERTIFIED

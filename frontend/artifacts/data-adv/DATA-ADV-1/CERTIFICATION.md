# DATA-ADV:1 Certification

Status: **DATA-ADV:1 — CERTIFIED**

Advisor now knows the manager’s Data Library via a read-only projection of `csvRealDataImportStore` (and live connections). Manager-initiated field/source questions no longer fall through to executive-subject lookup when the column exists. BCA and DATA-UX:7 were not started.

## Certification report (spec §44)

1. **Architecture inspected.** See `ARCHITECTURE-INSPECTION.md` (A–L).
2. **Root cause of ORD_QTY failure.** After FIX1 consumed “yes” for OTD, “what is ORD_QTY?” is a QUESTION. The shell used CC executive-subject resolution. That search never read CSV headers/mappings, so it emitted “current executive context” not-found copy.
3. **Advisor Data Context authority/boundary.** `projectAdvisorDataContext` is read-only. `ADVISOR_DATA_CONTEXT_BOUNDARY` does not own the CSV store, Data Reality, semantic writes, Stage, or Decision. It does not dump full CSV rows into prompts.
4. **Data Library awareness.** Lists committed, pending, and connected sources from actual store state.
5. **Committed source awareness.** Lifecycle committed, accepted evidence, ESI related objects, confirmed/authoritative fields.
6. **Pending source awareness.** Filename, columns, confirmation state, potentially related (uncertain). Explicitly not accepted Data Reality.
7. **Field awareness.** Exact and normalized column match, including ignored columns. Exact identity outranks Stage focus.
8. **Semantic-confidence handling.** Confirmed / authoritative vs likely vs unresolved. Likely may ask; does not assert.
9. **Manager-initiated data questions.** `answerAdvisorDataInquiry` in the shell after FIX1 pending answers and before `executeNexoraConversationalExperience`. Data Panel not required.
10. **Nexora-initiated clarification compatibility.** FIX1 Ask Nexora + `resolveNcaCsvSemanticReply` unchanged. Inquiry may begin NCA pending via `beginNcaCsvSemanticClarification` for pending likely/unresolved fields.
11. **Conversation continuity.** `advisorDataDialogueRef` holds source/field; “it”, “that file”, “what else is in that file” stay on the data subject.
12. **Multi-source ambiguity.** Same column in two sources asks which source; meanings stay source-scoped.
13. **Restored-source awareness.** DATA-UX:6 hydrate fills the store; projection is built at question time. Live: OTD after refresh without opening Data.
14. **Source questions.** Contain, ready, clarification remaining, objects, remove (explains; does not delete).
15. **Object → Data reasoning.** “What data do we have for Capacity?” uses ESI-related labels on committed sources; pending labeled separately.
16. **Data → Object reasoning.** Committed: ESI labels. Pending: potentially related, labeled uncertain.
17. **Cross-source executive guidance.** Investigation order; “may be relevant”; never “caused”.
18. **Missing-data intelligence.** Supplier (and similar) absence named; does not invent fields.
19. **Business/Project generality.** Topic matching uses labels, confirmed meanings, and ESI names. Project fixture `schedule.csv` is not manufacturing-hardcoded.
20. **Semantic write safety.** Writes only `applyCsvSemanticClarification` on the pending candidate. Advisor does not mutate mappings itself.
21. **Data Reality safety.** Inquiry `mutatesDataReality: false`. Conversation cannot commit or upgrade pending.
22. **Stage safety.** `mutatesStage: false`. Live focus stayed none. No Director call on field answers.
23. **Decision/Execution/Outcome/Learning safety.** Inquiry does not call those writers. Object creation unchanged.
24. **Files created.** `nexoraAdvisorDataContext.ts`, `nexoraAdvisorDataInquiry.ts`, `nexoraAdvisorDataInquiry.test.ts`, `scripts/data-adv1-live-proof.mjs`, this artifact folder (including proofs).
25. **Files modified.** `NexoraExecutiveShell.tsx` (read-only inquiry + existing clarification writer). Architecture inspection already present.
26. **Focused tests.** 4/4.
27. **Regression tests.** DATA-UX:1–6 / FIX1–FIX5 / RDI / ESI / DATA_OBJECT combined **117/117**. L4 omnibus **1370/1370**.
28. **TypeScript / ESLint / build.** L4 typecheck, PREP ESLint, production build, `git diff --check` (PREP + DATA-ADV files).
29. **Live browser conversation proof.** `proofs/live-report.json` `ok: true`. See `LIVE-MANAGER-PROOF.md`.
30. **Remaining limitations.** Detailed row retrieval is still not in this phase (by design). Connected sources have no field catalog. Committed meaning edits still go through Update Source, not conversation. Fuzzy matching is conservative. Inquiry will not answer non-data questions (returns null → existing CC). Initiative remains existing NCA policy; restore is silent.

## Not added

No second CSV registry, Data Reality, semantic writer, Advisor engine, conversation engine, object store, BCA, DB/SQL/RAG, or causal engine.

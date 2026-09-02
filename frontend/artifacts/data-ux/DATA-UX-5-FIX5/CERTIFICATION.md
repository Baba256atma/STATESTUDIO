# DATA-UX:5-FIX5 Certification

Status: **DATA-UX:5-FIX5 — CERTIFIED**

Pending CSV review is a manager-readable surface: grounded About this data, Needs attention, Nexora understands vs Needs clarification, optional Potentially related, collapsible Columns/Preview, and consent for meaning correction. DATA-UX:6 and BCA were not started.

## Certification report (spec §25)

1. **Architecture inspected.** See `ARCHITECTURE-INSPECTION.md`.
2. **Manager-readability problems.** Engineering-form dump; “Likely Bkl”; technical KPI missing-metric copy; confirmed meanings as always-on dropdowns; Related Objects with no pre-commit distinction.
3. **Collapse regression/root cause.** FIX3 always-visible preview removed `<details>`. Presentation only. Restored native disclosure.
4. **About this data.** `describeCsvSourceForManager` from confirmed meanings/`targetLabel` only. Weak: “has not confirmed enough business meaning…”.
5. **Grounding rules.** No LLM. No filename-only claims. Unresolved abbreviations do not become asserted meaning.
6. **Needs attention.** `describeCsvNeedsAttentionForManager` → “Nexora needs Used Capacity before this data can be used for Production.” Distinguishes missing required data from uncertain mapping.
7. **Nexora understands.** `csvConfirmedMappings` only; manager vs authoritative labels.
8. **Needs clarification.** Unconfirmed, non-ignored fields; unknown abbreviations → “Meaning not confirmed”. FIX1 Ask Nexora unchanged.
9. **Confirmed-meaning correction.** Pending: Change meaning → existing `updateCsvColumnMapping`. Committed: impact copy + Update source (`analyzeCsvSourceRemovalImpact`), not in-place mapping rewrite.
10. **Authoritative-mapping safety.** Authoritative rows stay labeled; not exposed as a silent dropdown while locked. Correction still goes through mapping authority or Update source.
11. **Potentially Related.** Shown only from confirmed `objectKey` on mapping targets. Not ESI, not Data Reality, not Stage. If none: “Available after validation.”
12. **Committed Related Objects.** ESI `affectedObjects` in `SourceIntelligenceView`.
13. **Collapsible sections.** Needs clarification, Columns, Data preview. About / Needs attention stay visible.
14. **CSV preview.** Same first-rows preview; collapsed by default; copy remains preview-only.
15. **Action hierarchy.** Ask Nexora while material clarification remains. Validate Import when ready. Use this data after prepare. Replace File / Cancel import secondary. Add Data still FIX4 new intake.
16. **Multi-pending.** Independent candidate description/mapping/preview (live G + FIX4 tests).
17. **Files created.** `dataUx5Fix5Readability.test.ts`, `scripts/data-ux5-fix5-live-proof.mjs`, this artifact folder (including `proofs/`).
18. **Files modified.** `nexoraDataRailPresentation.ts`, `NexoraCsvRealDataImportFlow.tsx`, `NexoraExecutiveDataExplorer.tsx` (presentation/copy/consent UI only).
19. **Automated tests.** Focused 6/6. Combined DATA-UX/CSV suite **98/98**. L4 omnibus **1366/1366**.
20. **TypeScript / ESLint / build.** L4 typecheck, PREP ESLint, production build, `git diff --check`.
21. **Live browser proof.** `proofs/live-report.json` `ok: true`. Flows A–G.
22. **Stage / Decision / Execution.** Inspection, collapse, and pending mapping do not create Decision/Execution/Outcome/Learning. Data Reality receives only committed sources.
23. **Durability limitation.** Close/reopen: supported. Page refresh: not supported (in-memory). CSV refresh durability remains DATA-UX:6.
24. **Remaining limitations.** Non-material columns stay ignored until mapped in Columns (existing semantic authority). Potentially Related is a mapping-target preview, not a relationship. Validate Import label remains prepare, not commit.

## Not added

No second Data Reality, CSV store, pending registry, semantic engine, ESI, Advisor, NCA, Stage, Director, DATA_OBJECT authority, source lifecycle, LLM summarizer, localStorage/IndexedDB, or Conversation Actions.

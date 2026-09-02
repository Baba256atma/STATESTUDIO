# DATA-UX:5-FIX5 Architecture Inspection

Date: 2026-09-01

Inspected DATA-UX:1–5, FIX1–FIX4, pending/committed CSV UI, `describeCsvSourceForManager`, `updateCsvColumnMapping`, `applyCsvSemanticClarification`, `prepareCsvRealDataImport`, ESI `affectedObjects`, `analyzeCsvSourceRemovalImpact`, Data Rail, NCA Ask Nexora.

No second store, ESI, semantic engine, or Data Reality writer.

## Answers (A–J)

**A. Long CSV review owner.** `NexoraCsvRealDataImportFlow` (pending) and `SourceIntelligenceView` in `NexoraExecutiveDataExplorer` (committed). Presentation copy already starts in `nexoraDataRailPresentation`.

**B. Why collapse disappeared.** FIX3 made the CSV preview always visible so managers would not miss it, and removed the `<details>` wrapper. Columns stayed a full always-open mapping form. That was presentation, not a store change.

**C. Restore without CSV state.** Yes. Native `<details>` / `<summary>` is presentation-only. It does not write the candidate, mappings, NCA, or Data Reality.

**D. Authority that changes a confirmed mapping.** Pending: `updateCsvColumnMapping` (sets `confirmationSource: "manager"`). Conversation: `applyCsvSemanticClarification` / FIX1. Committed snapshots are not rewritten in place; Update Source re-runs prepare/commit on the same `sourceContextId`.

**E. Downstream of a committed meaning change.** Re-prepare + `commitPreparedCsvRealDataImport` mode replace. ESI/DATA_OBJECT/Stage consume the new committed snapshot. Removal impact (`analyzeCsvSourceRemovalImpact`) describes object dependence; reuse that for consent copy. Do not silent-edit a committed mapping in the store.

**F. Objects after commit.** ESI `affectedObjects` only.

**G/H. Pre-commit potential relationships.** Safe evidence: confirmed mapping `targetId` → existing `CSV_MAPPING_TARGETS.objectKey`. That is mapping-target metadata, not ESI and not Data Reality. Display as **Potentially Related** with uncertainty. If no confirmed objectKey, keep “Available after validation.”

**I. Grounded 1–2 sentence description.** Confirmed `confirmedMeaning` / `targetLabel` only (`describeCsvSourceForManager`). No LLM. No filename-only claims.

**J. Validation errors.** KPI missing-metric strings from prepare. Translate to “Nexora needs {field} before this data can be used for {object}.” Uncertain mapping is a different section.

## Manager-readability problems

- Engineering form: Confirm meaning + all dropdowns always visible.
- “Likely Bkl” from title-casing unknown abbreviations.
- Related Objects said “Available after validation” with no potentially-related preview from confirmed targets.
- Needs-attention copy was technical.
- Confirmed meanings were silently editable via dropdowns (pending) or not correctable with consent (committed).

## Collapse regression / root cause

FIX3 required the CSV preview to be visible so managers would not miss it. The implementation removed the native `<details>` wrapper and always rendered the table. Collapse was never stored in the CSV candidate. Restoring `<details>` on Needs clarification, Columns, and Data preview is presentation-only.

## Potentially Related evidence boundary

Safe pre-commit labels come only from **confirmed** mapping `targetId` → `CSV_MAPPING_TARGETS.objectKey` (`csvPotentialRelatedLabels`). Date metadata has `objectKey: null` and is excluded. Filename/`CAP_AV` spelling is not used. Pending UI must not call `projectExecutiveSourceIntelligence`. After commit, Related Objects remain ESI `affectedObjects`.

Non-material unresolved columns remain ignored by existing `interpretCsvSemantics` (`ignored: !usableTarget && !material`). They stay in Columns, not Needs clarification. That is existing semantic authority, not a FIX5 inference change.

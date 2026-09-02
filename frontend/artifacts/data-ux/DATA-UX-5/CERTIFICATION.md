# DATA-UX:5 Certification

Status: **DATA-UX:5 — CERTIFIED**

CSV Data Sources have a complete manager lifecycle: add → understand → clarify → validate → import → Data Reality → DATA_OBJECT on Stage → update (stable identity) → **reviewed removal** with explicit consent, dependency impact, historical reference, and Stage reconciliation.

Remove from Stage ≠ Remove Data Source.

DATA-UX:1–5 is a completed program. No further DATA-UX phase was started.

## Architecture answers

1. **Who owns source removal?** RDI:2 `removeCsvRealDataImport` is the only writer. DATA-UX:5 adds confirmed-active removal and a historical reference in the same store. No second lifecycle authority.
2. **Dependency analysis?** Read-only `analyzeCsvSourceRemovalImpact` from Executive Source Intelligence `affectedObjects` and overlapping committed peers. Not visual proximity, not filenames, not LLM.
3. **Shared-source?** Inactive overlapping peer → `SHARED_SUPPORT_REMAINS`. Removing the **active** source clears the active dataset; remaining peers are not auto-activated. Current values come only from the active RDI dataset (existing freshness).
4. **Current vs historical?** Active committed import leaves the store. `CsvRemovedSourceReference` keeps identity, label, snapshot/mapping ids, `historical: true`, `suppliesCurrentReality: false`. Decisions/Evidence/Execution/Outcome/Learning are not rewritten.
5. **Semantic confirmation?** Historical `transfersSemanticConfirmation: false`. A later import occupying the same filename-derived `sourceContextId` is a new `importId` and must be confirmed again. Confirmations do not leak to an unrelated source id.
6. **Stage?** Shell drops `stagedDataObjectIds` and selection for that DATA_OBJECT, clears `activeCsvImport` if matching. No `setInteraction` / Focus write. Director re-projects remaining participants.
7. **Advisor?** Explains and may open review (`request-review`). Never calls remove. Rail confirm is destructive execution. LLM down: Rail still works.
8. **Atomicity?** One publication: delete committed row + one historical ref, or no write (`active_source` / `not_found` / mismatch). Retry after success does not duplicate history.
9. **Identity?** Update/replace keeps source identity (DATA-UX:2/3). Remove + new import is a new commit. Same normalized filename may reuse `sourceContextId` by existing RDI formula; snapshots/importIds remain distinct.
10. **UX?** Inspection: Remove from Stage. Data → More → Remove data source → review → Cancel or confirm.

## Certification checklist (1–26)

1. Distinct Stage vs source removal — live Proof F.
2. First destructive intent is review — live Proof E; store refuses unconfirmed active.
3. Canonical ESI impact before removal — `analyzeCsvSourceRemovalImpact`.
4. Meaningful impact copy — zero-object vs Capacity/Delivery/Revenue.
5. Cancel — no store mutation; staged count unchanged.
6. Explicit confirm required.
7. Zero-object removes safely.
8. Sole/active dependents: `DEPENDENT_DATA_BECOMES_UNAVAILABLE`; dataset cleared; no fabricated KPI.
9. Shared inactive peer: remaining source intact.
10. Unrelated + workspace isolation tests pass.
11. Workspace-b untouched.
12. No replacement values invented.
13. Current dataset follows existing RDI active-source / catalog fallback.
14. Historical reference retained; Decision/Evidence not rewritten.
15. Confirmations do not transfer.
16. DATA_OBJECT leaves Stage after confirm.
17. No ghost mesh (participants from remaining imports only).
18. Business Focus not written.
19. Director remains presentation authority.
20. Advisor explains; store owns deletion.
21. Rail confirm works without LLM.
22. Update ≠ remove+import.
23. Failed retry: `not_found`, one historical record.
24. Native live CSV lifecycle proofs pass.
25. Automated/regression gates pass (below).
26. No parallel architecture.

## Gates

- Focused DATA-UX:3–5 + ESI: **53/53**.
- DATA-UX:5 removal suite: **8/8**.
- Owning CSV slice + route + Shell + DTH: **206/206**.
- Test Funnel L1–3: passed, 0 failed/skipped.
- Level 4: **7/7** required (omnibus **1365/1365**, 50 suites; DIR **58/58**, 9 suites; typecheck; ESLint PREP; diff check; production build 13/13 pages; live smoke `ok: true`, `zeroPageErrors: true`).
- DATA-UX:5 ESLint on new/changed removal files: passed.
- Full `git diff --check`: passed.
- Live `/executive`: `proofs/live-report.json` `ok: true`.

## Regression fixed

DTH:2 iconic-language test still expected only `EXECUTIVE_OBJECT` / `ICONIC_OBJECT` after DATA-UX:4 added `DATA_OBJECT`. Expected list and a prefix classification assertion now match the canonical family table. No other known failure carried forward.

## Reused

RDI:2 store, RDI:1 identity, Data Reality active dataset, ESI affected objects, DATA-UX:3 semantics, DATA-UX:4 DATA_OBJECT/Director/Stage, Advisor/NCA, Manager–Object Focus, Decision/Execution/Outcome/Learning (untouched).

## Added

Impact classifier, Advisor removal inquiry (explain/review/cancel only), Rail review UI, historical source reference in the same store, shell staged/selection/active-source reconciliation, cancel dismiss of review request.

## Not added

No parallel ingestion, Data Reality, semantic authority, provenance authority, dependency truth, object store, Director, Stage, Advisor, Decision, Execution, Outcome, Learning, or business Focus authority. No APP-4 bypass. No second audit system.

## Remaining debt

- Historical references are session-store, not APP-4 durable memory.
- Shared current reality still requires activating a remaining source (no silent peer promotion).
- Filename-derived `sourceContextId` can be reused after remove; distinguished by `importId`.

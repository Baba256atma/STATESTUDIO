# DATA-UX:4 Certification

Status: **DATA-UX:4 — CERTIFIED**

CSV Data Sources are native spatial participants in Decision Theatre. They remain read-only projections of canonical Data Reality. Director owns presentation. Advisor can explain selected sources. Provenance lines are evidence-safe. Zero-object sources work. Update identity is stable. Remove from Stage does not delete the source.

DATA-UX:5 was not started.

## Architecture answers

1. Data Object truth lives in RDI:2 `CsvCommittedImport` / Data Reality snapshot. Stage holds none.
2. Semantic meaning lives in the existing `CsvColumnMapping.semantic` review (DATA-UX:3).
3. Stage visibility is Director-owned from manager-requested membership (`stagedDataObjectIds`) and scene density.
4. Spatial placement is the DATA-UX:4 Director projection, not the mesh.
5. Source relationships come from Executive Source Intelligence affected objects + DTH:3 visual grammar.
6. Business Focus remains Manager–Object / NEX-MVP object interaction.
7. Conversational explanation is Advisor/NCA plus a read-only DATA_OBJECT adapter.
8. Stage cannot mutate Data Reality.
9. Clicking a Data Object cannot create Evidence.
10. Importing CSV cannot create unsupported executive objects (zero-object path preserved).
11. Updating a source cannot duplicate the Data Object when identity is stable.
12. Removing from Stage cannot delete the source.

## Gates

- Focused DATA-UX:4 projection/integration tests: passed (20/20 in the DATA-UX:3+4 focused bundle).
- Owning-layer RDI / DTH / Stage / Shell / DATA-UX:3: 96/96.
- Test Funnel Levels 1–4: passed; Level 4 7/7 required tasks (typecheck, ESLint PREP surface, production build, live smoke, omnibus, DIR inventory, diff check).
- Additional DATA-UX:4 ESLint + `git diff --check` on changed presentation files: passed.
- Live `/executive` DATA-UX:4 proofs: `proofs/live-report.json` `ok: true`, `zeroPageErrors: true`.

## Reused

RDI/Data Reality, DATA_OBJECT, provenance, semantic understanding, Data Rail, Director, Scene Intent/Script, Stage R3F Canvas, NexoGraph/DTH:3, Advisor/NCA, object-click runtime.

## Added

Minimum Stage renderer (`NexoraStageDataObject`), inspection, Director projection, dashed provenance line pattern, Advisor stage-awareness adapter, diagnostics on shell/mount.

## Not added

No second CSV ingestion, source truth, Data Reality, semantic authority, provenance authority, object store, Director, Stage, relationship truth, Advisor, or business Focus authority.

## Remaining gaps (DATA-UX:5)

Source deletion, dependency impact, tombstone/provenance of removal, keep/remove dependent objects, final lifecycle certification.

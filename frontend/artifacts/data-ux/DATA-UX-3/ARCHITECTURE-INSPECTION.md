# DATA-UX:3 Architecture Inspection

Date: 2026-08-31

## Inspected

- DATA-UX:1 and DATA-UX:2 architecture, authority, integration, proof, and certification artifacts.
- RDI:2 deterministic parser, mapping review, validation, mapper, provenance, committed-import store, replacement, workspace guards, and failure behavior.
- P0 Data Reality handoff, Runtime/Stage/Advisor consumers, immutable DATA_OBJECT projection, Data Rail, source intelligence, and Executive shell ownership.
- Manager–Object, NCA:1–7 boundaries, NCA:2 dialogue/pending-question state, NCA:3 question intelligence, smart clarification, failed-turn recovery, conversational orchestrator, and shell submit path.
- Existing mapping vocabulary, domain definitions, Evidence boundaries, Director/Stage composition, tests, funnel, build, and live-smoke infrastructure.

## Finding

No separate CSV semantic authority existed. Structural meaning was split between the authoritative RDI mapping record and a manual mapping form. NCA already owned clarification continuity. The smallest compatible change was therefore:

1. enrich the existing `CsvColumnMapping` record with semantic metadata;
2. add bounded interpretation functions over existing RDI targets and parsed context;
3. adapt one material unresolved mapping into the existing NCA:2 pending question;
4. route the natural reply back to the open RDI review.

The first divergent layer and expected/actual record are in `SEMANTIC-AUTHORITY-MAP.md`.

## Reused

- RDI parser, mapping, preparation, mapper, provenance, workspace/source identity, atomic commit, and replacement.
- NCA:2 conversation state and existing Advisor conversational surface.
- DATA-UX:2 Data Rail, `Update source`, and shell composition.
- P0 Data Reality, DATA_OBJECT, Stage, Director, Evidence, and manager-object authorities unchanged.

## Added

- semantic fields on the existing RDI mapping record;
- a stateless semantic compatibility module;
- a stateless NCA:2 adapter;
- minimal Data Rail/Advisor invocation wiring;
- diagnostics and focused tests.

## Not added

No second CSV parser/ingestion path, semantic store, Data Reality store, provenance database, Advisor, chatbot, pending-question state, Evidence authority, business-object store, Stage, or Director.


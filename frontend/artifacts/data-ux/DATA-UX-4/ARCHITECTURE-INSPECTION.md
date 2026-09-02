# DATA-UX:4 Architecture Inspection

Date: 2026-08-31

## Expected versus actual

Expected: the certified RDI source projects through the canonical `DATA_OBJECT` adapter, Director-owned scene presentation, and the existing React Three Fiber Stage as one selectable spatial participant. A zero-Executive-Object source must remain independently renderable.

Actual before DATA-UX:4: Data Rail rows already expose the canonical DATA_OBJECT ID, but `View on Stage` resolves an affected business-object `stageObjectId`. A zero-object source therefore has no Stage target. `stageCompatibility.rendererRequired` is false, relationships are empty, and the existing Stage scene maps only business/context objects.

First divergent layer: Decision Theatre presentation integration after the certified DATA_OBJECT projection and before the existing Stage renderer. RDI, Data Reality, semantic understanding, source identity, provenance, and the Data Rail are not divergent.

## Reused authorities

- Source truth and lifecycle: `RDI:2/CsvCommittedImport` and its existing store.
- Executive reality and provenance: canonical Data Reality handoff/snapshot.
- Semantic meaning: the existing `CsvColumnMapping.semantic` review.
- Logical data identity: `DATA-UX:1/DecisionTheatreDataObjectProjection`.
- Detailed source control: DATA-UX:2 Data Rail.
- Source interpretation and affected-object mapping: RDI:3 Executive Source Intelligence.
- Scene purpose: existing `ORIENT_TO_STAGE` / `PRESERVE_SCENE` vocabulary.
- Spatial rendering: the existing R3F Canvas, fixed-camera topology plane, connection renderer, and Stage safe zones.
- Relationship grammar: DTH:3 NexoGraph relationship resolver and visual claim ledger.
- Business focus: NEX-MVP object interaction / Manager–Object authority.
- Conversation: existing Advisor/NCA surface and DATA-UX:3 semantic inquiry authority.

## Hard boundaries

The Stage projection is disposable and read-only. It cannot write RDI, Data Reality, semantic mappings, provenance, Evidence, Goal, Decision, journey, Director truth, or business Focus. Selection of a DATA_OBJECT is presentation inspection, not Manager–Object focus.

## Measurable stop condition

DATA-UX:4 stops only when one canonical source yields one native R3F Stage participant; Director-owned presentation determines visibility and placement; zero-object sources render without fabricated actors; supported source relationships derive from canonical affected-object/provenance data and are explicitly non-causal; Stage selection and removal preserve business Focus and source truth; source replacement updates rather than duplicates the participant; multiple sources remain readable; focused/owning/integration tests, Funnel Levels 1–4, TypeScript, ESLint, build, diff check, and live manager proofs pass with no unresolved required task.

## Architecture quality answers

1. Truth: RDI:2 committed import / Data Reality snapshot.
2. Meaning: DATA-UX:3 mapping semantics.
3. Visibility: Director projection from manager-requested ids + scene density.
4. Placement: Director projection; renderer consumes it.
5. Relationships: ESI affected objects + DTH:3.
6. Focus: existing Manager–Object interaction.
7. Explanation: existing Advisor; DATA_OBJECT adapter is read-only.
8–12. Stage does not write Data Reality; click does not create Evidence; import does not fabricate objects; replacement does not duplicate; Stage removal does not delete.

DATA-UX:5 is out of scope.

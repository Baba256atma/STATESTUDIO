# Gap Classification

## Already built

- CSV file selection, parsing, preview, schema/column discovery, deterministic mapping, ambiguity confirmation, validation, import, replace/cancel.
- Canonical source identity, source snapshots, record/field provenance, Data Reality handoff, workspace isolation and atomic failure behavior.
- Multiple CSV sources, active-source selection, source intelligence, source comparison, affected Stage objects, Advisor source context.
- `/executive` left Data Explorer open/close/resize behavior and Stage-return action.
- Inactive-source removal safety and active-source refusal.

## Already built but not exposed

- Rich provenance and transformation references exist below the UI but are summarized rather than fully browsable.
- Data Reality-aware Advisor has broader deterministic evidence/context capability than the source UI exposes as free-form source questions.

## Already built but incomplete

- CSV commit durability is process/session memory, not durable persistence.
- Removal handles the source record but does not perform a complete cross-authority dependency impact workflow.
- Source update is replace-by-stable-source identity; no polished version-history UX.
- Advisor source interrogation is action/context driven; arbitrary “what does this column mean?” coverage is incomplete.

## Needs integration

- Render/select/focus `DATA_OBJECT` through the existing Stage/Director application path.
- Canonical, provenance-backed `supplies`/`supports` relationships and dependency query.
- Advisor resolution of Data Object references in normal conversation.

## Needs future UX work

- Stage-attached professional Data control surface; luxury CSV Data Object form; source inspection scenes; dependency/removal confirmation; provenance/lineage explorer.

## Actually missing

- Durable CSV source persistence across sessions.
- Full dependency graph and historical tombstone/source-removed state for CSV removal.
- Database/API/document Data Objects (out of DATA-UX:1 scope).

The DATA-UX:1 missing bridge—read-only Theatre Data Object projection—is now implemented.


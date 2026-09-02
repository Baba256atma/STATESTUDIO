# DATA-UX:4 Director Integration

Date: 2026-08-31

## Reused intents

No new Scene Intent family. Existing DTH:5 kinds are reused:

- `ORIENT_TO_STAGE` — manager asked to see the source on Stage
- `PRESERVE_SCENE` — comparison/commitment/consequence scenes keep the executive scene; Data Objects stay omitted unless explicitly inspected
- `COMPARE_CANDIDATES`, `REVIEW_COMMITMENT`, `REVIEW_CONSEQUENCE` — density omit

DIR:1 remains the conversation-to-Stage director. DATA-UX:4 adds a read-only placement adapter (`DATA-UX:4/DirectorDataObjectStageProjection`) that consumes canonical DATA_OBJECT identity and current Stage object positions. It does not replace DIR:1.

## What DATA_OBJECT supplies

Identity, presentation capabilities, canonical relationships, understanding/validation state.

## What Director determines

Whether the object belongs in the current scene, placement under existing objects, relative arrangement of multiple sources, visibility, density, and whether relationships are disclosed (only if both ends are visible).

DATA_OBJECT does not self-position in the renderer.

## Import consent

CSV import updates Data Rail / Data Reality only. Stage membership is manager-requested. Advisor may explain the source; it must not replace an active Decision scene because data arrived.

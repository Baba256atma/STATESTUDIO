# NEX-ENT:5 Guided Attention contract

Reusable identity: `DIR:GA/NexoraGuidedAttentionPresentation` `1.0.0`

Education identity: `NEX-ENT:5/GuidedAttentionEducation` `1.0.0` (does not own DIR:GA)

## Targets this phase

- `DATA_ENTRY` → Data control (`data-testid="nexora-stage-data-control"`)
- `BACK_CONTROL` → Back (`data-testid="nexora-stage-step-back"`) when `canStepBack`
- `STAGE` → Stage frame (`data-testid="executive-stage-frame"`)

## Cues

- `SOFT_HALO` — default restrained accent halo
- `EMPHASIS` — reduced-motion static outline

Duration: 3000ms. Newest request replaces the previous cue. Repeat uses a new `requestId`.

## Intent

`LOCATE_UI` vs `UI_ACTION` vs `NONE`. “How do I add my data?” locates. “Add this data” is action and is not Guided Attention. “Show me the problems” is collection, not attention. Contextual “Show me” only when `pendingOfferTarget` is set.

## Education progression

`NOT_STARTED` → `INTRODUCING` → `DATA_GUIDANCE` → `SECOND_TARGET` → `REVIEW` → `COMPLETED` | `SKIPPED`

# NPA-T STAGE-PROD:6A — Architecture inspection

## Existing motion infrastructure

- `STAGE-MOTION:1/ExecutiveStageSmoothAnchorRecomposition` is the existing single presentation-only Canvas motion authority.
- `NexoraStageMotionController` maps final Stage Object targets, observes `prefers-reduced-motion`, and advances the existing motion authority.
- `NexoraStageObject` consumes the authority's position, opacity, visibility, and scale sample. Existing focused work Objects already project a bounded scale target (`1.08` for Capacity Gap), which the authority interpolates.
- Existing Stage focus and selection remain owned by NEX-MVP:4 and STAGE-PROD:5; motion does not resolve meaning.

## First divergent layer

The existing motion runtime had no small STAGE-PROD semantic contract that explicitly described REST versus EMPHASIZED from the already-authoritative focus/selection flags. The accessible Object companion control also changed focus styling immediately rather than exposing a bounded semantic motion treatment and reduced-motion fallback.

## 6A path

Existing canonical Object focus/selection → `NPA-T STAGE-PROD:6A/ObjectMotionFoundation` → REST or EMPHASIZED presentation marker → existing STAGE-MOTION:1 Canvas scale path plus a restrained Object-control CSS treatment.

The adapter preserves the canonical ID, creates no state machine, timer, frame loop, semantic inference, or write path. Its normal treatment is a one-pixel lift and 1.5% scale over 180 ms. Reduced motion removes transform and transition while retaining a stable outline.

Cards and Charts do not receive the Object motion class or markers and remain stationary 2D presentation.

## Authority result

No new animation authority was introduced. STAGE-MOTION:1 remains the only Canvas motion authority; 6A is a pure semantic presentation adapter over existing focus/selection.

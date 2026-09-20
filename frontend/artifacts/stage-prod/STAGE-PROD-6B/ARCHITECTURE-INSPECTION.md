# NPA-T STAGE-PROD:6B — Architecture inspection

## Existing Scene-motion seam

`STAGE-PROD:3/DirectorStageComposition` already produces final canonical Object positions. `NexoraStageMotionController` converts those rendered Objects and context nodes into target entries consumed by the single `STAGE-MOTION:1` authority. `NexoraStageObject` samples that authority for position, opacity, scale, and visibility. Relationships already read live canonical Object endpoints while motion is active.

## First divergent layer

The target-map construction lived privately inside the Canvas controller and did not expose an explicit STAGE-PROD composition-to-motion boundary. More importantly, the existing enter/exit sampler treated an Object as fully settled whenever its position was already at target, causing enter opacity/scale to snap. Exit opacity also defaulted to the new zero-opacity target rather than the previous canonical target when no live opacity seed was supplied.

## 6B production path

Director/Theatre → STAGE-PROD:3 composition → `NPA-T STAGE-PROD:6B/LiveSceneMotionProjection` → existing `STAGE-MOTION:1` → `NexoraStageObject`.

The 6B projection maps only canonical IDs and immutable final position/visibility/opacity/scale targets. It owns no clock, interpolation, Scene choice, semantic state, or business writes. `STAGE-MOTION:1` remains the only interpolation authority and the only existing Canvas frame-loop path.

## Enter/exit correction

- Position settlement is now independent from whole-transition settlement, so a stationary newly entered Object can still complete bounded opacity/scale entry.
- Retained Objects transitioning to hidden seed opacity/scale from the previous target when no live seed exists.
- Objects removed from the canonical composition are not retained as UI ghosts and cannot be substituted by label.

## Relationship boundary

Relationship endpoints already follow live Object positions using canonical source/target IDs. Relationship appearance/disappearance opacity animation is deferred: the current renderer has no retained-edge opacity lifecycle, and adding one would exceed the bounded 6B scope. No causal or relationship meaning was inferred.

## Authority result

One semantic Scene authority and one motion authority remain. No second frame loop, interpolation engine, choreography language, or animation-owned executive state was introduced.

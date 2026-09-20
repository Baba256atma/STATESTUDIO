# NPA-T STAGE-PROD:5 — Architecture inspection

## Existing production seam

`/executive` mounts `NexoraExecutiveShell` → `NexoraStageMount` → `Nexora3DExecutiveStage`. The Stage's existing native button controls send the rendered Object's canonical ID to `onSelectSubject`. `NexoraExecutiveShell` delegates that ID to `selectNexoraMVPInteractionSubject`, which remains the NEX-MVP:4 selection/focus owner and updates the already-certified manager Object and referent handoffs.

DTH:6 already provides the bounded `NexoraDecisionTheatreObjectInvestigation` and the existing `NexoraDecisionTheatreInvestigationSurface` already provides progressive glance/understand/investigate disclosure and local dismissal. No second inspector, Object store, Stage state, referent resolver, or business-write path was required.

## First divergent layer

The mount previously rendered any non-dismissed DTH investigation without explicitly verifying that its canonical ID remained in the current valid Stage composition. STAGE-PROD:4 visuals displayed provenance, but did not provide a bounded inspection control that exposed their canonical Object, source, and evidence associations.

## Production interaction path

Visible Stage Object → native keyboard/pointer activation → exact rendered canonical ID → existing NEX-MVP:4 selection/focus transition → existing DTH:6 investigation → `NPA-T STAGE-PROD:5/InteractiveDisclosure` identity/visibility guard → existing investigation surface.

The guard performs identity equality and current-composition membership checks only. It returns the exact upstream investigation object when valid, returns no investigation when dismissed/unavailable/stale, performs no label lookup, and has no write capability.

Contextual visuals now offer a native `details`/`summary` inspection control exposing only the STAGE-PROD:4 specification's existing canonical Object IDs, source IDs, and evidence states.

## Authority result

- Selection/focus: NEX-MVP:4.
- Conversational referent: existing certified shell/Advisor bridge handoff.
- Disclosure content: DTH:6.
- Visual association/provenance: STAGE-PROD:4 over DIR/DTH evidence.
- Dismissal: existing shell-local presentation state (`investigationDismissedId`).
- Business writes: none.

No architecture violation was found or introduced.

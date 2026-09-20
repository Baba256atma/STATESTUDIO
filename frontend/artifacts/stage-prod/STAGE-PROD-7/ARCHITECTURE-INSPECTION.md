# STAGE-PROD:7 architecture inspection

Conversation → Stage already converges through CC:5 canonical NLU/context → DIR:1 → DTH → `interaction` → `buildNexoraMVPAdvisorContextBridge` / `projectStageProdLiveFoundation` → `NexoraStageMount` → `Nexora3DExecutiveStage`.

Stage → Conversation already converges through the rendered Object canonical ID → `selectNexoraMVPInteractionSubject` (NEX-MVP:4) → `activateManagerObjectFromClick` (MO:1) → existing conversation continuity → Advisor.

The reproduced first divergence was an explicit named `EXPLAIN`: NLU and MO resolved `ctx-problem-capacity`, but DIR:1 classified the turn as `NO_CHANGE`, leaving the shared Stage/Advisor interaction at `none`. A second stale-context seam existed when the existing NCA Comparison became active: DTH correctly composed the pair, but the older singular NEX-MVP:4 focus could remain visible to the Advisor bridge.

The bounded repair admits an already-resolved, explicit named `EXPLAIN` into DIR:1's existing `FOCUS_OBJECT` application path. The shell releases singular selection/focus through the existing NEX-MVP:4 overview reset when the existing NCA state has at least two active Comparison candidates. No resolver, store, Director, Theatre, Advisor, animation authority, or synchronization state was added.

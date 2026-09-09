# NPA-T POST-ECA:2 — Architecture Inspection

Date: 2026-09-08

## Stop condition

POST-ECA conversation integration only. ECA:1 is not redesigned. ECA:13 is not started. No second Stage store, Director, Theatre, conversation-context engine, or correction engine. Advisor remains a reader of Stage/Director presentation.

## 1. Exact runtime reproduction

**Case A — Overview (failure)**

Initial MVP runtime: `createInitialNexoraMVPObjectInteractionState({ workspace: "overview" })` has `focusedSubject = null`, `collectionContext = null`, `trail = []`.

The 3D Stage still renders disclosed actors via `deriveNexoraMVPStageInteractionPresentation` → `resolveNexoraMVPStageScenePresentation` → `resolveExecutiveStageDisclosure` (CENTER / RELATED / WATCH). Watch-role objects are labeled with a secondary `WATCH` line; managers describe them as “Customer Watch”, “Capacity Watch”. Those strings are **not** catalog names. Catalog names are `Customer`, `Capacity`, `Delivery`, `Risk`, etc.

Manager: `what is on stage?`

Nexora: `The Stage does not currently show any executive objects.`

That sentence is composed in `composeWorkspaceReply` when `labels.length === 0` and the snapshot path never uses presentation-visible actors.

**Case B — Focus (success, incomplete)**

After manager focus (click or `Focus on Risk` / Investigate Risk), `focusedSubject` is set. Orchestrator STAGE_META branch requires `incomingStage.collection || incomingStage.focus`, so `composeStageSceneExplanation` runs and reports the focused object (and “you focused this object” when the reason string contains “focus”). Surrounding Watch/related actors are still omitted because `visibleMembers` is built only from focus + collection ids.

## 2. Why Overview visibly renders objects

Overview is a first-class Stage scene. `resolveExecutiveStageDisclosure({ presentationMode: "overview" })` assigns:

- optional executive-context **center**
- goal **related**
- ranked **watch** actors (`rankExecutiveWatchCandidates`, budget 2 at `presentationState: "minimum"`)
- remaining subjects **hidden** (Queue / overflow)

`Nexora3DExecutiveStage` renders `spatialRole !== "hidden"` with `labelVisible: true`. Watch is `background-discoverable`, not hidden. Visible composition can be nonempty with `focusedObject = none`.

## 3. Where those visible objects come from

Canonical presentation function:

`deriveNexoraMVPStageInteractionPresentation(runtimeState, catalog)`

Scene objects carry `spatialRole`, `disclosureState`, `labelPrimaryLine`, `labelSecondaryLine`. This is the same projection the Stage already uses. Queue entries and Problems collection membership are separate (`queueEntries`, `collectionContext`) and must not substitute for visible actors.

## 4. Why Advisor currently reports zero objects

Authority chain that **works for focus** and **fails for Overview**:

```
Runtime interaction state (focus + collection only)
    → projectAuthoritativeStageContext
         visibleMembers = [focus] ∪ collection.objectIds
    → ECA:1 stageContext.visible
    → NCA-POST:3 composeWorkspaceReply / NXA:5-FIX4 composeStageSceneExplanation
    → Advisor
```

On Overview, both focus and collection are null ⇒ `visibleMembers = []`.

Additionally:

- Orchestrator only installs `composeStageSceneExplanation` when `collection || focus`. Overview STAGE_META falls through to `composeWorkspaceReply`.
- `composeWorkspaceReply` never answers from `snapshot.visibleObjects` unless collection members or focus exist. Empty `trailLabels` then yields “no executive objects”.
- “Executive objects” here means focus/collection catalog members, not Watch-role presentation actors. That family mismatch is the screenshot failure.

Hypothesis **confirmed**: click → canonical focus → ECA:1 → Advisor works. Rendered Stage composition is not wired into the conversation read model.

## 5. Why focused Risk works

`projectAuthoritativeStageContext` always inserts `state.focusedSubject` into `visibleMembers`. STAGE_META + focus selects `composeStageSceneExplanation`. ECA:1 already consumes that focus as `STAGE_CANDIDATE`. POST-ECA:2 must keep this and add complementary visible composition.

## 6. Stage presentation authority

`deriveNexoraMVPStageInteractionPresentation` / `resolveNexoraMVPStageScenePresentation` / STAGE-PROD disclosure. One presentation authority.

## 7. Stage focus authority

`NexoraMVPObjectInteractionState.focusedSubject` (manager click and Director-applied focus). ECA:1 already reads it. Conversation subject ≠ Stage focus remains.

## 8. Director role

DIR:1 decides presentation commands. STAGE_META / STAGE_COMPATIBLE already freeze Stage (`shouldCommitRuntime: false`, no `applyDirectorPlanToStage`). POST-ECA:2 does not issue Director commands for read questions.

## 9. ECA:1 Stage inputs

`EcaStageContext` already has `focus`, `selected`, `visible`, `collection`. Orchestrator copies `incomingStage.visibleMembers` into `visible`. The gap is the **contents** of that read model, not a missing ECA:1 field. Visible actors should also be `STAGE_CANDIDATE` so Overview names resolve without a prior click. No ECA:1 redesign.

## 10. Advisor Stage-answer path

1. `isStageMetaUtterance` → `STAGE_META`
2. NCA-POST:3 `CURRENT_WORKSPACE` / `WORKSPACE_STATE` → `composeWorkspaceReply`
3. Orchestrator may replace with NXA:5-FIX4 scene explanation when focus/collection exist
4. ECA overlays (5/6) do not currently own membership copy

Membership must prefer the Stage presentation projection, not Problems collection, Queue, current subject, or trail.

## 11. Existing reusable projection

Reuse `deriveNexoraMVPStageInteractionPresentation` inside `projectAuthoritativeStageContext` (NXA:5-FIX4 read model). That **is** Stage Awareness. Do not add `AdvisorStageStore` or a parallel interface unless needed; extend `AuthoritativeStageContext.visibleMembers` / snapshot.

Manager-facing Watch names: catalog label + Watch spatial role / secondary line (not hardcoded Customer/Capacity/Delivery/Risk).

## 12. Smallest safe integration

1. Project visible actors from the existing Stage presentation (exclude `spatialRole === "hidden"`).
2. Answer Overview membership from that list when focus is null.
3. When focus and other visible actors exist, report both.
4. Bind Stage corrections in ECA:5 to Stage visibility, never subject `You`.
5. Treat Stage inspection as an ECA:6 side question.
6. Diagnostics on the shell from the same read model.

## 13. Authorities explicitly NOT changed

ECA:1 identity/contract (inputs extended only). ECA:4 / ECA:4-POST1. ECA:5 engine (binding rule only). ECA:6 engine (side-question/resume cues only). Director writers. DTH scene direction. Stage business writers. Queue/collection canonical membership. No ECA:13, Mini Nexora, RAG, or second Theatre.

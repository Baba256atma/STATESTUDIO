/**
 * NPA-T STAGE-ISOLATED-BROWSER-HARNESS:1
 * Standalone canvas host. Not a Next.js route and not imported by /executive.
 */

import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { nexoraDecisionTheatreDataObjectStageProjectionIdentity } from "../../app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import type { NexoraDecisionTheatreDataObjectStageProjection } from "../../app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "../../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "../../app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import {
  projectTestOwnedStageCatalog,
  type StageTestOwnedScenario,
} from "../../app/lib/spatial-presentation/executiveStageTestOwnedSubjectProjection.ts";
import { NexoraStageCanvas } from "../../app/executive/nex-mvp/stage/NexoraStageCanvas.tsx";
import { composeIsolatedStagePresentation } from "./composeIsolatedStagePresentation.ts";

const EMPTY_DATA_OBJECTS: NexoraDecisionTheatreDataObjectStageProjection = Object.freeze({
  identity: nexoraDecisionTheatreDataObjectStageProjectionIdentity,
  participants: Object.freeze([]),
  connections: Object.freeze([]),
  diagnostics: Object.freeze({
    canonicalSourceIds: Object.freeze([]),
    dataObjectIds: Object.freeze([]),
    stageInstanceIds: Object.freeze([]),
    selectedDataObjectId: null,
    businessFocusId: null,
    relationshipIds: Object.freeze([]),
    relationshipSemantics: Object.freeze([]),
    visibilityReasons: Object.freeze([]),
    duplicateCount: 0,
    directorOwnsPlacement: true as const,
    projectionOnly: true as const,
    mutatesBusinessFocus: false as const,
    mutatesDataReality: false as const,
  }),
});

function overviewState(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function IsolatedStageHarness() {
  const [scenario, setScenario] = useState<StageTestOwnedScenario>("workspace-a");
  const [interaction, setInteraction] = useState(overviewState);
  const catalog = useMemo(() => projectTestOwnedStageCatalog(scenario), [scenario]);
  const presentation = useMemo(
    () => composeIsolatedStagePresentation(interaction, catalog, scenario),
    [interaction, catalog, scenario],
  );
  const advisor = buildNexoraMVPAdvisorContextBridge(interaction, presentation);
  const environment = deriveNexoraMVPSceneEnvironmentVisualState("neutral");
  const subjectIds = presentation.scene.objects.map((object) => object.id).join(",");
  const world = JSON.stringify(
    presentation.scene.objects.map((object) => ({
      id: object.id,
      position: object.targetPosition,
    })),
  );

  function choose(next: StageTestOwnedScenario) {
    setScenario(next);
    setInteraction(overviewState());
  }

  return (
    <main data-testid="stage-isolated-harness" data-harness-identity="NPA-T STAGE-ISOLATED-BROWSER-HARNESS:1" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 8, padding: 8, flexWrap: "wrap" }}>
        <button type="button" data-testid="harness-workspace-alpha" onClick={() => choose("workspace-a")}>Workspace Alpha</button>
        <button type="button" data-testid="harness-workspace-beta" onClick={() => choose("workspace-b")}>Workspace Beta</button>
        <button type="button" data-testid="harness-no-center" onClick={() => choose("no-center")}>No Center</button>
        <button type="button" data-testid="harness-foreign-company" onClick={() => choose("foreign-company")}>Foreign Company</button>
        <button type="button" data-testid="harness-overview" onClick={() => setInteraction(resetNexoraMVPObjectInteractionOverview(interaction))}>Overview</button>
        <button type="button" data-testid="harness-focus-capacity" onClick={() => setInteraction(selectNexoraMVPInteractionSubject(interaction, "test-capacity-alpha", catalog))}>Focus Capacity</button>
      </div>
      <div
        data-testid="harness-status"
        data-scenario={scenario}
        data-anchor={presentation.scene.overviewAnchorId ?? ""}
        data-focused={presentation.scene.focusedObjectId ?? ""}
        data-advisor={advisor.advisorSubjectId ?? ""}
        data-subject-ids={subjectIds}
        data-world={world}
        style={{ display: "none" }}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <NexoraStageCanvas
          presentation={presentation}
          environment={environment}
          dataObjectStage={EMPTY_DATA_OBJECTS}
          onSelectSubject={(subjectId) => setInteraction(selectNexoraMVPInteractionSubject(interaction, subjectId, catalog))}
          onSelectDataObject={() => undefined}
          onClearSelection={() => setInteraction(resetNexoraMVPObjectInteractionOverview(interaction))}
        />
      </div>
    </main>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<IsolatedStageHarness />);

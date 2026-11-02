/**
 * NPA-T STAGE-ISOLATED-BROWSER-HARNESS:1
 * Test-only composition for the isolated Stage canvas.
 * Theatre, isometric placement, and management levels are not mounted:
 * this dataset has no theatre session. The remaining writers are the
 * same functions the production canvas calls after those preferences.
 */

import { applyExecutiveStageFixedCameraToStagePresentation } from "../../app/lib/nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { applyExecutiveStageObjectLabelTerritoryToStagePresentation } from "../../app/lib/nex-mvp/nexoraMVPExecutiveStageObjectLabelTerritory.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../../app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../../app/lib/nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import {
  deriveNexoraMVPStageInteractionPresentation,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
  type NexoraMVPStageInteractionPresentation,
} from "../../app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  STAGE_TEST_WORKSPACE_ALPHA,
  STAGE_TEST_WORKSPACE_BETA,
  type StageTestOwnedScenario,
} from "../../app/lib/spatial-presentation/executiveStageTestOwnedSubjectProjection.ts";

export function isolatedStageWorkspaceId(scenario: StageTestOwnedScenario): string {
  return scenario === "workspace-b" ? STAGE_TEST_WORKSPACE_BETA : STAGE_TEST_WORKSPACE_ALPHA;
}

export function composeIsolatedStagePresentation(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
  scenario: StageTestOwnedScenario,
): NexoraMVPStageInteractionPresentation {
  const derived = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
    activeManagerWorkspaceId: isolatedStageWorkspaceId(scenario),
  });
  const plane = applyExecutiveStage2DTopologyPlaneToStagePresentation(derived);
  const placed = applyExecutiveStage2DTopologyRecompositionToStagePresentation(plane, {
    ...(plane.scene.overviewAnchorId != null
      ? { overviewAnchorId: plane.scene.overviewAnchorId }
      : {}),
  });
  const camera = applyExecutiveStageFixedCameraToStagePresentation(placed);
  const level = state.presentationState === "report" || state.presentationState === "operation"
    ? state.presentationState
    : "minimum";
  return applyExecutiveStageObjectLabelTerritoryToStagePresentation(camera, {
    presentationLevel: level,
  });
}

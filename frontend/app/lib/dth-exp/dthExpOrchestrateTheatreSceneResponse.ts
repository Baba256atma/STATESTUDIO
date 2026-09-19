/**
 * NPA-T DTH-EXP:7B — orchestrate certified Theatre response to an interpreted conversation turn.
 * Does not parse utterances, command Stage, or select Nexo/actors/layout/Evidence.
 */

import { selectNexoraDirectorNexoFamily } from "./dthExpSelectDirectorNexoFamily.ts";
import { composeNexoraDirectorSceneContext } from "./dthExpDirectorSceneComposition.ts";
import { projectDthExpSpatialLayout } from "./dthExpProjectSpatialLayout.ts";
import { planDthExpSceneTransition } from "./dthExpPlanSceneTransition.ts";
import { projectDthExpEvidenceScene } from "./dthExpProjectEvidenceScene.ts";
import {
  DTH_EXP_THEATRE_SCENE_RESPONSE_ENGINE,
  dthExpTheatreSceneResponseIdentity,
  dthExpTheatreSceneResponseVersion,
} from "./dthExpTheatreSceneResponseIdentity.ts";
import {
  DTH_EXP_THEATRE_SCENE_RESPONSE_PIPELINE,
  type DthExpTheatreSceneResponse,
  type DthExpTheatreSceneResponseInput,
  type DthExpTheatreSceneResponseState,
} from "./dthExpTheatreSceneResponseContract.ts";
import type { DthExpDirectorNexoSelection } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpDirectorSceneComposition } from "./dthExpDirectorSceneCompositionContract.ts";
import type { DthExpEvidenceSceneProjection } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpSceneTransitionPlan } from "./dthExpSceneTransitionContract.ts";
import type { DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
import type { DthExpTheatreScene } from "./dthExpTheatreContract.ts";

function subjectId(input: DthExpTheatreSceneResponseInput): string | null {
  return (
    input.awareness?.grounding.canonicalObjectId ??
    input.turn.referent.canonicalSubjectId ??
    input.turn.referent.selectedCanonicalObjectId ??
    input.turn.referent.collectionMemberId ??
    null
  );
}

function empty(
  input: DthExpTheatreSceneResponseInput,
  state: DthExpTheatreSceneResponseState,
  reason: string,
  extras: {
    readonly selection?: DthExpDirectorNexoSelection | null;
    readonly composition?: DthExpDirectorSceneComposition | null;
    readonly canonicalSubjectId?: string | null;
  } = {},
): DthExpTheatreSceneResponse {
  return freezeResponse({
    state,
    managementReason: reason,
    canonicalSubjectId: extras.canonicalSubjectId ?? subjectId(input),
    managementNeed: input.turn.managementNeed,
    sourceFamily: input.sourceFamily ?? input.sourceSpatial?.family ?? null,
    targetFamily: extras.selection?.selectedFamily ?? null,
    selection: extras.selection ?? null,
    composition: extras.composition ?? null,
    scene: null,
    spatial: null,
    transition: null,
    evidence: null,
    ignoredRawUtterance: input.turn.rawUtterance != null && input.turn.rawUtterance.length > 0,
    reducedMotionEquivalent: input.reducedMotion === true,
  });
}

function freezeResponse(
  partial: Omit<
    DthExpTheatreSceneResponse,
    | "identity"
    | "version"
    | "engine"
    | "pipeline"
    | "reusedCertifiedPipeline"
    | "advisorToSceneShortcut"
    | "parsesRawText"
    | "advisorChoosesNexo"
    | "advisorSelectsActors"
    | "advisorLayoutsActors"
    | "advisorAnimatesActors"
    | "advisorManufacturesEvidence"
    | "deicticReResolved"
    | "liveStageWiring"
    | "writesCanonicalObjects"
    | "writesDecision"
    | "writesExecution"
    | "writesOutcome"
    | "assignsVaiRoles"
    | "upgradesCausality"
    | "calculatesRisk"
  >,
): DthExpTheatreSceneResponse {
  return Object.freeze({
    identity: dthExpTheatreSceneResponseIdentity,
    version: dthExpTheatreSceneResponseVersion,
    engine: DTH_EXP_THEATRE_SCENE_RESPONSE_ENGINE,
    pipeline: DTH_EXP_THEATRE_SCENE_RESPONSE_PIPELINE,
    reusedCertifiedPipeline: true as const,
    advisorToSceneShortcut: false as const,
    parsesRawText: false as const,
    advisorChoosesNexo: false as const,
    advisorSelectsActors: false as const,
    advisorLayoutsActors: false as const,
    advisorAnimatesActors: false as const,
    advisorManufacturesEvidence: false as const,
    deicticReResolved: false as const,
    liveStageWiring: false as const,
    writesCanonicalObjects: false as const,
    writesDecision: false as const,
    writesExecution: false as const,
    writesOutcome: false as const,
    assignsVaiRoles: false as const,
    upgradesCausality: false as const,
    calculatesRisk: false as const,
    ...partial,
  });
}

function evidenceFor(
  family: DthExpNexoRecipeFamily,
  scene: DthExpTheatreScene,
  spatial: DthExpSpatialLayoutProjection,
  input: DthExpTheatreSceneResponseInput,
  transition: DthExpSceneTransitionPlan | null,
): DthExpEvidenceSceneProjection {
  return projectDthExpEvidenceScene({
    family,
    scene,
    spatial,
    records: input.evidenceRecords ?? [],
    transition,
  });
}

export function orchestrateDthExpTheatreSceneResponse(
  input: DthExpTheatreSceneResponseInput,
): DthExpTheatreSceneResponse {
  const ignoredRawUtterance = Boolean(input.turn.rawUtterance && input.turn.rawUtterance.length > 0);
  const canonicalSubjectId = subjectId(input);
  const sourceFamily = input.sourceFamily ?? input.sourceSpatial?.family ?? null;
  const sourceScene = input.sourceScene ?? null;
  const sourceSpatial = input.sourceSpatial ?? null;

  if (input.turn.ambiguity !== "none" && canonicalSubjectId == null) {
    return empty(input, "unresolved", "ambiguous-grounding-does-not-guess-scene");
  }

  if (input.turn.responseKind === "preserve" || input.turn.responseKind === "evidence-inspection") {
    if (sourceScene == null || sourceSpatial == null || sourceFamily == null) {
      return empty(input, "unresolved", "preserve-without-current-scene");
    }
    return freezeResponse({
      state: "preserved",
      managementReason: input.turn.managementReason,
      canonicalSubjectId,
      managementNeed: input.turn.managementNeed ?? "CONTINUATION",
      sourceFamily,
      targetFamily: sourceFamily,
      selection: null,
      composition: null,
      scene: sourceScene,
      spatial: sourceSpatial,
      transition: null,
      evidence: evidenceFor(sourceFamily, sourceScene, sourceSpatial, input, null),
      ignoredRawUtterance,
      reducedMotionEquivalent: input.reducedMotion === true,
    });
  }

  const need = input.turn.managementNeed;
  if (canonicalSubjectId == null) {
    return empty(input, "unresolved", "canonical-subject-not-established");
  }
  if (need == null) {
    return empty(input, "unresolved", "management-need-not-interpreted");
  }

  const selection = selectNexoraDirectorNexoFamily({
    directorPlan: input.directorPlan,
    canonicalSubjectId,
    managementNeed: need,
    currentNexoFamily: sourceFamily,
  });
  if (selection.selectionState === "unresolved" || selection.selectedFamily == null) {
    return empty(input, "unresolved", selection.selectionReason, { selection, canonicalSubjectId });
  }

  const composition = composeNexoraDirectorSceneContext({
    selection,
    directorPlan: input.directorPlan,
    graph: input.graph,
  });
  const scene = composition.recipeResolution?.scene ?? null;
  if (composition.compositionState !== "ok" || scene == null || composition.selectedFamily == null) {
    return empty(input, "insufficient-context", composition.compositionReason, {
      selection,
      composition,
      canonicalSubjectId,
    });
  }

  const family = composition.selectedFamily;
  const spatial = projectDthExpSpatialLayout({
    scene,
    family,
    bottleneckFocusCanonicalObjectId:
      selection.managementNeed === "BOTTLENECK_LOCATION" ? input.graph.bottleneckCanonicalObjectId ?? null : null,
  });
  const transition =
    sourceSpatial != null && sourceScene != null
      ? planDthExpSceneTransition({
          source: sourceSpatial,
          target: spatial,
          sourceScene,
          targetScene: scene,
          supersededPlanId: input.previousTransition?.planId ?? null,
        })
      : null;
  const evidence = evidenceFor(family, scene, spatial, input, transition);
  const sameFamily = sourceFamily != null && sourceFamily === family;

  return freezeResponse({
    state: sameFamily ? "same-family-refined" : "composed",
    managementReason: input.turn.managementReason,
    canonicalSubjectId,
    managementNeed: selection.managementNeed,
    sourceFamily,
    targetFamily: family,
    selection,
    composition,
    scene,
    spatial,
    transition,
    evidence,
    ignoredRawUtterance,
    reducedMotionEquivalent: input.reducedMotion === true,
  });
}

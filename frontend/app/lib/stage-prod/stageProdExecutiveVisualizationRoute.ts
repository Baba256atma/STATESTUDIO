/**
 * NPA-T CEI:2 — route a DIR:VI view through existing DTH Nexo recipes onto STAGE-PROD.
 * Does not own evidence, DTH families, or a second Stage.
 */

import type { NexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreContract.ts";
import type { NexoraVisualView } from "@/app/lib/director/nexoraVisualIntelligence.ts";
import {
  defineNexoBarsRecipe,
  defineNexoTimeRecipe,
  resolveNexoFamilyRecipe,
} from "@/app/lib/dth-exp/dthExpNexoFamilyRecipes.ts";
import type { DthExpNexoFamilyDefinition } from "@/app/lib/dth-exp/dthExpNexoFamilyContract.ts";
import type { DthExpSceneRecipeResolution } from "@/app/lib/dth-exp/dthExpSceneRecipeContract.ts";
import type { StageProdDirectorComposition } from "./stageProdDirectorComposition.ts";
import {
  projectStageProdContextualVisuals,
  type StageProdVisualProjection,
} from "./stageProdVisualSpecification.ts";

export const stageProdExecutiveVisualizationRouteIdentity =
  "NPA-T CEI:2/ExecutiveVisualizationRoute" as const;

export type StageProdNexoVisualFamily = "NexoBars" | "NexoTime";

export type StageProdExecutiveVisualizationRoute = Readonly<{
  identity: typeof stageProdExecutiveVisualizationRouteIdentity;
  subjectId: string;
  nexoFamily: StageProdNexoVisualFamily;
  recipeId: string;
  recipeFamily: "NEXO_BARS" | "NEXO_TIME";
  recipeResolutionStatus: DthExpSceneRecipeResolution["projectionStatus"];
  observationIds: readonly string[];
  stageProjection: StageProdVisualProjection;
  writesCanonicalManagementState: false;
  parallelChartEngine: false;
  parallelDth: false;
  parallelStage: false;
}>;

function nexoFamilyOf(view: NexoraVisualView): StageProdNexoVisualFamily {
  return view.representation === "COMPARISON_BARS" ? "NexoBars" : "NexoTime";
}

function definitionFor(
  view: NexoraVisualView,
  subjectId: string,
  evidenceRefs: readonly string[],
): DthExpNexoFamilyDefinition {
  const participant = Object.freeze({
    canonicalObjectId: subjectId,
    evidenceRefs,
  });
  if (view.representation === "COMPARISON_BARS") {
    return defineNexoBarsRecipe({
      recipeId: `cei2:bars:${subjectId}:${view.viewId}`,
      comparable: [participant],
      focalCanonicalObjectId: subjectId,
      evidenceRequirements: evidenceRefs.map((evidenceRef, index) =>
        Object.freeze({
          requirementId: `cei2:ev:${index}`,
          evidenceRef,
          attachedToKind: "object" as const,
          attachedToId: subjectId,
          required: false,
        }),
      ),
      analyticalBindings: [
        Object.freeze({
          bindingId: `cei2:bar:${subjectId}`,
          canonicalObjectId: subjectId,
          dimension: "kpi-value" as const,
          authority: "DATA-ADV:1/AdvisorAcceptedVisualEvidence",
          valueRef: evidenceRefs[0] ?? null,
        }),
      ],
    });
  }
  return defineNexoTimeRecipe({
    recipeId: `cei2:time:${subjectId}:${view.viewId}`,
    current: [participant],
    focalCanonicalObjectId: subjectId,
    evidenceRequirements: evidenceRefs.map((evidenceRef, index) =>
      Object.freeze({
        requirementId: `cei2:ev:${index}`,
        evidenceRef,
        attachedToKind: "object" as const,
        attachedToId: subjectId,
        required: false,
      }),
    ),
    analyticalBindings: [
      Object.freeze({
        bindingId: `cei2:time:${subjectId}`,
        canonicalObjectId: subjectId,
        dimension: "time" as const,
        authority: "DATA-ADV:1/AdvisorAcceptedVisualEvidence",
        valueRef: evidenceRefs[0] ?? null,
      }),
    ],
  });
}

export function projectStageProdExecutiveVisualizationRoute(input: Readonly<{
  view: NexoraVisualView;
  subjectId: string;
  subjectLabel?: string | null;
  theatre: NexoraDecisionTheatreFoundation | null;
  composition: StageProdDirectorComposition;
  observationIds: readonly string[];
}>): StageProdExecutiveVisualizationRoute {
  const family = nexoFamilyOf(input.view);
  const definition = definitionFor(input.view, input.subjectId, input.observationIds);
  const recipeResolution = resolveNexoFamilyRecipe({
    definition,
    context: Object.freeze({
      objects: Object.freeze([
        Object.freeze({
          id: input.subjectId,
          kind: "object",
          label: input.subjectLabel ?? input.subjectId,
          authority: "MO:1 / NEX-MVP:4",
        }),
      ]),
      availableEvidenceRefs: input.observationIds,
      availableBindingRefs: input.observationIds,
      theatreSceneIdentity: input.theatre?.sceneScript.scriptId ?? "cei2:visual-route",
    }),
  });
  const stageProjection = projectStageProdContextualVisuals({
    theatre: input.theatre,
    composition: input.composition,
    requestedVisual: input.view,
    focalSubjectId: input.subjectId,
  });
  return Object.freeze({
    identity: stageProdExecutiveVisualizationRouteIdentity,
    subjectId: input.subjectId,
    nexoFamily: family,
    recipeId: definition.recipe.recipeId,
    recipeFamily: family === "NexoBars" ? "NEXO_BARS" : "NEXO_TIME",
    recipeResolutionStatus: recipeResolution.projectionStatus,
    observationIds: Object.freeze([...input.observationIds]),
    stageProjection,
    writesCanonicalManagementState: false,
    parallelChartEngine: false,
    parallelDth: false,
    parallelStage: false,
  });
}

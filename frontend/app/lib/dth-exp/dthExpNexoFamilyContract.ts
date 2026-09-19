/**
 * NPA-T DTH-EXP:3B — shared Nexo family definition contract.
 * Family modules configure recipes. Resolution remains DTH-EXP:3A.
 */

import { dthExpNexoFamilyIdentity, dthExpNexoFamilyVersion } from "./dthExpNexoFamilyIdentity.ts";
import type { DthExpNexoRecipeFamily, DthExpSceneRecipe } from "./dthExpSceneRecipeContract.ts";
import { resolveDthExpSceneRecipe } from "./dthExpResolveSceneRecipe.ts";
import { DTH_EXP_NEXO_TIME_BOUNDARY } from "./dthExpVisualRole.ts";

export const DTH_EXP_NEXO_FAMILY_DISPLAY_NAMES = Object.freeze({
  NEXO_BUBBLE: "NexoBubble",
  NEXO_BARS: "NexoBars",
  NEXO_FLOW: "NexoFlow",
  NEXO_IMPACT: "NexoImpact",
  NEXO_RISK: "NexoRisk",
  NEXO_TIME: "NexoTime",
  NEXO_CAUSE: "NexoCause",
  NEXO_EXECUTION: "NexoExecution",
  NEXO_OUTCOME: "NexoOutcome",
} as const);

export const DTH_EXP_NEXO_SHARED_CONTEXT_JOURNEY = Object.freeze([
  "NEXO_FLOW",
  "NEXO_RISK",
  "NEXO_CAUSE",
  "NEXO_IMPACT",
] as const);

export const DTH_EXP_NEXO_COMPOSITION_PREPARATION = Object.freeze({
  multiNexoScenesImplemented: false as const,
  sceneTransitionsImplemented: false as const,
  sharedCanonicalObjectsReusable: true as const,
  exampleJourney: DTH_EXP_NEXO_SHARED_CONTEXT_JOURNEY,
});

export const DTH_EXP_NEXO_FAMILY_RESOLVER = resolveDthExpSceneRecipe;

export type DthExpNexoFamilyDefinition = Readonly<{
  identity: typeof dthExpNexoFamilyIdentity;
  version: typeof dthExpNexoFamilyVersion;
  family: DthExpNexoRecipeFamily;
  displayName: (typeof DTH_EXP_NEXO_FAMILY_DISPLAY_NAMES)[DthExpNexoRecipeFamily];
  recipe: DthExpSceneRecipe;
  resolver: typeof resolveDthExpSceneRecipe;
  parallelEngine: false;
  isBusinessTruthAuthority: false;
  bottleneckIsNexoFamily: false;
  bottleneckCanonicalObjectId: string | null;
  ranksCandidates: false;
  calculatesKpi: false;
  consumesVai: boolean;
  convertsCorrelationToCause: false;
  candidateMeansConfirmedCause: false;
  writesExecution: false;
  writesOutcome: false;
  writesLearning: false;
  parallelTimelineAuthority: false;
  timelineIsNexoTimeTechnique: typeof DTH_EXP_NEXO_TIME_BOUNDARY.timelineIsVisualizationTechniqueInsideNexoTime;
  automaticDirectorSelection: false;
}>;

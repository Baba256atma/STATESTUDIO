/**
 * NPA-T DTH-EXP:10 — composed certification snapshot of DTH-EXP:1–9.
 * Not a Scene store and not a new management authority.
 */

import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { DthExpAdvisorSceneAwareness, DthExpAdvisorUtteranceKind } from "./dthExpAdvisorSceneAwarenessContract.ts";
import type { DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import type { DthExpCanonicalEvidenceRecord } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpMultiNexoAvailableSupport, DthExpMultiNexoCompositionPlan } from "./dthExpMultiNexoCompositionContract.ts";
import type { DthExpMultiNexoComposedScene } from "./dthExpMultiNexoSceneContract.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpTheatreSceneResponse, DthExpTheatreSceneResponseInput } from "./dthExpTheatreSceneResponseContract.ts";
import type { DthExpTheatreScaleWorkingSet } from "./dthExpTheatreScaleContract.ts";
import {
  DTH_EXP_EXECUTIVE_JOURNEY_ENGINE,
  dthExpExecutiveJourneyIdentity,
  dthExpExecutiveJourneyVersion,
} from "./dthExpExecutiveJourneyIdentity.ts";
import { DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY } from "./dthExpExecutiveJourneyBoundary.ts";

export const DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE = DTH_EXP_EXECUTIVE_JOURNEY_BOUNDARY.pipeline;

export type DthExpExecutiveJourneyInput = Readonly<{
  turn: DthExpTheatreSceneResponseInput["turn"];
  directorPlan: NexoraDirectorPlan;
  graph: DthExpDirectorSceneGraph;
  evidenceRecords?: readonly DthExpCanonicalEvidenceRecord[];
  sourceScene?: DthExpTheatreSceneResponseInput["sourceScene"];
  sourceSpatial?: DthExpTheatreSceneResponseInput["sourceSpatial"];
  sourceFamily?: DthExpNexoRecipeFamily | null;
  previousTransition?: DthExpTheatreSceneResponseInput["previousTransition"];
  theatreGeneration?: number | null;
  reducedMotion?: boolean;
  utteranceKind?: DthExpAdvisorUtteranceKind;
  deixisKind?: "object" | "risk" | "evidence" | "relationship" | null;
  availableSupports?: readonly DthExpMultiNexoAvailableSupport[];
  unsafeRequestedSupports?: readonly DthExpNexoRecipeFamily[];
  unrelatedObjectCount?: number;
}>;

export type DthExpExecutiveJourneySnapshot = Readonly<{
  identity: typeof dthExpExecutiveJourneyIdentity;
  version: typeof dthExpExecutiveJourneyVersion;
  engine: typeof DTH_EXP_EXECUTIVE_JOURNEY_ENGINE;
  pipeline: typeof DTH_EXP_EXECUTIVE_JOURNEY_PIPELINE;
  awareness: DthExpAdvisorSceneAwareness;
  response: DthExpTheatreSceneResponse;
  eligibility: DthExpMultiNexoCompositionPlan | null;
  composed: DthExpMultiNexoComposedScene | null;
  workingSet: DthExpTheatreScaleWorkingSet | null;
  reusedCertifiedPipeline: true;
  newTheatreCapability: false;
  advisorToStageCommands: false;
  parsesRawText: false;
  browserPerformanceCertified: false;
  liveStageWiring: false;
  writesCanonicalObjects: false;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  writesLearning: false;
  assignsVaiRoles: false;
  calculatesRisk: false;
  upgradesCausality: false;
  nexoBottleneck: false;
  nexoEvidence: false;
  parallelTimelineAuthority: false;
}>;

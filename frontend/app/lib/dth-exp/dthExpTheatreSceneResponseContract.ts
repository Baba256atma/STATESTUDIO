/**
 * NPA-T DTH-EXP:7B — Theatre scene-response contract.
 * Orchestration of certified layers. Not a Scene store or Stage command language.
 */

import type { NexoraDirectorPlan } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { DthExpAdvisorAmbiguityState, DthExpAdvisorSceneAwareness, DthExpConversationReferentState } from "./dthExpAdvisorSceneAwarenessContract.ts";
import type { DthExpDirectorManagementNeed, DthExpDirectorNexoSelection } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpDirectorSceneComposition, DthExpDirectorSceneGraph } from "./dthExpDirectorSceneCompositionContract.ts";
import type { DthExpCanonicalEvidenceRecord } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpEvidenceSceneProjection } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpSceneTransitionPlan } from "./dthExpSceneTransitionContract.ts";
import type { DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
import type { DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import {
  DTH_EXP_THEATRE_SCENE_RESPONSE_ENGINE,
  dthExpTheatreSceneResponseIdentity,
  dthExpTheatreSceneResponseVersion,
} from "./dthExpTheatreSceneResponseIdentity.ts";

export const DTH_EXP_THEATRE_SCENE_RESPONSE_PIPELINE = Object.freeze([
  "DTH-EXP:7A",
  "CC:5",
  "DIR:1",
  "DTH-EXP:4A",
  "DTH-EXP:4B",
  "DTH-EXP:3B",
  "DTH-EXP:3A",
  "DTH-EXP:5A",
  "DTH-EXP:5B",
  "DTH-EXP:6",
] as const);

export const DTH_EXP_THEATRE_SCENE_RESPONSE_KINDS = Object.freeze([
  "compose",
  "preserve",
  "evidence-inspection",
] as const);
export type DthExpTheatreSceneResponseKind = (typeof DTH_EXP_THEATRE_SCENE_RESPONSE_KINDS)[number];

export const DTH_EXP_THEATRE_SCENE_RESPONSE_STATES = Object.freeze([
  "composed",
  "same-family-refined",
  "preserved",
  "unresolved",
  "insufficient-context",
] as const);
export type DthExpTheatreSceneResponseState = (typeof DTH_EXP_THEATRE_SCENE_RESPONSE_STATES)[number];

export type DthExpInterpretedConversationTurn = Readonly<{
  referent: DthExpConversationReferentState;
  managementNeed: DthExpDirectorManagementNeed | null;
  responseKind: DthExpTheatreSceneResponseKind;
  ambiguity: DthExpAdvisorAmbiguityState;
  managementReason: string;
  rawUtterance?: string | null;
}>;

export type DthExpTheatreSceneResponseInput = Readonly<{
  turn: DthExpInterpretedConversationTurn;
  directorPlan: NexoraDirectorPlan;
  graph: DthExpDirectorSceneGraph;
  awareness?: DthExpAdvisorSceneAwareness | null;
  sourceScene?: DthExpTheatreScene | null;
  sourceSpatial?: DthExpSpatialLayoutProjection | null;
  sourceFamily?: DthExpNexoRecipeFamily | null;
  evidenceRecords?: readonly DthExpCanonicalEvidenceRecord[];
  previousTransition?: DthExpSceneTransitionPlan | null;
  theatreGeneration?: number | null;
  reducedMotion?: boolean;
}>;

export type DthExpTheatreSceneResponse = Readonly<{
  identity: typeof dthExpTheatreSceneResponseIdentity;
  version: typeof dthExpTheatreSceneResponseVersion;
  engine: typeof DTH_EXP_THEATRE_SCENE_RESPONSE_ENGINE;
  state: DthExpTheatreSceneResponseState;
  managementReason: string;
  canonicalSubjectId: string | null;
  managementNeed: DthExpDirectorManagementNeed | null;
  sourceFamily: DthExpNexoRecipeFamily | null;
  targetFamily: DthExpNexoRecipeFamily | null;
  selection: DthExpDirectorNexoSelection | null;
  composition: DthExpDirectorSceneComposition | null;
  scene: DthExpTheatreScene | null;
  spatial: DthExpSpatialLayoutProjection | null;
  transition: DthExpSceneTransitionPlan | null;
  evidence: DthExpEvidenceSceneProjection | null;
  pipeline: typeof DTH_EXP_THEATRE_SCENE_RESPONSE_PIPELINE;
  reusedCertifiedPipeline: true;
  advisorToSceneShortcut: false;
  parsesRawText: false;
  ignoredRawUtterance: boolean;
  advisorChoosesNexo: false;
  advisorSelectsActors: false;
  advisorLayoutsActors: false;
  advisorAnimatesActors: false;
  advisorManufacturesEvidence: false;
  deicticReResolved: false;
  reducedMotionEquivalent: boolean;
  liveStageWiring: false;
  writesCanonicalObjects: false;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  assignsVaiRoles: false;
  upgradesCausality: false;
  calculatesRisk: false;
}>;

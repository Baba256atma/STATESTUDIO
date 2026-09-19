/**
 * NPA-T DTH-EXP:2 — scene attention, referent, and visual-role transition contracts.
 * Presentation metadata only. Not Object, VAI, KPI, Evidence, Decision, Execution, or Outcome truth.
 */

import type { NexoraDecisionTheatreSceneActorRole } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneActorRoles.ts";
import { dthExpObjectStageRoleIdentity, dthExpObjectStageRoleVersion } from "./dthExpObjectStageRoleIdentity.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import type { DthExpActorPresentation, DthExpProjectionStatus } from "./dthExpTheatreContract.ts";

export const DTH_EXP_SCENE_ATTENTIONS = Object.freeze([
  "focal",
  "emphasized",
  "contextual",
  "de-emphasized",
  "hidden",
  "collapsed",
] as const);

export type DthExpSceneAttention = (typeof DTH_EXP_SCENE_ATTENTIONS)[number];

export function isDthExpSceneAttention(value: string | null | undefined): value is DthExpSceneAttention {
  return value != null && (DTH_EXP_SCENE_ATTENTIONS as readonly string[]).includes(value);
}

export type DthExpCanonicalObjectRef = Readonly<{
  id: string;
  kind?: string | null;
  canonicalObjectType?: string | null;
  label?: string | null;
  authority?: string | null;
  evidenceRef?: string | null;
}>;

export type DthExpTheatreActorReferent = Readonly<{
  canonicalObjectId: string;
  canonicalObjectKind: string;
  objectAuthority: string;
  sceneIdentity: string;
  visualRole: DthExpVisualRole | null;
  suitableForLaterAdvisorReference: true;
}>;

export type DthExpVisualRoleTransition = Readonly<{
  identity: typeof dthExpObjectStageRoleIdentity;
  version: typeof dthExpObjectStageRoleVersion;
  contract: "visual-role-transition";
  canonicalObjectId: string;
  fromVisualRole: DthExpVisualRole | null;
  toVisualRole: DthExpVisualRole | null;
  fromSceneIdentity: string;
  toSceneIdentity: string;
  fromAttention: DthExpSceneAttention;
  toAttention: DthExpSceneAttention;
  presentationChanged: Readonly<{
    visualRole: boolean;
    position: boolean;
    size: boolean;
    emphasis: boolean;
    visibility: boolean;
    grouping: boolean;
    attention: boolean;
  }>;
  preserved: Readonly<{
    canonicalObjectId: true;
    objectBusinessState: true;
    kpiTruth: true;
    evidenceTruth: true;
    vaiRoleTruth: true;
    decisionState: true;
    executionState: true;
    outcomeState: true;
  }>;
  animationImplemented: false;
  pixelMotionDescribed: false;
  projectionStatus: DthExpProjectionStatus;
  limitations: readonly string[];
}>;

export type DthExpTheatreActorResolution = Readonly<{
  identity: typeof dthExpObjectStageRoleIdentity;
  status: DthExpProjectionStatus;
  actor: import("./dthExpTheatreContract.ts").DthExpTheatreActor | null;
  limitations: readonly string[];
  writes: Readonly<{
    canonicalObjects: false;
    objectVisualTypeField: false;
    evidence: false;
    vaiRoles: false;
    kpiTruth: false;
    decisionState: false;
    executionState: false;
    outcomeState: false;
  }>;
}>;

export type DthExpResolveTheatreActorInput = Readonly<{
  object?: DthExpCanonicalObjectRef | null;
  sceneIdentity: string;
  visualRole?: string | null;
  attention?: string | null;
  grouping?: string | null;
  presentation?: Partial<DthExpActorPresentation>;
  vaiRole?: string | null;
  sceneActorRole?: NexoraDecisionTheatreSceneActorRole | null;
  evidenceRefs?: readonly string[];
}>;

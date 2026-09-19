/**
 * NPA-T DTH-EXP:1 — Theatre Scene / Actor / relationship / Evidence-attachment contracts.
 * Read-oriented projection. Does not store duplicated business truth.
 */

import type { NexoraPresentationIntent } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { nexoraSemanticPresentationDirectorIdentity } from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import type { VaiContextualRole } from "@/app/lib/vai/vaiContract.ts";
import { VAI_CONTEXTUAL_ROLES } from "@/app/lib/vai/vaiContract.ts";
import type { NexoraDecisionTheatreSceneActorRole } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneActorRoles.ts";
import type { NexoraDecisionTheatreSceneIntentKind } from "@/app/lib/decision-theatre/nexoraDecisionTheatreSceneIntent.ts";
import { dthExpFoundationIdentity, dthExpFoundationVersion } from "./dthExpIdentity.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import type { DthExpSceneAttention, DthExpTheatreActorReferent } from "./dthExpObjectStageRoleContract.ts";

/** Same tuple as VAI. DTH-EXP does not own or redefine analytical roles. */
export const DTH_EXP_VAI_ROLE_AUTHORITY = VAI_CONTEXTUAL_ROLES;

export type DthExpProjectionStatus = "ok" | "partial" | "failed";

export type DthExpActorPresentation = Readonly<{
  position: Readonly<{ x: number; y: number }> | null;
  size: Readonly<{ width: number; height: number }> | null;
  emphasis: "none" | "low" | "medium" | "high";
  visibility: "visible" | "background" | "hidden";
  grouping: string | null;
  relationshipPresentation: "inherit" | "emphasized" | "de-emphasized" | "hidden";
}>;

export type DthExpTheatreActor = Readonly<{
  actorId: string;
  canonicalObjectId: string;
  canonicalObjectKind: string;
  objectAuthority: string;
  sceneIdentity: string;
  displayLabel: string | null;
  labelIsIdentityAuthority: false;
  visualRole: DthExpVisualRole | null;
  visualRoleIsPermanent: false;
  visualRoleMutatesVaiRole: false;
  isTheatreActorNotBusinessObject: true;
  sceneActorRole: NexoraDecisionTheatreSceneActorRole | null;
  attention: DthExpSceneAttention;
  presentation: DthExpActorPresentation;
  evidenceRefs: readonly string[];
  vaiRoleRef: VaiContextualRole | null;
  referent: DthExpTheatreActorReferent;
  isCanonicalObjectDuplicate: false;
  presentationMutatesCanonicalObject: false;
}>;

export type DthExpSceneRelationship = Readonly<{
  relationshipId: string;
  fromCanonicalObjectId: string;
  toCanonicalObjectId: string;
  fromActorId: string;
  toActorId: string;
  semanticRelation: string | null;
  sourceAuthority: string;
  sourceRef: string;
  impliesCausality: false;
  manufacturedCausalTruth: false;
  evidenceRefs: readonly string[];
}>;

export type DthExpEvidenceAttachment = Readonly<{
  evidenceRef: string;
  authority: "CC:8";
  attachedToKind: "object" | "relationship" | "scene";
  attachedToId: string;
  copiesEvidence: false;
  copiesDataReality: false;
}>;

export type DthExpDirectorComposition = Readonly<{
  authority: typeof nexoraSemanticPresentationDirectorIdentity;
  intent: NexoraPresentationIntent | string | null;
  stageEffect: string | null;
  mutationRequired: boolean | null;
  secondDirector: false;
  automaticNexoSelection: false;
}>;

export type DthExpTheatreScene = Readonly<{
  identity: typeof dthExpFoundationIdentity;
  version: typeof dthExpFoundationVersion;
  sceneId: string;
  sceneIntentKind: NexoraDecisionTheatreSceneIntentKind | null;
  sceneIntentRef: string | null;
  sceneScriptRef: string | null;
  dthTheatreSceneIdentity: string | null;
  recipeRef: string | null;
  focalCanonicalObjectIds: readonly string[];
  participatingCanonicalObjectIds: readonly string[];
  actors: readonly DthExpTheatreActor[];
  relationships: readonly DthExpSceneRelationship[];
  visualRoles: readonly DthExpVisualRole[];
  evidenceAttachments: readonly DthExpEvidenceAttachment[];
  directorComposition: DthExpDirectorComposition;
  advisorContextRef: "DTH:1/advisorReadable";
  advisorOwnedByTheatreExpansion: false;
  stageHost: "NEX-MVP:3/Nexora3DExecutiveStage";
  stageInteractionAuthority: "NEX-MVP:4/NexoraObjectInteraction";
  secondStage: false;
  secondDirector: false;
  nexoTimeParallelTimeline: false;
  nexoFamiliesImplemented: false;
  projectionStatus: DthExpProjectionStatus;
  limitations: readonly string[];
  safeFallback: "preserve-existing-stage-and-dth";
  writes: Readonly<{
    canonicalObjects: false;
    evidence: false;
    dataReality: false;
    vaiRoles: false;
    decisionState: false;
    executionState: false;
    outcome: false;
    learning: false;
    stageSnapshots: false;
    directorPlans: false;
  }>;
}>;

export const DTH_EXP_DEFAULT_ACTOR_PRESENTATION: DthExpActorPresentation = Object.freeze({
  position: null,
  size: null,
  emphasis: "none",
  visibility: "visible",
  grouping: null,
  relationshipPresentation: "inherit",
});

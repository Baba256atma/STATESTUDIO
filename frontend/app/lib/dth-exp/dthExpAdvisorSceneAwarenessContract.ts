/**
 * NPA-T DTH-EXP:7A — read-only Advisor Theatre awareness contract.
 * Existing conversation/referent authority remains identity owner.
 */

import type { ManagerObjectActivationSource } from "@/app/lib/manager-object/managerObjectInteractionFoundation.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import type { DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
import type { DthExpEvidenceSceneProjection } from "./dthExpEvidenceSceneContract.ts";
import type { DthExpSceneTransitionPlan } from "./dthExpSceneTransitionContract.ts";
import type { DthExpVisualRole } from "./dthExpVisualRole.ts";
import type { DthExpSceneAttention } from "./dthExpObjectStageRoleContract.ts";
import {
  DTH_EXP_ADVISOR_SCENE_AWARENESS_ENGINE,
  dthExpAdvisorSceneAwarenessIdentity,
  dthExpAdvisorSceneAwarenessVersion,
} from "./dthExpAdvisorSceneAwarenessIdentity.ts";

export const DTH_EXP_ADVISOR_UTTERANCE_KINDS = Object.freeze([
  "named",
  "deictic-follow-up",
  "deictic-investigation",
  "deictic-object",
  "deictic-evidence",
  "deictic-relationship",
  "supports",
  "other",
] as const);
export type DthExpAdvisorUtteranceKind = (typeof DTH_EXP_ADVISOR_UTTERANCE_KINDS)[number];

export const DTH_EXP_ADVISOR_AMBIGUITY_STATES = Object.freeze([
  "none",
  "ambiguous-object",
  "ambiguous-evidence",
  "ambiguous-relationship",
] as const);
export type DthExpAdvisorAmbiguityState = (typeof DTH_EXP_ADVISOR_AMBIGUITY_STATES)[number];

export type DthExpConversationReferentState = Readonly<{
  authority: "CC:5 / ECA / NCA / MO referent";
  canonicalSubjectId: string | null;
  subjectSource: ManagerObjectActivationSource;
  selectedCanonicalObjectId: string | null;
  selectedRelationshipId: string | null;
  selectedEvidenceRef: string | null;
  collectionMemberId: string | null;
  generation: number;
}>;

export type DthExpAdvisorSceneAwarenessInput = Readonly<{
  conversation: DthExpConversationReferentState;
  scene?: DthExpTheatreScene | null;
  spatial?: DthExpSpatialLayoutProjection | null;
  evidence?: DthExpEvidenceSceneProjection | null;
  transition?: DthExpSceneTransitionPlan | null;
  theatreGeneration?: number | null;
  utteranceKind?: DthExpAdvisorUtteranceKind;
  deixisKind?: "object" | "risk" | "evidence" | "relationship" | null;
  reducedMotion?: boolean;
}>;

export type DthExpAdvisorGrounding = Readonly<{
  canonicalObjectId: string | null;
  evidenceRef: string | null;
  relationshipId: string | null;
  source: "conversation-named" | "canonical-selection" | "conversation-deictic" | "none";
  usedVisualLabel: false;
  usedScreenPosition: false;
  usedLargestActor: false;
  usedTheatreFocalOverride: false;
  usedAnimationProminence: false;
  usedEvidenceProminence: false;
}>;

export type DthExpAdvisorSceneAwareness = Readonly<{
  identity: typeof dthExpAdvisorSceneAwarenessIdentity;
  version: typeof dthExpAdvisorSceneAwarenessVersion;
  engine: typeof DTH_EXP_ADVISOR_SCENE_AWARENESS_ENGINE;
  advisorAuthority: "CC:5/ConversationalExperienceIntegration";
  referentAuthority: "CC:5 / ECA / NCA / MO referent";
  theatreAvailable: boolean;
  staleTheatreIgnored: boolean;
  family: DthExpNexoRecipeFamily | null;
  theatreFocalCanonicalObjectId: string | null;
  conversationalSubjectId: string | null;
  selectedCanonicalObjectId: string | null;
  visibleActorIds: readonly string[];
  primaryActorIds: readonly string[];
  supportingActorIds: readonly string[];
  contextualActorIds: readonly string[];
  visualRoles: readonly Readonly<{ canonicalObjectId: string; visualRole: DthExpVisualRole | null; attention: DthExpSceneAttention }>[];
  relationshipRefs: readonly Readonly<{ relationshipId: string; semanticRelation: string | null; sourceAuthority: string }>[];
  evidenceRefs: readonly Readonly<{
    evidenceRef: string;
    authority: "CC:8";
    attachedToId: string;
    attachmentTarget: string;
    disclosure: string;
    isMoCatalogMember: false;
  }>[];
  grounding: DthExpAdvisorGrounding;
  ambiguity: DthExpAdvisorAmbiguityState;
  candidateCanonicalObjectIds: readonly string[];
  nexoFamilyOverridesSubject: false;
  requestsSceneChange: false;
  parallelAdvisor: false;
  parallelReferentResolver: false;
  reducedMotionEquivalent: boolean;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  assignsVaiRoles: false;
  upgradesCausality: false;
  liveStageWiring: false;
}>;

/**
 * NPA-T DTH-EXP:6 — Theatre Evidence scene contract.
 * Read-only projection of existing CC:8 / Data Reality Evidence. Not a second store.
 */

import type { SemanticCandidateState } from "@/app/lib/data-reality/semanticCandidateIntelligence.ts";
import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpTheatreScene } from "./dthExpTheatreContract.ts";
import type { DthExpNormalizedPoint, DthExpSpatialLayoutProjection } from "./dthExpSpatialLayoutContract.ts";
import type { DthExpSceneTransitionPlan } from "./dthExpSceneTransitionContract.ts";
import {
  DTH_EXP_EVIDENCE_SCENE_ENGINE,
  dthExpEvidenceSceneIdentity,
  dthExpEvidenceSceneVersion,
} from "./dthExpEvidenceSceneIdentity.ts";

export const DTH_EXP_EVIDENCE_DISCLOSURE_STATES = Object.freeze([
  "indicator",
  "summary",
  "expanded",
  "contextual",
  "collapsed",
  "hidden",
] as const);
export type DthExpEvidenceDisclosureState = (typeof DTH_EXP_EVIDENCE_DISCLOSURE_STATES)[number];

export const DTH_EXP_EVIDENCE_ATTACHMENT_TARGETS = Object.freeze([
  "actor",
  "relationship",
  "investigation",
  "scene",
] as const);
export type DthExpEvidenceAttachmentTarget = (typeof DTH_EXP_EVIDENCE_ATTACHMENT_TARGETS)[number];

export const DTH_EXP_EVIDENCE_MISSING_STATES = Object.freeze([
  "no-evidence-available",
  "insufficient",
  "under-review",
  "unavailable-for-relationship",
  "semantic-meaning-unresolved",
] as const);
export type DthExpEvidenceMissingState = (typeof DTH_EXP_EVIDENCE_MISSING_STATES)[number];

export const DTH_EXP_EVIDENCE_DATA_REALITY_STATES = Object.freeze([
  "accepted",
  "under-review",
  "historical",
  "removed",
] as const);
export type DthExpEvidenceDataRealityState = (typeof DTH_EXP_EVIDENCE_DATA_REALITY_STATES)[number];

export const DTH_EXP_EVIDENCE_SUPPORT_STATES = Object.freeze([
  "authoritative",
  "manager-confirmed",
  "likely",
  "ambiguous",
  "unknown",
  "insufficient",
] as const);
export type DthExpEvidenceSupportState = (typeof DTH_EXP_EVIDENCE_SUPPORT_STATES)[number];

export type DthExpCanonicalEvidenceRecord = Readonly<{
  evidenceRef: string;
  authority: "CC:8";
  provenanceRef: string | null;
  provenanceKind: "csv-source" | "data-object" | "manager-confirmation" | "system-calculation" | "observed-result" | "authoritative-source" | null;
  dataRealityAcceptance: DthExpEvidenceDataRealityState | null;
  supportState: DthExpEvidenceSupportState | null;
  semanticConfirmationState: SemanticCandidateState | "unresolved" | null;
  semanticFieldLabel: string | null;
  freshness: "current" | "stale" | "unknown" | "historical" | null;
  causalSupport: "none" | "correlation" | "association" | "candidate" | "confirmed-by-existing-authority" | "insufficient";
  relevantToQuestion: boolean;
  attachedToKind: "object" | "relationship" | "investigation" | "scene";
  attachedToId: string;
  sceneRelevance?: "high" | "medium" | "low";
}>;

export type DthExpMissingEvidenceRecord = Readonly<{
  missingState: DthExpEvidenceMissingState;
  attachedToKind: "object" | "relationship" | "investigation" | "scene";
  attachedToId: string;
  reason: string;
}>;

export type DthExpEvidenceParticipant = Readonly<{
  evidenceRef: string;
  authority: "CC:8";
  isTheatreActor: false;
  isCanonicalManagementObject: false;
  isMoCatalogMember: false;
  copiesEvidence: false;
  attachmentTarget: DthExpEvidenceAttachmentTarget;
  attachedToId: string;
  provenanceRef: string | null;
  provenanceKind: DthExpCanonicalEvidenceRecord["provenanceKind"];
  provenanceInvented: false;
  dataRealityAcceptance: DthExpEvidenceDataRealityState | null;
  suppliesCurrentReality: boolean;
  supportState: DthExpEvidenceSupportState | null;
  semanticConfirmationState: DthExpCanonicalEvidenceRecord["semanticConfirmationState"];
  semanticFieldLabel: string | null;
  inventedSemanticMeaning: false;
  freshness: DthExpCanonicalEvidenceRecord["freshness"];
  causalSupport: DthExpCanonicalEvidenceRecord["causalSupport"];
  sceneRelevance: "high" | "medium" | "low";
  disclosure: DthExpEvidenceDisclosureState;
  position: DthExpNormalizedPoint | null;
  placementHintReusedFrom5A: boolean;
  visualProminenceCreatesConfidence: false;
  evidenceReason: string;
}>;

export type DthExpEvidenceCluster = Readonly<{
  clusterId: string;
  attachedToId: string;
  attachmentTarget: DthExpEvidenceAttachmentTarget;
  memberEvidenceRefs: readonly string[];
  mergesIntoCanonicalEvidence: false;
}>;

export type DthExpEvidenceSceneProjection = Readonly<{
  identity: typeof dthExpEvidenceSceneIdentity;
  version: typeof dthExpEvidenceSceneVersion;
  engine: typeof DTH_EXP_EVIDENCE_SCENE_ENGINE;
  family: DthExpNexoRecipeFamily;
  participants: readonly DthExpEvidenceParticipant[];
  clusters: readonly DthExpEvidenceCluster[];
  missing: readonly DthExpMissingEvidenceRecord[];
  reducedMotion: Readonly<{
    movement: false;
    managementMeaningPreserved: true;
    attachments: readonly string[];
    disclosure: readonly DthExpEvidenceDisclosureState[];
    supportStates: readonly (DthExpEvidenceSupportState | null)[];
    provenanceRefs: readonly (string | null)[];
    uncertainty: readonly (DthExpCanonicalEvidenceRecord["semanticConfirmationState"])[];
  }>;
  visualProminenceCreatesConfidence: false;
  evidenceCountCreatesConfidence: false;
  ranksBubbleCandidates: false;
  recalculatesBars: false;
  assignsVaiRoles: false;
  calculatesRisk: false;
  parallelTimelineAuthority: false;
  upgradesCausality: false;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  liveStageWiring: false;
}>;

export type DthExpEvidenceSceneInput = Readonly<{
  family: DthExpNexoRecipeFamily;
  scene: DthExpTheatreScene;
  spatial: DthExpSpatialLayoutProjection;
  records: readonly DthExpCanonicalEvidenceRecord[];
  missing?: readonly DthExpMissingEvidenceRecord[];
  transition?: DthExpSceneTransitionPlan | null;
}>;

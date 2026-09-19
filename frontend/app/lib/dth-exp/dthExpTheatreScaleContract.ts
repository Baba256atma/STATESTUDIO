/**
 * NPA-T DTH-EXP:9 — bounded Theatre working-set / performance contract.
 * Presentation policy over certified 4B/6/8A candidates. Not management truth.
 */

import type { DthExpNexoRecipeFamily } from "./dthExpSceneRecipeContract.ts";
import type { DthExpDirectorManagementNeed } from "./dthExpDirectorNexoSelectionContract.ts";
import type { DthExpMultiNexoDisclosureState } from "./dthExpMultiNexoCompositionContract.ts";
import {
  DTH_EXP_THEATRE_SCALE_ENGINE,
  dthExpTheatreScaleIdentity,
  dthExpTheatreScaleVersion,
} from "./dthExpTheatreScaleIdentity.ts";

export const DTH_EXP_THEATRE_SCALE_LODS = Object.freeze(["lod-0", "lod-1", "lod-2", "lod-3"] as const);
export type DthExpTheatreScaleLod = (typeof DTH_EXP_THEATRE_SCALE_LODS)[number];

export const DTH_EXP_THEATRE_SCALE_DENSITIES = Object.freeze(["sparse", "normal", "dense", "overloaded"] as const);
export type DthExpTheatreScaleDensity = (typeof DTH_EXP_THEATRE_SCALE_DENSITIES)[number];

export const DTH_EXP_THEATRE_SCALE_COMPLEXITY = Object.freeze(["light", "moderate", "heavy", "bounded-fallback"] as const);
export type DthExpTheatreScaleComplexity = (typeof DTH_EXP_THEATRE_SCALE_COMPLEXITY)[number];

export const DTH_EXP_THEATRE_SCALE_ADMISSION_CLASSES = Object.freeze([
  "required-subject",
  "required-focal",
  "required-primary",
  "required-relationship",
  "essential-evidence",
  "focused",
  "focused-comparison",
  "contextual",
  "expanded",
  "unrelated",
] as const);
export type DthExpTheatreScaleAdmissionClass = (typeof DTH_EXP_THEATRE_SCALE_ADMISSION_CLASSES)[number];

export const DTH_EXP_THEATRE_SCALE_DEGRADATION_LADDER = Object.freeze([
  "preserve-canonical-subject",
  "preserve-required-primary-actors",
  "preserve-required-primary-relationships",
  "preserve-essential-evidence",
  "collapse-contextual-evidence",
  "reduce-secondary-supporting-annotations",
  "defer-lower-relevance-supporting-nexo",
  "collapse-distant-contextual-actors",
  "reduce-contextual-relationships",
  "lower-lod",
  "fallback-minimal-certified-primary",
] as const);

export const DTH_EXP_THEATRE_SCALE_DEFAULT_BUDGET = Object.freeze({
  maxActiveActors: 24,
  maxActiveRelationships: 16,
  maxActiveEvidencePresentations: 8,
  maxSupportingAnnotations: 2,
  maxExpandedEvidenceClusters: 2,
  maxTransitionParticipants: 12,
} as const satisfies Readonly<{
  maxActiveActors: number;
  maxActiveRelationships: number;
  maxActiveEvidencePresentations: number;
  maxSupportingAnnotations: number;
  maxExpandedEvidenceClusters: number;
  maxTransitionParticipants: number;
}>);
export type DthExpTheatreScaleBudget = Readonly<{
  maxActiveActors: number;
  maxActiveRelationships: number;
  maxActiveEvidencePresentations: number;
  maxSupportingAnnotations: number;
  maxExpandedEvidenceClusters: number;
  maxTransitionParticipants: number;
}>;

export type DthExpTheatreScaleActorCandidate = Readonly<{
  canonicalObjectId: string;
  admissionClass: DthExpTheatreScaleAdmissionClass;
  groupingKey?: string | null;
  comparisonMember?: boolean;
}>;

export type DthExpTheatreScaleRelationshipCandidate = Readonly<{
  relationshipId: string;
  admissionClass: DthExpTheatreScaleAdmissionClass;
  semanticRelation: string | null;
  directional: boolean;
}>;

export type DthExpTheatreScaleEvidenceCandidate = Readonly<{
  evidenceRef: string;
  admissionClass: DthExpTheatreScaleAdmissionClass;
  attachedToId: string;
}>;

export type DthExpTheatreScaleSupportCandidate = Readonly<{
  family: DthExpNexoRecipeFamily;
  admissionClass: DthExpTheatreScaleAdmissionClass;
}>;

export type DthExpTheatreScaleTransitionCandidate = Readonly<{
  canonicalObjectId: string;
  admissionClass: DthExpTheatreScaleAdmissionClass;
  persistentFocal: boolean;
}>;

export type DthExpTheatreScaleGroup = Readonly<{
  groupingKey: string;
  memberCanonicalObjectIds: readonly string[];
  disclosure: DthExpMultiNexoDisclosureState;
  presentationOnly: true;
  inventsCanonicalGroupObject: false;
}>;

export type DthExpTheatreScaleEvidenceCluster = Readonly<{
  attachedToId: string;
  evidenceRefs: readonly string[];
  disclosure: DthExpMultiNexoDisclosureState;
  countCreatesConfidence: false;
  provenanceMerged: false;
}>;

export type DthExpTheatreScaleInput = Readonly<{
  canonicalSubjectId: string;
  primaryFamily: DthExpNexoRecipeFamily;
  managementNeed: DthExpDirectorManagementNeed;
  canonicalWorldObjectCount: number;
  canonicalWorldRelationshipCount: number;
  canonicalWorldEvidenceCount: number;
  actors: readonly DthExpTheatreScaleActorCandidate[];
  relationships: readonly DthExpTheatreScaleRelationshipCandidate[];
  evidence: readonly DthExpTheatreScaleEvidenceCandidate[];
  supports: readonly DthExpTheatreScaleSupportCandidate[];
  transitionCandidates?: readonly DthExpTheatreScaleTransitionCandidate[];
  requestedLod?: DthExpTheatreScaleLod | null;
  budget?: Partial<DthExpTheatreScaleBudget>;
  fallbackToSinglePrimary?: boolean;
  reducedMotion?: boolean;
  supersededByTargetId?: string | null;
  workingSetGeneration?: number;
}>;

export type DthExpTheatreScaleWorkingSet = Readonly<{
  identity: typeof dthExpTheatreScaleIdentity;
  version: typeof dthExpTheatreScaleVersion;
  engine: typeof DTH_EXP_THEATRE_SCALE_ENGINE;
  workingSetId: string;
  canonicalSubjectId: string;
  primaryFamily: DthExpNexoRecipeFamily;
  managementNeed: DthExpDirectorManagementNeed;
  lod: DthExpTheatreScaleLod;
  requestedLod: DthExpTheatreScaleLod | null;
  candidateActorCount: number;
  admittedActorIds: readonly string[];
  deferredActorIds: readonly string[];
  omittedActorIds: readonly string[];
  candidateRelationshipCount: number;
  admittedRelationshipIds: readonly string[];
  deferredRelationshipIds: readonly string[];
  omittedRelationshipIds: readonly string[];
  candidateEvidenceCount: number;
  admittedEvidenceRefs: readonly string[];
  deferredEvidenceRefs: readonly string[];
  omittedEvidenceRefs: readonly string[];
  candidateSupportCount: number;
  admittedSupports: readonly DthExpNexoRecipeFamily[];
  deferredSupports: readonly DthExpNexoRecipeFamily[];
  omittedSupports: readonly DthExpNexoRecipeFamily[];
  groups: readonly DthExpTheatreScaleGroup[];
  evidenceClusters: readonly DthExpTheatreScaleEvidenceCluster[];
  density: DthExpTheatreScaleDensity;
  complexity: DthExpTheatreScaleComplexity;
  budget: DthExpTheatreScaleBudget;
  budgetExceeded: boolean;
  degradationActions: readonly string[];
  fallbackToSinglePrimary: boolean;
  fallbackToMinimalPrimary: boolean;
  preservedFocalContext: readonly string[];
  transitionParticipantIds: readonly string[];
  transitionSnappedIds: readonly string[];
  latestValidTargetSupersedesObsolete: boolean;
  disclosureIsPresentationOnly: true;
  densityImpliesImportance: false;
  evidenceCountCreatesConfidence: false;
  presentationAdmissionIsBusinessRanking: false;
  firstNAdmission: false;
  workingSetIsCanonicalStore: false;
  lodChangesPresentationOnly: true;
  preservesFlowDirection: boolean;
  upgradesCausality: false;
  assignsVaiRoles: false;
  calculatesRisk: false;
  ranksBubbleCandidates: false;
  parallelTimelineAuthority: false;
  inventsTimeAggregates: false;
  writesCanonicalObjects: false;
  writesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  declaresOutcomeSuccess: false;
  browserPerformanceCertified: false;
  runtimeBrowserPerformanceNotYetCertified: true;
  liveStageWiring: false;
  reducedMotionEquivalent: true;
  advisorReceivesBoundedScene: true;
}>;

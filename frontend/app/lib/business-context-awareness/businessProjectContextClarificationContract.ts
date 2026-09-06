/**
 * BCA:6 — clarification-need projection.
 * Not NCA, not applyCsvSemanticClarification, not a confirmation writer.
 */
import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { BusinessProjectProcessPlacement } from "./businessProjectProcessContextContract.ts";
import type {
  BusinessProjectContext,
  BusinessProjectContextConfidence,
  BusinessProjectContextKind,
  BusinessProjectSourceRef,
} from "./businessProjectContextContract.ts";
import type { ManagerDecisionContext } from "./managerDecisionContextContract.ts";
import type { BusinessProjectConceptRelationship } from "./businessProjectRelationshipContract.ts";

export const businessProjectContextClarificationIdentity = "BCA:6/ContextClarificationNeed" as const;

export const BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY = Object.freeze({
  consumesBca1To5: true as const,
  ownsNca: false as const,
  ownsAdvisor: false as const,
  ownsClarificationConversation: false as const,
  writesManagerConfirmation: false as const,
  writesSemanticClarification: false as const,
  confirmationWriterSemantic: "applyCsvSemanticClarification" as const,
  confirmationWriterContextual: "ManagerConversation" as const,
  infersCausality: false as const,
  infersPermission: false as const,
  infersCurrentReality: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  mutatesStage: false as const,
  mutatesDecisionTheatre: false as const,
  persistsState: false as const,
  usesLlm: false as const,
});

export const CLARIFICATION_SUBJECT_KINDS = Object.freeze([
  "BUSINESS_PROJECT_CONTEXT",
  "CONCEPT_MEANING",
  "CONCEPT_CLASSIFICATION",
  "RELATIONSHIP",
  "PROCESS_CONTEXT",
  "MANAGER_ROLE",
  "MANAGER_RESPONSIBILITY",
  "CURRENT_DECISION_CONTEXT",
  "SCOPE",
  "TEMPORAL_CONTEXT",
  "SOURCE_CONTEXT",
  "ORGANIZATION_SPECIFIC_MEANING",
] as const);
export type ClarificationSubjectKind = (typeof CLARIFICATION_SUBJECT_KINDS)[number];

export const CLARIFICATION_AMBIGUITY_TYPES = Object.freeze([
  "MULTIPLE_PLAUSIBLE_INTERPRETATIONS",
  "MISSING_REQUIRED_CONTEXT",
  "CONFLICTING_EVIDENCE",
  "UNCONFIRMED_ORGANIZATION_SPECIFIC_MEANING",
  "HYBRID_SCOPE_AMBIGUITY",
  "TEMPORAL_AMBIGUITY",
  "ROLE_AMBIGUITY",
  "SOURCE_AMBIGUITY",
  "RELATIONSHIP_AMBIGUITY",
  "PROCESS_PLACEMENT_AMBIGUITY",
  "UNKNOWN_BUT_NONBLOCKING",
] as const);
export type ClarificationAmbiguityType = (typeof CLARIFICATION_AMBIGUITY_TYPES)[number];

export const CLARIFICATION_MATERIALITY = Object.freeze(["BLOCKING", "IMPORTANT", "OPTIONAL", "NONE"] as const);
export type ClarificationMateriality = (typeof CLARIFICATION_MATERIALITY)[number];

export type ClarificationConfirmationState = "UNCONFIRMED" | "MANAGER_CONFIRMED" | "DECLINED" | "UNRESOLVED";

export type ClarificationCandidate = Readonly<{
  id: string;
  label: string;
  scope: string;
}>;

export type ExistingScopedConfirmation = Readonly<{
  clarificationKey: string;
  confirmationState: ClarificationConfirmationState;
  interpretation?: string | null;
  sourceContextId?: string | null;
  projectId?: string | null;
}>;

export type StatedMeasurement = Readonly<{
  conceptMeaning: string;
  value: string;
  temporalStatus: "CURRENT" | "HISTORICAL" | "FORECAST" | "TARGET" | null;
  sourceRef?: BusinessProjectSourceRef | null;
}>;

export type ContextClarificationNeed = Readonly<{
  authority: typeof businessProjectContextClarificationIdentity;
  clarificationId: string;
  subjectKind: ClarificationSubjectKind | null;
  subjectId: string | null;
  contextKind: BusinessProjectContextKind;
  ambiguityType: ClarificationAmbiguityType | null;
  clarificationNeeded: boolean;
  materiality: ClarificationMateriality;
  candidateInterpretations: readonly ClarificationCandidate[];
  currentInterpretation: string | null;
  unresolvedFields: readonly string[];
  evidence: readonly string[];
  provenance: readonly BusinessProjectSourceRef[];
  confidence: BusinessProjectContextConfidence;
  confirmationState: ClarificationConfirmationState;
  sourceRefs: readonly BusinessProjectSourceRef[];
  scope: string;
  blockingReason: string | null;
  decisionImpact: null;
  recommendedClarificationKind: string | null;
  clarificationQuestionIntent: string | null;
  canProceedWithoutClarification: boolean;
  roleClarificationNeeded: boolean;
  alreadyAsked: boolean;
  declinedOrUnknown: boolean;
  stableRolesPreserved: true;
  currentRolePerspective: string | null;
  confirmationHandoffAuthority: "applyCsvSemanticClarification" | "ManagerConversation" | "none";
  writesConfirmation: false;
  causalQuestionRejected: true;
  permissionsInferred: false;
  currentRealityInferred: false;
  decisionCommitted: false;
  executionMutated: false;
  stageMutated: false;
  theatreMutated: false;
  rejectedInferences: readonly string[];
}>;

export type ResolveContextClarificationInput = Readonly<{
  context: BusinessProjectContext;
  concepts: readonly BusinessProjectConcept[];
  relationships?: readonly BusinessProjectConceptRelationship[];
  processPlacements?: readonly BusinessProjectProcessPlacement[];
  unknownProcessMeanings?: readonly string[];
  managerDecisionContext?: ManagerDecisionContext | null;
  currentRequest: string;
  existingConfirmations?: readonly ExistingScopedConfirmation[];
  pendingClarificationKey?: string | null;
  statedMeasurements?: readonly StatedMeasurement[];
  currentRolePerspective?: string | null;
}>;

export type ContextClarificationDiagnostics = Readonly<{
  clarificationId: string;
  detectedAmbiguities: readonly string[];
  selectedWhy: string | null;
  producingLayers: readonly string[];
  materialNow: boolean;
  canProceedWithoutClarification: boolean;
  alreadyAsked: boolean;
  alreadyConfirmed: boolean;
  declinedOrUnknown: boolean;
  confirmationWriter: typeof BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.confirmationWriterSemantic | typeof BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.confirmationWriterContextual | "none";
  bcaWriteAttempted: false;
  sourceScopePreserved: true;
  projectScopePreserved: true;
  mutatesAuthorities: false;
}>;

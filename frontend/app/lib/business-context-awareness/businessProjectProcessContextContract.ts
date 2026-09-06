/**
 * BCA:4 — conceptual Business/Project process-area placement.
 * Not process mining, workflow, CC:11 Execution, Outcome, or Object creation.
 */
import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { ConceptKnowledgeScope } from "./businessProjectConceptContract.ts";
import type {
  BusinessProjectContext,
  BusinessProjectContextConfidence,
  BusinessProjectContextKind,
  BusinessProjectSourceRef,
  ContextConfirmationState,
} from "./businessProjectContextContract.ts";
import type { BusinessProjectConceptRelationship } from "./businessProjectRelationshipContract.ts";

export const businessProjectProcessContextIdentity = "BCA:4/BusinessProjectProcessContext" as const;

export const BUSINESS_PROJECT_PROCESS_CONTEXT_BOUNDARY = Object.freeze({
  consumesBca1Context: true as const,
  consumesBca2Concepts: true as const,
  consumesBca3Relationships: true as const,
  ownsProcessStore: false as const,
  ownsWorkflowEngine: false as const,
  ownsProcessMining: false as const,
  ownsExecutionRuntime: false as const,
  ownsDependencyEngine: false as const,
  ownsCausalAuthority: false as const,
  createsObjects: false as const,
  createsGoals: false as const,
  createsOutcomes: false as const,
  mutatesStage: false as const,
  mutatesDecisionTheatre: false as const,
  writesManagerConfirmation: false as const,
  persistsState: false as const,
  usesLlm: false as const,
  wiresAdvisor: false as const,
});

export const BUSINESS_PROCESS_AREAS = Object.freeze([
  "STRATEGY", "SALES", "CUSTOMER", "ORDER_MANAGEMENT", "PLANNING", "PROCUREMENT", "SUPPLY",
  "PRODUCTION", "QUALITY", "INVENTORY", "FULFILLMENT", "DELIVERY", "SERVICE", "FINANCE", "PEOPLE",
] as const);
export type BusinessProcessArea = (typeof BUSINESS_PROCESS_AREAS)[number] | string;

/** Conceptual project work phases. PROJECT_WORK_EXECUTION is not CC:11 Execution. */
export const PROJECT_WORK_PHASES = Object.freeze([
  "INITIATION", "PLANNING", "PROJECT_WORK_EXECUTION", "MONITORING_CONTROL", "CLOSURE",
] as const);
export type ProjectWorkPhase = (typeof PROJECT_WORK_PHASES)[number];

export const PROJECT_CONTROL_AREAS = Object.freeze([
  "SCOPE_CONTROL", "SCHEDULE_CONTROL", "COST_CONTROL", "QUALITY_CONTROL", "RESOURCE_MANAGEMENT",
  "RISK_MANAGEMENT", "PROCUREMENT", "STAKEHOLDER_MANAGEMENT", "DEPENDENCY_MANAGEMENT", "DELIVERABLE_CONTROL",
] as const);
export type ProjectControlArea = (typeof PROJECT_CONTROL_AREAS)[number] | string;

export const PROCESS_PARTICIPATION_TYPES = Object.freeze([
  "INPUT_TO", "OUTPUT_OF", "MEASURE_OF", "PERFORMANCE_INDICATOR_FOR", "RELEVANT_DURING",
  "USED_IN", "MONITORED_IN", "CONTROLLED_IN", "ASSOCIATED_WITH_PROCESS",
] as const);
export type ProcessParticipationType = (typeof PROCESS_PARTICIPATION_TYPES)[number];

export type ProcessContextScope = "GENERAL" | "ORGANIZATION" | "PROJECT";
export type ProcessTemporalStatus = "GENERAL" | "HISTORICAL" | "CURRENT" | "FORECAST" | "HYPOTHESIS";
export type ProcessSequenceKind = "REFERENCE_SEQUENCE" | "OBSERVED_SEQUENCE";

export type BusinessProjectProcessPlacement = Readonly<{
  authority: typeof businessProjectProcessContextIdentity;
  processContextId: string;
  contextKind: BusinessProjectContextKind;
  conceptIds: readonly string[];
  canonicalMeaning: string | null;
  relationshipIds: readonly string[];
  processFamily: string | null;
  processAreas: readonly BusinessProcessArea[];
  projectWorkPhases: readonly ProjectWorkPhase[];
  projectControlAreas: readonly ProjectControlArea[];
  participationTypes: readonly ProcessParticipationType[];
  evidence: readonly string[];
  provenance: readonly BusinessProjectSourceRef[];
  confidence: BusinessProjectContextConfidence;
  confirmationState: ContextConfirmationState;
  sourceRefs: readonly BusinessProjectSourceRef[];
  scope: ProcessContextScope;
  knowledgeScopes: readonly ConceptKnowledgeScope[];
  temporalStatus: ProcessTemporalStatus;
  currentRealityEstablished: false;
  processInstanceEstablished: false;
  observedSequenceEstablished: false;
  nexoraExecutionEntityId: null;
  nexoraCanonicalExecutionRuntime: "CC:11/CanonicalExecution";
  nexoraOutcomeId: null;
  executiveObjectId: null;
  ambiguity: Readonly<{ preserved: boolean; note: string | null }>;
  suppressedForCurrentContext: boolean;
  rejectedInferences: readonly string[];
}>;

export type ManagerConfirmedProcessContext = Readonly<{
  conceptMeaning: string;
  processAreas: readonly string[];
  projectWorkPhases?: readonly ProjectWorkPhase[];
  projectControlAreas?: readonly string[];
  participationTypes?: readonly ProcessParticipationType[];
  confirmationState: "MANAGER_CONFIRMED";
  sourceRef: BusinessProjectSourceRef;
  scope: "ORGANIZATION" | "PROJECT";
  stance: "AFFIRMS" | "CONTRARY";
}>;

export type ResolveBusinessProjectProcessContextInput = Readonly<{
  context: BusinessProjectContext;
  concepts: readonly BusinessProjectConcept[];
  relationships?: readonly BusinessProjectConceptRelationship[];
  managerConfirmedProcessContexts?: readonly ManagerConfirmedProcessContext[];
}>;

export type ProcessReferenceSequence = Readonly<{
  kind: "REFERENCE_SEQUENCE";
  steps: readonly ProjectWorkPhase[];
  observedSequence: "UNKNOWN";
  dependencyInferred: false;
  causal: false;
}>;

export type BusinessProjectProcessContextProjection = Readonly<{
  authority: typeof businessProjectProcessContextIdentity;
  contextId: string;
  placements: readonly BusinessProjectProcessPlacement[];
  unknownConcepts: readonly string[];
  referenceSequence: ProcessReferenceSequence;
  processMiningPerformed: false;
  workflowMutated: false;
}>;

export type BusinessProjectProcessContextDiagnostics = Readonly<{
  contextId: string;
  evaluatedConcepts: readonly string[];
  placementTrace: readonly string[];
  selectedWhy: readonly string[];
  processInstanceEstablished: false;
  observedSequenceInferred: false;
  dependencyRejected: true;
  causalityRejected: true;
  sourceLeakagePrevented: boolean;
  objectMutationAttempted: false;
  nexoraExecutionConfused: false;
  reusedAuthorities: readonly string[];
  causalInference: "NONE";
  mutatesAuthorities: false;
}>;

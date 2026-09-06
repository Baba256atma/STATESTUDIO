import type { NexoraDomainId } from "../domain/domainTypes.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const businessProjectContextIdentity = "BCA:1/BusinessProjectContextFoundation" as const;

export const BUSINESS_PROJECT_CONTEXT_BOUNDARY = Object.freeze({
  ownsContextInterpretation: true as const,
  ownsDomain: false as const,
  ownsGoals: false as const,
  ownsObjects: false as const,
  ownsDataReality: false as const,
  ownsSemanticConfirmation: false as const,
  ownsStage: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  createsCausalEdges: false as const,
  createsObjects: false as const,
  createsGoals: false as const,
  persistsState: false as const,
  usesLlm: false as const,
});

export type BusinessProjectContextKind = "BUSINESS" | "PROJECT" | "HYBRID" | "UNKNOWN";
export type BusinessProjectContextConfidence = "KNOWN" | "MANAGER_CONFIRMED" | "SUPPORTED" | "LIKELY" | "AMBIGUOUS" | "UNKNOWN";
export type ContextConfirmationState = "AUTHORITATIVE" | "MANAGER_CONFIRMED" | "UNCONFIRMED";
export type ContextRelationshipKind = "BELONGS_TO_CONTEXT" | "RELEVANT_TO" | "ASSOCIATED_WITH" | "MEASURE_OF" | "SUPPORTS_UNDERSTANDING_OF" | "POTENTIALLY_RELATED_TO";
export type ContextEvidenceKind = "DOMAIN" | "ORGANIZATION" | "PROJECT" | "MANAGER_STATEMENT" | "GOAL" | "OBJECT" | "DATA_ADV_CONFIRMED_SEMANTIC" | "DATA_REALITY" | "EXISTING_RELATIONSHIP";

export type BusinessProjectSourceRef = Readonly<{
  authorityId: string;
  sourceId: string;
  sourceContextId?: string | null;
}>;

export type BusinessProjectContextEvidence = Readonly<{
  evidenceId: string;
  kind: ContextEvidenceKind;
  label: string;
  confirmationState: ContextConfirmationState;
  sourceRef: BusinessProjectSourceRef;
}>;

export type BusinessProjectKnownConcept = Readonly<{
  conceptId: string;
  label: string;
  sourceRef: BusinessProjectSourceRef;
  confirmationState: ContextConfirmationState;
}>;

export type BusinessProjectContextRelationship = Readonly<{
  relationshipId: string;
  fromConceptId: string;
  toContextConcept: string;
  kind: ContextRelationshipKind;
  confidence: Exclude<BusinessProjectContextConfidence, "KNOWN" | "UNKNOWN">;
  evidenceIds: readonly string[];
  causal: false;
}>;

export type BusinessProjectOrganizationContext = Readonly<{ label: string; description?: string | null }>;
export type BusinessProjectProjectContext = Readonly<{ projectId: string; label: string; description?: string | null }>;

/** Reserved attachment only. It grants no permissions or approval authority. */
export type BusinessProjectManagerContext = Readonly<{
  roleLabel: string;
  sourceRef: BusinessProjectSourceRef;
  confirmationState: ContextConfirmationState;
  permissions: null;
  decisionAuthority: null;
}>;

export type BusinessProjectContext = Readonly<{
  authority: typeof businessProjectContextIdentity;
  contextId: string;
  workspaceId: WorkspaceId;
  contextKind: BusinessProjectContextKind;
  domain: NexoraDomainId | null;
  organizationContext: BusinessProjectOrganizationContext | null;
  projectContext: BusinessProjectProjectContext | null;
  managerContext: BusinessProjectManagerContext | null;
  knownConcepts: readonly BusinessProjectKnownConcept[];
  contextualRelationships: readonly BusinessProjectContextRelationship[];
  evidence: readonly BusinessProjectContextEvidence[];
  confidence: BusinessProjectContextConfidence;
  confirmationState: ContextConfirmationState;
  sourceRefs: readonly BusinessProjectSourceRef[];
  unresolvedContext: readonly string[];
  createdFrom: "AUTHORITATIVE_PROJECTION";
}>;

export type BusinessProjectContextSignal = Readonly<{
  evidenceId: string;
  kind: ContextEvidenceKind;
  label: string;
  confirmationState: ContextConfirmationState;
  sourceRef: BusinessProjectSourceRef;
}>;

export type ResolveProjectContextInput = Readonly<{
  workspaceId: WorkspaceId;
  domain?: Readonly<{ domainId: NexoraDomainId; evidence: BusinessProjectContextSignal }> | null;
  organization?: Readonly<{ context: BusinessProjectOrganizationContext; evidence: BusinessProjectContextSignal }> | null;
  project?: Readonly<{ context: BusinessProjectProjectContext; evidence: BusinessProjectContextSignal }> | null;
  managerContext?: BusinessProjectManagerContext | null;
  confirmedSemanticConcepts?: readonly BusinessProjectKnownConcept[];
  goalSignals?: readonly BusinessProjectContextSignal[];
  objectSignals?: readonly BusinessProjectContextSignal[];
  dataRealitySignals?: readonly BusinessProjectContextSignal[];
  relationshipSignals?: readonly BusinessProjectContextSignal[];
}>;

export type BusinessProjectContextDiagnostics = Readonly<{
  contextId: string;
  resolvedContextKind: BusinessProjectContextKind;
  confidence: BusinessProjectContextConfidence;
  evidenceTrace: readonly string[];
  relationshipTrace: readonly string[];
  unresolvedContext: readonly string[];
  rejectedUnsafeInference: readonly string[];
  mutatesAuthorities: false;
}>;

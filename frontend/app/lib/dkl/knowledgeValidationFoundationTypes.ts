/**
 * DKL-5:1 — Knowledge Validation Foundation Types.
 *
 * Readonly contracts for the Knowledge Validation Platform foundation.
 * Architectural and metadata-oriented. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-5:1.
 */

/** Official definition of Knowledge Validation (DKL-5). */
export const KNOWLEDGE_VALIDATION_DEFINITION =
  "Knowledge Validation evaluates the structural reliability, completeness, consistency, traceability, and usability of organizational knowledge modeled by DKL-4 — producing explainable validation declarations and quality signals without cleansing data, resolving entities, generating AI confidence, or determining business decisions.";

export type ValidationTargetCategory =
  | "KnowledgeModel"
  | "KnowledgeObject"
  | "BusinessObject"
  | "Entity"
  | "Relationship"
  | "Identity"
  | "Metadata"
  | "Hierarchy"
  | "Composition"
  | "Reference"
  | "SemanticStructure"
  | "Provenance"
  | "Context"
  | "Snapshot"
  | "ObjectSet"
  | "RelationshipSet"
  | "Boundary"
  | "Version"
  | "Summary";

export type ValidationDimension =
  | "Identity"
  | "Completeness"
  | "Consistency"
  | "Integrity"
  | "ReferentialIntegrity"
  | "StructuralValidity"
  | "SemanticAlignment"
  | "Provenance"
  | "Traceability"
  | "Ownership"
  | "Compatibility"
  | "Classification"
  | "RelationshipValidity"
  | "HierarchyValidity"
  | "CompositionValidity"
  | "Ambiguity"
  | "Conflict"
  | "FreshnessDeclaration"
  | "ConsumerReadiness"
  | "ExecutiveUsability";

export type KnowledgeQualitySignalId =
  | "Complete"
  | "MostlyComplete"
  | "Partial"
  | "Missing"
  | "Consistent"
  | "Conflicting"
  | "Clear"
  | "Ambiguous"
  | "Traceable"
  | "Untraceable"
  | "Supported"
  | "Unsupported"
  | "Current"
  | "PotentiallyStale"
  | "Verified"
  | "Unverified"
  | "Reliable"
  | "Limited"
  | "Restricted"
  | "Ready";

export type QualitySignalPolarity = "Positive" | "Neutral" | "Negative" | "Caution";

export type ValidationOutcomeStatus =
  | "NotEvaluated"
  | "Valid"
  | "ValidWithLimitations"
  | "Invalid"
  | "Incomplete"
  | "Ambiguous"
  | "Conflicting"
  | "Unsupported"
  | "Restricted"
  | "ReadyForConsumer"
  | "NotReadyForConsumer";

export type ValidationSeverity =
  | "Informational"
  | "Low"
  | "Medium"
  | "High"
  | "Critical"
  | "Blocking";

export type ValidationLifecycleState =
  | "Declared"
  | "AwaitingEvaluation"
  | "Evaluating"
  | "EvidenceCollected"
  | "FindingsProduced"
  | "ResultDetermined"
  | "Limited"
  | "Blocked"
  | "ReadyForConsumer"
  | "Superseded"
  | "Archived";

export type TrustLevel =
  | "Undeclared"
  | "Unsupported"
  | "Limited"
  | "Conditional"
  | "Supported"
  | "Verified"
  | "Restricted";

export type EvidenceKind =
  | "Supporting"
  | "Contradicting"
  | "Missing"
  | "Referenced"
  | "Provenance";

export type ConflictResolutionStatus =
  | "Unresolved"
  | "Acknowledged"
  | "Scoped"
  | "Deferred"
  | "Superseded";

export interface KnowledgeValidationFoundationIdentity {
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly foundationName: string;
  readonly foundationNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-5:1";
  readonly platformId: "DKL-5";
  readonly platformVersion: string;
  readonly status: "FoundationComplete";
  readonly readiness: "ReadyForRegistry";
}

export interface QualitySignalDescriptor {
  readonly id: KnowledgeQualitySignalId;
  readonly name: string;
  readonly dimension: ValidationDimension;
  readonly meaning: string;
  readonly polarity: QualitySignalPolarity;
  readonly severity: ValidationSeverity;
  readonly consumerImpact: string;
  readonly clarificationRecommended: boolean;
  readonly blockingStatus: boolean;
  readonly ownership: string;
  readonly sourcePhase: "DKL-5:1";
}

export interface OutcomeDescriptor {
  readonly status: ValidationOutcomeStatus;
  readonly meaning: string;
  readonly allowedUsage: string;
  readonly mayRemainUsable: boolean;
  readonly clarificationRequired: boolean;
  readonly blocksConclusions: boolean;
}

export interface SeverityDescriptor {
  readonly severity: ValidationSeverity;
  readonly meaning: string;
  readonly architecturalImpact: string;
}

export interface ExtensionPolicyDescriptor {
  readonly policyId: string;
  readonly name: string;
  readonly status: "AdditiveAllowed" | "MigrationRequired" | "Forbidden";
  readonly description: string;
}

export interface CompatibilityPolicyDescriptor {
  readonly policyId: string;
  readonly name: string;
  readonly status: "Compatible" | "ForwardCompatible" | "Restricted" | "Forbidden";
  readonly description: string;
}

export interface KnowledgeValidationTerminology {
  readonly knowledgeValidation: string;
  readonly validationTarget: string;
  readonly qualitySignal: string;
  readonly trustDeclaration: string;
  readonly validationFinding: string;
  readonly ambiguity: string;
  readonly conflict: string;
  readonly limitation: string;
}

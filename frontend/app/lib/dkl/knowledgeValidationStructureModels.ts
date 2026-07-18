/**
 * DKL-5:3 — Structure, readiness, consumer, executive, provenance, set models.
 *
 * Ownership: owned exclusively by DKL-5:3.
 */

import { field, model } from "./knowledgeValidationModelHelpers.ts";
import type { CanonicalModelDescriptor } from "./knowledgeValidationModelTypes.ts";

export const KnowledgeValidationAggregateModel: CanonicalModelDescriptor = model(
  "KnowledgeValidation",
  "Knowledge Validation Model",
  "Canonical aggregate able to represent a complete knowledge-validation record. Structural only — no evaluation.",
  Object.freeze([
    "validationTargetTypes",
    "validationDimensions",
    "validationStatuses",
    "validationOutcomes",
    "knowledgeQualitySignals",
    "trustLevels",
    "evidenceTypes",
    "findingCategories",
    "issueCategories",
    "conflictTypes",
    "ambiguityTypes",
    "limitationTypes",
    "consumerReadinessStates",
  ]),
  Object.freeze([
    field("validationId", "string", "Stable declared validation identity."),
    field("namespace", "string", "Canonical namespace."),
    field("version", "string", "Declared version."),
    field("target", "ValidationTarget", "Validation target contract."),
    field("scope", "ValidationScope", "Validation scope contract."),
    field("lifecycleState", "ModelLifecycleState", "Declared lifecycle state."),
    field("status", "ValidationStatus", "Validation status contract."),
    field("applicableDimensions", "string[]", "Applicable dimension references."),
    field("ruleSet", "ValidationRuleSet", "Applied rule set."),
    field("criteria", "ValidationCriterion[]", "Criterion references."),
    field("evidenceSet", "ValidationEvidenceSet", "Evidence set."),
    field("findings", "ValidationFindingSet", "Finding set."),
    field("issues", "ValidationIssueSet", "Issue set."),
    field("conflicts", "ValidationConflict[]", "Conflict references."),
    field("ambiguities", "ValidationAmbiguity[]", "Ambiguity references."),
    field("limitations", "ValidationLimitation[]", "Limitation references."),
    field("qualitySignals", "KnowledgeQualitySignal[]", "Quality signal references."),
    field("trustDeclaration", "KnowledgeTrustDeclaration", "Trust declaration."),
    field("result", "ValidationResult", "Validation result."),
    field("summary", "ValidationSummary", "Validation summary."),
    field("consumerReadiness", "ValidationConsumerSuitability", "Consumer readiness."),
    field("executiveUsability", "ValidationExecutiveUsability", "Executive usability."),
    field("provenance", "ValidationProvenance", "Provenance contract."),
    field("ownership", "string", "Owning architectural owner."),
    field("compatibility", "string", "Compatibility metadata."),
    field("extensionMetadata", "string", "Extension policy metadata."),
    field("sourceKnowledgeModelingReferences", "string[]", "DKL-4 references via Foundation."),
  ]),
);

export const ValidationReadinessModel: CanonicalModelDescriptor = model(
  "ValidationReadiness",
  "Validation Readiness Model",
  "Structural readiness declaration for knowledge-validation records.",
  Object.freeze(["consumerReadinessStates", "validationLifecycleStates"]),
  Object.freeze([
    field("readinessId", "string", "Stable declared readiness identifier."),
    field("readinessState", "registryReference", "Registered readiness state."),
    field("targetReference", "string", "Target subject reference."),
    field("blockingFindings", "string[]", "Blocking finding references."),
    field("limitations", "string[]", "Limitation references."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationProvenanceModel: CanonicalModelDescriptor = model(
  "ValidationProvenance",
  "Validation Provenance Model",
  "Immutable provenance. generatedTimestamp is prohibited — no runtime timestamps.",
  Object.freeze(["ownershipDeclarations", "dependencyDeclarations"]),
  Object.freeze([
    field("sourcePhase", "string", "Declaring source phase."),
    field("sourceArtifact", "string", "Source artifact reference."),
    field("sourceKnowledgeModelingReference", "string", "DKL-4 reference via Foundation."),
    field("sourceValidationRule", "string", "Source validation rule reference."),
    field("sourceEvidence", "string", "Source evidence reference."),
    field("transformationDeclaration", "string", "Declared transformation — not executed."),
    field("authoringOwner", "string", "Authoring owner."),
    field("supersedes", "string", "Supersedes reference."),
    field("supersededBy", "string", "Superseded-by reference."),
    field("version", "string", "Declared version."),
    field("traceChain", "string[]", "Declared trace chain."),
    field("generatedTimestampProhibited", "true", "Always true — runtime timestamps forbidden."),
  ]),
);

export const ValidationBoundaryModel: CanonicalModelDescriptor = model(
  "ValidationBoundary",
  "Validation Boundary Model",
  "Structural boundary declaration for knowledge validation ownership and scope.",
  Object.freeze(["boundaryDeclarations"]),
  Object.freeze([
    field("boundaryId", "string", "Stable declared boundary identifier."),
    field("boundaryType", "registryReference", "Registered boundary declaration."),
    field("includedScopes", "string[]", "Included scope references."),
    field("excludedScopes", "string[]", "Excluded scope references."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationSessionModel: CanonicalModelDescriptor = model(
  "ValidationSession",
  "Validation Session Model",
  "Structural session metadata for a knowledge-validation record grouping. No runtime session execution.",
  Object.freeze(["validationLifecycleStates", "ownershipDeclarations"]),
  Object.freeze([
    field("sessionId", "string", "Stable declared session identifier."),
    field("validationReferences", "string[]", "Related validation identifiers."),
    field("subjectSet", "ValidationSubjectSet", "Subject set reference."),
    field("ruleSet", "ValidationRuleSet", "Rule set reference."),
    field("ownership", "string", "Owning architectural owner."),
    field("lifecycle", "ModelLifecycleState", "Declared lifecycle state."),
    field("status", "ModelStatus", "Declared status."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationSubjectSetModel: CanonicalModelDescriptor = model(
  "ValidationSubjectSet",
  "Validation Subject Set Model",
  "Ordered set of validation subject/target references.",
  Object.freeze(["validationTargetTypes"]),
  Object.freeze([
    field("setId", "string", "Stable declared subject set identifier."),
    field("subjectReferences", "string[]", "Subject/target references."),
    field("subjectCount", "number", "Declared subject count field."),
    field("ownership", "string", "Owning architectural owner."),
    field("status", "ModelStatus", "Declared status."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationRuleSetModel: CanonicalModelDescriptor = model(
  "ValidationRuleSet",
  "Validation Rule Set Model",
  "Ordered set of validation rule references. No rule execution.",
  Object.freeze(["validationRuleCategories"]),
  Object.freeze([
    field("setId", "string", "Stable declared rule set identifier."),
    field("ruleReferences", "string[]", "Rule references."),
    field("ruleCount", "number", "Declared rule count field."),
    field("ownership", "string", "Owning architectural owner."),
    field("status", "ModelStatus", "Declared status."),
    field("compatibility", "string", "Compatibility metadata."),
    field("executionImplemented", "false", "Always false."),
  ]),
);

export const ValidationEvidenceSetModel: CanonicalModelDescriptor = model(
  "ValidationEvidenceSet",
  "Validation Evidence Set Model",
  "Ordered set of evidence references. No payload embedding.",
  Object.freeze(["evidenceTypes"]),
  Object.freeze([
    field("setId", "string", "Stable declared evidence set identifier."),
    field("evidenceReferences", "string[]", "Evidence references."),
    field("evidenceCount", "number", "Declared evidence count field."),
    field("ownership", "string", "Owning architectural owner."),
    field("status", "ModelStatus", "Declared status."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationFindingSetModel: CanonicalModelDescriptor = model(
  "ValidationFindingSet",
  "Validation Finding Set Model",
  "Ordered set of finding references.",
  Object.freeze(["findingCategories"]),
  Object.freeze([
    field("setId", "string", "Stable declared finding set identifier."),
    field("findingReferences", "string[]", "Finding references."),
    field("findingCount", "number", "Declared finding count field."),
    field("ownership", "string", "Owning architectural owner."),
    field("status", "ModelStatus", "Declared status."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationIssueSetModel: CanonicalModelDescriptor = model(
  "ValidationIssueSet",
  "Validation Issue Set Model",
  "Ordered set of issue references.",
  Object.freeze(["issueCategories"]),
  Object.freeze([
    field("setId", "string", "Stable declared issue set identifier."),
    field("issueReferences", "string[]", "Issue references."),
    field("issueCount", "number", "Declared issue count field."),
    field("ownership", "string", "Owning architectural owner."),
    field("status", "ModelStatus", "Declared status."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationConsumerSuitabilityModel: CanonicalModelDescriptor = model(
  "ValidationConsumerSuitability",
  "Validation Consumer Suitability Model",
  "Consumer suitability declarations: ReadyForConsumer, ReadyWithLimitations, Restricted, NotReadyForConsumer. No access-control enforcement.",
  Object.freeze(["consumerReadinessStates"]),
  Object.freeze([
    field("suitabilityId", "string", "Stable declared suitability identifier."),
    field("suitabilityState", "string", "ReadyForConsumer | ReadyWithLimitations | Restricted | NotReadyForConsumer."),
    field("allowedConsumers", "string[]", "Declared allowed consumers."),
    field("restrictedConsumers", "string[]", "Declared restricted consumers."),
    field("allowedUseCases", "string[]", "Declared allowed use cases."),
    field("prohibitedUseCases", "string[]", "Declared prohibited use cases."),
    field("blockingFindings", "string[]", "Blocking finding references."),
    field("limitations", "string[]", "Limitation references."),
    field("requiredClarification", "string[]", "Required clarification declarations."),
    field("executiveUseStatus", "string", "Declared executive-use status."),
    field("accessControlEnforced", "false", "Always false — no access-control enforcement."),
    field("ownership", "string", "Owning architectural owner."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationExecutiveUsabilityModel: CanonicalModelDescriptor = model(
  "ValidationExecutiveUsability",
  "Validation Executive Usability Model",
  "Declares whether knowledge may support awareness through decision commitment. Declaration only — no Executive Engine reasoning.",
  Object.freeze(["consumerReadinessStates", "trustLevels"]),
  Object.freeze([
    field("usabilityId", "string", "Stable declared usability identifier."),
    field("executiveAwareness", "boolean", "Suitable for executive awareness."),
    field("executiveMonitoring", "boolean", "Suitable for executive monitoring."),
    field("executiveAnalysis", "boolean", "Suitable for executive analysis."),
    field("scenarioComparison", "boolean", "Suitable for scenario comparison."),
    field("planningInput", "boolean", "Suitable for planning input."),
    field("reasoningInput", "boolean", "Suitable for reasoning input."),
    field("decisionSupport", "boolean", "Suitable for decision support."),
    field("decisionCommitment", "boolean", "Suitable for decision commitment."),
    field("awarenessVsDecisionDistinction", "true", "Always true — awareness and commitment are distinct."),
    field("executiveEngineReasoningForbidden", "true", "Always true — no Engine reasoning."),
    field("ownership", "string", "Owning architectural owner."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationVersionModel: CanonicalModelDescriptor = model(
  "ValidationVersion",
  "Validation Version Model",
  "Structural version metadata for knowledge-validation records.",
  Object.freeze(["compatibilityPolicies", "extensionPolicies"]),
  Object.freeze([
    field("versionId", "string", "Stable declared version identifier."),
    field("version", "string", "Declared semantic version."),
    field("supersedes", "string", "Supersedes reference."),
    field("supersededBy", "string", "Superseded-by reference."),
    field("compatibility", "string", "Compatibility metadata."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
  ]),
);

/** Explicit consumer suitability state catalog. */
export const ConsumerSuitabilityStateCatalog = Object.freeze({
  catalogId: "DKL-5:3/ConsumerSuitabilityStates",
  states: Object.freeze([
    "ReadyForConsumer",
    "ReadyWithLimitations",
    "Restricted",
    "NotReadyForConsumer",
  ] as const),
  accessControlEnforcementForbidden: true,
  metadataOnly: true,
  immutable: true,
});

/** Explicit executive usability capability catalog. */
export const ExecutiveUsabilityCapabilityCatalog = Object.freeze({
  catalogId: "DKL-5:3/ExecutiveUsabilityCapabilities",
  capabilities: Object.freeze([
    "ExecutiveAwareness",
    "ExecutiveMonitoring",
    "ExecutiveAnalysis",
    "ScenarioComparison",
    "PlanningInput",
    "ReasoningInput",
    "DecisionSupport",
    "DecisionCommitment",
  ] as const),
  executiveEngineReasoningForbidden: true,
  metadataOnly: true,
  immutable: true,
});

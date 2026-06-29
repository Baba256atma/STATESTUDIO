/**
 * APP-12:7 — Executive Recommendation Delivery Engine validation.
 */

import {
  EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_LIMITS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_MANDATORY_DELIVERY_FIELDS,
} from "./executiveRecommendationDeliveryEngineConstants.ts";
import type {
  ExecutiveRecommendationDelivery,
  ExecutiveRecommendationDeliveryRequest,
  RecommendationDeliveryProvenance,
  RecommendationDeliveryValidation,
  RecommendationDeliveryValidationIssue,
  RecommendationInteractionCapability,
} from "./executiveRecommendationDeliveryEngineTypes.ts";
import { isRecommendationOptimizationEngineInitialized } from "./executiveRecommendationOptimizationEngine.ts";
import { validateRecommendationOptimizationRecord } from "./executiveRecommendationOptimizationEngineValidation.ts";
import type { RecommendationOptimization } from "./executiveRecommendationOptimizationEngineTypes.ts";
import { isRecommendationGovernanceEngineInitialized } from "./executiveRecommendationGovernanceEngine.ts";
import { isRecommendationExplainabilityEngineInitialized } from "./executiveRecommendationExplainabilityEngine.ts";
import { isRecommendationEvaluationEngineInitialized } from "./executiveRecommendationEvaluationEngine.ts";
import { isRecommendationGenerationEngineInitialized } from "./executiveRecommendationGenerationEngine.ts";
import { isExecutiveRecommendationPlatformInitialized } from "./executiveRecommendationFoundation.ts";

function issue(code: string, message: string, field?: string): RecommendationDeliveryValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: RecommendationDeliveryValidationIssue[]): RecommendationDeliveryValidation {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateDeliveryIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function validateFoundationCompatibilityForDeliveryEngine(
  foundationInitialized: boolean
): RecommendationDeliveryValidation {
  if (!foundationInitialized) {
    return result([issue("foundation_incompatible", "APP-12:1 foundation is not initialized.")]);
  }
  return result([]);
}

export function validateGenerationEngineCompatibilityForDelivery(
  generationEngineInitialized: boolean
): RecommendationDeliveryValidation {
  if (!generationEngineInitialized) {
    return result([issue("generation_incompatible", "APP-12:2 generation engine is not initialized.")]);
  }
  return result([]);
}

export function validateEvaluationEngineCompatibilityForDelivery(
  evaluationEngineInitialized: boolean
): RecommendationDeliveryValidation {
  if (!evaluationEngineInitialized) {
    return result([issue("evaluation_incompatible", "APP-12:3 evaluation engine is not initialized.")]);
  }
  return result([]);
}

export function validateExplainabilityEngineCompatibilityForDelivery(
  explainabilityEngineInitialized: boolean
): RecommendationDeliveryValidation {
  if (!explainabilityEngineInitialized) {
    return result([issue("explainability_incompatible", "APP-12:4 explainability engine is not initialized.")]);
  }
  return result([]);
}

export function validateGovernanceEngineCompatibilityForDelivery(
  governanceEngineInitialized: boolean
): RecommendationDeliveryValidation {
  if (!governanceEngineInitialized) {
    return result([issue("governance_incompatible", "APP-12:5 governance engine is not initialized.")]);
  }
  return result([]);
}

export function validateOptimizationEngineCompatibility(
  optimizationEngineInitialized: boolean
): RecommendationDeliveryValidation {
  if (!optimizationEngineInitialized) {
    return result([issue("optimization_incompatible", "APP-12:6 optimization engine is not initialized.")]);
  }
  return result([]);
}

export function validateDeliveryDependencies(): RecommendationDeliveryValidation {
  const foundation = validateFoundationCompatibilityForDeliveryEngine(
    isExecutiveRecommendationPlatformInitialized()
  );
  if (!foundation.valid) {
    return foundation;
  }
  const generation = validateGenerationEngineCompatibilityForDelivery(
    isRecommendationGenerationEngineInitialized()
  );
  if (!generation.valid) {
    return generation;
  }
  const evaluation = validateEvaluationEngineCompatibilityForDelivery(
    isRecommendationEvaluationEngineInitialized()
  );
  if (!evaluation.valid) {
    return evaluation;
  }
  const explainability = validateExplainabilityEngineCompatibilityForDelivery(
    isRecommendationExplainabilityEngineInitialized()
  );
  if (!explainability.valid) {
    return explainability;
  }
  const governance = validateGovernanceEngineCompatibilityForDelivery(
    isRecommendationGovernanceEngineInitialized()
  );
  if (!governance.valid) {
    return governance;
  }
  return validateOptimizationEngineCompatibility(isRecommendationOptimizationEngineInitialized());
}

export function validateRecommendationDeliveryProvenance(
  provenance: RecommendationDeliveryProvenance
): RecommendationDeliveryValidation {
  const issues: RecommendationDeliveryValidationIssue[] = [];
  if (!provenance.recommendationId.trim()) {
    issues.push(issue("missing_provenance", "recommendationId is required."));
  }
  if (!provenance.optimizationId.trim()) {
    issues.push(issue("missing_provenance", "optimizationId is required."));
  }
  if (!provenance.governanceId.trim()) {
    issues.push(issue("missing_provenance", "governanceId is required."));
  }
  if (!provenance.evaluationId.trim()) {
    issues.push(issue("missing_provenance", "evaluationId is required."));
  }
  if (!provenance.explanationId.trim()) {
    issues.push(issue("missing_provenance", "explanationId is required."));
  }
  if (!provenance.workspaceId.trim()) {
    issues.push(issue("missing_provenance", "workspaceId is required."));
  }
  if (provenance.sourcePlatforms.length === 0) {
    issues.push(issue("missing_provenance", "sourcePlatforms must not be empty."));
  }
  if (Object.keys(provenance.dependencyVersions).length === 0) {
    issues.push(issue("missing_provenance", "dependencyVersions must not be empty."));
  }
  if (provenance.generationVersion !== "APP-12/2") {
    issues.push(issue("invalid_provenance", "generationVersion mismatch."));
  }
  if (provenance.evaluationVersion !== "APP-12/3") {
    issues.push(issue("invalid_provenance", "evaluationVersion mismatch."));
  }
  if (provenance.explanationVersion !== "APP-12/4") {
    issues.push(issue("invalid_provenance", "explanationVersion mismatch."));
  }
  if (provenance.governanceVersion !== "APP-12/5") {
    issues.push(issue("invalid_provenance", "governanceVersion mismatch."));
  }
  if (provenance.optimizationVersion !== "APP-12/6") {
    issues.push(issue("invalid_provenance", "optimizationVersion mismatch."));
  }
  if (provenance.deliveryVersion !== EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "deliveryVersion mismatch."));
  }
  if (provenance.engineVersion !== EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch."));
  }
  if (provenance.foundationVersion !== "APP-12/1") {
    issues.push(issue("invalid_provenance", "foundationVersion mismatch."));
  }
  return result(issues);
}

function validateMandatoryFields(
  record: Record<string, unknown>,
  fields: readonly string[],
  prefix: string
): RecommendationDeliveryValidationIssue[] {
  const issues: RecommendationDeliveryValidationIssue[] = [];
  for (const field of fields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      issues.push(issue("missing_field", `${prefix}.${field} is required.`, field));
    }
  }
  return issues;
}

function validateInteractionCapability(
  capability: RecommendationInteractionCapability
): RecommendationDeliveryValidation {
  const issues: RecommendationDeliveryValidationIssue[] = [];
  if (
    !(EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS as readonly string[]).includes(
      capability.capabilityKey
    )
  ) {
    issues.push(issue("invalid_capability", "Invalid interaction capability key.", "capabilityKey"));
  }
  if (!capability.label.trim()) {
    issues.push(issue("missing_field", "label is required.", "label"));
  }
  if (!capability.rationale.trim()) {
    issues.push(issue("missing_field", "rationale is required.", "rationale"));
  }
  if (capability.enabled !== true) {
    issues.push(issue("capability_integrity", "Capabilities must be metadata-only enabled."));
  }
  return result(issues);
}

function buildExpectedDeliveryId(recommendationId: string): string {
  return `recommendation-delivery-${recommendationId}`;
}

export function validateExecutiveRecommendationDeliveryRecord(
  delivery: ExecutiveRecommendationDelivery
): RecommendationDeliveryValidation {
  const issues = validateMandatoryFields(
    delivery as unknown as Record<string, unknown>,
    EXECUTIVE_RECOMMENDATION_DELIVERY_MANDATORY_DELIVERY_FIELDS,
    "delivery"
  );
  if (delivery.deliveryId !== buildExpectedDeliveryId(delivery.recommendationId)) {
    issues.push(issue("identity_mismatch", "deliveryId must match recommendationId pattern."));
  }
  if (delivery.package.deliveryId !== delivery.deliveryId) {
    issues.push(issue("package_mismatch", "Package deliveryId mismatch."));
  }
  if (delivery.package.optimizationId !== delivery.optimizationId) {
    issues.push(issue("package_mismatch", "Package optimizationId mismatch."));
  }
  if (delivery.deliveryEvidence.length === 0) {
    issues.push(issue("missing_evidence", "deliveryEvidence must not be empty."));
  }
  if (delivery.package.consumerTargets.length !== EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS.length) {
    issues.push(issue("consumer_count", "Expected 4 consumer targets."));
  }
  if (
    delivery.package.interactionProfile.capabilities.length !==
    EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_LIMITS.maxCapabilitiesPerProfile
  ) {
    issues.push(issue("capability_count", "Expected 8 interaction capabilities."));
  }
  if (delivery.package.evidenceReferences.length === 0) {
    issues.push(issue("missing_references", "evidenceReferences must not be empty."));
  }
  if (!delivery.package.executiveSummary.trim()) {
    issues.push(issue("missing_summary", "executiveSummary is required."));
  }
  const provenanceValidation = validateRecommendationDeliveryProvenance(delivery.provenance);
  if (!provenanceValidation.valid) {
    issues.push(...provenanceValidation.issues);
  }
  for (const capability of delivery.package.interactionProfile.capabilities) {
    const capabilityValidation = validateInteractionCapability(capability);
    if (!capabilityValidation.valid) {
      issues.push(...capabilityValidation.issues);
    }
  }
  for (const consumer of delivery.package.consumerTargets) {
    if (!(EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS as readonly string[]).includes(consumer)) {
      issues.push(issue("invalid_consumer", `Invalid consumer target: ${consumer}.`));
    }
  }
  return result(issues);
}

export function validateExecutiveRecommendationDeliveries(
  deliveries: readonly ExecutiveRecommendationDelivery[]
): RecommendationDeliveryValidation {
  const issues: RecommendationDeliveryValidationIssue[] = [];
  const ids = deliveries.map((entry) => entry.deliveryId);
  if (hasDuplicateDeliveryIds(ids)) {
    issues.push(issue("duplicate_ids", "Duplicate delivery IDs detected."));
  }
  for (const delivery of deliveries) {
    const validation = validateExecutiveRecommendationDeliveryRecord(delivery);
    if (!validation.valid) {
      issues.push(...validation.issues);
    }
  }
  return result(issues);
}

export function validateExecutiveRecommendationDeliveryRequest(
  request: ExecutiveRecommendationDeliveryRequest
): RecommendationDeliveryValidation {
  const issues: RecommendationDeliveryValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (!request.sessionLabel.trim()) {
    issues.push(issue("missing_field", "sessionLabel is required.", "sessionLabel"));
  }
  if (request.optimizations.length === 0) {
    issues.push(issue("missing_field", "optimizations must not be empty.", "optimizations"));
  }
  if (request.optimizations.length > EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_LIMITS.maxOptimizationsPerRequest) {
    issues.push(issue("limit_exceeded", "Too many optimizations."));
  }
  if (hasDuplicateDeliveryIds(request.optimizations.map((entry) => entry.recommendationId))) {
    issues.push(issue("duplicate_ids", "Duplicate recommendation IDs in request."));
  }
  for (const optimization of request.optimizations) {
    const optimizationValidation = validateRecommendationOptimizationRecord(optimization);
    if (!optimizationValidation.valid) {
      issues.push(...optimizationValidation.issues);
    }
    if (optimization.provenance.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Optimization workspace mismatch.", "workspaceId"));
    }
  }
  return result(issues);
}

export function validateRecommendationDelivery(
  input: ExecutiveRecommendationDelivery | ExecutiveRecommendationDeliveryRequest
): RecommendationDeliveryValidation {
  if ("optimizations" in input) {
    return validateExecutiveRecommendationDeliveryRequest(input);
  }
  return validateExecutiveRecommendationDeliveryRecord(input);
}

export function isOptimizationEligibleForDelivery(optimization: RecommendationOptimization): boolean {
  return optimization.variant.governancePreserved === true && optimization.variant.intentPreserved === true;
}

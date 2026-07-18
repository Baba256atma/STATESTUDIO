/**
 * DKL-5:3 — Finding and Issue model descriptors.
 *
 * Ownership: owned exclusively by DKL-5:3.
 */

import { field, model } from "./knowledgeValidationModelHelpers.ts";
import type { CanonicalModelDescriptor } from "./knowledgeValidationModelTypes.ts";

export const ValidationFindingModel: CanonicalModelDescriptor = model(
  "ValidationFinding",
  "Validation Finding Model",
  "Immutable validation finding. Recommendations are declared only — not generated dynamically. runtimeRemediationImplemented is always false.",
  Object.freeze(["findingCategories", "validationSeverities", "knowledgeQualitySignals"]),
  Object.freeze([
    field("findingId", "string", "Stable declared finding identifier."),
    field("category", "registryReference", "Registered finding category."),
    field("targetReference", "string", "Target subject reference."),
    field("ruleReference", "string", "Related rule reference."),
    field("criterionReference", "string", "Related criterion reference."),
    field("dimension", "registryReference", "Registered validation dimension."),
    field("severity", "registryReference", "Registered severity."),
    field("qualitySignal", "registryReference", "Related quality signal reference."),
    field("evidenceReferences", "string[]", "Evidence reference identifiers."),
    field("explanation", "string", "Explainable finding narrative."),
    field("consumerImpact", "string", "Declared consumer impact."),
    field("executiveImpact", "string", "Declared executive impact."),
    field("clarificationRecommendation", "string", "Declared clarification recommendation."),
    field("blockingDeclaration", "boolean", "Declared blocking behavior."),
    field("remediationOwnershipDeclaration", "string", "Declared remediation ownership."),
    field("limitationReferences", "string[]", "Related limitation references."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("lifecycle", "ModelLifecycleState", "Declared lifecycle state."),
    field("status", "ModelStatus", "Declared status."),
    field("runtimeRemediationImplemented", "false", "Always false — no remediation."),
  ]),
);

export const ValidationIssueModel: CanonicalModelDescriptor = model(
  "ValidationIssue",
  "Validation Issue Model",
  "Immutable validation issue. No issue workflows are executed in this phase.",
  Object.freeze(["issueCategories", "validationSeverities"]),
  Object.freeze([
    field("issueId", "string", "Stable declared issue identifier."),
    field("category", "registryReference", "Registered issue category."),
    field("targetReference", "string", "Target subject reference."),
    field("relatedFindings", "string[]", "Related finding identifiers."),
    field("severity", "registryReference", "Registered severity."),
    field("status", "ModelStatus", "Declared status."),
    field("scope", "string", "Issue scope declaration."),
    field("evidenceReferences", "string[]", "Evidence reference identifiers."),
    field("ownership", "string", "Owning architectural owner."),
    field("consumerImpact", "string", "Declared consumer impact."),
    field("executiveImpact", "string", "Declared executive impact."),
    field("blockingDeclaration", "boolean", "Declared blocking behavior."),
    field("clarificationRequirement", "string", "Declared clarification requirement."),
    field("limitationReferences", "string[]", "Related limitation references."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

export const ValidationLimitationModel: CanonicalModelDescriptor = model(
  "ValidationLimitation",
  "Validation Limitation Model",
  "Immutable limitation metadata that preserves partial usability declarations.",
  Object.freeze(["limitationTypes"]),
  Object.freeze([
    field("limitationId", "string", "Stable declared limitation identifier."),
    field("category", "registryReference", "Registered limitation category."),
    field("targetReference", "string", "Target subject reference."),
    field("relatedFindings", "string[]", "Related finding identifiers."),
    field("affectedDimensions", "string[]", "Affected dimension references."),
    field("description", "string", "Readonly limitation description."),
    field("consumerImpact", "string", "Declared consumer impact."),
    field("executiveImpact", "string", "Declared executive impact."),
    field("allowedUsage", "string[]", "Declared allowed usage."),
    field("prohibitedUsage", "string[]", "Declared prohibited usage."),
    field("expiryDeclaration", "string", "Declared expiry — not a runtime timestamp."),
    field("supersessionReference", "string", "Supersession reference."),
    field("partialUsabilityPreserved", "true", "Always true — partial usability is preserved."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("status", "ModelStatus", "Declared status."),
  ]),
);

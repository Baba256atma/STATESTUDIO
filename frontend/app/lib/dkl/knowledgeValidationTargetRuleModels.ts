/**
 * DKL-5:3 — Target, Rule, Criterion, and Scope model descriptors.
 *
 * Ownership: owned exclusively by DKL-5:3.
 */

import { KnowledgeValidationRegistry } from "./knowledgeValidationRegistry.ts";
import { field, model } from "./knowledgeValidationModelHelpers.ts";
import type { CanonicalModelDescriptor } from "./knowledgeValidationModelTypes.ts";

const targetRefs = Object.freeze(
  KnowledgeValidationRegistry.collections.validationTargetTypes.map((e) => e.id),
);
const dimensionRefs = Object.freeze(
  KnowledgeValidationRegistry.collections.validationDimensions.map((e) => e.id),
);
const categoryRefs = Object.freeze(
  KnowledgeValidationRegistry.collections.validationRuleCategories.map((e) => e.id),
);

export const ValidationTargetModel: CanonicalModelDescriptor = model(
  "ValidationTarget",
  "Validation Target Model",
  "Immutable structural contract for a knowledge-validation target. References only — no runtime dereference.",
  Object.freeze(["validationTargetTypes"]),
  Object.freeze([
    field("targetId", "string", "Stable declared target identifier."),
    field("targetType", "registryReference", "Registered validation target type."),
    field("targetReference", "string", "Structural reference to the validation subject."),
    field("sourceDkl4Concept", "string", "Source Knowledge Modeling concept via Foundation."),
    field("sourcePhase", "string", "Declaring source phase."),
    field("namespace", "string", "Canonical namespace."),
    field("version", "string", "Declared version."),
    field("ownership", "string", "Owning architectural owner."),
    field("validationEligibility", "string", "Declared eligibility for validation."),
    field("applicableDimensions", "string[]", "Registered dimension references."),
    field("consumerImpact", "string", "Declared consumer impact."),
    field("executiveRelevance", "string", "Declared executive relevance."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("lifecycleStatus", "ModelLifecycleState", "Declared lifecycle status."),
    field("compatibility", "string", "Compatibility metadata."),
    field("extensionMetadata", "string", "Extension policy metadata."),
  ]),
);

export const ValidationScopeModel: CanonicalModelDescriptor = model(
  "ValidationScope",
  "Validation Scope Model",
  "Immutable structural contract declaring validation scope boundaries.",
  Object.freeze(["validationScopeTypes"]),
  Object.freeze([
    field("scopeId", "string", "Stable declared scope identifier."),
    field("scopeType", "registryReference", "Registered validation scope."),
    field("includedTargets", "string[]", "Included target references."),
    field("excludedTargets", "string[]", "Excluded target references."),
    field("applicableDimensions", "string[]", "Applicable dimension references."),
    field("ownership", "string", "Owning architectural owner."),
    field("provenance", "ValidationProvenance", "Provenance contract reference."),
    field("status", "ModelStatus", "Declared status."),
    field("compatibility", "string", "Compatibility metadata."),
    field("extensionMetadata", "string", "Extension policy metadata."),
  ]),
);

export const ValidationRuleModel: CanonicalModelDescriptor = model(
  "ValidationRule",
  "Validation Rule Model",
  "Structural validation rule metadata. executionImplemented is always false — no predicates or callbacks.",
  Object.freeze(["validationRuleCategories", "validationDimensions", "validationSeverities"]),
  Object.freeze([
    field("ruleId", "string", "Stable declared rule identifier."),
    field("name", "string", "Canonical rule name."),
    field("description", "string", "Readonly rule description."),
    field("category", "registryReference", "Registered rule category."),
    field("targetTypes", "string[]", "Applicable registered target types."),
    field("dimensions", "string[]", "Applicable registered dimensions."),
    field("criteriaReferences", "string[]", "Criterion reference identifiers."),
    field("evidenceRequirements", "string[]", "Required evidence type references."),
    field("defaultSeverity", "registryReference", "Registered default severity."),
    field("blockingPotential", "boolean", "Declared blocking potential."),
    field("clarificationRelevance", "string", "Declared clarification relevance."),
    field("consumerImpact", "string", "Declared consumer impact."),
    field("executiveRelevance", "string", "Declared executive relevance."),
    field("ownership", "string", "Owning architectural owner."),
    field("sourcePhase", "string", "Declaring source phase."),
    field("lifecycleStatus", "ModelLifecycleState", "Declared lifecycle status."),
    field("compatibility", "string", "Compatibility metadata."),
    field("extensionMetadata", "string", "Extension policy metadata."),
    field("executionImplemented", "false", "Always false — no executable rule logic."),
  ]),
);

export const ValidationCriterionModel: CanonicalModelDescriptor = model(
  "ValidationCriterion",
  "Validation Criterion Model",
  "Structural criterion metadata. Comparison modes are descriptive only — no executable comparison.",
  Object.freeze(["validationCriterionTypes", "validationDimensions"]),
  Object.freeze([
    field("criterionId", "string", "Stable declared criterion identifier."),
    field("ruleReference", "string", "Parent rule reference."),
    field("dimension", "registryReference", "Registered validation dimension."),
    field("expectedDeclaration", "string", "Expected declaration metadata."),
    field("comparisonModeDeclaration", "string", "Descriptive comparison mode only."),
    field("evidenceExpectation", "string", "Expected evidence declaration."),
    field("failureMeaning", "string", "Meaning of criterion failure."),
    field("limitationMeaning", "string", "Meaning when limited rather than failed."),
    field("blockingDeclaration", "boolean", "Declared blocking behavior."),
    field("ownership", "string", "Owning architectural owner."),
    field("status", "ModelStatus", "Declared status."),
    field("compatibility", "string", "Compatibility metadata."),
  ]),
);

/** Registry references used by target/rule models (deterministic snapshot). */
export const TargetRuleRegistrySnapshot = Object.freeze({
  targetIds: targetRefs,
  dimensionIds: dimensionRefs,
  categoryIds: categoryRefs,
  targetCount: targetRefs.length,
  dimensionCount: dimensionRefs.length,
  categoryCount: categoryRefs.length,
});

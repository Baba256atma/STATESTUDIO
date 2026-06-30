/**
 * ASS-7 — Executive Clarification Architecture validation.
 */

import {
  ASS_EXECUTIVE_INTENT_CATEGORY_KEYS,
  ASS_INTENT_ROUTE_BINDING_KEYS,
} from "./executiveAssistantIntentContracts.ts";
import {
  ASS_RESPONSE_CATEGORY_KEYS,
  ASS_RESPONSE_INTENT_BINDING_KEYS,
} from "./executiveAssistantResponseContracts.ts";
import {
  ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS,
  ASS_AMBIGUITY_RESOLUTION_MANDATORY_FIELDS,
  ASS_CLARIFICATION_CATEGORY_KEYS,
  ASS_CLARIFICATION_CATEGORY_MANDATORY_FIELDS,
  ASS_CLARIFICATION_COMPATIBLE_VERSIONS,
  ASS_CLARIFICATION_IDENTITY_MANDATORY_FIELDS,
  ASS_CLARIFICATION_INTENT_BINDING_KEYS,
  ASS_CLARIFICATION_INTENT_BINDING_MAP,
  ASS_CLARIFICATION_INTENT_BINDING_MANDATORY_FIELDS,
  ASS_CLARIFICATION_MUST_NOT_OWN,
  ASS_CLARIFICATION_PRIORITY_METADATA_KEYS,
  ASS_CLARIFICATION_PRIORITY_MANDATORY_FIELDS,
  ASS_CLARIFICATION_PRINCIPLES,
  ASS_CLARIFICATION_REGISTRY_KEYS,
  ASS_CLARIFICATION_RESPONSE_BINDING_KEYS,
  ASS_CLARIFICATION_RESPONSE_BINDING_MAP,
  ASS_CLARIFICATION_RESPONSE_BINDING_MANDATORY_FIELDS,
  ASS_CLARIFICATION_TRIGGER_MANDATORY_FIELDS,
  ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS,
  ASS_CLARIFICATION_VERSION,
  ASS_MISSING_CONTEXT_METADATA_KEYS,
  ASS_MISSING_CONTEXT_MANDATORY_FIELDS,
  ASS_QUESTION_TYPE_METADATA_KEYS,
  ASS_QUESTION_TYPE_MANDATORY_FIELDS,
} from "./executiveAssistantClarificationContracts.ts";
import type {
  ExecutiveAssistantClarificationManifest,
  ExecutiveAssistantClarificationRegistryBundle,
  ExecutiveAssistantClarificationValidationIssue,
  ExecutiveAssistantClarificationValidationReport,
} from "./executiveAssistantClarificationTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveAssistantClarificationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: ExecutiveAssistantClarificationValidationIssue[]): ExecutiveAssistantClarificationValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateClarificationRegistryCompleteness(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  if (registry.clarificationCategoryCount !== ASS_CLARIFICATION_CATEGORY_KEYS.length) {
    issues.push(issue("category_incomplete", "Clarification category registry is incomplete."));
  }
  if (registry.triggerPlaceholderCount !== ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS.length) {
    issues.push(issue("trigger_incomplete", "Clarification trigger placeholder registry is incomplete."));
  }
  if (registry.questionTypeMetadataCount !== ASS_QUESTION_TYPE_METADATA_KEYS.length) {
    issues.push(issue("question_type_incomplete", "Question type metadata registry is incomplete."));
  }
  if (registry.ambiguityResolutionMetadataCount !== ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS.length) {
    issues.push(issue("resolution_incomplete", "Ambiguity resolution metadata registry is incomplete."));
  }
  if (registry.missingContextMetadataCount !== ASS_MISSING_CONTEXT_METADATA_KEYS.length) {
    issues.push(issue("missing_context_incomplete", "Missing context metadata registry is incomplete."));
  }
  if (registry.clarificationPriorityMetadataCount !== ASS_CLARIFICATION_PRIORITY_METADATA_KEYS.length) {
    issues.push(issue("priority_incomplete", "Clarification priority metadata registry is incomplete."));
  }
  if (registry.clarificationIntentBindingCount !== ASS_CLARIFICATION_INTENT_BINDING_KEYS.length) {
    issues.push(issue("intent_binding_incomplete", "Clarification-to-intent binding registry is incomplete."));
  }
  if (registry.clarificationResponseBindingCount !== ASS_CLARIFICATION_RESPONSE_BINDING_KEYS.length) {
    issues.push(issue("response_binding_incomplete", "Clarification-to-response binding registry is incomplete."));
  }
  if (registry.clarificationIdentityCount === 0) {
    issues.push(issue("identity_empty", "Clarification identity registry is empty."));
  }
  return report(issues);
}

export function validateClarificationCategoriesValid(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  const categoryKeys = new Set(registry.clarificationCategoryRegistry.map((entry) => entry.categoryKey));
  for (const categoryKey of ASS_CLARIFICATION_CATEGORY_KEYS) {
    if (!categoryKeys.has(categoryKey)) {
      issues.push(issue("missing_category", `Missing clarification category: ${categoryKey}.`));
    }
  }
  return report(issues);
}

export function validateTriggerPlaceholdersOnly(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const trigger of registry.clarificationTriggerPlaceholderRegistry) {
    if (trigger.placeholderOnly !== true) {
      issues.push(issue("trigger_not_placeholder", `Trigger ${trigger.triggerKey} is not placeholder-only.`));
    }
  }
  return report(issues);
}

export function validateQuestionTypeMetadataDeclarativeOnly(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const questionType of registry.questionTypeMetadataRegistry) {
    if (questionType.declarativeOnly !== true) {
      issues.push(issue("question_type_not_declarative", `Question type ${questionType.questionTypeKey} is not declarative.`));
    }
  }
  return report(issues);
}

export function validateAmbiguityResolutionMetadataPlaceholderOnly(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const resolution of registry.ambiguityResolutionMetadataRegistry) {
    if (resolution.placeholderOnly !== true) {
      issues.push(issue("resolution_not_placeholder", `Resolution ${resolution.resolutionKey} is not placeholder-only.`));
    }
  }
  return report(issues);
}

export function validateMissingContextMetadataPlaceholderOnly(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const missingContext of registry.missingContextMetadataRegistry) {
    if (missingContext.placeholderOnly !== true) {
      issues.push(issue("missing_context_not_placeholder", `Missing context ${missingContext.missingContextKey} is not placeholder-only.`));
    }
  }
  return report(issues);
}

export function validateClarificationPriorityDeclarativeOnly(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const priority of registry.clarificationPriorityMetadataRegistry) {
    if (priority.declarativeOnly !== true) {
      issues.push(issue("priority_not_declarative", `Priority ${priority.priorityKey} is not declarative.`));
    }
  }
  return report(issues);
}

export function validateClarificationIntentBindingsReferenceAss5(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const binding of registry.clarificationIntentBindingRegistry) {
    const expected = ASS_CLARIFICATION_INTENT_BINDING_MAP[binding.bindingKey];
    if (!expected) {
      issues.push(issue("unknown_intent_binding", `Unknown clarification intent binding: ${binding.bindingKey}.`));
      continue;
    }
    if (!(ASS_EXECUTIVE_INTENT_CATEGORY_KEYS as readonly string[]).includes(binding.intentCategoryKey as never)) {
      issues.push(issue("invalid_intent_category", `Binding ${binding.bindingKey} has invalid ASS/5 intent category.`));
    }
    if (!(ASS_INTENT_ROUTE_BINDING_KEYS as readonly string[]).includes(binding.intentRouteBindingKey as never)) {
      issues.push(issue("invalid_route_binding", `Binding ${binding.bindingKey} has invalid ASS/5 route binding ref.`));
    }
    if (binding.intentCategoryKey !== expected.intentCategoryKey) {
      issues.push(issue("intent_category_mismatch", `Binding ${binding.bindingKey} intent category mismatch.`));
    }
    if (binding.intentRouteBindingKey !== expected.intentRouteBindingKey) {
      issues.push(issue("route_binding_mismatch", `Binding ${binding.bindingKey} route binding mismatch.`));
    }
    if (binding.interpretationId !== `ass-intent-interpretation-${expected.interpretationKey}`) {
      issues.push(issue("interpretation_mismatch", `Binding ${binding.bindingKey} interpretation ref mismatch.`));
    }
  }
  return report(issues);
}

export function validateClarificationResponseBindingsReferenceAss6(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const binding of registry.clarificationResponseBindingRegistry) {
    const expected = ASS_CLARIFICATION_RESPONSE_BINDING_MAP[binding.bindingKey];
    if (!expected) {
      issues.push(issue("unknown_response_binding", `Unknown clarification response binding: ${binding.bindingKey}.`));
      continue;
    }
    if (!(ASS_RESPONSE_CATEGORY_KEYS as readonly string[]).includes(binding.responseCategoryKey as never)) {
      issues.push(issue("invalid_response_category", `Binding ${binding.bindingKey} has invalid ASS/6 response category.`));
    }
    if (!(ASS_RESPONSE_INTENT_BINDING_KEYS as readonly string[]).includes(binding.responseIntentBindingKey as never)) {
      issues.push(issue("invalid_response_intent_binding", `Binding ${binding.bindingKey} has invalid ASS/6 response intent binding.`));
    }
    if (binding.responseCategoryKey !== expected.responseCategoryKey) {
      issues.push(issue("response_category_mismatch", `Binding ${binding.bindingKey} response category mismatch.`));
    }
    if (binding.responseIntentBindingKey !== expected.responseIntentBindingKey) {
      issues.push(issue("response_intent_binding_mismatch", `Binding ${binding.bindingKey} response intent binding mismatch.`));
    }
    if (binding.responseId !== `ass-response-identity-${expected.responseCategoryKey}`) {
      issues.push(issue("response_id_mismatch", `Binding ${binding.bindingKey} response id mismatch.`));
    }
  }
  return report(issues);
}

export function validateFrozenImmutableClarificationRecords(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  const checkMandatory = (
    records: readonly Record<string, unknown>[],
    mandatoryFields: readonly string[],
    label: string
  ) => {
    for (const record of records) {
      if (!Object.isFrozen(record)) {
        issues.push(issue("mutable_record", `${label} record is not frozen.`));
      }
      for (const field of mandatoryFields) {
        if (!(field in record)) {
          issues.push(issue("missing_field", `${label} missing field ${field}.`, field));
        }
      }
    }
  };
  checkMandatory(registry.clarificationIdentityRegistry, ASS_CLARIFICATION_IDENTITY_MANDATORY_FIELDS, "Clarification identity");
  checkMandatory(registry.clarificationCategoryRegistry, ASS_CLARIFICATION_CATEGORY_MANDATORY_FIELDS, "Clarification category");
  checkMandatory(registry.clarificationTriggerPlaceholderRegistry, ASS_CLARIFICATION_TRIGGER_MANDATORY_FIELDS, "Trigger placeholder");
  checkMandatory(registry.questionTypeMetadataRegistry, ASS_QUESTION_TYPE_MANDATORY_FIELDS, "Question type metadata");
  checkMandatory(registry.ambiguityResolutionMetadataRegistry, ASS_AMBIGUITY_RESOLUTION_MANDATORY_FIELDS, "Ambiguity resolution metadata");
  checkMandatory(registry.missingContextMetadataRegistry, ASS_MISSING_CONTEXT_MANDATORY_FIELDS, "Missing context metadata");
  checkMandatory(registry.clarificationPriorityMetadataRegistry, ASS_CLARIFICATION_PRIORITY_MANDATORY_FIELDS, "Priority metadata");
  checkMandatory(registry.clarificationIntentBindingRegistry, ASS_CLARIFICATION_INTENT_BINDING_MANDATORY_FIELDS, "Intent binding");
  checkMandatory(registry.clarificationResponseBindingRegistry, ASS_CLARIFICATION_RESPONSE_BINDING_MANDATORY_FIELDS, "Response binding");
  return report(issues);
}

export function validateNoClarificationRuntimeOwnership(): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const principle of [
    "declarative_clarification_no_question_generation",
    "clarification_intent_bindings_reference_ass5_metadata_only",
    "clarification_response_bindings_reference_ass6_metadata_only",
  ] as const) {
    if (!(ASS_CLARIFICATION_PRINCIPLES as readonly string[]).includes(principle)) {
      issues.push(issue("runtime_principle_missing", `Missing principle: ${principle}.`));
    }
  }
  for (const forbidden of ["question_generation", "clarification_renderer", "intent_detection_runtime"] as const) {
    if (!ASS_CLARIFICATION_MUST_NOT_OWN.includes(forbidden)) {
      issues.push(issue("runtime_boundary_missing", `Must not own ${forbidden}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantClarificationManifestRecord(
  manifest: ExecutiveAssistantClarificationManifest
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  if (manifest.version !== ASS_CLARIFICATION_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be ASS/7."));
  }
  if (manifest.registryKeys.length !== ASS_CLARIFICATION_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of ASS_CLARIFICATION_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantClarificationRegistry(
  registry: ExecutiveAssistantClarificationRegistryBundle
): ExecutiveAssistantClarificationValidationReport {
  const issues: ExecutiveAssistantClarificationValidationIssue[] = [];
  for (const validation of [
    validateClarificationRegistryCompleteness(registry),
    validateClarificationCategoriesValid(registry),
    validateTriggerPlaceholdersOnly(registry),
    validateQuestionTypeMetadataDeclarativeOnly(registry),
    validateAmbiguityResolutionMetadataPlaceholderOnly(registry),
    validateMissingContextMetadataPlaceholderOnly(registry),
    validateClarificationPriorityDeclarativeOnly(registry),
    validateClarificationIntentBindingsReferenceAss5(registry),
    validateClarificationResponseBindingsReferenceAss6(registry),
    validateFrozenImmutableClarificationRecords(registry),
    validateNoClarificationRuntimeOwnership(),
  ]) {
    issues.push(...validation.issues);
  }
  return report(issues);
}

export function getDefaultClarificationCompatibility(): readonly string[] {
  return Object.freeze([...ASS_CLARIFICATION_COMPATIBLE_VERSIONS, ASS_CLARIFICATION_VERSION]);
}

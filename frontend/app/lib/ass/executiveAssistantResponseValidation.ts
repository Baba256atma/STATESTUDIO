/**
 * ASS-6 — Executive Response Contract Architecture validation.
 */

import {
  ASS_EXECUTIVE_INTENT_CATEGORY_KEYS,
  ASS_INTENT_ROUTE_BINDING_KEYS,
} from "./executiveAssistantIntentContracts.ts";
import {
  ASS_ACTION_SUGGESTION_METADATA_KEYS,
  ASS_ACTION_SUGGESTION_MANDATORY_FIELDS,
  ASS_EXPLANATION_METADATA_KEYS,
  ASS_EXPLANATION_MANDATORY_FIELDS,
  ASS_FOLLOW_UP_METADATA_KEYS,
  ASS_FOLLOW_UP_MANDATORY_FIELDS,
  ASS_RESPONSE_CATEGORY_KEYS,
  ASS_RESPONSE_CATEGORY_MANDATORY_FIELDS,
  ASS_RESPONSE_COMPATIBLE_VERSIONS,
  ASS_RESPONSE_IDENTITY_MANDATORY_FIELDS,
  ASS_RESPONSE_INTENT_BINDING_KEYS,
  ASS_RESPONSE_INTENT_BINDING_MAP,
  ASS_RESPONSE_INTENT_BINDING_MANDATORY_FIELDS,
  ASS_RESPONSE_MUST_NOT_OWN,
  ASS_RESPONSE_PRINCIPLES,
  ASS_RESPONSE_REGISTRY_KEYS,
  ASS_RESPONSE_STRUCTURE_MANDATORY_FIELDS,
  ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS,
  ASS_RESPONSE_VALIDATION_CONTRACT_KEYS,
  ASS_RESPONSE_VALIDATION_MANDATORY_FIELDS,
  ASS_RESPONSE_VERSION,
  ASS_TONE_STYLE_METADATA_KEYS,
  ASS_TONE_STYLE_MANDATORY_FIELDS,
} from "./executiveAssistantResponseContracts.ts";
import type {
  ExecutiveAssistantResponseManifest,
  ExecutiveAssistantResponseRegistryBundle,
  ExecutiveAssistantResponseValidationIssue,
  ExecutiveAssistantResponseValidationReport,
} from "./executiveAssistantResponseTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveAssistantResponseValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: ExecutiveAssistantResponseValidationIssue[]): ExecutiveAssistantResponseValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateResponseRegistryCompleteness(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  if (registry.responseCategoryCount !== ASS_RESPONSE_CATEGORY_KEYS.length) {
    issues.push(issue("category_incomplete", "Response category registry is incomplete."));
  }
  if (registry.structurePlaceholderCount !== ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS.length) {
    issues.push(issue("structure_incomplete", "Response structure placeholder registry is incomplete."));
  }
  if (registry.toneStyleMetadataCount !== ASS_TONE_STYLE_METADATA_KEYS.length) {
    issues.push(issue("tone_incomplete", "Tone/style metadata registry is incomplete."));
  }
  if (registry.explanationMetadataCount !== ASS_EXPLANATION_METADATA_KEYS.length) {
    issues.push(issue("explanation_incomplete", "Explanation metadata registry is incomplete."));
  }
  if (registry.followUpMetadataCount !== ASS_FOLLOW_UP_METADATA_KEYS.length) {
    issues.push(issue("follow_up_incomplete", "Follow-up metadata registry is incomplete."));
  }
  if (registry.actionSuggestionMetadataCount !== ASS_ACTION_SUGGESTION_METADATA_KEYS.length) {
    issues.push(issue("action_incomplete", "Action suggestion metadata registry is incomplete."));
  }
  if (registry.responseIntentBindingCount !== ASS_RESPONSE_INTENT_BINDING_KEYS.length) {
    issues.push(issue("intent_binding_incomplete", "Response-to-intent binding registry is incomplete."));
  }
  if (registry.responseValidationContractCount !== ASS_RESPONSE_VALIDATION_CONTRACT_KEYS.length) {
    issues.push(issue("validation_incomplete", "Response validation contract registry is incomplete."));
  }
  if (registry.responseIdentityCount === 0) {
    issues.push(issue("identity_empty", "Response identity registry is empty."));
  }
  return report(issues);
}

export function validateResponseCategoriesValid(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  const categoryKeys = new Set(registry.responseCategoryRegistry.map((entry) => entry.categoryKey));
  for (const categoryKey of ASS_RESPONSE_CATEGORY_KEYS) {
    if (!categoryKeys.has(categoryKey)) {
      issues.push(issue("missing_category", `Missing response category: ${categoryKey}.`));
    }
  }
  for (const identity of registry.responseIdentityRegistry) {
    if (!(ASS_RESPONSE_CATEGORY_KEYS as readonly string[]).includes(identity.responseCategoryKey)) {
      issues.push(issue("invalid_category", `Identity ${identity.responseKey} has invalid category.`));
    }
  }
  return report(issues);
}

export function validateStructurePlaceholdersOnly(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  for (const structure of registry.responseStructurePlaceholderRegistry) {
    if (structure.placeholderOnly !== true) {
      issues.push(issue("structure_not_placeholder", `Structure ${structure.structureKey} is not placeholder-only.`));
    }
  }
  return report(issues);
}

export function validateToneStyleMetadataDeclarativeOnly(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  for (const tone of registry.toneStyleMetadataRegistry) {
    if (tone.declarativeOnly !== true) {
      issues.push(issue("tone_not_declarative", `Tone ${tone.toneStyleKey} is not declarative.`));
    }
  }
  return report(issues);
}

export function validateExplanationMetadataPlaceholderOnly(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  for (const explanation of registry.explanationMetadataRegistry) {
    if (explanation.placeholderOnly !== true) {
      issues.push(
        issue("explanation_not_placeholder", `Explanation ${explanation.explanationKey} is not placeholder-only.`)
      );
    }
  }
  return report(issues);
}

export function validateFollowUpMetadataPlaceholderOnly(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  for (const followUp of registry.followUpMetadataRegistry) {
    if (followUp.placeholderOnly !== true) {
      issues.push(issue("follow_up_not_placeholder", `Follow-up ${followUp.followUpKey} is not placeholder-only.`));
    }
  }
  return report(issues);
}

export function validateActionSuggestionMetadataPlaceholderOnly(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  for (const action of registry.actionSuggestionMetadataRegistry) {
    if (action.placeholderOnly !== true) {
      issues.push(issue("action_not_placeholder", `Action ${action.actionSuggestionKey} is not placeholder-only.`));
    }
  }
  return report(issues);
}

export function validateResponseIntentBindingsReferenceAss5(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  for (const binding of registry.responseIntentBindingRegistry) {
    const expected = ASS_RESPONSE_INTENT_BINDING_MAP[binding.bindingKey];
    if (!expected) {
      issues.push(issue("unknown_binding", `Unknown response intent binding: ${binding.bindingKey}.`));
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
    if (!binding.interpretationId.startsWith("ass-intent-interpretation-")) {
      issues.push(issue("invalid_interpretation_ref", `Binding ${binding.bindingKey} has invalid interpretation ref.`));
    }
    if (binding.interpretationId !== `ass-intent-interpretation-${expected.interpretationKey}`) {
      issues.push(issue("interpretation_mismatch", `Binding ${binding.bindingKey} interpretation ref mismatch.`));
    }
  }
  return report(issues);
}

export function validateFrozenImmutableResponseRecords(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
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
  checkMandatory(registry.responseIdentityRegistry, ASS_RESPONSE_IDENTITY_MANDATORY_FIELDS, "Response identity");
  checkMandatory(registry.responseCategoryRegistry, ASS_RESPONSE_CATEGORY_MANDATORY_FIELDS, "Response category");
  checkMandatory(registry.responseStructurePlaceholderRegistry, ASS_RESPONSE_STRUCTURE_MANDATORY_FIELDS, "Structure placeholder");
  checkMandatory(registry.toneStyleMetadataRegistry, ASS_TONE_STYLE_MANDATORY_FIELDS, "Tone/style metadata");
  checkMandatory(registry.explanationMetadataRegistry, ASS_EXPLANATION_MANDATORY_FIELDS, "Explanation metadata");
  checkMandatory(registry.followUpMetadataRegistry, ASS_FOLLOW_UP_MANDATORY_FIELDS, "Follow-up metadata");
  checkMandatory(registry.actionSuggestionMetadataRegistry, ASS_ACTION_SUGGESTION_MANDATORY_FIELDS, "Action suggestion metadata");
  checkMandatory(registry.responseIntentBindingRegistry, ASS_RESPONSE_INTENT_BINDING_MANDATORY_FIELDS, "Intent binding");
  checkMandatory(registry.responseValidationContractRegistry, ASS_RESPONSE_VALIDATION_MANDATORY_FIELDS, "Validation contract");
  return report(issues);
}

export function validateNoResponseRuntimeOwnership(): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  for (const principle of [
    "declarative_response_no_generation",
    "response_intent_bindings_reference_ass5_metadata_only",
  ] as const) {
    if (!(ASS_RESPONSE_PRINCIPLES as readonly string[]).includes(principle)) {
      issues.push(issue("runtime_principle_missing", `Missing principle: ${principle}.`));
    }
  }
  for (const forbidden of ["response_generation", "response_renderer", "content_synthesis"] as const) {
    if (!ASS_RESPONSE_MUST_NOT_OWN.includes(forbidden)) {
      issues.push(issue("runtime_boundary_missing", `Must not own ${forbidden}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantResponseManifestRecord(
  manifest: ExecutiveAssistantResponseManifest
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  if (manifest.version !== ASS_RESPONSE_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be ASS/6."));
  }
  if (manifest.registryKeys.length !== ASS_RESPONSE_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of ASS_RESPONSE_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantResponseRegistry(
  registry: ExecutiveAssistantResponseRegistryBundle
): ExecutiveAssistantResponseValidationReport {
  const issues: ExecutiveAssistantResponseValidationIssue[] = [];
  for (const validation of [
    validateResponseRegistryCompleteness(registry),
    validateResponseCategoriesValid(registry),
    validateStructurePlaceholdersOnly(registry),
    validateToneStyleMetadataDeclarativeOnly(registry),
    validateExplanationMetadataPlaceholderOnly(registry),
    validateFollowUpMetadataPlaceholderOnly(registry),
    validateActionSuggestionMetadataPlaceholderOnly(registry),
    validateResponseIntentBindingsReferenceAss5(registry),
    validateFrozenImmutableResponseRecords(registry),
    validateNoResponseRuntimeOwnership(),
  ]) {
    issues.push(...validation.issues);
  }
  return report(issues);
}

export function getDefaultResponseCompatibility(): readonly string[] {
  return Object.freeze([...ASS_RESPONSE_COMPATIBLE_VERSIONS, ASS_RESPONSE_VERSION]);
}

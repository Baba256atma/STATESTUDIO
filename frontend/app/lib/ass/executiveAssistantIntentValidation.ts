/**
 * ASS-5 — Executive Intent Interpretation Contract validation.
 */

import {
  ASS_AMBIGUITY_METADATA_KEYS,
  ASS_AMBIGUITY_MANDATORY_FIELDS,
  ASS_CLARIFICATION_METADATA_KEYS,
  ASS_CLARIFICATION_MANDATORY_FIELDS,
  ASS_EXECUTIVE_INTENT_CATEGORY_KEYS,
  ASS_INTENT_CATEGORY_MANDATORY_FIELDS,
  ASS_INTENT_COMPATIBLE_VERSIONS,
  ASS_INTENT_CONFIDENCE_LEVEL_KEYS,
  ASS_INTENT_CONFIDENCE_MANDATORY_FIELDS,
  ASS_INTENT_IDENTITY_MANDATORY_FIELDS,
  ASS_INTENT_MUST_NOT_OWN,
  ASS_INTENT_PRINCIPLES,
  ASS_INTENT_REGISTRY_KEYS,
  ASS_INTENT_ROUTE_BINDING_KEYS,
  ASS_INTENT_ROUTE_BINDING_MAP,
  ASS_INTENT_ROUTE_BINDING_MANDATORY_FIELDS,
  ASS_INTENT_SIGNAL_MANDATORY_FIELDS,
  ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS,
  ASS_INTENT_VALIDATION_CONTRACT_KEYS,
  ASS_INTENT_VALIDATION_MANDATORY_FIELDS,
  ASS_INTENT_VERSION,
} from "./executiveAssistantIntentContracts.ts";
import {
  ASS_COORDINATION_ROUTE_KEYS,
  ASS_ROUTE_CATEGORY_KEYS,
  ASS_ROUTE_INTENT_PLACEHOLDER_KEYS,
  ASS_SCOPE_ROUTING_KEYS,
} from "./executiveAssistantRoutingContracts.ts";
import type {
  ExecutiveAssistantIntentManifest,
  ExecutiveAssistantIntentRegistryBundle,
  ExecutiveAssistantIntentValidationIssue,
  ExecutiveAssistantIntentValidationReport,
} from "./executiveAssistantIntentTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveAssistantIntentValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: ExecutiveAssistantIntentValidationIssue[]): ExecutiveAssistantIntentValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateIntentRegistryCompleteness(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  if (registry.intentCategoryCount !== ASS_EXECUTIVE_INTENT_CATEGORY_KEYS.length) {
    issues.push(issue("category_incomplete", "Executive intent category registry is incomplete."));
  }
  if (registry.signalPlaceholderCount !== ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS.length) {
    issues.push(issue("signal_incomplete", "Intent signal placeholder registry is incomplete."));
  }
  if (registry.ambiguityMetadataCount !== ASS_AMBIGUITY_METADATA_KEYS.length) {
    issues.push(issue("ambiguity_incomplete", "Ambiguity metadata registry is incomplete."));
  }
  if (registry.clarificationMetadataCount !== ASS_CLARIFICATION_METADATA_KEYS.length) {
    issues.push(issue("clarification_incomplete", "Clarification metadata registry is incomplete."));
  }
  if (registry.intentConfidenceMetadataCount !== ASS_INTENT_CONFIDENCE_LEVEL_KEYS.length) {
    issues.push(issue("confidence_incomplete", "Intent confidence metadata registry is incomplete."));
  }
  if (registry.intentRouteBindingCount !== ASS_INTENT_ROUTE_BINDING_KEYS.length) {
    issues.push(issue("route_binding_incomplete", "Intent-to-route binding registry is incomplete."));
  }
  if (registry.intentValidationContractCount !== ASS_INTENT_VALIDATION_CONTRACT_KEYS.length) {
    issues.push(issue("validation_incomplete", "Intent validation contract registry is incomplete."));
  }
  if (registry.interpretationIdentityCount === 0) {
    issues.push(issue("identity_empty", "Intent interpretation identity registry is empty."));
  }
  return report(issues);
}

export function validateIntentCategoriesValid(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  const categoryKeys = new Set(registry.executiveIntentCategoryRegistry.map((entry) => entry.categoryKey));
  for (const categoryKey of ASS_EXECUTIVE_INTENT_CATEGORY_KEYS) {
    if (!categoryKeys.has(categoryKey)) {
      issues.push(issue("missing_category", `Missing intent category: ${categoryKey}.`));
    }
  }
  for (const identity of registry.intentInterpretationIdentityRegistry) {
    if (!(ASS_EXECUTIVE_INTENT_CATEGORY_KEYS as readonly string[]).includes(identity.intentCategoryKey)) {
      issues.push(issue("invalid_category", `Identity ${identity.interpretationKey} has invalid category.`));
    }
  }
  return report(issues);
}

export function validateSignalPlaceholdersOnly(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  for (const signal of registry.intentSignalPlaceholderRegistry) {
    if (signal.placeholderOnly !== true) {
      issues.push(issue("signal_not_placeholder", `Signal ${signal.signalKey} is not placeholder-only.`));
    }
  }
  return report(issues);
}

export function validateAmbiguityMetadataDeclarativeOnly(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  for (const ambiguity of registry.ambiguityMetadataRegistry) {
    if (ambiguity.declarativeOnly !== true) {
      issues.push(issue("ambiguity_not_declarative", `Ambiguity ${ambiguity.ambiguityKey} is not declarative.`));
    }
  }
  return report(issues);
}

export function validateClarificationMetadataPlaceholderOnly(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  for (const clarification of registry.clarificationMetadataRegistry) {
    if (clarification.placeholderOnly !== true) {
      issues.push(
        issue("clarification_not_placeholder", `Clarification ${clarification.clarificationKey} is not placeholder-only.`)
      );
    }
  }
  return report(issues);
}

export function validateIntentConfidenceDeclarativeOnly(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  for (const confidence of registry.intentConfidenceMetadataRegistry) {
    if (confidence.declarativeOnly !== true) {
      issues.push(issue("confidence_not_declarative", `Confidence ${confidence.confidenceKey} is not declarative.`));
    }
  }
  return report(issues);
}

export function validateIntentRouteBindingsReferenceAss4(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  for (const binding of registry.intentRouteBindingRegistry) {
    const expected = ASS_INTENT_ROUTE_BINDING_MAP[binding.bindingKey];
    if (!expected) {
      issues.push(issue("unknown_binding", `Unknown route binding key: ${binding.bindingKey}.`));
      continue;
    }
    if (!(ASS_COORDINATION_ROUTE_KEYS as readonly string[]).includes(binding.coordinationRouteKey as never)) {
      issues.push(issue("invalid_coordination_ref", `Binding ${binding.bindingKey} has invalid ASS/4 coordination ref.`));
    }
    if (!(ASS_SCOPE_ROUTING_KEYS as readonly string[]).includes(binding.scopeRoutingKey as never)) {
      issues.push(issue("invalid_scope_ref", `Binding ${binding.bindingKey} has invalid ASS/4 scope routing ref.`));
    }
    if (!(ASS_ROUTE_CATEGORY_KEYS as readonly string[]).includes(binding.routeCategoryKey as never)) {
      issues.push(issue("invalid_category_ref", `Binding ${binding.bindingKey} has invalid ASS/4 route category ref.`));
    }
    if (!(ASS_ROUTE_INTENT_PLACEHOLDER_KEYS as readonly string[]).includes(binding.intentPlaceholderKey as never)) {
      issues.push(issue("invalid_intent_ref", `Binding ${binding.bindingKey} has invalid ASS/4 intent placeholder ref.`));
    }
    if (binding.coordinationRouteKey !== expected.coordinationRouteKey) {
      issues.push(issue("coordination_mismatch", `Binding ${binding.bindingKey} coordination ref mismatch.`));
    }
    if (binding.scopeRoutingKey !== expected.scopeRoutingKey) {
      issues.push(issue("scope_mismatch", `Binding ${binding.bindingKey} scope routing ref mismatch.`));
    }
    if (binding.routeCategoryKey !== expected.routeCategoryKey) {
      issues.push(issue("category_mismatch", `Binding ${binding.bindingKey} route category ref mismatch.`));
    }
    if (binding.intentPlaceholderKey !== expected.intentPlaceholderKey) {
      issues.push(issue("intent_placeholder_mismatch", `Binding ${binding.bindingKey} intent placeholder ref mismatch.`));
    }
  }
  return report(issues);
}

export function validateFrozenImmutableIntentRecords(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
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
  checkMandatory(registry.intentInterpretationIdentityRegistry, ASS_INTENT_IDENTITY_MANDATORY_FIELDS, "Intent identity");
  checkMandatory(registry.executiveIntentCategoryRegistry, ASS_INTENT_CATEGORY_MANDATORY_FIELDS, "Intent category");
  checkMandatory(registry.intentSignalPlaceholderRegistry, ASS_INTENT_SIGNAL_MANDATORY_FIELDS, "Signal placeholder");
  checkMandatory(registry.ambiguityMetadataRegistry, ASS_AMBIGUITY_MANDATORY_FIELDS, "Ambiguity metadata");
  checkMandatory(registry.clarificationMetadataRegistry, ASS_CLARIFICATION_MANDATORY_FIELDS, "Clarification metadata");
  checkMandatory(registry.intentConfidenceMetadataRegistry, ASS_INTENT_CONFIDENCE_MANDATORY_FIELDS, "Confidence metadata");
  checkMandatory(registry.intentRouteBindingRegistry, ASS_INTENT_ROUTE_BINDING_MANDATORY_FIELDS, "Route binding");
  checkMandatory(registry.intentValidationContractRegistry, ASS_INTENT_VALIDATION_MANDATORY_FIELDS, "Validation contract");
  return report(issues);
}

export function validateNoIntentRuntimeOwnership(): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  for (const principle of [
    "declarative_intent_no_detection_runtime",
    "signal_placeholders_only",
    "intent_route_bindings_reference_ass4_metadata_only",
  ] as const) {
    if (!(ASS_INTENT_PRINCIPLES as readonly string[]).includes(principle)) {
      issues.push(issue("runtime_principle_missing", `Missing principle: ${principle}.`));
    }
  }
  for (const forbidden of ["intent_detection_runtime", "intent_classifier", "inference_engine"] as const) {
    if (!ASS_INTENT_MUST_NOT_OWN.includes(forbidden)) {
      issues.push(issue("runtime_boundary_missing", `Must not own ${forbidden}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantIntentManifestRecord(
  manifest: ExecutiveAssistantIntentManifest
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  if (manifest.version !== ASS_INTENT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be ASS/5."));
  }
  if (manifest.registryKeys.length !== ASS_INTENT_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of ASS_INTENT_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantIntentRegistry(
  registry: ExecutiveAssistantIntentRegistryBundle
): ExecutiveAssistantIntentValidationReport {
  const issues: ExecutiveAssistantIntentValidationIssue[] = [];
  for (const validation of [
    validateIntentRegistryCompleteness(registry),
    validateIntentCategoriesValid(registry),
    validateSignalPlaceholdersOnly(registry),
    validateAmbiguityMetadataDeclarativeOnly(registry),
    validateClarificationMetadataPlaceholderOnly(registry),
    validateIntentConfidenceDeclarativeOnly(registry),
    validateIntentRouteBindingsReferenceAss4(registry),
    validateFrozenImmutableIntentRecords(registry),
    validateNoIntentRuntimeOwnership(),
  ]) {
    issues.push(...validation.issues);
  }
  return report(issues);
}

export function getDefaultIntentCompatibility(): readonly string[] {
  return Object.freeze([...ASS_INTENT_COMPATIBLE_VERSIONS, ASS_INTENT_VERSION]);
}

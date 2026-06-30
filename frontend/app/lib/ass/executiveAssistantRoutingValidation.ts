/**
 * ASS-4 — Executive Conversation Routing Architecture validation.
 */

import {
  ASS_COORDINATION_PLATFORM_KEYS,
  ASS_COORDINATION_ROUTE_KEYS,
  ASS_COORDINATION_ROUTE_PLATFORM_MAP,
  ASS_COORDINATION_ROUTE_TARGET_MAP,
  ASS_INTENT_PLACEHOLDER_MANDATORY_FIELDS,
  ASS_ROUTE_CATEGORY_KEYS,
  ASS_ROUTE_CATEGORY_MANDATORY_FIELDS,
  ASS_ROUTE_CONFIDENCE_LEVEL_KEYS,
  ASS_ROUTE_CONFIDENCE_MANDATORY_FIELDS,
  ASS_ROUTE_DECISION_PLACEHOLDER_KEYS,
  ASS_ROUTE_DECISION_MANDATORY_FIELDS,
  ASS_ROUTE_INTENT_PLACEHOLDER_KEYS,
  ASS_ROUTE_TARGET_PLACEHOLDER_KEYS,
  ASS_ROUTE_VALIDATION_CONTRACT_KEYS,
  ASS_ROUTE_VALIDATION_MANDATORY_FIELDS,
  ASS_ROUTING_COMPATIBLE_VERSIONS,
  ASS_ROUTING_IDENTITY_MANDATORY_FIELDS,
  ASS_ROUTING_MUST_NOT_OWN,
  ASS_ROUTING_PRINCIPLES,
  ASS_ROUTING_REGISTRY_KEYS,
  ASS_ROUTING_VERSION,
  ASS_SCOPE_ROUTING_KEYS,
  ASS_SCOPE_ROUTING_MANDATORY_FIELDS,
  ASS_SCOPE_ROUTING_SCOPE_KEYS,
  ASS_TARGET_PLACEHOLDER_MANDATORY_FIELDS,
  ASS_COORDINATION_ROUTE_MANDATORY_FIELDS,
} from "./executiveAssistantRoutingContracts.ts";
import type {
  ExecutiveAssistantRoutingManifest,
  ExecutiveAssistantRoutingRegistryBundle,
  ExecutiveAssistantRoutingValidationIssue,
  ExecutiveAssistantRoutingValidationReport,
} from "./executiveAssistantRoutingTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveAssistantRoutingValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: ExecutiveAssistantRoutingValidationIssue[]): ExecutiveAssistantRoutingValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateRouteRegistryCompleteness(
  registry: ExecutiveAssistantRoutingRegistryBundle
): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
  if (registry.routeCategoryCount !== ASS_ROUTE_CATEGORY_KEYS.length) {
    issues.push(issue("category_incomplete", "Route category registry is incomplete."));
  }
  if (registry.intentPlaceholderCount !== ASS_ROUTE_INTENT_PLACEHOLDER_KEYS.length) {
    issues.push(issue("intent_placeholder_incomplete", "Intent placeholder registry is incomplete."));
  }
  if (registry.targetPlaceholderCount !== ASS_ROUTE_TARGET_PLACEHOLDER_KEYS.length) {
    issues.push(issue("target_placeholder_incomplete", "Target placeholder registry is incomplete."));
  }
  if (registry.coordinationRouteCount !== ASS_COORDINATION_ROUTE_KEYS.length) {
    issues.push(issue("coordination_route_incomplete", "Coordination route registry is incomplete."));
  }
  if (registry.scopeRoutingCount !== ASS_SCOPE_ROUTING_KEYS.length) {
    issues.push(issue("scope_routing_incomplete", "Scope routing metadata registry is incomplete."));
  }
  if (registry.routeDecisionMetadataCount !== ASS_ROUTE_DECISION_PLACEHOLDER_KEYS.length) {
    issues.push(issue("decision_metadata_incomplete", "Route decision metadata registry is incomplete."));
  }
  if (registry.routeConfidenceMetadataCount !== ASS_ROUTE_CONFIDENCE_LEVEL_KEYS.length) {
    issues.push(issue("confidence_metadata_incomplete", "Route confidence metadata registry is incomplete."));
  }
  if (registry.routeValidationContractCount !== ASS_ROUTE_VALIDATION_CONTRACT_KEYS.length) {
    issues.push(issue("validation_contract_incomplete", "Route validation contract registry is incomplete."));
  }
  if (registry.routingIdentityCount === 0) {
    issues.push(issue("routing_identity_empty", "Routing identity registry is empty."));
  }
  return report(issues);
}

export function validateRouteTargetValidity(
  registry: ExecutiveAssistantRoutingRegistryBundle
): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
  const targetKeys = new Set(registry.targetPlaceholderRegistry.map((entry) => entry.placeholderKey));
  for (const route of registry.coordinationRouteRegistry) {
    if (!targetKeys.has(route.targetPlaceholderKey)) {
      issues.push(issue("invalid_target", `Coordination route ${route.coordinationRouteKey} has invalid target.`));
    }
    const expectedTarget = ASS_COORDINATION_ROUTE_TARGET_MAP[route.coordinationRouteKey];
    if (route.targetPlaceholderKey !== expectedTarget) {
      issues.push(
        issue("target_mismatch", `Coordination route ${route.coordinationRouteKey} target mismatch.`)
      );
    }
  }
  for (const scope of registry.scopeRoutingMetadataRegistry) {
    if (!(ASS_SCOPE_ROUTING_SCOPE_KEYS as readonly string[]).includes(scope.scopeKey)) {
      issues.push(issue("invalid_scope", `Scope routing ${scope.scopeRoutingKey} has invalid scope key.`));
    }
    if (!scope.contextRef.startsWith("context-ref-")) {
      issues.push(issue("invalid_context_ref", `Scope routing ${scope.scopeRoutingKey} missing context reference.`));
    }
  }
  return report(issues);
}

export function validateCoordinationRoutesMetadataOnly(
  registry: ExecutiveAssistantRoutingRegistryBundle
): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
  for (const route of registry.coordinationRouteRegistry) {
    if (!(ASS_COORDINATION_PLATFORM_KEYS as readonly string[]).includes(route.platformKey)) {
      issues.push(issue("invalid_platform", `Route ${route.coordinationRouteKey} has invalid platform key.`));
    }
    const expectedPlatform = ASS_COORDINATION_ROUTE_PLATFORM_MAP[route.coordinationRouteKey];
    if (route.platformKey !== expectedPlatform) {
      issues.push(issue("platform_mismatch", `Route ${route.coordinationRouteKey} platform mismatch.`));
    }
    if (route.declarativeOnly !== true) {
      issues.push(issue("non_declarative_route", `Route ${route.coordinationRouteKey} is not declarative.`));
    }
    if (!Object.isFrozen(route.decisionMetadata)) {
      issues.push(issue("mutable_decision_metadata", `Route ${route.coordinationRouteKey} decision metadata not frozen.`));
    }
    if (!Object.isFrozen(route.confidenceMetadata)) {
      issues.push(
        issue("mutable_confidence_metadata", `Route ${route.coordinationRouteKey} confidence metadata not frozen.`)
      );
    }
  }
  return report(issues);
}

export function validateDecisionMetadataPlaceholderOnly(
  registry: ExecutiveAssistantRoutingRegistryBundle
): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
  for (const decision of registry.routeDecisionMetadataRegistry) {
    if (decision.placeholderOnly !== true) {
      issues.push(issue("decision_not_placeholder", `Decision ${decision.decisionKey} is not placeholder-only.`));
    }
  }
  for (const route of registry.coordinationRouteRegistry) {
    if (!route.decisionMetadata.decisionPlaceholder) {
      issues.push(issue("missing_decision_placeholder", `Route ${route.coordinationRouteKey} missing decision placeholder.`));
    }
    if (!(ASS_ROUTE_DECISION_PLACEHOLDER_KEYS as readonly string[]).includes(route.decisionMetadata.decisionPlaceholder as never)) {
      issues.push(issue("invalid_decision_placeholder", `Route ${route.coordinationRouteKey} invalid decision placeholder.`));
    }
  }
  return report(issues);
}

export function validateConfidenceMetadataDeclarativeOnly(
  registry: ExecutiveAssistantRoutingRegistryBundle
): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
  for (const confidence of registry.routeConfidenceMetadataRegistry) {
    if (confidence.declarativeOnly !== true) {
      issues.push(issue("confidence_not_declarative", `Confidence ${confidence.confidenceKey} is not declarative.`));
    }
  }
  for (const route of registry.coordinationRouteRegistry) {
    if (!route.confidenceMetadata.confidenceLevel) {
      issues.push(issue("missing_confidence_level", `Route ${route.coordinationRouteKey} missing confidence level.`));
    }
    if (!(ASS_ROUTE_CONFIDENCE_LEVEL_KEYS as readonly string[]).includes(route.confidenceMetadata.confidenceLevel as never)) {
      issues.push(issue("invalid_confidence_level", `Route ${route.coordinationRouteKey} invalid confidence level.`));
    }
  }
  return report(issues);
}

export function validateFrozenImmutableRoutingRecords(
  registry: ExecutiveAssistantRoutingRegistryBundle
): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
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
  checkMandatory(registry.routingIdentityRegistry, ASS_ROUTING_IDENTITY_MANDATORY_FIELDS, "Routing identity");
  checkMandatory(registry.routeCategoryRegistry, ASS_ROUTE_CATEGORY_MANDATORY_FIELDS, "Route category");
  checkMandatory(registry.intentPlaceholderRegistry, ASS_INTENT_PLACEHOLDER_MANDATORY_FIELDS, "Intent placeholder");
  checkMandatory(registry.targetPlaceholderRegistry, ASS_TARGET_PLACEHOLDER_MANDATORY_FIELDS, "Target placeholder");
  checkMandatory(registry.coordinationRouteRegistry, ASS_COORDINATION_ROUTE_MANDATORY_FIELDS, "Coordination route");
  checkMandatory(registry.scopeRoutingMetadataRegistry, ASS_SCOPE_ROUTING_MANDATORY_FIELDS, "Scope routing");
  checkMandatory(registry.routeDecisionMetadataRegistry, ASS_ROUTE_DECISION_MANDATORY_FIELDS, "Decision metadata");
  checkMandatory(registry.routeConfidenceMetadataRegistry, ASS_ROUTE_CONFIDENCE_MANDATORY_FIELDS, "Confidence metadata");
  checkMandatory(registry.routeValidationContractRegistry, ASS_ROUTE_VALIDATION_MANDATORY_FIELDS, "Validation contract");
  return report(issues);
}

export function validateNoRoutingRuntimeOwnership(): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
  for (const principle of [
    "declarative_routes_no_execution",
    "coordination_routes_reference_app_llm_smm_only",
    "decision_metadata_placeholder_only",
    "confidence_metadata_declarative_only",
  ] as const) {
    if (!(ASS_ROUTING_PRINCIPLES as readonly string[]).includes(principle)) {
      issues.push(issue("runtime_principle_missing", `Missing principle: ${principle}.`));
    }
  }
  for (const forbidden of ["route_execution", "runtime_router", "smm_mutation", "route_inference"] as const) {
    if (!ASS_ROUTING_MUST_NOT_OWN.includes(forbidden)) {
      issues.push(issue("runtime_boundary_missing", `Must not own ${forbidden}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantRoutingManifestRecord(
  manifest: ExecutiveAssistantRoutingManifest
): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
  if (manifest.version !== ASS_ROUTING_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be ASS/4."));
  }
  if (manifest.registryKeys.length !== ASS_ROUTING_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of ASS_ROUTING_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantRoutingRegistry(
  registry: ExecutiveAssistantRoutingRegistryBundle
): ExecutiveAssistantRoutingValidationReport {
  const issues: ExecutiveAssistantRoutingValidationIssue[] = [];
  for (const validation of [
    validateRouteRegistryCompleteness(registry),
    validateRouteTargetValidity(registry),
    validateCoordinationRoutesMetadataOnly(registry),
    validateDecisionMetadataPlaceholderOnly(registry),
    validateConfidenceMetadataDeclarativeOnly(registry),
    validateFrozenImmutableRoutingRecords(registry),
    validateNoRoutingRuntimeOwnership(),
  ]) {
    issues.push(...validation.issues);
  }
  for (const route of registry.coordinationRouteRegistry) {
    if (!(ASS_ROUTE_INTENT_PLACEHOLDER_KEYS as readonly string[]).includes(route.intentPlaceholderKey)) {
      issues.push(issue("invalid_intent_placeholder", `Route ${route.coordinationRouteKey} has invalid intent placeholder.`));
    }
  }
  return report(issues);
}

export function getDefaultRoutingCompatibility(): readonly string[] {
  return Object.freeze([...ASS_ROUTING_COMPATIBLE_VERSIONS, ASS_ROUTING_VERSION]);
}

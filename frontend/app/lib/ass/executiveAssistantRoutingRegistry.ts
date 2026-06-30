/**
 * ASS-4 — Routing identity, category, placeholder, coordination, and validation registries.
 */

import { buildExecutiveAssistantConversationStateArchitecture } from "./executiveAssistantConversationStateExports.ts";
import {
  ASS_COORDINATION_ROUTE_KEYS,
  ASS_COORDINATION_ROUTE_PLATFORM_MAP,
  ASS_COORDINATION_ROUTE_TARGET_MAP,
  ASS_INTENT_PLACEHOLDER_LABELS,
  ASS_ROUTE_CATEGORY_KEYS,
  ASS_ROUTE_CATEGORY_LABELS,
  ASS_ROUTE_CONFIDENCE_LEVEL_KEYS,
  ASS_ROUTE_DECISION_PLACEHOLDER_KEYS,
  ASS_ROUTE_INTENT_PLACEHOLDER_KEYS,
  ASS_ROUTE_TARGET_PLACEHOLDER_KEYS,
  ASS_ROUTE_VALIDATION_CHECKS,
  ASS_ROUTE_VALIDATION_CONTRACT_KEYS,
  ASS_ROUTING_DEPENDENCY,
  ASS_ROUTING_VERSION,
  ASS_SCOPE_ROUTING_KEYS,
  ASS_SCOPE_ROUTING_SCOPE_KEYS,
  ASS_TARGET_PLACEHOLDER_LABELS,
  ASS_TEMPLATE_CONVERSATION_REF,
  ASS_TEMPLATE_ROUTE_KEY,
} from "./executiveAssistantRoutingContracts.ts";
import type {
  ExecutiveAssistantCoordinationRouteKey,
  ExecutiveAssistantCoordinationRouteRecord,
  ExecutiveAssistantIntentPlaceholderRecord,
  ExecutiveAssistantRouteBindingRecord,
  ExecutiveAssistantRouteCategoryKey,
  ExecutiveAssistantRouteCategoryRecord,
  ExecutiveAssistantRouteConfidenceMetadataRecord,
  ExecutiveAssistantRouteDecisionMetadataRecord,
  ExecutiveAssistantRouteValidationContractRecord,
  ExecutiveAssistantRoutingIdentityRecord,
  ExecutiveAssistantRoutingRegistryBundle,
  ExecutiveAssistantScopeRoutingMetadataRecord,
  ExecutiveAssistantTargetPlaceholderRecord,
} from "./executiveAssistantRoutingTypes.ts";

const routingIdentityRegistry = new Map<string, ExecutiveAssistantRoutingIdentityRecord>();
const routeCategoryRegistry = new Map<string, ExecutiveAssistantRouteCategoryRecord>();
const intentPlaceholderRegistry = new Map<string, ExecutiveAssistantIntentPlaceholderRecord>();
const targetPlaceholderRegistry = new Map<string, ExecutiveAssistantTargetPlaceholderRecord>();
const coordinationRouteRegistry = new Map<string, ExecutiveAssistantCoordinationRouteRecord>();
const scopeRoutingMetadataRegistry = new Map<string, ExecutiveAssistantScopeRoutingMetadataRecord>();
const routeDecisionMetadataRegistry = new Map<string, ExecutiveAssistantRouteDecisionMetadataRecord>();
const routeConfidenceMetadataRegistry = new Map<string, ExecutiveAssistantRouteConfidenceMetadataRecord>();
const routeValidationContractRegistry = new Map<string, ExecutiveAssistantRouteValidationContractRecord>();
const routeBindingRegistry = new Map<string, ExecutiveAssistantRouteBindingRecord>();

const TEMPLATE_BINDING_ID = "ass-route-binding-template";

const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
  Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

export function resetExecutiveAssistantRoutingStoreForTests(): void {
  routingIdentityRegistry.clear();
  routeCategoryRegistry.clear();
  intentPlaceholderRegistry.clear();
  targetPlaceholderRegistry.clear();
  coordinationRouteRegistry.clear();
  scopeRoutingMetadataRegistry.clear();
  routeDecisionMetadataRegistry.clear();
  routeConfidenceMetadataRegistry.clear();
  routeValidationContractRegistry.clear();
  routeBindingRegistry.clear();
}

function buildRoutingIdentity(
  routeKey: string,
  routeCategory: ExecutiveAssistantRouteCategoryKey,
  timestamp: string
): ExecutiveAssistantRoutingIdentityRecord {
  return Object.freeze({
    routeId: `ass-route-identity-${routeKey}`,
    routeKey,
    routeCategory,
    contractVersion: ASS_ROUTING_VERSION,
    stateDependency: ASS_ROUTING_DEPENDENCY,
    declarativeOnly: true as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function seedRouteCategories(timestamp: string): void {
  for (const categoryKey of ASS_ROUTE_CATEGORY_KEYS) {
    const record = Object.freeze({
      categoryId: `ass-route-category-${categoryKey}`,
      categoryKey,
      label: ASS_ROUTE_CATEGORY_LABELS[categoryKey],
      contractVersion: ASS_ROUTING_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    routeCategoryRegistry.set(record.categoryId, record);
  }
}

function seedIntentPlaceholders(timestamp: string): void {
  for (const placeholderKey of ASS_ROUTE_INTENT_PLACEHOLDER_KEYS) {
    const record = Object.freeze({
      placeholderId: `ass-intent-placeholder-${placeholderKey}`,
      placeholderKey,
      label: ASS_INTENT_PLACEHOLDER_LABELS[placeholderKey],
      contractVersion: ASS_ROUTING_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    intentPlaceholderRegistry.set(record.placeholderId, record);
  }
}

function seedTargetPlaceholders(timestamp: string): void {
  for (const placeholderKey of ASS_ROUTE_TARGET_PLACEHOLDER_KEYS) {
    const record = Object.freeze({
      placeholderId: `ass-target-placeholder-${placeholderKey}`,
      placeholderKey,
      label: ASS_TARGET_PLACEHOLDER_LABELS[placeholderKey],
      contractVersion: ASS_ROUTING_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    targetPlaceholderRegistry.set(record.placeholderId, record);
  }
}

function seedCoordinationRoutes(timestamp: string): void {
  for (const coordinationRouteKey of ASS_COORDINATION_ROUTE_KEYS) {
    const platformKey = ASS_COORDINATION_ROUTE_PLATFORM_MAP[coordinationRouteKey];
    const targetPlaceholderKey = ASS_COORDINATION_ROUTE_TARGET_MAP[coordinationRouteKey];
    const record = Object.freeze({
      coordinationRouteId: `ass-coordination-route-${coordinationRouteKey}`,
      coordinationRouteKey,
      platformKey,
      intentPlaceholderKey: "intent_unresolved" as const,
      targetPlaceholderKey: targetPlaceholderKey as (typeof ASS_ROUTE_TARGET_PLACEHOLDER_KEYS)[number],
      decisionMetadata: Object.freeze({ decisionPlaceholder: "decision_pending" }),
      confidenceMetadata: Object.freeze({ confidenceLevel: "confidence_unspecified" }),
      declarativeOnly: true as const,
      contractVersion: ASS_ROUTING_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    coordinationRouteRegistry.set(record.coordinationRouteId, record);
    routingIdentityRegistry.set(
      record.coordinationRouteId,
      buildRoutingIdentity(coordinationRouteKey, "coordination", timestamp)
    );
  }
}

function seedScopeRoutingMetadata(timestamp: string): void {
  for (const scopeRoutingKey of ASS_SCOPE_ROUTING_KEYS) {
    const scopeKey = scopeRoutingKey.replace("_routing", "") as (typeof ASS_SCOPE_ROUTING_SCOPE_KEYS)[number];
    const record = Object.freeze({
      scopeRoutingId: `ass-scope-routing-${scopeRoutingKey}`,
      scopeRoutingKey,
      scopeKey,
      routingMetadataRef: `routing-metadata-ref-${scopeRoutingKey}`,
      contextRef: `context-ref-${scopeKey}`,
      contractVersion: ASS_ROUTING_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    scopeRoutingMetadataRegistry.set(record.scopeRoutingId, record);
    routingIdentityRegistry.set(
      record.scopeRoutingId,
      buildRoutingIdentity(scopeRoutingKey, "scope_binding", timestamp)
    );
  }
}

function seedDecisionMetadata(timestamp: string): void {
  for (const decisionKey of ASS_ROUTE_DECISION_PLACEHOLDER_KEYS) {
    const record = Object.freeze({
      decisionMetadataId: `ass-route-decision-${decisionKey}`,
      decisionKey,
      label: `${decisionKey} placeholder metadata`,
      placeholderOnly: true as const,
      contractVersion: ASS_ROUTING_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    routeDecisionMetadataRegistry.set(record.decisionMetadataId, record);
  }
}

function seedConfidenceMetadata(timestamp: string): void {
  for (const confidenceKey of ASS_ROUTE_CONFIDENCE_LEVEL_KEYS) {
    const record = Object.freeze({
      confidenceMetadataId: `ass-route-confidence-${confidenceKey}`,
      confidenceKey,
      label: `${confidenceKey} declarative metadata`,
      declarativeOnly: true as const,
      contractVersion: ASS_ROUTING_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    routeConfidenceMetadataRegistry.set(record.confidenceMetadataId, record);
  }
}

function seedValidationContracts(timestamp: string): void {
  for (const validationKey of ASS_ROUTE_VALIDATION_CONTRACT_KEYS) {
    const routeCategory = validationKey.startsWith("coordination")
      ? ("coordination" as const)
      : validationKey.startsWith("scope")
        ? ("scope_binding" as const)
        : validationKey.startsWith("target")
          ? ("intent_resolution" as const)
          : validationKey.startsWith("decision")
            ? ("fallback" as const)
            : validationKey.startsWith("confidence")
              ? ("escalation" as const)
              : ("coordination" as const);
    const record = Object.freeze({
      validationContractId: `ass-route-validation-${validationKey}`,
      validationKey,
      routeCategory,
      mandatoryChecks: Object.freeze([...ASS_ROUTE_VALIDATION_CHECKS[validationKey]]),
      contractVersion: ASS_ROUTING_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    routeValidationContractRegistry.set(record.validationContractId, record);
  }
}

function seedTemplateRouteBinding(timestamp: string): void {
  if (routeBindingRegistry.has(TEMPLATE_BINDING_ID)) {
    return;
  }
  routeBindingRegistry.set(
    TEMPLATE_BINDING_ID,
    Object.freeze({
      bindingId: TEMPLATE_BINDING_ID,
      routeId: `ass-route-identity-${ASS_TEMPLATE_ROUTE_KEY}`,
      conversationIdRef: ASS_TEMPLATE_CONVERSATION_REF,
      routeCategory: "coordination",
      coordinationRouteKey: "llm_coordination_route",
      scopeRoutingKey: "workspace_routing",
      decisionKey: "decision_pending",
      confidenceKey: "confidence_unspecified",
      recordedAt: timestamp,
      readOnly: true as const,
    })
  );
  routingIdentityRegistry.set(
    `ass-route-identity-${ASS_TEMPLATE_ROUTE_KEY}`,
    buildRoutingIdentity(ASS_TEMPLATE_ROUTE_KEY, "coordination", timestamp)
  );
}

export function seedExecutiveAssistantRoutingRegistries(timestamp: string): void {
  seedRouteCategories(timestamp);
  seedIntentPlaceholders(timestamp);
  seedTargetPlaceholders(timestamp);
  seedCoordinationRoutes(timestamp);
  seedScopeRoutingMetadata(timestamp);
  seedDecisionMetadata(timestamp);
  seedConfidenceMetadata(timestamp);
  seedValidationContracts(timestamp);
  seedTemplateRouteBinding(timestamp);
}

export function ensureExecutiveAssistantRoutingDependenciesReady(timestamp: string): boolean {
  const state = buildExecutiveAssistantConversationStateArchitecture(timestamp);
  return state.success;
}

export function getExecutiveAssistantRoutingRegistryBundle(): ExecutiveAssistantRoutingRegistryBundle {
  const identities = sortByKey([...routingIdentityRegistry.values()], (entry) => entry.routeId);
  const categories = sortByKey([...routeCategoryRegistry.values()], (entry) => entry.categoryKey);
  const intents = sortByKey([...intentPlaceholderRegistry.values()], (entry) => entry.placeholderKey);
  const targets = sortByKey([...targetPlaceholderRegistry.values()], (entry) => entry.placeholderKey);
  const coordination = sortByKey([...coordinationRouteRegistry.values()], (entry) => entry.coordinationRouteKey);
  const scopeRouting = sortByKey([...scopeRoutingMetadataRegistry.values()], (entry) => entry.scopeRoutingKey);
  const decisions = sortByKey([...routeDecisionMetadataRegistry.values()], (entry) => entry.decisionKey);
  const confidence = sortByKey([...routeConfidenceMetadataRegistry.values()], (entry) => entry.confidenceKey);
  const validation = sortByKey([...routeValidationContractRegistry.values()], (entry) => entry.validationKey);
  const bindings = sortByKey([...routeBindingRegistry.values()], (entry) => entry.bindingId);

  return Object.freeze({
    routingIdentityRegistry: identities,
    routingIdentityCount: identities.length,
    routeCategoryRegistry: categories,
    routeCategoryCount: categories.length,
    intentPlaceholderRegistry: intents,
    intentPlaceholderCount: intents.length,
    targetPlaceholderRegistry: targets,
    targetPlaceholderCount: targets.length,
    coordinationRouteRegistry: coordination,
    coordinationRouteCount: coordination.length,
    scopeRoutingMetadataRegistry: scopeRouting,
    scopeRoutingCount: scopeRouting.length,
    routeDecisionMetadataRegistry: decisions,
    routeDecisionMetadataCount: decisions.length,
    routeConfidenceMetadataRegistry: confidence,
    routeConfidenceMetadataCount: confidence.length,
    routeValidationContractRegistry: validation,
    routeValidationContractCount: validation.length,
    routeBindingRegistry: bindings,
    routeBindingCount: bindings.length,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantRoutingRegistry(): ExecutiveAssistantRoutingRegistryBundle {
  return getExecutiveAssistantRoutingRegistryBundle();
}

export function isExecutiveAssistantRoutingIdentityImmutable(record: ExecutiveAssistantRoutingIdentityRecord): boolean {
  return Object.isFrozen(record) && record.declarativeOnly === true;
}

export function isExecutiveAssistantCoordinationRouteImmutable(record: ExecutiveAssistantCoordinationRouteRecord): boolean {
  return Object.isFrozen(record) && record.declarativeOnly === true;
}

export function registerExecutiveAssistantRouteBinding(record: ExecutiveAssistantRouteBindingRecord): boolean {
  if (routeBindingRegistry.has(record.bindingId)) {
    return false;
  }
  routeBindingRegistry.set(record.bindingId, Object.freeze({ ...record, readOnly: true as const }));
  return true;
}

export function getExecutiveAssistantCoordinationTargets(): readonly ExecutiveAssistantCoordinationRouteKey[] {
  return Object.freeze([...ASS_COORDINATION_ROUTE_KEYS]);
}

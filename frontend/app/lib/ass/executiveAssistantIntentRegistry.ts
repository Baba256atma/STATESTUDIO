/**
 * ASS-5 — Intent interpretation identity, category, signal, and binding registries.
 */

import { buildExecutiveAssistantRoutingArchitecture } from "./executiveAssistantRoutingExports.ts";
import {
  ASS_AMBIGUITY_METADATA_KEYS,
  ASS_CLARIFICATION_METADATA_KEYS,
  ASS_EXECUTIVE_INTENT_CATEGORY_KEYS,
  ASS_INTENT_CATEGORY_LABELS,
  ASS_INTENT_CONFIDENCE_LEVEL_KEYS,
  ASS_INTENT_DEPENDENCY,
  ASS_INTENT_ROUTE_BINDING_KEYS,
  ASS_INTENT_ROUTE_BINDING_MAP,
  ASS_INTENT_SIGNAL_LABELS,
  ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS,
  ASS_INTENT_VALIDATION_CHECKS,
  ASS_INTENT_VALIDATION_CONTRACT_KEYS,
  ASS_INTENT_VERSION,
  ASS_TEMPLATE_CONVERSATION_REF,
  ASS_TEMPLATE_INTERPRETATION_KEY,
} from "./executiveAssistantIntentContracts.ts";
import type {
  ExecutiveAssistantAmbiguityMetadataRecord,
  ExecutiveAssistantClarificationMetadataRecord,
  ExecutiveAssistantIntentBindingSnapshotRecord,
  ExecutiveAssistantIntentCategoryRecord,
  ExecutiveAssistantIntentConfidenceMetadataRecord,
  ExecutiveAssistantIntentInterpretationIdentityRecord,
  ExecutiveAssistantIntentRegistryBundle,
  ExecutiveAssistantIntentRouteBindingRecord,
  ExecutiveAssistantIntentSignalPlaceholderRecord,
  ExecutiveAssistantIntentValidationContractRecord,
} from "./executiveAssistantIntentTypes.ts";

const interpretationIdentityRegistry = new Map<string, ExecutiveAssistantIntentInterpretationIdentityRecord>();
const intentCategoryRegistry = new Map<string, ExecutiveAssistantIntentCategoryRecord>();
const signalPlaceholderRegistry = new Map<string, ExecutiveAssistantIntentSignalPlaceholderRecord>();
const ambiguityMetadataRegistry = new Map<string, ExecutiveAssistantAmbiguityMetadataRecord>();
const clarificationMetadataRegistry = new Map<string, ExecutiveAssistantClarificationMetadataRecord>();
const intentConfidenceMetadataRegistry = new Map<string, ExecutiveAssistantIntentConfidenceMetadataRecord>();
const intentRouteBindingRegistry = new Map<string, ExecutiveAssistantIntentRouteBindingRecord>();
const intentValidationContractRegistry = new Map<string, ExecutiveAssistantIntentValidationContractRecord>();
const intentBindingSnapshotRegistry = new Map<string, ExecutiveAssistantIntentBindingSnapshotRecord>();

const TEMPLATE_SNAPSHOT_ID = "ass-intent-binding-snapshot-template";
const TEMPLATE_INTERPRETATION_ID = `ass-intent-interpretation-${ASS_TEMPLATE_INTERPRETATION_KEY}`;

const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
  Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

export function resetExecutiveAssistantIntentStoreForTests(): void {
  interpretationIdentityRegistry.clear();
  intentCategoryRegistry.clear();
  signalPlaceholderRegistry.clear();
  ambiguityMetadataRegistry.clear();
  clarificationMetadataRegistry.clear();
  intentConfidenceMetadataRegistry.clear();
  intentRouteBindingRegistry.clear();
  intentValidationContractRegistry.clear();
  intentBindingSnapshotRegistry.clear();
}

function buildInterpretationIdentity(
  interpretationKey: string,
  intentCategoryKey: (typeof ASS_EXECUTIVE_INTENT_CATEGORY_KEYS)[number],
  timestamp: string
): ExecutiveAssistantIntentInterpretationIdentityRecord {
  return Object.freeze({
    interpretationId: `ass-intent-interpretation-${interpretationKey}`,
    interpretationKey,
    intentCategoryKey,
    contractVersion: ASS_INTENT_VERSION,
    routingDependency: ASS_INTENT_DEPENDENCY,
    declarativeOnly: true as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function seedIntentCategories(timestamp: string): void {
  for (const categoryKey of ASS_EXECUTIVE_INTENT_CATEGORY_KEYS) {
    const record = Object.freeze({
      categoryId: `ass-intent-category-${categoryKey}`,
      categoryKey,
      label: ASS_INTENT_CATEGORY_LABELS[categoryKey],
      contractVersion: ASS_INTENT_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    intentCategoryRegistry.set(record.categoryId, record);
    interpretationIdentityRegistry.set(
      record.categoryId,
      buildInterpretationIdentity(categoryKey, categoryKey, timestamp)
    );
  }
}

function seedSignalPlaceholders(timestamp: string): void {
  for (const signalKey of ASS_INTENT_SIGNAL_PLACEHOLDER_KEYS) {
    const record = Object.freeze({
      signalId: `ass-intent-signal-${signalKey}`,
      signalKey,
      label: ASS_INTENT_SIGNAL_LABELS[signalKey],
      placeholderOnly: true as const,
      contractVersion: ASS_INTENT_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    signalPlaceholderRegistry.set(record.signalId, record);
  }
}

function seedAmbiguityMetadata(timestamp: string): void {
  for (const ambiguityKey of ASS_AMBIGUITY_METADATA_KEYS) {
    const record = Object.freeze({
      ambiguityId: `ass-intent-ambiguity-${ambiguityKey}`,
      ambiguityKey,
      label: `${ambiguityKey} declarative metadata`,
      declarativeOnly: true as const,
      contractVersion: ASS_INTENT_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    ambiguityMetadataRegistry.set(record.ambiguityId, record);
  }
}

function seedClarificationMetadata(timestamp: string): void {
  for (const clarificationKey of ASS_CLARIFICATION_METADATA_KEYS) {
    const record = Object.freeze({
      clarificationId: `ass-intent-clarification-${clarificationKey}`,
      clarificationKey,
      label: `${clarificationKey} placeholder metadata`,
      placeholderOnly: true as const,
      contractVersion: ASS_INTENT_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    clarificationMetadataRegistry.set(record.clarificationId, record);
  }
}

function seedIntentConfidenceMetadata(timestamp: string): void {
  for (const confidenceKey of ASS_INTENT_CONFIDENCE_LEVEL_KEYS) {
    const record = Object.freeze({
      confidenceId: `ass-intent-confidence-${confidenceKey}`,
      confidenceKey,
      label: `${confidenceKey} declarative metadata`,
      declarativeOnly: true as const,
      contractVersion: ASS_INTENT_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    intentConfidenceMetadataRegistry.set(record.confidenceId, record);
  }
}

function seedIntentRouteBindings(timestamp: string): void {
  for (const bindingKey of ASS_INTENT_ROUTE_BINDING_KEYS) {
    const refs = ASS_INTENT_ROUTE_BINDING_MAP[bindingKey];
    const interpretationId = `ass-intent-interpretation-${bindingKey.replace("_route_binding", "")}`;
    const record = Object.freeze({
      bindingId: `ass-intent-route-binding-${bindingKey}`,
      bindingKey,
      interpretationId,
      coordinationRouteKey: refs.coordinationRouteKey,
      scopeRoutingKey: refs.scopeRoutingKey,
      routeCategoryKey: refs.routeCategoryKey,
      intentPlaceholderKey: refs.intentPlaceholderKey,
      contractVersion: ASS_INTENT_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    intentRouteBindingRegistry.set(record.bindingId, record);
  }
}

function seedValidationContracts(timestamp: string): void {
  for (const validationKey of ASS_INTENT_VALIDATION_CONTRACT_KEYS) {
    const record = Object.freeze({
      validationContractId: `ass-intent-validation-${validationKey}`,
      validationKey,
      mandatoryChecks: Object.freeze([...ASS_INTENT_VALIDATION_CHECKS[validationKey]]),
      contractVersion: ASS_INTENT_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    intentValidationContractRegistry.set(record.validationContractId, record);
  }
}

function seedTemplateBindingSnapshot(timestamp: string): void {
  if (intentBindingSnapshotRegistry.has(TEMPLATE_SNAPSHOT_ID)) {
    return;
  }
  interpretationIdentityRegistry.set(
    TEMPLATE_INTERPRETATION_ID,
    buildInterpretationIdentity(ASS_TEMPLATE_INTERPRETATION_KEY, "information_seeking", timestamp)
  );
  intentBindingSnapshotRegistry.set(
    TEMPLATE_SNAPSHOT_ID,
    Object.freeze({
      snapshotId: TEMPLATE_SNAPSHOT_ID,
      interpretationId: TEMPLATE_INTERPRETATION_ID,
      conversationIdRef: ASS_TEMPLATE_CONVERSATION_REF,
      intentCategoryKey: "information_seeking",
      signalKey: "signal_unspecified",
      ambiguityKey: "ambiguity_unresolved",
      clarificationKey: "clarification_pending",
      confidenceKey: "confidence_unspecified",
      routeBindingKey: "llm_intent_route_binding",
      recordedAt: timestamp,
      readOnly: true as const,
    })
  );
}

export function seedExecutiveAssistantIntentRegistries(timestamp: string): void {
  seedIntentCategories(timestamp);
  seedSignalPlaceholders(timestamp);
  seedAmbiguityMetadata(timestamp);
  seedClarificationMetadata(timestamp);
  seedIntentConfidenceMetadata(timestamp);
  seedIntentRouteBindings(timestamp);
  seedValidationContracts(timestamp);
  seedTemplateBindingSnapshot(timestamp);
}

export function ensureExecutiveAssistantIntentDependenciesReady(timestamp: string): boolean {
  const routing = buildExecutiveAssistantRoutingArchitecture(timestamp);
  return routing.success;
}

export function getExecutiveAssistantIntentRegistryBundle(): ExecutiveAssistantIntentRegistryBundle {
  const identities = sortByKey([...interpretationIdentityRegistry.values()], (entry) => entry.interpretationKey);
  const categories = sortByKey([...intentCategoryRegistry.values()], (entry) => entry.categoryKey);
  const signals = sortByKey([...signalPlaceholderRegistry.values()], (entry) => entry.signalKey);
  const ambiguity = sortByKey([...ambiguityMetadataRegistry.values()], (entry) => entry.ambiguityKey);
  const clarification = sortByKey([...clarificationMetadataRegistry.values()], (entry) => entry.clarificationKey);
  const confidence = sortByKey([...intentConfidenceMetadataRegistry.values()], (entry) => entry.confidenceKey);
  const bindings = sortByKey([...intentRouteBindingRegistry.values()], (entry) => entry.bindingKey);
  const validation = sortByKey([...intentValidationContractRegistry.values()], (entry) => entry.validationKey);
  const snapshots = sortByKey([...intentBindingSnapshotRegistry.values()], (entry) => entry.snapshotId);

  return Object.freeze({
    intentInterpretationIdentityRegistry: identities,
    interpretationIdentityCount: identities.length,
    executiveIntentCategoryRegistry: categories,
    intentCategoryCount: categories.length,
    intentSignalPlaceholderRegistry: signals,
    signalPlaceholderCount: signals.length,
    ambiguityMetadataRegistry: ambiguity,
    ambiguityMetadataCount: ambiguity.length,
    clarificationMetadataRegistry: clarification,
    clarificationMetadataCount: clarification.length,
    intentConfidenceMetadataRegistry: confidence,
    intentConfidenceMetadataCount: confidence.length,
    intentRouteBindingRegistry: bindings,
    intentRouteBindingCount: bindings.length,
    intentValidationContractRegistry: validation,
    intentValidationContractCount: validation.length,
    intentBindingSnapshotRegistry: snapshots,
    intentBindingSnapshotCount: snapshots.length,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantIntentRegistry(): ExecutiveAssistantIntentRegistryBundle {
  return getExecutiveAssistantIntentRegistryBundle();
}

export function isExecutiveAssistantIntentInterpretationImmutable(
  record: ExecutiveAssistantIntentInterpretationIdentityRecord
): boolean {
  return Object.isFrozen(record) && record.declarativeOnly === true;
}

export function registerExecutiveAssistantIntentBindingSnapshot(
  snapshot: ExecutiveAssistantIntentBindingSnapshotRecord
): boolean {
  if (intentBindingSnapshotRegistry.has(snapshot.snapshotId)) {
    return false;
  }
  intentBindingSnapshotRegistry.set(snapshot.snapshotId, Object.freeze({ ...snapshot, readOnly: true as const }));
  return true;
}

export function getExecutiveAssistantIntentRouteBindingModel(): readonly ExecutiveAssistantIntentRouteBindingRecord[] {
  return getExecutiveAssistantIntentRegistryBundle().intentRouteBindingRegistry;
}

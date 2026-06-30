/**
 * ASS-7 — Clarification identity, category, trigger, metadata, and binding registries.
 */

import { buildExecutiveAssistantResponseContractArchitecture } from "./executiveAssistantResponseExports.ts";
import {
  ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS,
  ASS_CLARIFICATION_BINDING_CATEGORY_MAP,
  ASS_CLARIFICATION_CATEGORY_KEYS,
  ASS_CLARIFICATION_CATEGORY_LABELS,
  ASS_CLARIFICATION_DEPENDENCY,
  ASS_CLARIFICATION_INTENT_BINDING_KEYS,
  ASS_CLARIFICATION_INTENT_BINDING_MAP,
  ASS_CLARIFICATION_PRIORITY_METADATA_KEYS,
  ASS_CLARIFICATION_RESPONSE_BINDING_KEYS,
  ASS_CLARIFICATION_RESPONSE_BINDING_MAP,
  ASS_CLARIFICATION_TRIGGER_LABELS,
  ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS,
  ASS_CLARIFICATION_VERSION,
  ASS_MISSING_CONTEXT_METADATA_KEYS,
  ASS_QUESTION_TYPE_METADATA_KEYS,
  ASS_TEMPLATE_CLARIFICATION_KEY,
  ASS_TEMPLATE_CONVERSATION_REF,
} from "./executiveAssistantClarificationContracts.ts";
import type {
  ExecutiveAssistantClarificationBindingSnapshotRecord,
  ExecutiveAssistantClarificationIdentityRecord,
  ExecutiveAssistantClarificationIntentBindingRecord,
  ExecutiveAssistantClarificationRegistryBundle,
  ExecutiveAssistantClarificationResponseBindingRecord,
} from "./executiveAssistantClarificationTypes.ts";

const clarificationIdentityRegistry = new Map<string, ExecutiveAssistantClarificationIdentityRecord>();
const clarificationCategoryRegistry = new Map<string, ReturnType<typeof buildCategoryRecord>>();
const triggerPlaceholderRegistry = new Map<string, ReturnType<typeof buildTriggerRecord>>();
const questionTypeMetadataRegistry = new Map<string, ReturnType<typeof buildQuestionTypeRecord>>();
const ambiguityResolutionMetadataRegistry = new Map<string, ReturnType<typeof buildResolutionRecord>>();
const missingContextMetadataRegistry = new Map<string, ReturnType<typeof buildMissingContextRecord>>();
const clarificationPriorityMetadataRegistry = new Map<string, ReturnType<typeof buildPriorityRecord>>();
const clarificationIntentBindingRegistry = new Map<string, ExecutiveAssistantClarificationIntentBindingRecord>();
const clarificationResponseBindingRegistry = new Map<string, ExecutiveAssistantClarificationResponseBindingRecord>();
const clarificationBindingSnapshotRegistry = new Map<string, ExecutiveAssistantClarificationBindingSnapshotRecord>();

const TEMPLATE_SNAPSHOT_ID = "ass-clarification-binding-snapshot-template";
const TEMPLATE_CLARIFICATION_ID = `ass-clarification-identity-${ASS_TEMPLATE_CLARIFICATION_KEY}`;

const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
  Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

function buildCategoryRecord(categoryKey: (typeof ASS_CLARIFICATION_CATEGORY_KEYS)[number], timestamp: string) {
  return Object.freeze({
    categoryId: `ass-clarification-category-${categoryKey}`,
    categoryKey,
    label: ASS_CLARIFICATION_CATEGORY_LABELS[categoryKey],
    contractVersion: ASS_CLARIFICATION_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildTriggerRecord(triggerKey: (typeof ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS)[number], timestamp: string) {
  return Object.freeze({
    triggerId: `ass-clarification-trigger-${triggerKey}`,
    triggerKey,
    label: ASS_CLARIFICATION_TRIGGER_LABELS[triggerKey],
    placeholderOnly: true as const,
    contractVersion: ASS_CLARIFICATION_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildQuestionTypeRecord(questionTypeKey: (typeof ASS_QUESTION_TYPE_METADATA_KEYS)[number], timestamp: string) {
  return Object.freeze({
    questionTypeId: `ass-clarification-question-type-${questionTypeKey}`,
    questionTypeKey,
    label: `${questionTypeKey} declarative metadata`,
    declarativeOnly: true as const,
    contractVersion: ASS_CLARIFICATION_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildResolutionRecord(resolutionKey: (typeof ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS)[number], timestamp: string) {
  return Object.freeze({
    resolutionId: `ass-clarification-resolution-${resolutionKey}`,
    resolutionKey,
    label: `${resolutionKey} placeholder metadata`,
    placeholderOnly: true as const,
    contractVersion: ASS_CLARIFICATION_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildMissingContextRecord(missingContextKey: (typeof ASS_MISSING_CONTEXT_METADATA_KEYS)[number], timestamp: string) {
  return Object.freeze({
    missingContextId: `ass-clarification-missing-context-${missingContextKey}`,
    missingContextKey,
    label: `${missingContextKey} placeholder metadata`,
    placeholderOnly: true as const,
    contractVersion: ASS_CLARIFICATION_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildPriorityRecord(priorityKey: (typeof ASS_CLARIFICATION_PRIORITY_METADATA_KEYS)[number], timestamp: string) {
  return Object.freeze({
    priorityId: `ass-clarification-priority-${priorityKey}`,
    priorityKey,
    label: `${priorityKey} declarative metadata`,
    declarativeOnly: true as const,
    contractVersion: ASS_CLARIFICATION_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveAssistantClarificationStoreForTests(): void {
  clarificationIdentityRegistry.clear();
  clarificationCategoryRegistry.clear();
  triggerPlaceholderRegistry.clear();
  questionTypeMetadataRegistry.clear();
  ambiguityResolutionMetadataRegistry.clear();
  missingContextMetadataRegistry.clear();
  clarificationPriorityMetadataRegistry.clear();
  clarificationIntentBindingRegistry.clear();
  clarificationResponseBindingRegistry.clear();
  clarificationBindingSnapshotRegistry.clear();
}

function buildClarificationIdentity(
  clarificationKey: string,
  clarificationCategoryKey: (typeof ASS_CLARIFICATION_CATEGORY_KEYS)[number],
  timestamp: string
): ExecutiveAssistantClarificationIdentityRecord {
  return Object.freeze({
    clarificationId: `ass-clarification-identity-${clarificationKey}`,
    clarificationKey,
    clarificationCategoryKey,
    contractVersion: ASS_CLARIFICATION_VERSION,
    responseDependency: ASS_CLARIFICATION_DEPENDENCY,
    declarativeOnly: true as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function seedClarificationCategories(timestamp: string): void {
  for (const categoryKey of ASS_CLARIFICATION_CATEGORY_KEYS) {
    const record = buildCategoryRecord(categoryKey, timestamp);
    clarificationCategoryRegistry.set(record.categoryId, record);
    clarificationIdentityRegistry.set(
      record.categoryId,
      buildClarificationIdentity(categoryKey, categoryKey, timestamp)
    );
  }
}

function seedTriggerPlaceholders(timestamp: string): void {
  for (const triggerKey of ASS_CLARIFICATION_TRIGGER_PLACEHOLDER_KEYS) {
    const record = buildTriggerRecord(triggerKey, timestamp);
    triggerPlaceholderRegistry.set(record.triggerId, record);
  }
}

function seedQuestionTypeMetadata(timestamp: string): void {
  for (const questionTypeKey of ASS_QUESTION_TYPE_METADATA_KEYS) {
    const record = buildQuestionTypeRecord(questionTypeKey, timestamp);
    questionTypeMetadataRegistry.set(record.questionTypeId, record);
  }
}

function seedAmbiguityResolutionMetadata(timestamp: string): void {
  for (const resolutionKey of ASS_AMBIGUITY_RESOLUTION_METADATA_KEYS) {
    const record = buildResolutionRecord(resolutionKey, timestamp);
    ambiguityResolutionMetadataRegistry.set(record.resolutionId, record);
  }
}

function seedMissingContextMetadata(timestamp: string): void {
  for (const missingContextKey of ASS_MISSING_CONTEXT_METADATA_KEYS) {
    const record = buildMissingContextRecord(missingContextKey, timestamp);
    missingContextMetadataRegistry.set(record.missingContextId, record);
  }
}

function seedClarificationPriorityMetadata(timestamp: string): void {
  for (const priorityKey of ASS_CLARIFICATION_PRIORITY_METADATA_KEYS) {
    const record = buildPriorityRecord(priorityKey, timestamp);
    clarificationPriorityMetadataRegistry.set(record.priorityId, record);
  }
}

function seedClarificationIntentBindings(timestamp: string): void {
  for (const bindingKey of ASS_CLARIFICATION_INTENT_BINDING_KEYS) {
    const refs = ASS_CLARIFICATION_INTENT_BINDING_MAP[bindingKey];
    const categoryKey = ASS_CLARIFICATION_BINDING_CATEGORY_MAP[bindingKey];
    const record = Object.freeze({
      bindingId: `ass-clarification-intent-binding-${bindingKey}`,
      bindingKey,
      clarificationId: `ass-clarification-identity-${categoryKey}`,
      interpretationId: `ass-intent-interpretation-${refs.interpretationKey}`,
      intentCategoryKey: refs.intentCategoryKey,
      intentRouteBindingKey: refs.intentRouteBindingKey,
      contractVersion: ASS_CLARIFICATION_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    clarificationIntentBindingRegistry.set(record.bindingId, record);
  }
}

function seedClarificationResponseBindings(timestamp: string): void {
  for (const bindingKey of ASS_CLARIFICATION_RESPONSE_BINDING_KEYS) {
    const refs = ASS_CLARIFICATION_RESPONSE_BINDING_MAP[bindingKey];
    const intentBindingKey = bindingKey.replace("_response_binding", "_intent_binding") as (typeof ASS_CLARIFICATION_INTENT_BINDING_KEYS)[number];
    const categoryKey = ASS_CLARIFICATION_BINDING_CATEGORY_MAP[intentBindingKey];
    const record = Object.freeze({
      bindingId: `ass-clarification-response-binding-${bindingKey}`,
      bindingKey,
      clarificationId: `ass-clarification-identity-${categoryKey}`,
      responseId: `ass-response-identity-${refs.responseCategoryKey}`,
      responseCategoryKey: refs.responseCategoryKey,
      responseIntentBindingKey: refs.responseIntentBindingKey,
      contractVersion: ASS_CLARIFICATION_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    clarificationResponseBindingRegistry.set(record.bindingId, record);
  }
}

function seedTemplateBindingSnapshot(timestamp: string): void {
  if (clarificationBindingSnapshotRegistry.has(TEMPLATE_SNAPSHOT_ID)) {
    return;
  }
  clarificationIdentityRegistry.set(
    TEMPLATE_CLARIFICATION_ID,
    buildClarificationIdentity(ASS_TEMPLATE_CLARIFICATION_KEY, "ambiguity_resolution", timestamp)
  );
  clarificationBindingSnapshotRegistry.set(
    TEMPLATE_SNAPSHOT_ID,
    Object.freeze({
      snapshotId: TEMPLATE_SNAPSHOT_ID,
      clarificationId: TEMPLATE_CLARIFICATION_ID,
      conversationIdRef: ASS_TEMPLATE_CONVERSATION_REF,
      clarificationCategoryKey: "ambiguity_resolution",
      triggerKey: "trigger_ambiguity_detected",
      questionTypeKey: "question_type_open",
      resolutionKey: "resolution_pending",
      missingContextKey: "context_partial",
      priorityKey: "priority_medium",
      intentBindingKey: "ambiguity_intent_binding",
      responseBindingKey: "ambiguity_response_binding",
      recordedAt: timestamp,
      readOnly: true as const,
    })
  );
}

export function seedExecutiveAssistantClarificationRegistries(timestamp: string): void {
  seedClarificationCategories(timestamp);
  seedTriggerPlaceholders(timestamp);
  seedQuestionTypeMetadata(timestamp);
  seedAmbiguityResolutionMetadata(timestamp);
  seedMissingContextMetadata(timestamp);
  seedClarificationPriorityMetadata(timestamp);
  seedClarificationIntentBindings(timestamp);
  seedClarificationResponseBindings(timestamp);
  seedTemplateBindingSnapshot(timestamp);
}

export function ensureExecutiveAssistantClarificationDependenciesReady(timestamp: string): boolean {
  const response = buildExecutiveAssistantResponseContractArchitecture(timestamp);
  return response.success;
}

export function getExecutiveAssistantClarificationRegistryBundle(): ExecutiveAssistantClarificationRegistryBundle {
  const identities = sortByKey([...clarificationIdentityRegistry.values()], (entry) => entry.clarificationKey);
  const categories = sortByKey([...clarificationCategoryRegistry.values()], (entry) => entry.categoryKey);
  const triggers = sortByKey([...triggerPlaceholderRegistry.values()], (entry) => entry.triggerKey);
  const questionTypes = sortByKey([...questionTypeMetadataRegistry.values()], (entry) => entry.questionTypeKey);
  const resolutions = sortByKey([...ambiguityResolutionMetadataRegistry.values()], (entry) => entry.resolutionKey);
  const missingContexts = sortByKey([...missingContextMetadataRegistry.values()], (entry) => entry.missingContextKey);
  const priorities = sortByKey([...clarificationPriorityMetadataRegistry.values()], (entry) => entry.priorityKey);
  const intentBindings = sortByKey([...clarificationIntentBindingRegistry.values()], (entry) => entry.bindingKey);
  const responseBindings = sortByKey([...clarificationResponseBindingRegistry.values()], (entry) => entry.bindingKey);
  const snapshots = sortByKey([...clarificationBindingSnapshotRegistry.values()], (entry) => entry.snapshotId);

  return Object.freeze({
    clarificationIdentityRegistry: identities,
    clarificationIdentityCount: identities.length,
    clarificationCategoryRegistry: categories,
    clarificationCategoryCount: categories.length,
    clarificationTriggerPlaceholderRegistry: triggers,
    triggerPlaceholderCount: triggers.length,
    questionTypeMetadataRegistry: questionTypes,
    questionTypeMetadataCount: questionTypes.length,
    ambiguityResolutionMetadataRegistry: resolutions,
    ambiguityResolutionMetadataCount: resolutions.length,
    missingContextMetadataRegistry: missingContexts,
    missingContextMetadataCount: missingContexts.length,
    clarificationPriorityMetadataRegistry: priorities,
    clarificationPriorityMetadataCount: priorities.length,
    clarificationIntentBindingRegistry: intentBindings,
    clarificationIntentBindingCount: intentBindings.length,
    clarificationResponseBindingRegistry: responseBindings,
    clarificationResponseBindingCount: responseBindings.length,
    clarificationBindingSnapshotRegistry: snapshots,
    clarificationBindingSnapshotCount: snapshots.length,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantClarificationRegistry(): ExecutiveAssistantClarificationRegistryBundle {
  return getExecutiveAssistantClarificationRegistryBundle();
}

export function isExecutiveAssistantClarificationIdentityImmutable(
  record: ExecutiveAssistantClarificationIdentityRecord
): boolean {
  return Object.isFrozen(record) && record.declarativeOnly === true;
}

export function registerExecutiveAssistantClarificationBindingSnapshot(
  snapshot: ExecutiveAssistantClarificationBindingSnapshotRecord
): boolean {
  if (clarificationBindingSnapshotRegistry.has(snapshot.snapshotId)) {
    return false;
  }
  clarificationBindingSnapshotRegistry.set(snapshot.snapshotId, Object.freeze({ ...snapshot, readOnly: true as const }));
  return true;
}

export function getExecutiveAssistantClarificationBindingModel(): Readonly<{
  intentBindings: readonly ExecutiveAssistantClarificationIntentBindingRecord[];
  responseBindings: readonly ExecutiveAssistantClarificationResponseBindingRecord[];
}> {
  const registry = getExecutiveAssistantClarificationRegistryBundle();
  return Object.freeze({
    intentBindings: registry.clarificationIntentBindingRegistry,
    responseBindings: registry.clarificationResponseBindingRegistry,
  });
}

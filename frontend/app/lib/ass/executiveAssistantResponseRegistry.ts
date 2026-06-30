/**
 * ASS-6 — Response identity, category, structure, metadata, and intent binding registries.
 */

import { buildExecutiveAssistantIntentInterpretationContracts } from "./executiveAssistantIntentExports.ts";
import {
  ASS_ACTION_SUGGESTION_METADATA_KEYS,
  ASS_EXPLANATION_METADATA_KEYS,
  ASS_FOLLOW_UP_METADATA_KEYS,
  ASS_RESPONSE_CATEGORY_KEYS,
  ASS_RESPONSE_CATEGORY_LABELS,
  ASS_RESPONSE_DEPENDENCY,
  ASS_RESPONSE_INTENT_BINDING_KEYS,
  ASS_RESPONSE_INTENT_BINDING_MAP,
  ASS_RESPONSE_STRUCTURE_LABELS,
  ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS,
  ASS_RESPONSE_VALIDATION_CHECKS,
  ASS_RESPONSE_VALIDATION_CONTRACT_KEYS,
  ASS_RESPONSE_VERSION,
  ASS_TEMPLATE_CONVERSATION_REF,
  ASS_TEMPLATE_RESPONSE_KEY,
  ASS_TONE_STYLE_METADATA_KEYS,
} from "./executiveAssistantResponseContracts.ts";
import type {
  ExecutiveAssistantActionSuggestionMetadataRecord,
  ExecutiveAssistantExplanationMetadataRecord,
  ExecutiveAssistantFollowUpMetadataRecord,
  ExecutiveAssistantResponseBindingSnapshotRecord,
  ExecutiveAssistantResponseCategoryRecord,
  ExecutiveAssistantResponseIdentityRecord,
  ExecutiveAssistantResponseIntentBindingRecord,
  ExecutiveAssistantResponseRegistryBundle,
  ExecutiveAssistantResponseStructurePlaceholderRecord,
  ExecutiveAssistantResponseValidationContractRecord,
  ExecutiveAssistantToneStyleMetadataRecord,
} from "./executiveAssistantResponseTypes.ts";

const responseIdentityRegistry = new Map<string, ExecutiveAssistantResponseIdentityRecord>();
const responseCategoryRegistry = new Map<string, ExecutiveAssistantResponseCategoryRecord>();
const structurePlaceholderRegistry = new Map<string, ExecutiveAssistantResponseStructurePlaceholderRecord>();
const toneStyleMetadataRegistry = new Map<string, ExecutiveAssistantToneStyleMetadataRecord>();
const explanationMetadataRegistry = new Map<string, ExecutiveAssistantExplanationMetadataRecord>();
const followUpMetadataRegistry = new Map<string, ExecutiveAssistantFollowUpMetadataRecord>();
const actionSuggestionMetadataRegistry = new Map<string, ExecutiveAssistantActionSuggestionMetadataRecord>();
const responseIntentBindingRegistry = new Map<string, ExecutiveAssistantResponseIntentBindingRecord>();
const responseValidationContractRegistry = new Map<string, ExecutiveAssistantResponseValidationContractRecord>();
const responseBindingSnapshotRegistry = new Map<string, ExecutiveAssistantResponseBindingSnapshotRecord>();

const TEMPLATE_SNAPSHOT_ID = "ass-response-binding-snapshot-template";
const TEMPLATE_RESPONSE_ID = `ass-response-identity-${ASS_TEMPLATE_RESPONSE_KEY}`;

const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
  Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

export function resetExecutiveAssistantResponseStoreForTests(): void {
  responseIdentityRegistry.clear();
  responseCategoryRegistry.clear();
  structurePlaceholderRegistry.clear();
  toneStyleMetadataRegistry.clear();
  explanationMetadataRegistry.clear();
  followUpMetadataRegistry.clear();
  actionSuggestionMetadataRegistry.clear();
  responseIntentBindingRegistry.clear();
  responseValidationContractRegistry.clear();
  responseBindingSnapshotRegistry.clear();
}

function buildResponseIdentity(
  responseKey: string,
  responseCategoryKey: (typeof ASS_RESPONSE_CATEGORY_KEYS)[number],
  timestamp: string
): ExecutiveAssistantResponseIdentityRecord {
  return Object.freeze({
    responseId: `ass-response-identity-${responseKey}`,
    responseKey,
    responseCategoryKey,
    contractVersion: ASS_RESPONSE_VERSION,
    intentDependency: ASS_RESPONSE_DEPENDENCY,
    declarativeOnly: true as const,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function seedResponseCategories(timestamp: string): void {
  for (const categoryKey of ASS_RESPONSE_CATEGORY_KEYS) {
    const record = Object.freeze({
      categoryId: `ass-response-category-${categoryKey}`,
      categoryKey,
      label: ASS_RESPONSE_CATEGORY_LABELS[categoryKey],
      contractVersion: ASS_RESPONSE_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    responseCategoryRegistry.set(record.categoryId, record);
    responseIdentityRegistry.set(
      record.categoryId,
      buildResponseIdentity(categoryKey, categoryKey, timestamp)
    );
  }
}

function seedStructurePlaceholders(timestamp: string): void {
  for (const structureKey of ASS_RESPONSE_STRUCTURE_PLACEHOLDER_KEYS) {
    const record = Object.freeze({
      structureId: `ass-response-structure-${structureKey}`,
      structureKey,
      label: ASS_RESPONSE_STRUCTURE_LABELS[structureKey],
      placeholderOnly: true as const,
      contractVersion: ASS_RESPONSE_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    structurePlaceholderRegistry.set(record.structureId, record);
  }
}

function seedToneStyleMetadata(timestamp: string): void {
  for (const toneStyleKey of ASS_TONE_STYLE_METADATA_KEYS) {
    const record = Object.freeze({
      toneStyleId: `ass-response-tone-${toneStyleKey}`,
      toneStyleKey,
      label: `${toneStyleKey} declarative metadata`,
      declarativeOnly: true as const,
      contractVersion: ASS_RESPONSE_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    toneStyleMetadataRegistry.set(record.toneStyleId, record);
  }
}

function seedExplanationMetadata(timestamp: string): void {
  for (const explanationKey of ASS_EXPLANATION_METADATA_KEYS) {
    const record = Object.freeze({
      explanationId: `ass-response-explanation-${explanationKey}`,
      explanationKey,
      label: `${explanationKey} placeholder metadata`,
      placeholderOnly: true as const,
      contractVersion: ASS_RESPONSE_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    explanationMetadataRegistry.set(record.explanationId, record);
  }
}

function seedFollowUpMetadata(timestamp: string): void {
  for (const followUpKey of ASS_FOLLOW_UP_METADATA_KEYS) {
    const record = Object.freeze({
      followUpId: `ass-response-follow-up-${followUpKey}`,
      followUpKey,
      label: `${followUpKey} placeholder metadata`,
      placeholderOnly: true as const,
      contractVersion: ASS_RESPONSE_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    followUpMetadataRegistry.set(record.followUpId, record);
  }
}

function seedActionSuggestionMetadata(timestamp: string): void {
  for (const actionSuggestionKey of ASS_ACTION_SUGGESTION_METADATA_KEYS) {
    const record = Object.freeze({
      actionSuggestionId: `ass-response-action-${actionSuggestionKey}`,
      actionSuggestionKey,
      label: `${actionSuggestionKey} placeholder metadata`,
      placeholderOnly: true as const,
      contractVersion: ASS_RESPONSE_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    actionSuggestionMetadataRegistry.set(record.actionSuggestionId, record);
  }
}

const RESPONSE_BINDING_CATEGORY_MAP = Object.freeze({
  informative_intent_binding: "informative",
  advisory_intent_binding: "advisory",
  confirmatory_intent_binding: "confirmatory",
  clarifying_intent_binding: "clarifying",
  procedural_intent_binding: "procedural",
  summary_intent_binding: "summary",
  escalation_intent_binding: "escalation_notice",
} as const);

function seedResponseIntentBindings(timestamp: string): void {
  for (const bindingKey of ASS_RESPONSE_INTENT_BINDING_KEYS) {
    const refs = ASS_RESPONSE_INTENT_BINDING_MAP[bindingKey];
    const categoryKey = RESPONSE_BINDING_CATEGORY_MAP[bindingKey];
    const record = Object.freeze({
      bindingId: `ass-response-intent-binding-${bindingKey}`,
      bindingKey,
      responseId: `ass-response-identity-${categoryKey}`,
      interpretationId: `ass-intent-interpretation-${refs.interpretationKey}`,
      intentCategoryKey: refs.intentCategoryKey,
      intentRouteBindingKey: refs.intentRouteBindingKey,
      contractVersion: ASS_RESPONSE_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    responseIntentBindingRegistry.set(record.bindingId, record);
  }
}

function seedValidationContracts(timestamp: string): void {
  for (const validationKey of ASS_RESPONSE_VALIDATION_CONTRACT_KEYS) {
    const record = Object.freeze({
      validationContractId: `ass-response-validation-${validationKey}`,
      validationKey,
      mandatoryChecks: Object.freeze([...ASS_RESPONSE_VALIDATION_CHECKS[validationKey]]),
      contractVersion: ASS_RESPONSE_VERSION,
      registeredAt: timestamp,
      readOnly: true as const,
    });
    responseValidationContractRegistry.set(record.validationContractId, record);
  }
}

function seedTemplateBindingSnapshot(timestamp: string): void {
  if (responseBindingSnapshotRegistry.has(TEMPLATE_SNAPSHOT_ID)) {
    return;
  }
  responseIdentityRegistry.set(
    TEMPLATE_RESPONSE_ID,
    buildResponseIdentity(ASS_TEMPLATE_RESPONSE_KEY, "informative", timestamp)
  );
  responseBindingSnapshotRegistry.set(
    TEMPLATE_SNAPSHOT_ID,
    Object.freeze({
      snapshotId: TEMPLATE_SNAPSHOT_ID,
      responseId: TEMPLATE_RESPONSE_ID,
      conversationIdRef: ASS_TEMPLATE_CONVERSATION_REF,
      responseCategoryKey: "informative",
      structureKey: "structure_unspecified",
      toneStyleKey: "tone_executive",
      explanationKey: "explanation_pending",
      followUpKey: "follow_up_not_required",
      actionSuggestionKey: "action_not_suggested",
      intentBindingKey: "informative_intent_binding",
      recordedAt: timestamp,
      readOnly: true as const,
    })
  );
}

export function seedExecutiveAssistantResponseRegistries(timestamp: string): void {
  seedResponseCategories(timestamp);
  seedStructurePlaceholders(timestamp);
  seedToneStyleMetadata(timestamp);
  seedExplanationMetadata(timestamp);
  seedFollowUpMetadata(timestamp);
  seedActionSuggestionMetadata(timestamp);
  seedResponseIntentBindings(timestamp);
  seedValidationContracts(timestamp);
  seedTemplateBindingSnapshot(timestamp);
}

export function ensureExecutiveAssistantResponseDependenciesReady(timestamp: string): boolean {
  const intent = buildExecutiveAssistantIntentInterpretationContracts(timestamp);
  return intent.success;
}

export function getExecutiveAssistantResponseRegistryBundle(): ExecutiveAssistantResponseRegistryBundle {
  const identities = sortByKey([...responseIdentityRegistry.values()], (entry) => entry.responseKey);
  const categories = sortByKey([...responseCategoryRegistry.values()], (entry) => entry.categoryKey);
  const structures = sortByKey([...structurePlaceholderRegistry.values()], (entry) => entry.structureKey);
  const toneStyles = sortByKey([...toneStyleMetadataRegistry.values()], (entry) => entry.toneStyleKey);
  const explanations = sortByKey([...explanationMetadataRegistry.values()], (entry) => entry.explanationKey);
  const followUps = sortByKey([...followUpMetadataRegistry.values()], (entry) => entry.followUpKey);
  const actions = sortByKey([...actionSuggestionMetadataRegistry.values()], (entry) => entry.actionSuggestionKey);
  const bindings = sortByKey([...responseIntentBindingRegistry.values()], (entry) => entry.bindingKey);
  const validation = sortByKey([...responseValidationContractRegistry.values()], (entry) => entry.validationKey);
  const snapshots = sortByKey([...responseBindingSnapshotRegistry.values()], (entry) => entry.snapshotId);

  return Object.freeze({
    responseIdentityRegistry: identities,
    responseIdentityCount: identities.length,
    responseCategoryRegistry: categories,
    responseCategoryCount: categories.length,
    responseStructurePlaceholderRegistry: structures,
    structurePlaceholderCount: structures.length,
    toneStyleMetadataRegistry: toneStyles,
    toneStyleMetadataCount: toneStyles.length,
    explanationMetadataRegistry: explanations,
    explanationMetadataCount: explanations.length,
    followUpMetadataRegistry: followUps,
    followUpMetadataCount: followUps.length,
    actionSuggestionMetadataRegistry: actions,
    actionSuggestionMetadataCount: actions.length,
    responseIntentBindingRegistry: bindings,
    responseIntentBindingCount: bindings.length,
    responseValidationContractRegistry: validation,
    responseValidationContractCount: validation.length,
    responseBindingSnapshotRegistry: snapshots,
    responseBindingSnapshotCount: snapshots.length,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantResponseRegistry(): ExecutiveAssistantResponseRegistryBundle {
  return getExecutiveAssistantResponseRegistryBundle();
}

export function isExecutiveAssistantResponseIdentityImmutable(record: ExecutiveAssistantResponseIdentityRecord): boolean {
  return Object.isFrozen(record) && record.declarativeOnly === true;
}

export function registerExecutiveAssistantResponseBindingSnapshot(
  snapshot: ExecutiveAssistantResponseBindingSnapshotRecord
): boolean {
  if (responseBindingSnapshotRegistry.has(snapshot.snapshotId)) {
    return false;
  }
  responseBindingSnapshotRegistry.set(snapshot.snapshotId, Object.freeze({ ...snapshot, readOnly: true as const }));
  return true;
}

export function getExecutiveAssistantResponseIntentBindingModel(): readonly ExecutiveAssistantResponseIntentBindingRecord[] {
  return getExecutiveAssistantResponseRegistryBundle().responseIntentBindingRegistry;
}

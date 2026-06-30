/**
 * ASS-3 — Conversation state, transition, failure metadata, and snapshot registries.
 */

import { buildExecutiveAssistantConversationContracts } from "./executiveAssistantConversationExports.ts";
import {
  ASS_COMPLETION_STATE_KEYS,
  ASS_COMPLETION_TERMINAL_STATE_KEYS,
  ASS_CONVERSATION_STATE_DEPENDENCY,
  ASS_CONVERSATION_STATE_VERSION,
  ASS_DECLARATIVE_TRANSITIONS,
  ASS_FAILURE_METADATA_CODES,
  ASS_INTERACTION_STATE_KEYS,
  ASS_LIFECYCLE_STATE_KEYS,
  ASS_LIFECYCLE_TERMINAL_STATE_KEYS,
  ASS_PAUSE_RESUME_STATE_KEYS,
  ASS_SESSION_STATE_KEYS,
  ASS_SESSION_TERMINAL_STATE_KEYS,
  ASS_STATE_LABELS,
  ASS_TURN_STATE_KEYS,
  ASS_TURN_TERMINAL_STATE_KEYS,
  ASS_WAITING_STATE_KEYS,
} from "./executiveAssistantConversationStateContracts.ts";
import type {
  ExecutiveAssistantConversationStateRegistryBundle,
  ExecutiveAssistantFailureMetadataRecord,
  ExecutiveAssistantStateCategoryKey,
  ExecutiveAssistantStateDefinitionRecord,
  ExecutiveAssistantStateSnapshotRecord,
  ExecutiveAssistantTransitionContractRecord,
  ExecutiveAssistantTransitionMatrixEntry,
} from "./executiveAssistantConversationStateTypes.ts";

const lifecycleStateRegistry = new Map<string, ExecutiveAssistantStateDefinitionRecord>();
const sessionStateRegistry = new Map<string, ExecutiveAssistantStateDefinitionRecord>();
const turnStateRegistry = new Map<string, ExecutiveAssistantStateDefinitionRecord>();
const interactionStateRegistry = new Map<string, ExecutiveAssistantStateDefinitionRecord>();
const waitingStateRegistry = new Map<string, ExecutiveAssistantStateDefinitionRecord>();
const completionStateRegistry = new Map<string, ExecutiveAssistantStateDefinitionRecord>();
const pauseResumeStateRegistry = new Map<string, ExecutiveAssistantStateDefinitionRecord>();
const failureMetadataRegistry = new Map<string, ExecutiveAssistantFailureMetadataRecord>();
const transitionContractRegistry = new Map<string, ExecutiveAssistantTransitionContractRecord>();
const stateSnapshotRegistry = new Map<string, ExecutiveAssistantStateSnapshotRecord>();

const TEMPLATE_SNAPSHOT_ID = "ass-state-snapshot-template";
const TEMPLATE_CONVERSATION_REF = "ass-conversation-template";

function resolveStateRegistry(category: ExecutiveAssistantStateCategoryKey) {
  switch (category) {
    case "lifecycle":
      return lifecycleStateRegistry;
    case "session":
      return sessionStateRegistry;
    case "turn":
      return turnStateRegistry;
    case "interaction":
      return interactionStateRegistry;
    case "waiting":
      return waitingStateRegistry;
    case "completion":
      return completionStateRegistry;
    case "pause_resume":
      return pauseResumeStateRegistry;
  }
}

function resolveStateKeys(category: ExecutiveAssistantStateCategoryKey): readonly string[] {
  switch (category) {
    case "lifecycle":
      return ASS_LIFECYCLE_STATE_KEYS;
    case "session":
      return ASS_SESSION_STATE_KEYS;
    case "turn":
      return ASS_TURN_STATE_KEYS;
    case "interaction":
      return ASS_INTERACTION_STATE_KEYS;
    case "waiting":
      return ASS_WAITING_STATE_KEYS;
    case "completion":
      return ASS_COMPLETION_STATE_KEYS;
    case "pause_resume":
      return ASS_PAUSE_RESUME_STATE_KEYS;
  }
}

function resolveTerminalStateKeys(category: ExecutiveAssistantStateCategoryKey): readonly string[] {
  switch (category) {
    case "lifecycle":
      return ASS_LIFECYCLE_TERMINAL_STATE_KEYS;
    case "session":
      return ASS_SESSION_TERMINAL_STATE_KEYS;
    case "turn":
      return ASS_TURN_TERMINAL_STATE_KEYS;
    case "completion":
      return ASS_COMPLETION_TERMINAL_STATE_KEYS;
    default:
      return Object.freeze([]);
  }
}

function resolveLabel(stateKey: string): string {
  return ASS_STATE_LABELS[stateKey as keyof typeof ASS_STATE_LABELS] ?? `${stateKey} State`;
}

function buildStateDefinition(
  category: ExecutiveAssistantStateCategoryKey,
  stateKey: string,
  timestamp: string
): ExecutiveAssistantStateDefinitionRecord {
  return Object.freeze({
    stateId: `ass-state-${category}-${stateKey}`,
    stateKey,
    stateCategory: category,
    label: resolveLabel(stateKey),
    contractVersion: ASS_CONVERSATION_STATE_VERSION,
    conversationDependency: ASS_CONVERSATION_STATE_DEPENDENCY,
    terminal: resolveTerminalStateKeys(category).includes(stateKey),
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildTransitionContract(
  category: ExecutiveAssistantStateCategoryKey,
  fromStateKey: string,
  toStateKey: string,
  transitionKey: string,
  timestamp: string
): ExecutiveAssistantTransitionContractRecord {
  return Object.freeze({
    transitionId: `ass-transition-${transitionKey}`,
    transitionKey,
    stateCategory: category,
    fromStateKey,
    toStateKey,
    declarativeOnly: true as const,
    contractVersion: ASS_CONVERSATION_STATE_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

function buildFailureMetadata(
  failureCode: (typeof ASS_FAILURE_METADATA_CODES)[number],
  timestamp: string
): ExecutiveAssistantFailureMetadataRecord {
  return Object.freeze({
    failureMetadataId: `ass-failure-metadata-${failureCode}`,
    failureCode,
    reasonRef: `failure-reason-ref-${failureCode}`,
    recoverable: failureCode !== "user_cancelled",
    retryEligible: failureCode === "timeout_placeholder" || failureCode === "external_blocked",
    contractVersion: ASS_CONVERSATION_STATE_VERSION,
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveAssistantConversationStateStoreForTests(): void {
  lifecycleStateRegistry.clear();
  sessionStateRegistry.clear();
  turnStateRegistry.clear();
  interactionStateRegistry.clear();
  waitingStateRegistry.clear();
  completionStateRegistry.clear();
  pauseResumeStateRegistry.clear();
  failureMetadataRegistry.clear();
  transitionContractRegistry.clear();
  stateSnapshotRegistry.clear();
}

function seedStateDefinitions(timestamp: string): void {
  for (const category of [
    "lifecycle",
    "session",
    "turn",
    "interaction",
    "waiting",
    "completion",
    "pause_resume",
  ] as const) {
    const registry = resolveStateRegistry(category);
    for (const stateKey of resolveStateKeys(category)) {
      const record = buildStateDefinition(category, stateKey, timestamp);
      registry.set(record.stateId, record);
    }
  }
}

function seedTransitionContracts(timestamp: string): void {
  for (const transition of ASS_DECLARATIVE_TRANSITIONS) {
    const record = buildTransitionContract(
      transition.category,
      transition.from,
      transition.to,
      transition.key,
      timestamp
    );
    transitionContractRegistry.set(record.transitionId, record);
  }
}

function seedFailureMetadata(timestamp: string): void {
  for (const failureCode of ASS_FAILURE_METADATA_CODES) {
    const record = buildFailureMetadata(failureCode, timestamp);
    failureMetadataRegistry.set(record.failureMetadataId, record);
  }
}

function seedTemplateSnapshot(timestamp: string): void {
  if (stateSnapshotRegistry.has(TEMPLATE_SNAPSHOT_ID)) {
    return;
  }
  stateSnapshotRegistry.set(
    TEMPLATE_SNAPSHOT_ID,
    Object.freeze({
      snapshotId: TEMPLATE_SNAPSHOT_ID,
      conversationIdRef: TEMPLATE_CONVERSATION_REF,
      lifecycleStateKey: "draft",
      sessionStateKey: "draft",
      turnStateKey: "placeholder",
      interactionStateKey: "idle",
      waitingStateKey: null,
      completionStateKey: null,
      pauseResumeStateKey: "none",
      failureMetadataRef: null,
      recordedAt: timestamp,
      readOnly: true as const,
    })
  );
}

export function seedExecutiveAssistantConversationStateRegistries(timestamp: string): void {
  seedStateDefinitions(timestamp);
  seedTransitionContracts(timestamp);
  seedFailureMetadata(timestamp);
  seedTemplateSnapshot(timestamp);
}

export function ensureExecutiveAssistantConversationStateDependenciesReady(timestamp: string): boolean {
  const conversation = buildExecutiveAssistantConversationContracts(timestamp);
  return conversation.success;
}

const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
  Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

export function getExecutiveAssistantConversationStateRegistryBundle(): ExecutiveAssistantConversationStateRegistryBundle {
  const lifecycleStates = sortByKey([...lifecycleStateRegistry.values()], (entry) => entry.stateKey);
  const sessionStates = sortByKey([...sessionStateRegistry.values()], (entry) => entry.stateKey);
  const turnStates = sortByKey([...turnStateRegistry.values()], (entry) => entry.stateKey);
  const interactionStates = sortByKey([...interactionStateRegistry.values()], (entry) => entry.stateKey);
  const waitingStates = sortByKey([...waitingStateRegistry.values()], (entry) => entry.stateKey);
  const completionStates = sortByKey([...completionStateRegistry.values()], (entry) => entry.stateKey);
  const pauseResumeStates = sortByKey([...pauseResumeStateRegistry.values()], (entry) => entry.stateKey);
  const failureMetadata = sortByKey([...failureMetadataRegistry.values()], (entry) => entry.failureMetadataId);
  const transitions = sortByKey([...transitionContractRegistry.values()], (entry) => entry.transitionKey);
  const snapshots = sortByKey([...stateSnapshotRegistry.values()], (entry) => entry.snapshotId);

  return Object.freeze({
    lifecycleStateRegistry: lifecycleStates,
    lifecycleStateCount: lifecycleStates.length,
    sessionStateRegistry: sessionStates,
    sessionStateCount: sessionStates.length,
    turnStateRegistry: turnStates,
    turnStateCount: turnStates.length,
    interactionStateRegistry: interactionStates,
    interactionStateCount: interactionStates.length,
    waitingStateRegistry: waitingStates,
    waitingStateCount: waitingStates.length,
    completionStateRegistry: completionStates,
    completionStateCount: completionStates.length,
    pauseResumeStateRegistry: pauseResumeStates,
    pauseResumeStateCount: pauseResumeStates.length,
    failureMetadataRegistry: failureMetadata,
    failureMetadataCount: failureMetadata.length,
    transitionContractRegistry: transitions,
    transitionCount: transitions.length,
    stateSnapshotRegistry: snapshots,
    snapshotCount: snapshots.length,
    readOnly: true as const,
  });
}

export function getExecutiveAssistantConversationStateRegistry(): ExecutiveAssistantConversationStateRegistryBundle {
  return getExecutiveAssistantConversationStateRegistryBundle();
}

export function getExecutiveAssistantTransitionMatrix(): readonly ExecutiveAssistantTransitionMatrixEntry[] {
  return Object.freeze(
    [...transitionContractRegistry.values()]
      .sort((left, right) => left.transitionKey.localeCompare(right.transitionKey))
      .map((entry) =>
        Object.freeze({
          stateCategory: entry.stateCategory,
          fromStateKey: entry.fromStateKey,
          toStateKey: entry.toStateKey,
          transitionKey: entry.transitionKey,
          readOnly: true as const,
        })
      )
  );
}

export function isExecutiveAssistantStateDefinitionImmutable(record: ExecutiveAssistantStateDefinitionRecord): boolean {
  return Object.isFrozen(record);
}

export function isExecutiveAssistantTransitionContractImmutable(
  record: ExecutiveAssistantTransitionContractRecord
): boolean {
  return Object.isFrozen(record) && record.declarativeOnly === true;
}

export function isExecutiveAssistantStateCategoryKey(value: string): value is ExecutiveAssistantStateCategoryKey {
  return (
    [
      "lifecycle",
      "session",
      "turn",
      "interaction",
      "waiting",
      "completion",
      "pause_resume",
    ] as readonly string[]
  ).includes(value);
}

export function registerExecutiveAssistantStateSnapshot(
  snapshot: ExecutiveAssistantStateSnapshotRecord
): boolean {
  if (stateSnapshotRegistry.has(snapshot.snapshotId)) {
    return false;
  }
  stateSnapshotRegistry.set(snapshot.snapshotId, Object.freeze({ ...snapshot, readOnly: true as const }));
  return true;
}

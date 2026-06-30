/**
 * KNL-12 — Knowledge Learning Bridge metadata registry.
 */

import {
  FEEDBACK_TYPE_KEYS,
  KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
  KNOWLEDGE_LEARNING_BRIDGE_DEFAULT_LIMITS,
  KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE,
  KNOWLEDGE_LEARNING_BRIDGE_OWNER,
  KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_ID,
  LEARNING_BRIDGE_KEYS,
  LEARNING_BRIDGE_LABELS,
  LEARNING_BRIDGE_TARGET_MAP,
  LEARNING_CONTEXT_KEYS,
  LEARNING_DEPENDENCY_KEYS,
  LEARNING_EXTENSION_POINT_KEYS,
  LEARNING_NAMESPACE_KEYS,
  LEARNING_PLATFORM_ID_MAP,
  LEARNING_SOURCE_KEYS,
  LEARNING_STATUS_KEYS,
  LEARNING_TARGET_KEYS,
  LEARNING_TARGET_PLATFORM_ID_MAP,
  OBSERVATION_TYPE_KEYS,
} from "./knowledgeLearningBridgeCatalog.ts";
import type {
  KnowledgeFeedbackDescriptor,
  KnowledgeImprovementProposal,
  KnowledgeLearningBridge,
  KnowledgeLearningBridgePlatformSnapshot,
  KnowledgeLearningBridgePlatformState,
  KnowledgeLearningBridgeRegistrationInput,
  KnowledgeLearningResult,
  KnowledgeLearningSource,
  KnowledgeLearningSourceRegistrationInput,
  KnowledgeLearningTarget,
  KnowledgeLearningTargetRegistrationInput,
  KnowledgeObservationDescriptor,
  KnowledgeLearningSession,
  LearningContext,
  LearningDependency,
  LearningExtensionPoint,
  LearningMetadata,
  LearningNamespace,
} from "./knowledgeLearningBridgeTypes.ts";
import {
  validateKnowledgeLearningBridgeRegistration,
  validateKnowledgeLearningSourceRegistration,
  validateKnowledgeLearningTargetRegistration,
} from "./knowledgeLearningBridgeValidation.ts";
import { initializeKnowledgeVersioningPlatform } from "./knowledgeVersioningRegistry.ts";

export const KNOWLEDGE_LEARNING_BRIDGE_REGISTRY_VERSION = "KNL/12-REGISTRY-1" as const;

const sourceRegistry = new Map<string, KnowledgeLearningSource>();
const sourceKeyRegistry = new Map<string, KnowledgeLearningSource>();
const targetRegistry = new Map<string, KnowledgeLearningTarget>();
const targetKeyRegistry = new Map<string, KnowledgeLearningTarget>();
const bridgeRegistry = new Map<string, KnowledgeLearningBridge>();
const bridgeKeyRegistry = new Map<string, KnowledgeLearningBridge>();
const feedbackTypeRegistry = new Map<string, KnowledgeFeedbackDescriptor>();
const observationTypeRegistry = new Map<string, KnowledgeObservationDescriptor>();
const proposalRegistry = new Map<string, KnowledgeImprovementProposal>();
const namespaceRegistry = new Map<string, LearningNamespace>();
const dependencyRegistry = new Map<string, LearningDependency>();
const extensionPointRegistry = new Map<string, LearningExtensionPoint>();
const contextRegistry = new Map<string, LearningContext>();
const metadataRegistry = new Map<string, LearningMetadata>();

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): KnowledgeLearningResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    namespace: KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE,
    owner: KNOWLEDGE_LEARNING_BRIDGE_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetKnowledgeLearningBridgeRegistryForTests(): void {
  sourceRegistry.clear();
  sourceKeyRegistry.clear();
  targetRegistry.clear();
  targetKeyRegistry.clear();
  bridgeRegistry.clear();
  bridgeKeyRegistry.clear();
  feedbackTypeRegistry.clear();
  observationTypeRegistry.clear();
  proposalRegistry.clear();
  namespaceRegistry.clear();
  dependencyRegistry.clear();
  extensionPointRegistry.clear();
  contextRegistry.clear();
  metadataRegistry.clear();
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isKnowledgeLearningBridgePlatformInitialized(): boolean {
  return platformInitialized;
}

export function getKnowledgeLearningBridgePlatformSnapshot(): KnowledgeLearningBridgePlatformSnapshot {
  return Object.freeze({
    platformVersion: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    bridgeCount: bridgeRegistry.size,
    sourceCount: sourceRegistry.size,
    targetCount: targetRegistry.size,
    feedbackTypeCount: feedbackTypeRegistry.size,
    observationTypeCount: observationTypeRegistry.size,
    proposalCount: proposalRegistry.size,
    namespaceCount: namespaceRegistry.size || LEARNING_NAMESPACE_KEYS.length,
    dependencyCount: dependencyRegistry.size || LEARNING_DEPENDENCY_KEYS.length,
    readOnly: true as const,
  });
}

export function getKnowledgeLearningBridgePlatformState(
  timestamp: string = new Date(0).toISOString()
): KnowledgeLearningBridgePlatformState {
  const snapshot = getKnowledgeLearningBridgePlatformSnapshot();
  return Object.freeze({
    platformId: KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_ID,
    contractVersion: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    bestPracticeDependency: "KNL/8",
    retrievalDependency: "KNL/9",
    validationDependency: "KNL/10",
    versioningDependency: "KNL/11",
    initialized: platformInitialized,
    bridgeCount: snapshot.bridgeCount,
    sourceCount: snapshot.sourceCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeKnowledgeLearningBridgePlatform(
  timestamp: string = new Date(0).toISOString()
): KnowledgeLearningResult<KnowledgeLearningBridgePlatformState> {
  const validation = initializeKnowledgeVersioningPlatform(timestamp);
  if (!validation.success) {
    return createResult(false, "KNL/11 Knowledge Versioning Platform initialization failed.", null);
  }
  seedKnowledgeLearningBridgeCatalog(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(
    true,
    "Knowledge learning bridge platform initialized.",
    getKnowledgeLearningBridgePlatformState(timestamp)
  );
}

export function registerKnowledgeLearningSource(
  input: KnowledgeLearningSourceRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeLearningResult<KnowledgeLearningSource> {
  const validation = validateKnowledgeLearningSourceRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (sourceRegistry.size >= KNOWLEDGE_LEARNING_BRIDGE_DEFAULT_LIMITS.maxRegisteredSources) {
    return createResult(false, "Learning source registration limit reached.", null);
  }
  if (sourceRegistry.has(input.sourceId)) {
    return createResult(false, `Learning source already registered: ${input.sourceId}.`, null);
  }
  if (sourceKeyRegistry.has(input.sourceKey)) {
    return createResult(false, `Learning source key already registered: ${input.sourceKey}.`, null);
  }
  const entry = Object.freeze({
    sourceId: input.sourceId,
    sourceKey: input.sourceKey,
    platformReference: input.platformReference,
    label: input.label,
    description: input.description,
    status: input.status,
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-source-${input.sourceKey}`, timestamp),
    readOnly: true as const,
  });
  sourceRegistry.set(entry.sourceId, entry);
  sourceKeyRegistry.set(entry.sourceKey, entry);
  return createResult(true, "Learning source registered.", entry);
}

export function registerKnowledgeLearningTarget(
  input: KnowledgeLearningTargetRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeLearningResult<KnowledgeLearningTarget> {
  const validation = validateKnowledgeLearningTargetRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (targetRegistry.size >= KNOWLEDGE_LEARNING_BRIDGE_DEFAULT_LIMITS.maxRegisteredTargets) {
    return createResult(false, "Learning target registration limit reached.", null);
  }
  if (targetRegistry.has(input.targetId)) {
    return createResult(false, `Learning target already registered: ${input.targetId}.`, null);
  }
  if (targetKeyRegistry.has(input.targetKey)) {
    return createResult(false, `Learning target key already registered: ${input.targetKey}.`, null);
  }
  const entry = Object.freeze({
    targetId: input.targetId,
    targetKey: input.targetKey,
    platformId: input.platformId,
    label: input.label,
    description: input.description,
    status: input.status,
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-target-${input.targetKey}`, timestamp),
    readOnly: true as const,
  });
  targetRegistry.set(entry.targetId, entry);
  targetKeyRegistry.set(entry.targetKey, entry);
  return createResult(true, "Learning target registered.", entry);
}

export function registerKnowledgeLearningBridge(
  input: KnowledgeLearningBridgeRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeLearningResult<KnowledgeLearningBridge> {
  const registeredSourceKeys = [...sourceKeyRegistry.keys()];
  const registeredTargetKeys = [...targetKeyRegistry.keys()];
  const validation = validateKnowledgeLearningBridgeRegistration(
    input,
    registeredSourceKeys,
    registeredTargetKeys
  );
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (bridgeRegistry.size >= KNOWLEDGE_LEARNING_BRIDGE_DEFAULT_LIMITS.maxRegisteredBridges) {
    return createResult(false, "Learning bridge registration limit reached.", null);
  }
  if (bridgeRegistry.has(input.bridgeId)) {
    return createResult(false, `Learning bridge already registered: ${input.bridgeId}.`, null);
  }
  if (bridgeKeyRegistry.has(input.bridgeKey)) {
    return createResult(false, `Learning bridge key already registered: ${input.bridgeKey}.`, null);
  }
  const feedback = Object.freeze({
    feedbackId: `feedback-${input.bridgeKey}`,
    feedbackType: input.feedbackType,
    description: input.feedbackDescription,
    readOnly: true as const,
  });
  const observation = Object.freeze({
    observationId: `observation-${input.bridgeKey}`,
    observationType: input.observationType,
    description: input.observationDescription,
    readOnly: true as const,
  });
  const proposal = Object.freeze({
    proposalId: `proposal-${input.bridgeKey}`,
    label: input.proposalLabel,
    description: input.proposalDescription,
    readOnly: true as const,
  });
  const session = Object.freeze({
    sessionId: `session-${input.bridgeKey}`,
    bridgeId: input.bridgeId,
    contextKey: input.contextKey,
    description: input.sessionDescription,
    readOnly: true as const,
  });
  const entry = Object.freeze({
    bridgeId: input.bridgeId,
    bridgeKey: input.bridgeKey,
    bridgeName: input.bridgeName,
    sourceKey: input.sourceKey,
    targetKey: input.targetKey,
    platformReference: input.platformReference,
    knlPlatformId: input.knlPlatformId,
    label: input.label,
    description: input.description,
    status: input.status,
    feedback,
    observation,
    proposal,
    session,
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-bridge-${input.bridgeKey}`, timestamp),
    readOnly: true as const,
  });
  bridgeRegistry.set(entry.bridgeId, entry);
  bridgeKeyRegistry.set(entry.bridgeKey, entry);
  feedbackTypeRegistry.set(feedback.feedbackId, feedback);
  observationTypeRegistry.set(observation.observationId, observation);
  proposalRegistry.set(proposal.proposalId, proposal);
  return createResult(true, "Learning bridge registered.", entry);
}

function registerLearningNamespace(
  namespaceKey: (typeof LEARNING_NAMESPACE_KEYS)[number],
  timestamp: string
): KnowledgeLearningResult<LearningNamespace> {
  const namespaceId = `learning-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Learning namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} learning namespace metadata.`,
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Learning namespace registered.", entry);
}

function registerLearningDependency(
  dependencyKey: (typeof LEARNING_DEPENDENCY_KEYS)[number],
  timestamp: string
): KnowledgeLearningResult<LearningDependency> {
  const dependencyId = `learning-dependency-${dependencyKey.replace("/", "-").toLowerCase()}`;
  if (dependencyRegistry.has(dependencyId)) {
    return createResult(false, `Learning dependency already registered: ${dependencyId}.`, null);
  }
  const entry = Object.freeze({
    dependencyId,
    dependencyKey,
    label: dependencyKey,
    description: `${dependencyKey} learning bridge dependency metadata.`,
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-dependency-${dependencyKey.replace("/", "-")}`, timestamp),
    readOnly: true as const,
  });
  dependencyRegistry.set(entry.dependencyId, entry);
  return createResult(true, "Learning dependency registered.", entry);
}

function registerLearningExtensionPoint(
  extensionPointKey: (typeof LEARNING_EXTENSION_POINT_KEYS)[number],
  timestamp: string
): KnowledgeLearningResult<LearningExtensionPoint> {
  const extensionPointId = `learning-extension-${extensionPointKey.replace(/_/g, "-")}`;
  if (extensionPointRegistry.has(extensionPointId)) {
    return createResult(false, `Learning extension point already registered: ${extensionPointId}.`, null);
  }
  const entry = Object.freeze({
    extensionPointId,
    extensionPointKey,
    label: extensionPointKey,
    description: `${extensionPointKey} learning extension point metadata.`,
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-extension-${extensionPointKey}`, timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(entry.extensionPointId, entry);
  return createResult(true, "Learning extension point registered.", entry);
}

function registerLearningContext(
  contextKey: (typeof LEARNING_CONTEXT_KEYS)[number],
  timestamp: string
): KnowledgeLearningResult<LearningContext> {
  const contextId = `learning-context-${contextKey}`;
  if (contextRegistry.has(contextId)) {
    return createResult(false, `Learning context already registered: ${contextId}.`, null);
  }
  const entry = Object.freeze({
    contextId,
    contextKey,
    label: contextKey,
    description: `${contextKey} learning context metadata.`,
    readOnly: true as const,
  });
  contextRegistry.set(entry.contextId, entry);
  return createResult(true, "Learning context registered.", entry);
}

export function getKnowledgeLearningBridgePlatformRegistry(): Readonly<{
  sources: readonly KnowledgeLearningSource[];
  targets: readonly KnowledgeLearningTarget[];
  bridges: readonly KnowledgeLearningBridge[];
  feedbackTypes: readonly KnowledgeFeedbackDescriptor[];
  observationTypes: readonly KnowledgeObservationDescriptor[];
  proposals: readonly KnowledgeImprovementProposal[];
  namespaces: readonly LearningNamespace[];
  dependencies: readonly LearningDependency[];
  extensionPoints: readonly LearningExtensionPoint[];
  contexts: readonly LearningContext[];
  metadataRecords: readonly LearningMetadata[];
  snapshot: KnowledgeLearningBridgePlatformSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    sources: Object.freeze(
      [...sourceRegistry.values()].sort((a, b) => a.sourceId.localeCompare(b.sourceId))
    ),
    targets: Object.freeze(
      [...targetRegistry.values()].sort((a, b) => a.targetId.localeCompare(b.targetId))
    ),
    bridges: Object.freeze(
      [...bridgeRegistry.values()].sort((a, b) => a.bridgeId.localeCompare(b.bridgeId))
    ),
    feedbackTypes: Object.freeze(
      [...feedbackTypeRegistry.values()].sort((a, b) => a.feedbackId.localeCompare(b.feedbackId))
    ),
    observationTypes: Object.freeze(
      [...observationTypeRegistry.values()].sort((a, b) => a.observationId.localeCompare(b.observationId))
    ),
    proposals: Object.freeze(
      [...proposalRegistry.values()].sort((a, b) => a.proposalId.localeCompare(b.proposalId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    dependencies: Object.freeze(
      [...dependencyRegistry.values()].sort((a, b) => a.dependencyId.localeCompare(b.dependencyId))
    ),
    extensionPoints: Object.freeze(
      [...extensionPointRegistry.values()].sort((a, b) => a.extensionPointId.localeCompare(b.extensionPointId))
    ),
    contexts: Object.freeze(
      [...contextRegistry.values()].sort((a, b) => a.contextId.localeCompare(b.contextId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getKnowledgeLearningBridgePlatformSnapshot(),
    readOnly: true as const,
  });
}

export function seedKnowledgeLearningBridgeCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (bridgeRegistry.size > 0) {
    return;
  }
  for (const namespaceKey of LEARNING_NAMESPACE_KEYS) {
    registerLearningNamespace(namespaceKey, timestamp);
  }
  for (const dependencyKey of LEARNING_DEPENDENCY_KEYS) {
    registerLearningDependency(dependencyKey, timestamp);
  }
  for (const extensionPointKey of LEARNING_EXTENSION_POINT_KEYS) {
    registerLearningExtensionPoint(extensionPointKey, timestamp);
  }
  for (const contextKey of LEARNING_CONTEXT_KEYS) {
    registerLearningContext(contextKey, timestamp);
  }
  for (const targetKey of LEARNING_TARGET_KEYS) {
    registerKnowledgeLearningTarget(
      Object.freeze({
        targetId: `learning-target-${targetKey}`,
        targetKey,
        platformId: LEARNING_TARGET_PLATFORM_ID_MAP[targetKey],
        label: targetKey === "knl_platform" ? "KNL Platform" : "Knowledge Versioning Platform",
        description: `Learning target metadata for ${targetKey}.`,
        status: "active",
      }),
      timestamp
    );
  }
  for (const sourceKey of LEARNING_SOURCE_KEYS) {
    registerKnowledgeLearningSource(
      Object.freeze({
        sourceId: `learning-source-${sourceKey}`,
        sourceKey,
        platformReference: LEARNING_PLATFORM_ID_MAP[sourceKey],
        label: LEARNING_BRIDGE_LABELS[sourceKey],
        description: `Learning source metadata for ${LEARNING_BRIDGE_LABELS[sourceKey]}.`,
        status: "active",
      }),
      timestamp
    );
  }
  for (const bridgeKey of LEARNING_BRIDGE_KEYS) {
    const targetKey = LEARNING_BRIDGE_TARGET_MAP[bridgeKey];
    registerKnowledgeLearningBridge(
      Object.freeze({
        bridgeId: `learning-bridge-${bridgeKey}`,
        bridgeKey,
        bridgeName: bridgeKey,
        sourceKey: bridgeKey,
        targetKey,
        platformReference: LEARNING_PLATFORM_ID_MAP[bridgeKey],
        knlPlatformId: LEARNING_TARGET_PLATFORM_ID_MAP[targetKey],
        label: LEARNING_BRIDGE_LABELS[bridgeKey],
        description: `Metadata learning bridge for ${LEARNING_BRIDGE_LABELS[bridgeKey]} (integration point only).`,
        status: "active",
        feedbackType: FEEDBACK_TYPE_KEYS[0],
        feedbackDescription: `Feedback descriptor metadata for ${LEARNING_BRIDGE_LABELS[bridgeKey]}.`,
        observationType: OBSERVATION_TYPE_KEYS[0],
        observationDescription: `Observation descriptor metadata for ${LEARNING_BRIDGE_LABELS[bridgeKey]}.`,
        proposalLabel: `${LEARNING_BRIDGE_LABELS[bridgeKey]} Improvement`,
        proposalDescription: `Improvement proposal metadata for ${LEARNING_BRIDGE_LABELS[bridgeKey]}.`,
        contextKey: LEARNING_CONTEXT_KEYS[0],
        sessionDescription: `Learning session metadata for ${LEARNING_BRIDGE_LABELS[bridgeKey]}.`,
      }),
      timestamp
    );
  }
  for (const statusKey of LEARNING_STATUS_KEYS) {
    const metadata = createMetadata(`metadata-status-${statusKey}`, timestamp);
    metadataRegistry.set(metadata.metadataId, metadata);
  }
  const rootMetadata = createMetadata("knowledge-learning-bridge-platform-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const KnowledgeLearningBridgeRegistry = Object.freeze({
  resetKnowledgeLearningBridgeRegistryForTests,
  initializeKnowledgeLearningBridgePlatform,
  registerKnowledgeLearningSource,
  registerKnowledgeLearningTarget,
  registerKnowledgeLearningBridge,
  getKnowledgeLearningBridgePlatformRegistry,
  getKnowledgeLearningBridgePlatformSnapshot,
  seedKnowledgeLearningBridgeCatalog,
});

/**
 * KNL-12 — Knowledge Learning Bridge domain types.
 */

import type {
  FEEDBACK_TYPE_KEYS,
  KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
  KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE,
  LEARNING_BRIDGE_KEYS,
  LEARNING_CONTEXT_KEYS,
  LEARNING_DEPENDENCY_KEYS,
  LEARNING_EXTENSION_POINT_KEYS,
  LEARNING_NAMESPACE_KEYS,
  LEARNING_SOURCE_KEYS,
  LEARNING_STATUS_KEYS,
  LEARNING_TARGET_KEYS,
  OBSERVATION_TYPE_KEYS,
} from "./knowledgeLearningBridgeCatalog.ts";

export type KnowledgeLearningIdentifier = string;
export type LearningBridgeKey = (typeof LEARNING_BRIDGE_KEYS)[number];
export type LearningSourceKey = (typeof LEARNING_SOURCE_KEYS)[number];
export type LearningTargetKey = (typeof LEARNING_TARGET_KEYS)[number];
export type FeedbackTypeKey = (typeof FEEDBACK_TYPE_KEYS)[number];
export type ObservationTypeKey = (typeof OBSERVATION_TYPE_KEYS)[number];
export type LearningContextKey = (typeof LEARNING_CONTEXT_KEYS)[number];
export type LearningStatusKey = (typeof LEARNING_STATUS_KEYS)[number];
export type LearningNamespaceKey = (typeof LEARNING_NAMESPACE_KEYS)[number];
export type LearningDependencyKey = (typeof LEARNING_DEPENDENCY_KEYS)[number];
export type LearningExtensionPointKey = (typeof LEARNING_EXTENSION_POINT_KEYS)[number];

export type LearningMetadata = Readonly<{
  metadataId: KnowledgeLearningIdentifier;
  metadataVersion: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  namespace: typeof KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type LearningNamespace = Readonly<{
  namespaceId: KnowledgeLearningIdentifier;
  namespaceKey: LearningNamespaceKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  metadata: LearningMetadata;
  readOnly: true;
}>;

export type LearningDependency = Readonly<{
  dependencyId: KnowledgeLearningIdentifier;
  dependencyKey: LearningDependencyKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  metadata: LearningMetadata;
  readOnly: true;
}>;

export type KnowledgeLearningSource = Readonly<{
  sourceId: KnowledgeLearningIdentifier;
  sourceKey: LearningSourceKey;
  platformReference: string;
  label: string;
  description: string;
  status: LearningStatusKey;
  version: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  metadata: LearningMetadata;
  readOnly: true;
}>;

export type KnowledgeLearningTarget = Readonly<{
  targetId: KnowledgeLearningIdentifier;
  targetKey: LearningTargetKey;
  platformId: string;
  label: string;
  description: string;
  status: LearningStatusKey;
  version: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  metadata: LearningMetadata;
  readOnly: true;
}>;

export type KnowledgeFeedbackDescriptor = Readonly<{
  feedbackId: KnowledgeLearningIdentifier;
  feedbackType: FeedbackTypeKey;
  description: string;
  readOnly: true;
}>;

export type KnowledgeObservationDescriptor = Readonly<{
  observationId: KnowledgeLearningIdentifier;
  observationType: ObservationTypeKey;
  description: string;
  readOnly: true;
}>;

export type KnowledgeImprovementProposal = Readonly<{
  proposalId: KnowledgeLearningIdentifier;
  label: string;
  description: string;
  readOnly: true;
}>;

export type LearningContext = Readonly<{
  contextId: KnowledgeLearningIdentifier;
  contextKey: LearningContextKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type KnowledgeLearningSession = Readonly<{
  sessionId: KnowledgeLearningIdentifier;
  bridgeId: KnowledgeLearningIdentifier;
  contextKey: LearningContextKey;
  description: string;
  readOnly: true;
}>;

export type KnowledgeLearningBridge = Readonly<{
  bridgeId: KnowledgeLearningIdentifier;
  bridgeKey: LearningBridgeKey;
  bridgeName: string;
  sourceKey: LearningSourceKey;
  targetKey: LearningTargetKey;
  platformReference: string;
  knlPlatformId: string;
  label: string;
  description: string;
  status: LearningStatusKey;
  feedback: KnowledgeFeedbackDescriptor;
  observation: KnowledgeObservationDescriptor;
  proposal: KnowledgeImprovementProposal;
  session: KnowledgeLearningSession;
  version: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  metadata: LearningMetadata;
  readOnly: true;
}>;

export type LearningExtensionPoint = Readonly<{
  extensionPointId: KnowledgeLearningIdentifier;
  extensionPointKey: LearningExtensionPointKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  metadata: LearningMetadata;
  readOnly: true;
}>;

export type LearningManifest = Readonly<{
  platformId: typeof import("./knowledgeLearningBridgeCatalog.ts").KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_ID;
  platformName: typeof import("./knowledgeLearningBridgeCatalog.ts").KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_NAME;
  namespace: typeof KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE;
  contractVersion: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgeLearningBridgeCatalog.ts").KNOWLEDGE_LEARNING_BRIDGE_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  retrievalDependency: "KNL/9";
  validationDependency: "KNL/10";
  versioningDependency: "KNL/11";
  supportedBridges: readonly LearningBridgeKey[];
  supportedSources: readonly LearningSourceKey[];
  supportedTargets: readonly LearningTargetKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type KnowledgeLearningIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type KnowledgeLearningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly KnowledgeLearningIssue[];
  readOnly: true;
}>;

export type KnowledgeLearningResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type KnowledgeLearningSourceRegistrationInput = Readonly<{
  sourceId: KnowledgeLearningIdentifier;
  sourceKey: LearningSourceKey;
  platformReference: string;
  label: string;
  description: string;
  status: LearningStatusKey;
}>;

export type KnowledgeLearningTargetRegistrationInput = Readonly<{
  targetId: KnowledgeLearningIdentifier;
  targetKey: LearningTargetKey;
  platformId: string;
  label: string;
  description: string;
  status: LearningStatusKey;
}>;

export type KnowledgeLearningBridgeRegistrationInput = Readonly<{
  bridgeId: KnowledgeLearningIdentifier;
  bridgeKey: LearningBridgeKey;
  bridgeName: string;
  sourceKey: LearningSourceKey;
  targetKey: LearningTargetKey;
  platformReference: string;
  knlPlatformId: string;
  label: string;
  description: string;
  status: LearningStatusKey;
  feedbackType: FeedbackTypeKey;
  feedbackDescription: string;
  observationType: ObservationTypeKey;
  observationDescription: string;
  proposalLabel: string;
  proposalDescription: string;
  contextKey: LearningContextKey;
  sessionDescription: string;
}>;

export type KnowledgeLearningBridgePlatformSnapshot = Readonly<{
  platformVersion: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  bridgeCount: number;
  sourceCount: number;
  targetCount: number;
  feedbackTypeCount: number;
  observationTypeCount: number;
  proposalCount: number;
  namespaceCount: number;
  dependencyCount: number;
  readOnly: true;
}>;

export type KnowledgeLearningBridgePlatformState = Readonly<{
  platformId: typeof import("./knowledgeLearningBridgeCatalog.ts").KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_ID;
  contractVersion: typeof KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  retrievalDependency: "KNL/9";
  validationDependency: "KNL/10";
  versioningDependency: "KNL/11";
  initialized: boolean;
  bridgeCount: number;
  sourceCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type KnowledgeLearningBridgePlatformValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphValid: boolean;
  industryValid: boolean;
  frameworkValid: boolean;
  policyValid: boolean;
  bestPracticeValid: boolean;
  retrievalValid: boolean;
  validationValid: boolean;
  versioningValid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly KnowledgeLearningIssue[];
  readOnly: true;
}>;

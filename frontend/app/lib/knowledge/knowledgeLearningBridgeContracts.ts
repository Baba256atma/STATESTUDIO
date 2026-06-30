/**
 * KNL-12 — Knowledge Learning Bridge contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_LEARNING_BRIDGE_ARCHITECTURE_VERSION,
  KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
  KNOWLEDGE_LEARNING_BRIDGE_FORBIDDEN_PATTERNS,
  KNOWLEDGE_LEARNING_BRIDGE_FUTURE_PHASE_KEYS,
  KNOWLEDGE_LEARNING_BRIDGE_GOVERNANCE_RULES,
  KNOWLEDGE_LEARNING_BRIDGE_MUST_NOT_OWN,
  KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE,
  KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_ID,
  KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_NAME,
  KNOWLEDGE_LEARNING_BRIDGE_PRINCIPLES,
  KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY,
  LEARNING_BRIDGE_KEYS,
  LEARNING_SOURCE_KEYS,
  LEARNING_TARGET_KEYS,
} from "./knowledgeLearningBridgeCatalog.ts";
import {
  getKnowledgeLearningBridgePlatformSnapshot,
  initializeKnowledgeLearningBridgePlatform,
  isKnowledgeLearningBridgePlatformInitialized,
} from "./knowledgeLearningBridgeRegistry.ts";
import type {
  KnowledgeFeedbackDescriptor,
  KnowledgeImprovementProposal,
  KnowledgeLearningBridge,
  KnowledgeLearningBridgePlatformValidationReport,
  KnowledgeLearningSession,
  KnowledgeLearningSource,
  KnowledgeLearningTarget,
  KnowledgeObservationDescriptor,
  LearningContext,
  LearningDependency,
  LearningExtensionPoint,
  LearningManifest,
  LearningMetadata,
  LearningNamespace,
} from "./knowledgeLearningBridgeTypes.ts";
import {
  validateBestPracticePlatformDependency,
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateFrameworkLibraryDependency,
  validateIndustryModelsDependency,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
  validateKnowledgeLearningBridgeContractVersion,
  validateKnowledgeLearningBridgeCoreNamespace,
  validateKnowledgeLearningBridgeDependencyDeclarations,
  validateKnowledgeRetrievalEngineDependency,
  validateKnowledgeValidationPlatformDependency,
  validateKnowledgeVersioningPlatformDependency,
  validatePolicyRuleBaseDependency,
} from "./knowledgeLearningBridgeValidation.ts";

export const KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noLearningEngine: true,
  noFeedbackProcessing: true,
  noAdaptiveLearning: true,
  noKnowledgeMutation: true,
  noRuntimeIntegration: true,
  noSearch: true,
  noRetrieval: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  descriptiveOnly: true,
  readOnly: true as const,
});

export const KNOWLEDGE_LEARNING_BRIDGE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...KNOWLEDGE_LEARNING_BRIDGE_FORBIDDEN_PATTERNS,
] as const);

export const KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/12",
  title: "Knowledge Learning Bridge",
  goal: "Canonical metadata-only bridge between static Knowledge Platform and future learning capabilities.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgeLearningBridgeCatalog.ts",
    "frontend/app/lib/knowledge/knowledgeLearningBridgeTypes.ts",
    "frontend/app/lib/knowledge/knowledgeLearningBridgeContracts.ts",
    "frontend/app/lib/knowledge/knowledgeLearningBridgeRegistry.ts",
    "frontend/app/lib/knowledge/knowledgeLearningBridgeValidation.ts",
    "frontend/app/lib/knowledge/knowledgeLearningBridgePlatform.ts",
    "frontend/app/lib/knowledge/knowledgeLearningBridgePlatform.test.ts",
    "docs/knl-12-knowledge-learning-bridge-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_LEARNING_BRIDGE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze([
    "KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6", "KNL/7", "KNL/8", "KNL/9", "KNL/10", "KNL/11",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_12]", "[KNOWLEDGE_LEARNING_BRIDGE]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): LearningMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    namespace: KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE,
    owner: "knowledge-learning-bridge-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveLearningMetadataExample(timestamp: string): LearningMetadata {
  return createMetadata("learning-metadata-example-001", timestamp);
}

export function resolveKnowledgeLearningSourceExample(timestamp: string): KnowledgeLearningSource {
  return Object.freeze({
    sourceId: "learning-source-app_layer",
    sourceKey: "app_layer",
    platformReference: "app-layer",
    label: "APP Layer",
    description: "Example learning source contract.",
    status: "active",
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: resolveLearningMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeLearningTargetExample(timestamp: string): KnowledgeLearningTarget {
  return Object.freeze({
    targetId: "learning-target-knl_platform",
    targetKey: "knl_platform",
    platformId: "knowledge-platform",
    label: "KNL Platform",
    description: "Example learning target contract.",
    status: "active",
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: resolveLearningMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeFeedbackDescriptorExample(): KnowledgeFeedbackDescriptor {
  return Object.freeze({
    feedbackId: "feedback-example-001",
    feedbackType: "observation",
    description: "Example feedback descriptor (metadata only).",
    readOnly: true as const,
  });
}

export function resolveKnowledgeObservationDescriptorExample(): KnowledgeObservationDescriptor {
  return Object.freeze({
    observationId: "observation-example-001",
    observationType: "usage",
    description: "Example observation descriptor (metadata only).",
    readOnly: true as const,
  });
}

export function resolveKnowledgeImprovementProposalExample(): KnowledgeImprovementProposal {
  return Object.freeze({
    proposalId: "proposal-example-001",
    label: "Example Improvement",
    description: "Example improvement proposal (metadata only).",
    readOnly: true as const,
  });
}

export function resolveLearningContextExample(): LearningContext {
  return Object.freeze({
    contextId: "learning-context-example-001",
    contextKey: "session",
    label: "Session",
    description: "Example learning context contract.",
    readOnly: true as const,
  });
}

export function resolveKnowledgeLearningSessionExample(): KnowledgeLearningSession {
  return Object.freeze({
    sessionId: "session-example-001",
    bridgeId: "learning-bridge-app_layer",
    contextKey: "session",
    description: "Example learning session contract (metadata only).",
    readOnly: true as const,
  });
}

export function resolveKnowledgeLearningBridgeExample(timestamp: string): KnowledgeLearningBridge {
  return Object.freeze({
    bridgeId: "learning-bridge-app_layer",
    bridgeKey: "app_layer",
    bridgeName: "app_layer",
    sourceKey: "app_layer",
    targetKey: "knl_platform",
    platformReference: "app-layer",
    knlPlatformId: "knowledge-platform",
    label: "APP Layer",
    description: "Example learning bridge contract.",
    status: "active",
    feedback: resolveKnowledgeFeedbackDescriptorExample(),
    observation: resolveKnowledgeObservationDescriptorExample(),
    proposal: resolveKnowledgeImprovementProposalExample(),
    session: resolveKnowledgeLearningSessionExample(),
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: resolveLearningMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveLearningNamespaceExample(timestamp: string): LearningNamespace {
  return Object.freeze({
    namespaceId: "learning-namespace-knowledge-learning-bridge",
    namespaceKey: "knowledge-learning-bridge",
    label: "knowledge-learning-bridge",
    description: "Example learning namespace contract.",
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: resolveLearningMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveLearningDependencyExample(timestamp: string): LearningDependency {
  return Object.freeze({
    dependencyId: "learning-dependency-knl-1",
    dependencyKey: "KNL/1",
    label: "KNL/1",
    description: "Example learning dependency contract.",
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: resolveLearningMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveLearningExtensionPointExample(timestamp: string): LearningExtensionPoint {
  return Object.freeze({
    extensionPointId: "learning-extension-knowledge-governance",
    extensionPointKey: "knowledge_governance",
    label: "Knowledge Governance",
    description: "Reserved extension point for KNL-13 Knowledge Governance Platform.",
    version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    metadata: resolveLearningMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getKnowledgeLearningBridgeManifest(timestamp: string = new Date(0).toISOString()): LearningManifest {
  if (!isKnowledgeLearningBridgePlatformInitialized()) {
    initializeKnowledgeLearningBridgePlatform(timestamp);
  }
  return Object.freeze({
    platformId: KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_ID,
    platformName: KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_NAME,
    namespace: KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE,
    contractVersion: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_LEARNING_BRIDGE_ARCHITECTURE_VERSION,
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
    supportedBridges: LEARNING_BRIDGE_KEYS,
    supportedSources: LEARNING_SOURCE_KEYS,
    supportedTargets: LEARNING_TARGET_KEYS,
    publicApis: KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_LEARNING_BRIDGE_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_LEARNING_BRIDGE_MUST_NOT_OWN,
    governanceRules: KNOWLEDGE_LEARNING_BRIDGE_GOVERNANCE_RULES,
    futurePhases: KNOWLEDGE_LEARNING_BRIDGE_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateKnowledgeLearningBridgePlatform(
  timestamp: string = new Date(0).toISOString()
): KnowledgeLearningBridgePlatformValidationReport {
  const issues: KnowledgeLearningBridgePlatformValidationReport["issues"][number][] = [];

  const dependencyValidation = validateKnowledgeLearningBridgeDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateKnowledgeLearningBridgeContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateKnowledgeLearningBridgeCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  if (!isKnowledgeLearningBridgePlatformInitialized()) {
    initializeKnowledgeLearningBridgePlatform(timestamp);
  }

  const foundationValidation = validateKnowledgeFoundationDependency(timestamp);
  if (!foundationValidation.valid) issues.push(...foundationValidation.issues);

  const ontologyValidation = validateBusinessOntologyDependency(timestamp);
  if (!ontologyValidation.valid) issues.push(...ontologyValidation.issues);

  const vocabularyValidation = validateBusinessVocabularyDependency(timestamp);
  if (!vocabularyValidation.valid) issues.push(...vocabularyValidation.issues);

  const graphValidation = validateKnowledgeGraphDependency(timestamp);
  if (!graphValidation.valid) issues.push(...graphValidation.issues);

  const industryValidation = validateIndustryModelsDependency(timestamp);
  if (!industryValidation.valid) issues.push(...industryValidation.issues);

  const frameworkValidation = validateFrameworkLibraryDependency(timestamp);
  if (!frameworkValidation.valid) issues.push(...frameworkValidation.issues);

  const policyValidation = validatePolicyRuleBaseDependency(timestamp);
  if (!policyValidation.valid) issues.push(...policyValidation.issues);

  const bestPracticeValidation = validateBestPracticePlatformDependency(timestamp);
  if (!bestPracticeValidation.valid) issues.push(...bestPracticeValidation.issues);

  const retrievalValidation = validateKnowledgeRetrievalEngineDependency(timestamp);
  if (!retrievalValidation.valid) issues.push(...retrievalValidation.issues);

  const validationPlatformValidation = validateKnowledgeValidationPlatformDependency(timestamp);
  if (!validationPlatformValidation.valid) issues.push(...validationPlatformValidation.issues);

  const versioningValidation = validateKnowledgeVersioningPlatformDependency(timestamp);
  if (!versioningValidation.valid) issues.push(...versioningValidation.issues);

  const manifestValidation = validateStageManifest(KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getKnowledgeLearningBridgePlatformSnapshot();
  if (snapshot.bridgeCount < LEARNING_BRIDGE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "bridges_incomplete",
        message: "Learning bridge catalog must contain all seeded bridges.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.sourceCount < LEARNING_SOURCE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "sources_incomplete",
        message: "Learning source catalog must contain seeded sources.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.targetCount < LEARNING_TARGET_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "targets_incomplete",
        message: "Learning target catalog must contain seeded targets.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    foundationValid: foundationValidation.valid,
    ontologyValid: ontologyValidation.valid,
    vocabularyValid: vocabularyValidation.valid,
    graphValid: graphValidation.valid,
    industryValid: industryValidation.valid,
    frameworkValid: frameworkValidation.valid,
    policyValid: policyValidation.valid,
    bestPracticeValid: bestPracticeValidation.valid,
    retrievalValid: retrievalValidation.valid,
    validationValid: validationPlatformValidation.valid,
    versioningValid: versioningValidation.valid,
    platformInitialized: isKnowledgeLearningBridgePlatformInitialized(),
    registryValid:
      snapshot.bridgeCount >= LEARNING_BRIDGE_KEYS.length &&
      snapshot.sourceCount >= LEARNING_SOURCE_KEYS.length &&
      snapshot.targetCount >= LEARNING_TARGET_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgeLearningBridgeContract = Object.freeze({
  KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_RULES,
  KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST,
  getKnowledgeLearningBridgeManifest,
  validateKnowledgeLearningBridgePlatform,
  resolveKnowledgeLearningBridgeExample,
  resolveKnowledgeLearningSourceExample,
  version: KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
});

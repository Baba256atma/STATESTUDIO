/**
 * APP-10:1 — Cross-Scenario Learning Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  CROSS_SCENARIO_LEARNING_CERTIFICATION_METADATA,
  CROSS_SCENARIO_LEARNING_CERTIFIED_DEPENDENCIES,
  CROSS_SCENARIO_LEARNING_COMPATIBILITY_REGISTRY,
  CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY,
  CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY,
  CROSS_SCENARIO_LEARNING_FUTURE_API_REGISTRY,
  CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY,
  CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY,
  CROSS_SCENARIO_LEARNING_METADATA_EXTENSION_REGISTRY,
  CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
  CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES,
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES,
  CROSS_SCENARIO_LEARNING_PLATFORM_TAGS,
  CROSS_SCENARIO_LEARNING_RELEASE_METADATA,
  CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
} from "./crossScenarioLearningConstants.ts";
import {
  buildCrossScenarioLearningFoundation,
  createCrossScenarioLearningFoundation,
  isCrossScenarioLearningPlatformInitialized,
} from "./crossScenarioLearningFoundation.ts";
import {
  getCrossScenarioLearningRegistry,
  getCrossScenarioLearningRegistrySnapshot,
} from "./crossScenarioLearningRegistry.ts";
import type {
  CrossScenarioLearningDependencyValidationReport,
  CrossScenarioLearningFutureCompatibility,
  CrossScenarioLearningPlatformIdentity,
  CrossScenarioLearningPlatformValidationReport,
  CrossScenarioLearningValidationResult,
  LearningCandidate,
  LearningContext,
  LearningMetadata,
  LearningSession,
  LearningSource,
  ScenarioSnapshot,
} from "./crossScenarioLearningTypes.ts";
import {
  validateLearningCandidateContractShape,
  validateLearningContextContractShape,
  validateLearningSessionContractShape,
  validatePlatformIdentity,
  validateScenarioSnapshotContractShape,
  validateSessionIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
} from "./crossScenarioLearningValidation.ts";

export type { CrossScenarioLearningPlatformManifest } from "./crossScenarioLearningTypes.ts";

export const CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY: CrossScenarioLearningPlatformIdentity = Object.freeze({
  appId: "APP-10",
  title: "Cross-Scenario Learning",
  platformId: "cross-scenario-learning-platform",
  version: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION,
});

export const CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "components/",
  ".tsx",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "clustering",
  "similarityEngine",
  "recommendationEngine",
  "openai",
  "prompt(",
  "predict(",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/1",
  title: "Cross-Scenario Learning Platform Foundation",
  goal: "Immutable APP-10 architecture foundation — learning contracts, registry, dependency validation, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningConstants.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningTypes.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningValidation.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningRegistry.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningFoundation.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningContracts.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningRunner.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningFoundation.test.ts",
    "docs/app-10-1-cross-scenario-learning-foundation.md",
  ]),
  forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-1",
    "APP-2",
    "APP-3",
    "APP-4",
    "APP-5",
    "APP-6",
    "APP-7",
    "APP-8",
    "APP-9",
    "DS",
    "INT",
  ]),
  runtimePath: "library-only" as const,
  tags: CROSS_SCENARIO_LEARNING_PLATFORM_TAGS,
} satisfies StageManifest);

export const CROSS_SCENARIO_LEARNING_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  noMachineLearning: true,
  noSimilarityEngine: true,
  noRecommendationEngine: true,
  noEmbeddings: true,
  noVectorSearch: true,
  noStatisticalPrediction: true,
  consumerOnly: true,
} as const);

export const CROSS_SCENARIO_LEARNING_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noMachineLearning: true,
  noSimilarityEngine: true,
  noRecommendationEngine: true,
  noRuntime: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  consumerOnly: true,
  metadataOnly: true,
} as const);

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

function createLearningMetadata(timestamp: string = DEFAULT_TIME): LearningMetadata {
  void timestamp;
  return Object.freeze({
    metadataVersion: "APP-10/1",
    owner: "cross-scenario-learning-platform-foundation",
    extensions: Object.freeze({ reviewCycle: "quarterly" }),
    readOnly: true as const,
  });
}

export function resolveLearningSourceExample(timestamp: string = DEFAULT_TIME): LearningSource {
  void timestamp;
  return Object.freeze({
    sourceId: "learning-source-scenario-expansion-001",
    sourceType: "completed_scenario",
    platformId: "scenario-timeline-platform",
    appId: "APP-5",
    referenceId: "scenario-expansion-001",
    label: "Completed Expansion Scenario",
    description: "Reference to a completed scenario used as a deterministic learning source.",
    consumerOnly: true as const,
    metadata: createLearningMetadata(timestamp),
    readOnly: true as const,
  });
}

export function resolveScenarioSnapshotExample(timestamp: string = DEFAULT_TIME): ScenarioSnapshot {
  return Object.freeze({
    snapshotId: "scenario-snapshot-expansion-001",
    workspaceId: "ws-cross-scenario-learning-001",
    scenarioId: "scenario-expansion-001",
    scenarioTitle: "Market Expansion Strategy",
    completionStatus: "completed",
    sourceType: "completed_scenario",
    sourceReferenceId: "scenario-expansion-001",
    outcomeSummary: "Expansion achieved target revenue with moderated risk exposure.",
    strategySummary: "Phased regional rollout with partner-led distribution.",
    metadata: createLearningMetadata(timestamp),
    capturedAt: timestamp,
    version: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function resolveLearningCandidateExample(timestamp: string = DEFAULT_TIME): LearningCandidate {
  return Object.freeze({
    candidateId: "learning-candidate-expansion-001",
    workspaceId: "ws-cross-scenario-learning-001",
    sessionId: "cross-scenario-learning-ws-001",
    snapshotId: "scenario-snapshot-expansion-001",
    sourceType: "completed_scenario",
    status: "registered",
    label: "Expansion Strategy Candidate",
    description: "Registered learning candidate from completed expansion scenario.",
    metadata: createLearningMetadata(timestamp),
    registeredAt: timestamp,
    version: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function resolveLearningContextExample(timestamp: string = DEFAULT_TIME): LearningContext {
  return Object.freeze({
    contextId: "learning-context-ws-001",
    workspaceId: "ws-cross-scenario-learning-001",
    sessionId: "cross-scenario-learning-ws-001",
    sourceTypes: Object.freeze(["completed_scenario", "final_outcome", "confidence_evolution"]),
    scope: "workspace",
    metadata: createLearningMetadata(timestamp),
    createdAt: timestamp,
    version: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function resolveLearningSessionExample(timestamp: string = DEFAULT_TIME): LearningSession {
  return Object.freeze({
    sessionId: "cross-scenario-learning-ws-001",
    workspaceId: "ws-cross-scenario-learning-001",
    status: "draft",
    label: "Executive Cross-Scenario Learning Session",
    description: "Foundation session for deterministic cross-scenario learning registration.",
    sourceTypes: Object.freeze(["completed_scenario", "executive_decision", "confidence_evolution"]),
    metadata: createLearningMetadata(timestamp),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

const CERTIFIED_APP_IDENTITY_PRESENT: Readonly<Record<string, boolean>> = Object.freeze({
  "APP-5": SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5",
  "APP-6": DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6",
  "APP-7": BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7",
  "APP-8": DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8",
  "APP-9": CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9",
});

export function validateCrossScenarioLearningDependencies(): CrossScenarioLearningDependencyValidationReport {
  const dependencies = CROSS_SCENARIO_LEARNING_CERTIFIED_DEPENDENCIES.map((dependency) => {
    const present = CERTIFIED_APP_IDENTITY_PRESENT[dependency.appId] === true;
    return Object.freeze({
      appId: dependency.appId,
      platformId: dependency.platformId,
      present,
      consumerOnly: true as const,
      readOnly: true as const,
    });
  });
  const issues = dependencies
    .filter((entry) => !entry.present)
    .map((entry) =>
      Object.freeze({
        code: "missing_dependency",
        message: `Certified dependency missing: ${entry.appId} (${entry.platformId}).`,
        field: entry.appId,
        readOnly: true as const,
      })
    );
  return Object.freeze({
    valid: issues.length === 0,
    dependencies: Object.freeze(dependencies),
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export function getCrossScenarioLearningContractVersionMetadata(): Readonly<{
  contractVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION;
}> {
  return Object.freeze({
    contractVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    architectureVersion: CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION,
  });
}

export function getCrossScenarioLearningFutureCompatibility(): CrossScenarioLearningFutureCompatibility {
  return CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY;
}

export function buildCrossScenarioLearningManifest(
  stageManifest: StageManifest,
  timestamp: string
): CrossScenarioLearningPlatformManifest {
  void timestamp;
  const registry = getCrossScenarioLearningRegistry();
  return Object.freeze({
    manifestVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    architectureVersion: CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION,
    stageManifest,
    releaseMetadata: CROSS_SCENARIO_LEARNING_RELEASE_METADATA,
    certificationMetadata: CROSS_SCENARIO_LEARNING_CERTIFICATION_METADATA,
    futureCompatibility: CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY,
    extensionRegistry: CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY,
    metadataExtensionRegistry: CROSS_SCENARIO_LEARNING_METADATA_EXTENSION_REGISTRY,
    compatibilityRegistry: CROSS_SCENARIO_LEARNING_COMPATIBILITY_REGISTRY,
    consumerRegistry: CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY,
    futureEngineRegistry: CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY,
    futureApiRegistry: CROSS_SCENARIO_LEARNING_FUTURE_API_REGISTRY,
    certifiedDependencies: CROSS_SCENARIO_LEARNING_CERTIFIED_DEPENDENCIES,
    platformCapabilities: CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES,
    platformPrinciples: CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES,
    registrySnapshot: getCrossScenarioLearningRegistrySnapshot(),
    dependencyValidation: validateCrossScenarioLearningDependencies(),
    platformInitialized: isCrossScenarioLearningPlatformInitialized(),
    readOnly: true as const,
  });
}

export function validateCrossScenarioLearningManifest(
  manifest: CrossScenarioLearningPlatformManifest
): CrossScenarioLearningValidationResult {
  const stageValidation = validateStageManifest(manifest.stageManifest);
  const issues = [...stageValidation.issues.map((entry) =>
    Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const })
  )];
  if (manifest.manifestVersion !== CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_manifest",
        message: "Manifest version mismatch.",
        field: "manifestVersion",
        readOnly: true as const,
      })
    );
  }
  if (!manifest.dependencyValidation.valid) {
    issues.push(...manifest.dependencyValidation.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function getCrossScenarioLearningManifest(
  timestamp: string = DEFAULT_TIME
): CrossScenarioLearningPlatformManifest {
  if (!isCrossScenarioLearningPlatformInitialized()) {
    buildCrossScenarioLearningFoundation(timestamp);
  }
  return buildCrossScenarioLearningManifest(CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST, timestamp);
}

export function validateCrossScenarioLearningFoundation(
  timestamp: string = DEFAULT_TIME
): CrossScenarioLearningPlatformValidationReport {
  const issues: CrossScenarioLearningPlatformValidationReport["issues"] = [];

  const identityValidation = validatePlatformIdentity(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY);
  if (!identityValidation.valid) {
    issues.push(...identityValidation.issues);
  }

  const versionValidation = validateVersionCompatibility(CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isCrossScenarioLearningPlatformInitialized()) {
    buildCrossScenarioLearningFoundation(timestamp);
  }

  const manifest = buildCrossScenarioLearningManifest(CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST, timestamp);
  const manifestValidation = validateCrossScenarioLearningManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }

  const dependencyValidation = validateCrossScenarioLearningDependencies();
  if (!dependencyValidation.valid) {
    issues.push(...dependencyValidation.issues);
  }

  const snapshotValidation = validateScenarioSnapshotContractShape(resolveScenarioSnapshotExample(timestamp));
  if (!snapshotValidation.valid) {
    issues.push(...snapshotValidation.issues);
  }

  const candidateValidation = validateLearningCandidateContractShape(resolveLearningCandidateExample(timestamp));
  if (!candidateValidation.valid) {
    issues.push(...candidateValidation.issues);
  }

  const contextValidation = validateLearningContextContractShape(resolveLearningContextExample(timestamp));
  if (!contextValidation.valid) {
    issues.push(...contextValidation.issues);
  }

  const sessionValidation = validateLearningSessionContractShape(resolveLearningSessionExample(timestamp));
  if (!sessionValidation.valid) {
    issues.push(...sessionValidation.issues);
  }

  const sessionIdentityValidation = validateSessionIdentity("cross-scenario-learning-ws-001");
  if (!sessionIdentityValidation.valid) {
    issues.push(...sessionIdentityValidation.issues);
  }

  const workspaceIsolationValidation = validateWorkspaceIsolation(
    "ws-cross-scenario-learning-001",
    "ws-cross-scenario-learning-001"
  );
  if (!workspaceIsolationValidation.valid) {
    issues.push(...workspaceIsolationValidation.issues);
  }

  const registry = getCrossScenarioLearningRegistrySnapshot();
  if (registry.registryVersion.trim().length === 0) {
    issues.push(
      Object.freeze({
        code: "invalid_registry",
        message: "Registry version is missing.",
        field: "registryVersion",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    platformInitialized: isCrossScenarioLearningPlatformInitialized(),
    registryValid: registry.sourceTypeCount === CROSS_SCENARIO_LEARNING_SOURCE_KEYS.length,
    manifestValid: manifestValidation.valid,
    compatibilityValid: CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.metadataOnly === true,
    dependencyValid: dependencyValidation.valid,
    workspaceIsolationValid: workspaceIsolationValidation.valid,
    sessionIdentityValid: sessionIdentityValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export {
  buildCrossScenarioLearningFoundation,
  createCrossScenarioLearningFoundation,
  isCrossScenarioLearningPlatformInitialized as isCrossScenarioLearningReady,
} from "./crossScenarioLearningFoundation.ts";
export { registerLearningSession, registerLearningCandidate } from "./crossScenarioLearningRegistry.ts";

export const CrossScenarioLearningPlatformContract = Object.freeze({
  resolveLearningSourceExample,
  resolveScenarioSnapshotExample,
  resolveLearningCandidateExample,
  resolveLearningContextExample,
  resolveLearningSessionExample,
  validateCrossScenarioLearningFoundation,
  validateCrossScenarioLearningDependencies,
  getCrossScenarioLearningManifest,
  getCrossScenarioLearningContractVersionMetadata,
  getCrossScenarioLearningFutureCompatibility,
  identity: CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY,
  version: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  tags: CROSS_SCENARIO_LEARNING_PLATFORM_TAGS,
  mustNotOwn: CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
  principles: CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES,
});

export {
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_TAGS,
  CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
  CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY,
  CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES,
  CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
  getCrossScenarioLearningRegistry,
};

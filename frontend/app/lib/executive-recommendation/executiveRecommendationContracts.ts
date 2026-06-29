/**
 * APP-12:1 — Executive Recommendation Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { SCENARIO_INTELLIGENCE_IDENTITY } from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { EXECUTIVE_INBOX_PLATFORM_ID } from "../executive-inbox/executiveInboxConstants.ts";
import { EXECUTIVE_INTENT_IDENTITY } from "../executiveIntent/executiveIntentContract.ts";
import { EXECUTIVE_MEMORY_IDENTITY } from "../executiveMemory/executiveMemoryContracts.ts";
import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "../executive-time/executiveTimeContract.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  EXECUTIVE_RECOMMENDATION_CERTIFICATION_METADATA,
  EXECUTIVE_RECOMMENDATION_CERTIFIED_DEPENDENCIES,
  EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY,
  EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY,
  EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
  EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY,
  EXECUTIVE_RECOMMENDATION_FUTURE_API_REGISTRY,
  EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY,
  EXECUTIVE_RECOMMENDATION_FUTURE_ENGINE_REGISTRY,
  EXECUTIVE_RECOMMENDATION_METADATA_EXTENSION_REGISTRY,
  EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
  EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_TAGS,
  EXECUTIVE_RECOMMENDATION_RELEASE_METADATA,
  EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY,
} from "./executiveRecommendationConstants.ts";
import {
  buildExecutiveRecommendationFoundation,
  createExecutiveRecommendationFoundation,
  isExecutiveRecommendationPlatformInitialized,
} from "./executiveRecommendationFoundation.ts";
import {
  getExecutiveRecommendationRegistry,
  getExecutiveRecommendationRegistrySnapshot,
} from "./executiveRecommendationRegistry.ts";
import type {
  ExecutiveRecommendationCandidate,
  ExecutiveRecommendationContext,
  ExecutiveRecommendationDependencyValidationReport,
  ExecutiveRecommendationFutureCompatibility,
  ExecutiveRecommendationManifest,
  ExecutiveRecommendationMetadata,
  ExecutiveRecommendationPlatformIdentity,
  ExecutiveRecommendationValidationIssue,
  ExecutiveRecommendationPlatformValidationReport,
  ExecutiveRecommendationRequest,
  ExecutiveRecommendationSession,
  ExecutiveRecommendationSourceProvider,
  ExecutiveRecommendationValidationResult,
} from "./executiveRecommendationTypes.ts";
import {
  validateExecutiveRecommendationCandidateContractShape,
  validateExecutiveRecommendationContextContractShape,
  validateExecutiveRecommendationRequestContractShape,
  validateExecutiveRecommendationSessionContractShape,
  validateExecutiveRecommendationSourceProviderContractShape,
  validatePlatformIdentity,
  validateSessionIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
} from "./executiveRecommendationValidation.ts";

export type { ExecutiveRecommendationManifest };

export const EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY: ExecutiveRecommendationPlatformIdentity = Object.freeze({
  appId: "APP-12",
  title: "Executive Recommendation",
  platformId: "executive-recommendation-platform",
  version: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "components/",
  ".tsx",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "openai",
  "prompt(",
  "predict(",
  "generateRecommendation",
  "scoreRecommendation",
  "rankRecommendation",
  "optimizeRecommendation",
  "executeRecommendation",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/1",
  title: "Executive Recommendation Platform Foundation",
  goal: "Immutable APP-12 architecture foundation — recommendation contracts, registry, dependency validation, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executive-recommendation/executiveRecommendationConstants.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationValidation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationRegistry.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationFoundation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationContracts.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationFoundation.test.ts",
    "docs/app-12-1-executive-recommendation-foundation.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_PATTERNS,
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
    "APP-10",
    "APP-11",
    "DS",
    "INT",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RECOMMENDATION_PLATFORM_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_RECOMMENDATION_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  noRecommendationGeneration: true,
  noRecommendationScoring: true,
  noRecommendationExecution: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  consumerOnly: true,
} as const);

export const EXECUTIVE_RECOMMENDATION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noRecommendationGeneration: true,
  noRecommendationScoring: true,
  noRecommendationExecution: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  noRuntime: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  consumerOnly: true,
  metadataOnly: true,
} as const);

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

function createExecutiveRecommendationMetadata(timestamp: string = DEFAULT_TIME): ExecutiveRecommendationMetadata {
  void timestamp;
  return Object.freeze({
    metadataVersion: "APP-12/1",
    owner: "executive-recommendation-platform-foundation",
    extensions: Object.freeze({ advisoryCycle: "weekly" }),
    readOnly: true as const,
  });
}

export function resolveExecutiveRecommendationSourceProviderExample(
  timestamp: string = DEFAULT_TIME
): ExecutiveRecommendationSourceProvider {
  void timestamp;
  return Object.freeze({
    providerId: "scenario-intelligence-provider",
    label: "Scenario Intelligence Provider",
    platformId: "scenario-intelligence-platform",
    appId: "APP-2",
    consumerOnly: true as const,
    metadata: createExecutiveRecommendationMetadata(timestamp),
    readOnly: true as const,
  });
}

export function resolveExecutiveRecommendationRequestExample(
  timestamp: string = DEFAULT_TIME
): ExecutiveRecommendationRequest {
  return Object.freeze({
    requestId: "recommendation-request-strategic-001",
    workspaceId: "ws-executive-recommendation-001",
    sessionId: "executive-recommendation-ws-001",
    domain: "strategic",
    label: "Strategic Portfolio Review",
    description: "Executive recommendation request for strategic portfolio advisory context.",
    metadata: createExecutiveRecommendationMetadata(timestamp),
    createdAt: timestamp,
    version: "APP-12/1",
    readOnly: true as const,
  });
}

export function resolveExecutiveRecommendationCandidateExample(
  timestamp: string = DEFAULT_TIME
): ExecutiveRecommendationCandidate {
  return Object.freeze({
    candidateId: "recommendation-candidate-strategic-001",
    workspaceId: "ws-executive-recommendation-001",
    sessionId: "executive-recommendation-ws-001",
    domain: "strategic",
    sourceProviderId: "scenario-intelligence-provider",
    sourceReferenceId: "scenario-strategic-001",
    status: "registered",
    label: "Review Strategic Scenario Options",
    description: "Registered executive recommendation candidate referencing certified scenario intelligence.",
    metadata: createExecutiveRecommendationMetadata(timestamp),
    registeredAt: timestamp,
    version: "APP-12/1",
    readOnly: true as const,
  });
}

export function resolveExecutiveRecommendationContextExample(
  timestamp: string = DEFAULT_TIME
): ExecutiveRecommendationContext {
  return Object.freeze({
    contextId: "recommendation-context-ws-001",
    workspaceId: "ws-executive-recommendation-001",
    sessionId: "executive-recommendation-ws-001",
    domains: Object.freeze(["strategic", "risk", "scenario"] as const),
    scope: "workspace",
    metadata: createExecutiveRecommendationMetadata(timestamp),
    createdAt: timestamp,
    version: "APP-12/1",
    readOnly: true as const,
  });
}

export function resolveExecutiveRecommendationSessionExample(
  timestamp: string = DEFAULT_TIME
): ExecutiveRecommendationSession {
  return Object.freeze({
    sessionId: "executive-recommendation-ws-001",
    workspaceId: "ws-executive-recommendation-001",
    status: "draft",
    label: "Executive Advisory Session",
    description: "Workspace-scoped executive recommendation session for certified source registration.",
    domains: Object.freeze(["strategic", "risk", "financial"] as const),
    metadata: createExecutiveRecommendationMetadata(timestamp),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: "APP-12/1",
    readOnly: true as const,
  });
}

const CERTIFIED_APP_IDENTITY_PRESENT: Readonly<Record<string, boolean>> = Object.freeze({
  "APP-1": EXECUTIVE_TIME_FOUNDATION_VERSION.startsWith("APP-1"),
  "APP-2": SCENARIO_INTELLIGENCE_IDENTITY.appId === "APP-2",
  "APP-3": EXECUTIVE_INTENT_IDENTITY.appId === "APP-3",
  "APP-4": EXECUTIVE_MEMORY_IDENTITY.appId === "APP-4",
  "APP-5": SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5",
  "APP-6": DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6",
  "APP-7": BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7",
  "APP-8": DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8",
  "APP-9": CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9",
  "APP-10": CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
  "APP-11": EXECUTIVE_INBOX_PLATFORM_ID === "executive-inbox-platform",
  DS: true,
  INT: true,
});

export function validateExecutiveRecommendationDependencies(): ExecutiveRecommendationDependencyValidationReport {
  const dependencies = EXECUTIVE_RECOMMENDATION_CERTIFIED_DEPENDENCIES.map((dependency) => {
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

export function getExecutiveRecommendationContractVersionMetadata(): Readonly<{
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION;
}> {
  return Object.freeze({
    contractVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
    architectureVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION,
  });
}

export function getExecutiveRecommendationFutureCompatibility(): ExecutiveRecommendationFutureCompatibility {
  return EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY;
}

export function buildExecutiveRecommendationManifest(
  stageManifest: StageManifest,
  timestamp: string
): ExecutiveRecommendationManifest {
  void timestamp;
  return Object.freeze({
    manifestVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
    architectureVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION,
    stageManifest,
    releaseMetadata: EXECUTIVE_RECOMMENDATION_RELEASE_METADATA,
    certificationMetadata: EXECUTIVE_RECOMMENDATION_CERTIFICATION_METADATA,
    futureCompatibility: EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY,
    extensionRegistry: EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY,
    metadataExtensionRegistry: EXECUTIVE_RECOMMENDATION_METADATA_EXTENSION_REGISTRY,
    compatibilityRegistry: EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY,
    consumerRegistry: EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY,
    sourceProviderRegistry: EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY,
    futureEngineRegistry: EXECUTIVE_RECOMMENDATION_FUTURE_ENGINE_REGISTRY,
    futureApiRegistry: EXECUTIVE_RECOMMENDATION_FUTURE_API_REGISTRY,
    certifiedDependencies: EXECUTIVE_RECOMMENDATION_CERTIFIED_DEPENDENCIES,
    platformCapabilities: EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES,
    platformPrinciples: EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES,
    supportedDomains: EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
    registrySnapshot: getExecutiveRecommendationRegistrySnapshot(),
    dependencyValidation: validateExecutiveRecommendationDependencies(),
    platformInitialized: isExecutiveRecommendationPlatformInitialized(),
    readOnly: true as const,
  });
}

export function validateExecutiveRecommendationManifest(
  manifest: ExecutiveRecommendationManifest
): ExecutiveRecommendationValidationResult {
  const stageValidation = validateStageManifest(manifest.stageManifest);
  const issues = [...stageValidation.issues.map((entry) =>
    Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const })
  )];
  if (manifest.manifestVersion !== EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION) {
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

export function getExecutiveRecommendationManifest(timestamp: string = DEFAULT_TIME): ExecutiveRecommendationManifest {
  if (!isExecutiveRecommendationPlatformInitialized()) {
    buildExecutiveRecommendationFoundation(timestamp);
  }
  return buildExecutiveRecommendationManifest(EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST, timestamp);
}

export function validateExecutiveRecommendationFoundation(
  timestamp: string = DEFAULT_TIME
): ExecutiveRecommendationPlatformValidationReport {
  const issues: ExecutiveRecommendationValidationIssue[] = [];

  const identityValidation = validatePlatformIdentity(EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY);
  if (!identityValidation.valid) {
    issues.push(...identityValidation.issues);
  }

  const versionValidation = validateVersionCompatibility(EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isExecutiveRecommendationPlatformInitialized()) {
    buildExecutiveRecommendationFoundation(timestamp);
  }

  const manifest = buildExecutiveRecommendationManifest(EXECUTIVE_RECOMMENDATION_PLATFORM_SELF_MANIFEST, timestamp);
  const manifestValidation = validateExecutiveRecommendationManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }

  const dependencyValidation = validateExecutiveRecommendationDependencies();
  if (!dependencyValidation.valid) {
    issues.push(...dependencyValidation.issues);
  }

  const requestValidation = validateExecutiveRecommendationRequestContractShape(
    resolveExecutiveRecommendationRequestExample(timestamp)
  );
  if (!requestValidation.valid) {
    issues.push(...requestValidation.issues);
  }

  const contextValidation = validateExecutiveRecommendationContextContractShape(
    resolveExecutiveRecommendationContextExample(timestamp)
  );
  if (!contextValidation.valid) {
    issues.push(...contextValidation.issues);
  }

  const sessionValidation = validateExecutiveRecommendationSessionContractShape(
    resolveExecutiveRecommendationSessionExample(timestamp)
  );
  if (!sessionValidation.valid) {
    issues.push(...sessionValidation.issues);
  }

  const candidateValidation = validateExecutiveRecommendationCandidateContractShape(
    resolveExecutiveRecommendationCandidateExample(timestamp)
  );
  if (!candidateValidation.valid) {
    issues.push(...candidateValidation.issues);
  }

  const providerValidation = validateExecutiveRecommendationSourceProviderContractShape(
    resolveExecutiveRecommendationSourceProviderExample(timestamp)
  );
  if (!providerValidation.valid) {
    issues.push(...providerValidation.issues);
  }

  const sessionIdentityValidation = validateSessionIdentity("executive-recommendation-ws-001");
  if (!sessionIdentityValidation.valid) {
    issues.push(...sessionIdentityValidation.issues);
  }

  const workspaceIsolationValidation = validateWorkspaceIsolation(
    "ws-executive-recommendation-001",
    "ws-executive-recommendation-001"
  );
  if (!workspaceIsolationValidation.valid) {
    issues.push(...workspaceIsolationValidation.issues);
  }

  const registry = getExecutiveRecommendationRegistrySnapshot();
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
    platformInitialized: isExecutiveRecommendationPlatformInitialized(),
    registryValid: registry.domainCount === EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS.length,
    manifestValid: manifestValidation.valid,
    compatibilityValid: EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY.metadataOnly === true,
    dependencyValid: dependencyValidation.valid,
    workspaceIsolationValid: workspaceIsolationValidation.valid,
    sessionIdentityValid: sessionIdentityValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export {
  buildExecutiveRecommendationFoundation,
  createExecutiveRecommendationFoundation,
  isExecutiveRecommendationPlatformInitialized as isExecutiveRecommendationReady,
} from "./executiveRecommendationFoundation.ts";
export {
  registerExecutiveRecommendationSession,
  registerExecutiveRecommendationCandidate,
} from "./executiveRecommendationRegistry.ts";

export const ExecutiveRecommendationPlatformContract = Object.freeze({
  resolveExecutiveRecommendationSourceProviderExample,
  resolveExecutiveRecommendationRequestExample,
  resolveExecutiveRecommendationCandidateExample,
  resolveExecutiveRecommendationContextExample,
  resolveExecutiveRecommendationSessionExample,
  validateExecutiveRecommendationFoundation,
  validateExecutiveRecommendationDependencies,
  getExecutiveRecommendationManifest,
  getExecutiveRecommendationContractVersionMetadata,
  getExecutiveRecommendationFutureCompatibility,
  identity: EXECUTIVE_RECOMMENDATION_PLATFORM_IDENTITY,
  version: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  tags: EXECUTIVE_RECOMMENDATION_PLATFORM_TAGS,
  mustNotOwn: EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
  principles: EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES,
});

export {
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_TAGS,
  EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
  EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY,
  EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES,
  EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
  getExecutiveRecommendationRegistry,
};

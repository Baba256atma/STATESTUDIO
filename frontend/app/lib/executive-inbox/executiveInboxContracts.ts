/**
 * APP-11:1 — Executive Inbox Platform contracts.
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
import { EXECUTIVE_INTENT_IDENTITY } from "../executiveIntent/executiveIntentContract.ts";
import { EXECUTIVE_MEMORY_IDENTITY } from "../executiveMemory/executiveMemoryContracts.ts";
import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "../executive-time/executiveTimeContract.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  EXECUTIVE_INBOX_CERTIFICATION_METADATA,
  EXECUTIVE_INBOX_CERTIFIED_DEPENDENCIES,
  EXECUTIVE_INBOX_COMPATIBILITY_REGISTRY,
  EXECUTIVE_INBOX_CONSUMER_REGISTRY,
  EXECUTIVE_INBOX_EXTENSION_REGISTRY,
  EXECUTIVE_INBOX_FUTURE_API_REGISTRY,
  EXECUTIVE_INBOX_FUTURE_COMPATIBILITY,
  EXECUTIVE_INBOX_FUTURE_ENGINE_REGISTRY,
  EXECUTIVE_INBOX_METADATA_EXTENSION_REGISTRY,
  EXECUTIVE_INBOX_MUST_NOT_OWN,
  EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION,
  EXECUTIVE_INBOX_PLATFORM_CAPABILITIES,
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_PRINCIPLES,
  EXECUTIVE_INBOX_PLATFORM_TAGS,
  EXECUTIVE_INBOX_RELEASE_METADATA,
  EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY,
  EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
} from "./executiveInboxConstants.ts";
import {
  buildExecutiveInboxFoundation,
  createExecutiveInboxFoundation,
  isExecutiveInboxPlatformInitialized,
} from "./executiveInboxFoundation.ts";
import {
  getExecutiveInboxRegistry,
  getExecutiveInboxRegistrySnapshot,
} from "./executiveInboxRegistry.ts";
import type {
  ExecutiveInboxContext,
  ExecutiveInboxDependencyValidationReport,
  ExecutiveInboxFutureCompatibility,
  ExecutiveInboxItem,
  ExecutiveInboxManifest,
  ExecutiveInboxMetadata,
  ExecutiveInboxPlatformIdentity,
  ExecutiveInboxPlatformValidationReport,
  ExecutiveInboxSession,
  ExecutiveInboxSource,
  ExecutiveInboxValidationResult,
} from "./executiveInboxTypes.ts";
import {
  validateExecutiveInboxContextContractShape,
  validateExecutiveInboxItemContractShape,
  validateExecutiveInboxSessionContractShape,
  validateExecutiveInboxSourceContractShape,
  validatePlatformIdentity,
  validateSessionIdentity,
  validateVersionCompatibility,
  validateWorkspaceIsolation,
} from "./executiveInboxValidation.ts";

export type { ExecutiveInboxManifest };

export const EXECUTIVE_INBOX_PLATFORM_IDENTITY: ExecutiveInboxPlatformIdentity = Object.freeze({
  appId: "APP-11",
  title: "Executive Inbox",
  platformId: "executive-inbox-platform",
  version: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "components/",
  ".tsx",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "openai",
  "prompt(",
  "predict(",
  "aggregateInbox",
  "prioritizeInbox",
  "sendNotification",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "APP-11/1",
  title: "Executive Inbox Platform Foundation",
  goal: "Immutable APP-11 architecture foundation — inbox contracts, registry, dependency validation, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executive-inbox/executiveInboxConstants.ts",
    "frontend/app/lib/executive-inbox/executiveInboxTypes.ts",
    "frontend/app/lib/executive-inbox/executiveInboxValidation.ts",
    "frontend/app/lib/executive-inbox/executiveInboxRegistry.ts",
    "frontend/app/lib/executive-inbox/executiveInboxFoundation.ts",
    "frontend/app/lib/executive-inbox/executiveInboxContracts.ts",
    "frontend/app/lib/executive-inbox/executiveInboxRunner.ts",
    "frontend/app/lib/executive-inbox/executiveInboxFoundation.test.ts",
    "docs/app-11-1-executive-inbox-foundation.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_PATTERNS,
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
    "DS",
    "INT",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INBOX_PLATFORM_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_INBOX_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  noInboxAggregation: true,
  noPrioritization: true,
  noNotificationDelivery: true,
  noWorkflowExecution: true,
  noMachineLearning: true,
  consumerOnly: true,
} as const);

export const EXECUTIVE_INBOX_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noInboxAggregation: true,
  noPrioritization: true,
  noNotificationDelivery: true,
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

function createExecutiveInboxMetadata(timestamp: string = DEFAULT_TIME): ExecutiveInboxMetadata {
  void timestamp;
  return Object.freeze({
    metadataVersion: "APP-11/1",
    owner: "executive-inbox-platform-foundation",
    extensions: Object.freeze({ reviewCycle: "daily" }),
    readOnly: true as const,
  });
}

export function resolveExecutiveInboxSourceExample(timestamp: string = DEFAULT_TIME): ExecutiveInboxSource {
  void timestamp;
  return Object.freeze({
    sourceId: "inbox-source-scenario-expansion-001",
    sourceType: "scenario",
    platformId: "scenario-timeline-platform",
    appId: "APP-5",
    referenceId: "scenario-expansion-001",
    label: "Scenario Attention Item",
    description: "Reference to a certified scenario item for executive inbox attention.",
    consumerOnly: true as const,
    metadata: createExecutiveInboxMetadata(timestamp),
    readOnly: true as const,
  });
}

export function resolveExecutiveInboxItemExample(timestamp: string = DEFAULT_TIME): ExecutiveInboxItem {
  return Object.freeze({
    itemId: "inbox-item-scenario-expansion-001",
    workspaceId: "ws-executive-inbox-001",
    sessionId: "executive-inbox-ws-001",
    sourceType: "scenario",
    sourceReferenceId: "scenario-expansion-001",
    status: "registered",
    label: "Review Expansion Scenario Outcome",
    description: "Registered executive inbox item referencing a certified scenario source.",
    metadata: createExecutiveInboxMetadata(timestamp),
    registeredAt: timestamp,
    version: "APP-11/1",
    readOnly: true as const,
  });
}

export function resolveExecutiveInboxContextExample(timestamp: string = DEFAULT_TIME): ExecutiveInboxContext {
  return Object.freeze({
    contextId: "inbox-context-ws-001",
    workspaceId: "ws-executive-inbox-001",
    sessionId: "executive-inbox-ws-001",
    sourceTypes: Object.freeze(["scenario", "decision", "timeline"] as const),
    scope: "workspace",
    metadata: createExecutiveInboxMetadata(timestamp),
    createdAt: timestamp,
    version: "APP-11/1",
    readOnly: true as const,
  });
}

export function resolveExecutiveInboxSessionExample(timestamp: string = DEFAULT_TIME): ExecutiveInboxSession {
  return Object.freeze({
    sessionId: "executive-inbox-ws-001",
    workspaceId: "ws-executive-inbox-001",
    status: "draft",
    label: "Executive Attention Session",
    description: "Workspace-scoped executive inbox session for certified source registration.",
    sourceTypes: Object.freeze(["scenario", "decision", "recommendation"] as const),
    metadata: createExecutiveInboxMetadata(timestamp),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: "APP-11/1",
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
  DS: true,
  INT: true,
});

export function validateExecutiveInboxDependencies(): ExecutiveInboxDependencyValidationReport {
  const dependencies = EXECUTIVE_INBOX_CERTIFIED_DEPENDENCIES.map((dependency) => {
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

export function getExecutiveInboxContractVersionMetadata(): Readonly<{
  contractVersion: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION;
}> {
  return Object.freeze({
    contractVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
    architectureVersion: EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION,
  });
}

export function getExecutiveInboxFutureCompatibility(): ExecutiveInboxFutureCompatibility {
  return EXECUTIVE_INBOX_FUTURE_COMPATIBILITY;
}

export function buildExecutiveInboxManifest(
  stageManifest: StageManifest,
  timestamp: string
): ExecutiveInboxManifest {
  void timestamp;
  return Object.freeze({
    manifestVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
    architectureVersion: EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION,
    stageManifest,
    releaseMetadata: EXECUTIVE_INBOX_RELEASE_METADATA,
    certificationMetadata: EXECUTIVE_INBOX_CERTIFICATION_METADATA,
    futureCompatibility: EXECUTIVE_INBOX_FUTURE_COMPATIBILITY,
    extensionRegistry: EXECUTIVE_INBOX_EXTENSION_REGISTRY,
    metadataExtensionRegistry: EXECUTIVE_INBOX_METADATA_EXTENSION_REGISTRY,
    compatibilityRegistry: EXECUTIVE_INBOX_COMPATIBILITY_REGISTRY,
    consumerRegistry: EXECUTIVE_INBOX_CONSUMER_REGISTRY,
    sourceProviderRegistry: EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY,
    futureEngineRegistry: EXECUTIVE_INBOX_FUTURE_ENGINE_REGISTRY,
    futureApiRegistry: EXECUTIVE_INBOX_FUTURE_API_REGISTRY,
    certifiedDependencies: EXECUTIVE_INBOX_CERTIFIED_DEPENDENCIES,
    platformCapabilities: EXECUTIVE_INBOX_PLATFORM_CAPABILITIES,
    platformPrinciples: EXECUTIVE_INBOX_PLATFORM_PRINCIPLES,
    registrySnapshot: getExecutiveInboxRegistrySnapshot(),
    dependencyValidation: validateExecutiveInboxDependencies(),
    platformInitialized: isExecutiveInboxPlatformInitialized(),
    readOnly: true as const,
  });
}

export function validateExecutiveInboxManifest(manifest: ExecutiveInboxManifest): ExecutiveInboxValidationResult {
  const stageValidation = validateStageManifest(manifest.stageManifest);
  const issues = [...stageValidation.issues.map((entry) =>
    Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const })
  )];
  if (manifest.manifestVersion !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
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

export function getExecutiveInboxManifest(timestamp: string = DEFAULT_TIME): ExecutiveInboxManifest {
  if (!isExecutiveInboxPlatformInitialized()) {
    buildExecutiveInboxFoundation(timestamp);
  }
  return buildExecutiveInboxManifest(EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST, timestamp);
}

export function validateExecutiveInboxFoundation(
  timestamp: string = DEFAULT_TIME
): ExecutiveInboxPlatformValidationReport {
  const issues: ExecutiveInboxPlatformValidationReport["issues"] = [];

  const identityValidation = validatePlatformIdentity(EXECUTIVE_INBOX_PLATFORM_IDENTITY);
  if (!identityValidation.valid) {
    issues.push(...identityValidation.issues);
  }

  const versionValidation = validateVersionCompatibility(EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION);
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isExecutiveInboxPlatformInitialized()) {
    buildExecutiveInboxFoundation(timestamp);
  }

  const manifest = buildExecutiveInboxManifest(EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST, timestamp);
  const manifestValidation = validateExecutiveInboxManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }

  const dependencyValidation = validateExecutiveInboxDependencies();
  if (!dependencyValidation.valid) {
    issues.push(...dependencyValidation.issues);
  }

  const itemValidation = validateExecutiveInboxItemContractShape(resolveExecutiveInboxItemExample(timestamp));
  if (!itemValidation.valid) {
    issues.push(...itemValidation.issues);
  }

  const contextValidation = validateExecutiveInboxContextContractShape(resolveExecutiveInboxContextExample(timestamp));
  if (!contextValidation.valid) {
    issues.push(...contextValidation.issues);
  }

  const sessionValidation = validateExecutiveInboxSessionContractShape(resolveExecutiveInboxSessionExample(timestamp));
  if (!sessionValidation.valid) {
    issues.push(...sessionValidation.issues);
  }

  const sourceValidation = validateExecutiveInboxSourceContractShape(resolveExecutiveInboxSourceExample(timestamp));
  if (!sourceValidation.valid) {
    issues.push(...sourceValidation.issues);
  }

  const sessionIdentityValidation = validateSessionIdentity("executive-inbox-ws-001");
  if (!sessionIdentityValidation.valid) {
    issues.push(...sessionIdentityValidation.issues);
  }

  const workspaceIsolationValidation = validateWorkspaceIsolation("ws-executive-inbox-001", "ws-executive-inbox-001");
  if (!workspaceIsolationValidation.valid) {
    issues.push(...workspaceIsolationValidation.issues);
  }

  const registry = getExecutiveInboxRegistrySnapshot();
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
    platformInitialized: isExecutiveInboxPlatformInitialized(),
    registryValid: registry.sourceTypeCount === EXECUTIVE_INBOX_SOURCE_TYPE_KEYS.length,
    manifestValid: manifestValidation.valid,
    compatibilityValid: EXECUTIVE_INBOX_FUTURE_COMPATIBILITY.metadataOnly === true,
    dependencyValid: dependencyValidation.valid,
    workspaceIsolationValid: workspaceIsolationValidation.valid,
    sessionIdentityValid: sessionIdentityValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export {
  buildExecutiveInboxFoundation,
  createExecutiveInboxFoundation,
  isExecutiveInboxPlatformInitialized as isExecutiveInboxReady,
} from "./executiveInboxFoundation.ts";
export { registerExecutiveInboxSession, registerExecutiveInboxItem } from "./executiveInboxRegistry.ts";

export const ExecutiveInboxPlatformContract = Object.freeze({
  resolveExecutiveInboxSourceExample,
  resolveExecutiveInboxItemExample,
  resolveExecutiveInboxContextExample,
  resolveExecutiveInboxSessionExample,
  validateExecutiveInboxFoundation,
  validateExecutiveInboxDependencies,
  getExecutiveInboxManifest,
  getExecutiveInboxContractVersionMetadata,
  getExecutiveInboxFutureCompatibility,
  identity: EXECUTIVE_INBOX_PLATFORM_IDENTITY,
  version: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  tags: EXECUTIVE_INBOX_PLATFORM_TAGS,
  mustNotOwn: EXECUTIVE_INBOX_MUST_NOT_OWN,
  principles: EXECUTIVE_INBOX_PLATFORM_PRINCIPLES,
});

export {
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_TAGS,
  EXECUTIVE_INBOX_MUST_NOT_OWN,
  EXECUTIVE_INBOX_FUTURE_COMPATIBILITY,
  EXECUTIVE_INBOX_PLATFORM_PRINCIPLES,
  EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
  getExecutiveInboxRegistry,
};

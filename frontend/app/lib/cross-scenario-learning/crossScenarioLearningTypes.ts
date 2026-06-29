/**
 * APP-10:1 — Cross-Scenario Learning Platform domain types.
 * Immutable contract vocabulary — no learning algorithms, ML, or runtime execution.
 */

import type {
  CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS,
  CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
} from "./crossScenarioLearningConstants.ts";

export type LearningWorkspaceId = string;
export type LearningSessionId = string;
export type LearningCandidateId = string;
export type ScenarioSnapshotId = string;
export type LearningContextId = string;
export type ScenarioId = string;

export type LearningCertificationStatus = "pending" | "pass" | "fail";
export type LearningFreezeState = "open" | "frozen";
export type LearningArchitectureStatus = "build" | "certified";

export type LearningSourceType = (typeof CROSS_SCENARIO_LEARNING_SOURCE_KEYS)[number];
export type LearningCandidateStatus = (typeof CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS)[number];
export type LearningSessionStatus = (typeof CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS)[number];

export type CrossScenarioLearningPlatformIdentity = Readonly<{
  appId: "APP-10";
  title: "Cross-Scenario Learning";
  platformId: "cross-scenario-learning-platform";
  version: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  status: LearningArchitectureStatus;
  certificationStatus: LearningCertificationStatus;
  freezeState: LearningFreezeState;
  architectureVersion: string;
}>;

export type LearningMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type LearningSource = Readonly<{
  sourceId: string;
  sourceType: LearningSourceType;
  platformId: string;
  appId: string;
  referenceId: string;
  label: string;
  description: string;
  consumerOnly: true;
  metadata: LearningMetadata;
  readOnly: true;
}>;

export type ScenarioSnapshot = Readonly<{
  snapshotId: ScenarioSnapshotId;
  workspaceId: LearningWorkspaceId;
  scenarioId: ScenarioId;
  scenarioTitle: string;
  completionStatus: "completed" | "archived";
  sourceType: LearningSourceType;
  sourceReferenceId: string;
  outcomeSummary?: string;
  strategySummary?: string;
  metadata: LearningMetadata;
  capturedAt: string;
  version: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type LearningCandidate = Readonly<{
  candidateId: LearningCandidateId;
  workspaceId: LearningWorkspaceId;
  sessionId: LearningSessionId;
  snapshotId: ScenarioSnapshotId;
  sourceType: LearningSourceType;
  status: LearningCandidateStatus;
  label: string;
  description: string;
  metadata: LearningMetadata;
  registeredAt: string;
  version: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type LearningContext = Readonly<{
  contextId: LearningContextId;
  workspaceId: LearningWorkspaceId;
  sessionId: LearningSessionId;
  sourceTypes: readonly LearningSourceType[];
  scope: "workspace" | "portfolio";
  metadata: LearningMetadata;
  createdAt: string;
  version: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type LearningSession = Readonly<{
  sessionId: LearningSessionId;
  workspaceId: LearningWorkspaceId;
  status: LearningSessionStatus;
  label: string;
  description: string;
  sourceTypes: readonly LearningSourceType[];
  metadata: LearningMetadata;
  createdAt: string;
  updatedAt: string;
  version: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type LearningSessionRegistrationInput = Readonly<{
  sessionId: LearningSessionId;
  workspaceId: LearningWorkspaceId;
  label: string;
  description: string;
  sourceTypes: readonly LearningSourceType[];
}>;

export type LearningCandidateRegistrationInput = Readonly<{
  candidateId: LearningCandidateId;
  workspaceId: LearningWorkspaceId;
  sessionId: LearningSessionId;
  snapshotId: ScenarioSnapshotId;
  sourceType: LearningSourceType;
  label: string;
  description: string;
}>;

export type LearningMetadataExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  description: string;
}>;

export type LearningFutureExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
}>;

export type CrossScenarioLearningValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type CrossScenarioLearningValidationResult = Readonly<{
  valid: boolean;
  issues: readonly CrossScenarioLearningValidationIssue[];
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type CrossScenarioLearningRegistrySnapshot = Readonly<{
  registryVersion: string;
  sessionCount: number;
  candidateCount: number;
  sourceTypeCount: number;
  consumerCount: number;
  futureEngineCount: number;
  extensionCount: number;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformState = Readonly<{
  platformId: "cross-scenario-learning-platform";
  foundationVersion: string;
  contractVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  sessionCount: number;
  registeredSessionIds: readonly LearningSessionId[];
  supportedSourceTypes: readonly LearningSourceType[];
  supportedSessionStatuses: readonly LearningSessionStatus[];
  supportedCandidateStatuses: readonly LearningCandidateStatus[];
  timestamp: string;
  readOnly: true;
}>;

export type CrossScenarioLearningFutureCompatibility = typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY;

export type CrossScenarioLearningPlatformManifest = Readonly<{
  manifestVersion: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION;
  stageManifest: import("../stage/stageArchitectureTypes.ts").StageManifest;
  releaseMetadata: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_RELEASE_METADATA;
  certificationMetadata: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_CERTIFICATION_METADATA;
  futureCompatibility: CrossScenarioLearningFutureCompatibility;
  extensionRegistry: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY;
  metadataExtensionRegistry: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_METADATA_EXTENSION_REGISTRY;
  compatibilityRegistry: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_COMPATIBILITY_REGISTRY;
  consumerRegistry: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY;
  futureEngineRegistry: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY;
  futureApiRegistry: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_FUTURE_API_REGISTRY;
  certifiedDependencies: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_CERTIFIED_DEPENDENCIES;
  platformCapabilities: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES;
  platformPrinciples: typeof import("./crossScenarioLearningConstants.ts").CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES;
  registrySnapshot: CrossScenarioLearningRegistrySnapshot;
  dependencyValidation: CrossScenarioLearningDependencyValidationReport;
  platformInitialized: boolean;
  readOnly: true;
}>;

export type CrossScenarioLearningPlatformValidationReport = Readonly<{
  valid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  manifestValid: boolean;
  compatibilityValid: boolean;
  dependencyValid: boolean;
  workspaceIsolationValid: boolean;
  sessionIdentityValid: boolean;
  issues: readonly CrossScenarioLearningValidationIssue[];
  readOnly: true;
}>;

export type CrossScenarioLearningCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type CrossScenarioLearningCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-10/1";
  contractVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  checks: readonly CrossScenarioLearningCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type CrossScenarioLearningDependencyValidationReport = Readonly<{
  valid: boolean;
  dependencies: readonly Readonly<{
    appId: string;
    platformId: string;
    present: boolean;
    consumerOnly: true;
    readOnly: true;
  }>[];
  issues: readonly CrossScenarioLearningValidationIssue[];
  readOnly: true;
}>;

/**
 * APP-11:1 — Executive Inbox Platform domain types.
 * Immutable contract vocabulary — no aggregation, prioritization, or runtime delivery.
 */

import type {
  EXECUTIVE_INBOX_ITEM_STATUS_KEYS,
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_SESSION_STATUS_KEYS,
  EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
} from "./executiveInboxConstants.ts";

export type ExecutiveInboxWorkspaceId = string;
export type ExecutiveInboxSessionId = string;
export type ExecutiveInboxItemId = string;
export type ExecutiveInboxContextId = string;
export type ExecutiveInboxSourceId = string;

export type ExecutiveInboxCertificationStatus = "pending" | "pass" | "fail";
export type ExecutiveInboxFreezeState = "open" | "frozen";
export type ExecutiveInboxArchitectureStatus = "build" | "certified";

export type ExecutiveInboxSourceType = (typeof EXECUTIVE_INBOX_SOURCE_TYPE_KEYS)[number];
export type ExecutiveInboxItemStatus = (typeof EXECUTIVE_INBOX_ITEM_STATUS_KEYS)[number];
export type ExecutiveInboxSessionStatus = (typeof EXECUTIVE_INBOX_SESSION_STATUS_KEYS)[number];

export type ExecutiveInboxPlatformIdentity = Readonly<{
  appId: "APP-11";
  title: "Executive Inbox";
  platformId: "executive-inbox-platform";
  version: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  status: ExecutiveInboxArchitectureStatus;
  certificationStatus: ExecutiveInboxCertificationStatus;
  freezeState: ExecutiveInboxFreezeState;
  architectureVersion: string;
}>;

export type ExecutiveInboxMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveInboxSource = Readonly<{
  sourceId: ExecutiveInboxSourceId;
  sourceType: ExecutiveInboxSourceType;
  platformId: string;
  appId: string;
  referenceId: string;
  label: string;
  description: string;
  consumerOnly: true;
  metadata: ExecutiveInboxMetadata;
  readOnly: true;
}>;

export type ExecutiveInboxItem = Readonly<{
  itemId: ExecutiveInboxItemId;
  workspaceId: ExecutiveInboxWorkspaceId;
  sessionId: ExecutiveInboxSessionId;
  sourceType: ExecutiveInboxSourceType;
  sourceReferenceId: string;
  status: ExecutiveInboxItemStatus;
  label: string;
  description: string;
  metadata: ExecutiveInboxMetadata;
  registeredAt: string;
  version: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveInboxContext = Readonly<{
  contextId: ExecutiveInboxContextId;
  workspaceId: ExecutiveInboxWorkspaceId;
  sessionId: ExecutiveInboxSessionId;
  sourceTypes: readonly ExecutiveInboxSourceType[];
  scope: "workspace" | "portfolio";
  metadata: ExecutiveInboxMetadata;
  createdAt: string;
  version: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveInboxSession = Readonly<{
  sessionId: ExecutiveInboxSessionId;
  workspaceId: ExecutiveInboxWorkspaceId;
  status: ExecutiveInboxSessionStatus;
  label: string;
  description: string;
  sourceTypes: readonly ExecutiveInboxSourceType[];
  metadata: ExecutiveInboxMetadata;
  createdAt: string;
  updatedAt: string;
  version: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveInboxSessionRegistrationInput = Readonly<{
  sessionId: ExecutiveInboxSessionId;
  workspaceId: ExecutiveInboxWorkspaceId;
  label: string;
  description: string;
  sourceTypes: readonly ExecutiveInboxSourceType[];
}>;

export type ExecutiveInboxItemRegistrationInput = Readonly<{
  itemId: ExecutiveInboxItemId;
  workspaceId: ExecutiveInboxWorkspaceId;
  sessionId: ExecutiveInboxSessionId;
  sourceType: ExecutiveInboxSourceType;
  sourceReferenceId: string;
  label: string;
  description: string;
}>;

export type ExecutiveInboxMetadataExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  description: string;
}>;

export type ExecutiveInboxFutureExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
}>;

export type ExecutiveInboxValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveInboxValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveInboxValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveInboxPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ExecutiveInboxRegistrySnapshot = Readonly<{
  registryVersion: string;
  sessionCount: number;
  itemCount: number;
  sourceTypeCount: number;
  sourceProviderCount: number;
  consumerCount: number;
  futureEngineCount: number;
  extensionCount: number;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformState = Readonly<{
  platformId: "executive-inbox-platform";
  foundationVersion: string;
  contractVersion: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  sessionCount: number;
  registeredSessionIds: readonly ExecutiveInboxSessionId[];
  supportedSourceTypes: readonly ExecutiveInboxSourceType[];
  supportedSessionStatuses: readonly ExecutiveInboxSessionStatus[];
  supportedItemStatuses: readonly ExecutiveInboxItemStatus[];
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxFutureCompatibility = typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_FUTURE_COMPATIBILITY;

export type ExecutiveInboxManifest = Readonly<{
  manifestVersion: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION;
  stageManifest: import("../stage/stageArchitectureTypes.ts").StageManifest;
  releaseMetadata: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_RELEASE_METADATA;
  certificationMetadata: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_CERTIFICATION_METADATA;
  futureCompatibility: ExecutiveInboxFutureCompatibility;
  extensionRegistry: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_EXTENSION_REGISTRY;
  metadataExtensionRegistry: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_METADATA_EXTENSION_REGISTRY;
  compatibilityRegistry: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_COMPATIBILITY_REGISTRY;
  consumerRegistry: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_CONSUMER_REGISTRY;
  sourceProviderRegistry: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY;
  futureEngineRegistry: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_FUTURE_ENGINE_REGISTRY;
  futureApiRegistry: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_FUTURE_API_REGISTRY;
  certifiedDependencies: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_CERTIFIED_DEPENDENCIES;
  platformCapabilities: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_PLATFORM_CAPABILITIES;
  platformPrinciples: typeof import("./executiveInboxConstants.ts").EXECUTIVE_INBOX_PLATFORM_PRINCIPLES;
  registrySnapshot: ExecutiveInboxRegistrySnapshot;
  dependencyValidation: ExecutiveInboxDependencyValidationReport;
  platformInitialized: boolean;
  readOnly: true;
}>;

export type ExecutiveInboxPlatformValidationReport = Readonly<{
  valid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  manifestValid: boolean;
  compatibilityValid: boolean;
  dependencyValid: boolean;
  workspaceIsolationValid: boolean;
  sessionIdentityValid: boolean;
  issues: readonly ExecutiveInboxValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveInboxCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-11/1";
  contractVersion: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  checks: readonly ExecutiveInboxCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxDependencyValidationReport = Readonly<{
  valid: boolean;
  dependencies: readonly Readonly<{
    appId: string;
    platformId: string;
    present: boolean;
    consumerOnly: true;
    readOnly: true;
  }>[];
  issues: readonly ExecutiveInboxValidationIssue[];
  readOnly: true;
}>;

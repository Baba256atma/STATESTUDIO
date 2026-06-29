/**
 * APP-12:1 — Executive Recommendation Platform domain types.
 * Immutable contract vocabulary — no generation, scoring, or runtime execution.
 */

import type {
  EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS,
  EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS,
} from "./executiveRecommendationConstants.ts";

export type ExecutiveRecommendationWorkspaceId = string;
export type ExecutiveRecommendationSessionId = string;
export type ExecutiveRecommendationCandidateId = string;
export type ExecutiveRecommendationContextId = string;
export type ExecutiveRecommendationRequestId = string;
export type ExecutiveRecommendationSourceProviderId = string;

export type ExecutiveRecommendationCertificationStatus = "pending" | "pass" | "fail";
export type ExecutiveRecommendationFreezeState = "open" | "frozen";
export type ExecutiveRecommendationArchitectureStatus = "build" | "certified";

export type ExecutiveRecommendationDomainKey = (typeof EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS)[number];
export type ExecutiveRecommendationCandidateStatus = (typeof EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS)[number];
export type ExecutiveRecommendationSessionStatus = (typeof EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS)[number];

export type ExecutiveRecommendationPlatformIdentity = Readonly<{
  appId: "APP-12";
  title: "Executive Recommendation";
  platformId: "executive-recommendation-platform";
  version: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  status: ExecutiveRecommendationArchitectureStatus;
  certificationStatus: ExecutiveRecommendationCertificationStatus;
  freezeState: ExecutiveRecommendationFreezeState;
  architectureVersion: string;
}>;

export type ExecutiveRecommendationMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveRecommendationSourceProvider = Readonly<{
  providerId: ExecutiveRecommendationSourceProviderId;
  label: string;
  platformId: string;
  appId: string;
  consumerOnly: true;
  metadata: ExecutiveRecommendationMetadata;
  readOnly: true;
}>;

export type ExecutiveRecommendationRequest = Readonly<{
  requestId: ExecutiveRecommendationRequestId;
  workspaceId: ExecutiveRecommendationWorkspaceId;
  sessionId: ExecutiveRecommendationSessionId;
  domain: ExecutiveRecommendationDomainKey;
  label: string;
  description: string;
  metadata: ExecutiveRecommendationMetadata;
  createdAt: string;
  version: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveRecommendationContext = Readonly<{
  contextId: ExecutiveRecommendationContextId;
  workspaceId: ExecutiveRecommendationWorkspaceId;
  sessionId: ExecutiveRecommendationSessionId;
  domains: readonly ExecutiveRecommendationDomainKey[];
  scope: "workspace" | "portfolio";
  metadata: ExecutiveRecommendationMetadata;
  createdAt: string;
  version: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveRecommendationCandidate = Readonly<{
  candidateId: ExecutiveRecommendationCandidateId;
  workspaceId: ExecutiveRecommendationWorkspaceId;
  sessionId: ExecutiveRecommendationSessionId;
  domain: ExecutiveRecommendationDomainKey;
  sourceProviderId: ExecutiveRecommendationSourceProviderId;
  sourceReferenceId: string;
  status: ExecutiveRecommendationCandidateStatus;
  label: string;
  description: string;
  metadata: ExecutiveRecommendationMetadata;
  registeredAt: string;
  version: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveRecommendationSession = Readonly<{
  sessionId: ExecutiveRecommendationSessionId;
  workspaceId: ExecutiveRecommendationWorkspaceId;
  status: ExecutiveRecommendationSessionStatus;
  label: string;
  description: string;
  domains: readonly ExecutiveRecommendationDomainKey[];
  metadata: ExecutiveRecommendationMetadata;
  createdAt: string;
  updatedAt: string;
  version: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveRecommendationSessionRegistrationInput = Readonly<{
  sessionId: ExecutiveRecommendationSessionId;
  workspaceId: ExecutiveRecommendationWorkspaceId;
  label: string;
  description: string;
  domains: readonly ExecutiveRecommendationDomainKey[];
}>;

export type ExecutiveRecommendationCandidateRegistrationInput = Readonly<{
  candidateId: ExecutiveRecommendationCandidateId;
  workspaceId: ExecutiveRecommendationWorkspaceId;
  sessionId: ExecutiveRecommendationSessionId;
  domain: ExecutiveRecommendationDomainKey;
  sourceProviderId: ExecutiveRecommendationSourceProviderId;
  sourceReferenceId: string;
  label: string;
  description: string;
}>;

export type ExecutiveRecommendationMetadataExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  description: string;
}>;

export type ExecutiveRecommendationFutureExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
}>;

export type ExecutiveRecommendationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveRecommendationValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveRecommendationPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ExecutiveRecommendationRegistrySnapshot = Readonly<{
  registryVersion: string;
  sessionCount: number;
  candidateCount: number;
  domainCount: number;
  sourceProviderCount: number;
  consumerCount: number;
  futureEngineCount: number;
  extensionCount: number;
  readOnly: true;
}>;

export type ExecutiveRecommendationPlatformState = Readonly<{
  platformId: "executive-recommendation-platform";
  foundationVersion: string;
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  sessionCount: number;
  registeredSessionIds: readonly ExecutiveRecommendationSessionId[];
  supportedDomains: readonly ExecutiveRecommendationDomainKey[];
  supportedSessionStatuses: readonly ExecutiveRecommendationSessionStatus[];
  supportedCandidateStatuses: readonly ExecutiveRecommendationCandidateStatus[];
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationFutureCompatibility =
  typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY;

export type ExecutiveRecommendationManifest = Readonly<{
  manifestVersion: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION;
  stageManifest: import("../stage/stageArchitectureTypes.ts").StageManifest;
  releaseMetadata: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_RELEASE_METADATA;
  certificationMetadata: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_CERTIFICATION_METADATA;
  futureCompatibility: ExecutiveRecommendationFutureCompatibility;
  extensionRegistry: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY;
  metadataExtensionRegistry: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_METADATA_EXTENSION_REGISTRY;
  compatibilityRegistry: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY;
  consumerRegistry: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY;
  sourceProviderRegistry: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY;
  futureEngineRegistry: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_FUTURE_ENGINE_REGISTRY;
  futureApiRegistry: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_FUTURE_API_REGISTRY;
  certifiedDependencies: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_CERTIFIED_DEPENDENCIES;
  platformCapabilities: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES;
  platformPrinciples: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES;
  supportedDomains: typeof import("./executiveRecommendationConstants.ts").EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS;
  registrySnapshot: ExecutiveRecommendationRegistrySnapshot;
  dependencyValidation: ExecutiveRecommendationDependencyValidationReport;
  platformInitialized: boolean;
  readOnly: true;
}>;

export type ExecutiveRecommendationPlatformValidationReport = Readonly<{
  valid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  manifestValid: boolean;
  compatibilityValid: boolean;
  dependencyValid: boolean;
  workspaceIsolationValid: boolean;
  sessionIdentityValid: boolean;
  issues: readonly ExecutiveRecommendationValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveRecommendationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-12/1";
  contractVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  checks: readonly ExecutiveRecommendationCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveRecommendationDependencyValidationReport = Readonly<{
  valid: boolean;
  dependencies: readonly Readonly<{
    appId: string;
    platformId: string;
    present: boolean;
    consumerOnly: true;
    readOnly: true;
  }>[];
  issues: readonly ExecutiveRecommendationValidationIssue[];
  readOnly: true;
}>;

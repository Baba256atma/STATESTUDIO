/**
 * APP-4:1 — Executive Memory domain types.
 * Immutable contract vocabulary — no storage, retrieval, or execution.
 */

export type ExecutiveMemoryWorkspaceId = string;
export type ExecutiveMemoryId = string;
export type ExecutiveMemoryProviderId = string;

export type ExecutiveMemoryCertificationStatus = "pending" | "pass" | "fail";
export type ExecutiveMemoryFreezeState = "open" | "frozen";
export type ExecutiveMemoryArchitectureStatus = "build" | "certified";

export type ExecutiveMemoryPlatformIdentity = Readonly<{
  appId: "APP-4";
  title: "Executive Memory";
  version: string;
  status: ExecutiveMemoryArchitectureStatus;
  certificationStatus: ExecutiveMemoryCertificationStatus;
  freezeState: ExecutiveMemoryFreezeState;
  architectureVersion: string;
}>;

export type ExecutiveMemoryCategory =
  | "goal"
  | "intent"
  | "scenario"
  | "decision"
  | "evidence"
  | "kpi_reference"
  | "risk_reference"
  | "object"
  | "relationship"
  | "timeline_reference"
  | "confidence"
  | "business_context"
  | "tag"
  | "metadata"
  | "custom";

export type ExecutiveMemoryTag = Readonly<{
  tagId: string;
  label: string;
  readOnly: true;
}>;

export type ExecutiveMemoryReference = Readonly<{
  referenceId: string;
  referenceType: string;
  targetId: string;
  label: string;
  module: string | null;
  readOnly: true;
}>;

export type ExecutiveMemoryMetadata = Readonly<{
  memoryId: ExecutiveMemoryId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  category: ExecutiveMemoryCategory;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  sourceModule: string;
  contractVersion: string;
  tags: readonly ExecutiveMemoryTag[];
  references: readonly ExecutiveMemoryReference[];
  customMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveMemory = Readonly<{
  memoryId: ExecutiveMemoryId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  category: ExecutiveMemoryCategory;
  metadata: ExecutiveMemoryMetadata;
  contractVersion: string;
  readOnly: true;
}>;

export type ExecutiveMemoryProvider = Readonly<{
  providerId: ExecutiveMemoryProviderId;
  label: string;
  version: string;
  supportedCategories: readonly ExecutiveMemoryCategory[];
  metadata: Readonly<Record<string, string>>;
  registeredAt: string;
  readOnly: true;
}>;

export type ExecutiveMemoryProviderRegistration = Readonly<{
  providerId: ExecutiveMemoryProviderId;
  label: string;
  version: string;
  supportedCategories: readonly ExecutiveMemoryCategory[];
  metadata?: Readonly<Record<string, string>>;
}>;

export type ExecutiveMemoryResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ExecutiveMemoryPlatformState = Readonly<{
  platformId: "executive-memory-platform";
  foundationVersion: string;
  contractVersion: string;
  initialized: boolean;
  providerCount: number;
  registeredProviderIds: readonly ExecutiveMemoryProviderId[];
  supportedCategories: readonly ExecutiveMemoryCategory[];
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveMemoryValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
}>;

export type ExecutiveMemoryValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveMemoryValidationIssue[];
  readOnly: true;
}>;

export type ExecutiveMemoryFuturePhase =
  | "memory_storage"
  | "memory_retrieval"
  | "memory_ranking"
  | "memory_lifecycle"
  | "memory_assistant_integration"
  | "memory_dashboard_integration"
  | "memory_learning"
  | "memory_recommendation";

export type ExecutiveMemoryFutureCompatibility = Readonly<{
  app4Ready: true;
  storageReady: true;
  retrievalReady: true;
  rankingReady: true;
  lifecycleReady: true;
  assistantIntegrationReady: true;
  dashboardIntegrationReady: true;
  learningReady: true;
  executiveIntentConsumerReady: true;
  scenarioIntelligenceConsumerReady: true;
  executiveTimeConsumerReady: true;
  readOnly: true;
  metadataOnly: true;
}>;

/** Reserved for APP-4:2 extension. */
export type ExecutiveMemoryFutureExtension = Readonly<{
  storageBindings: null;
  retrievalBindings: null;
}>;

export const EXECUTIVE_MEMORY_FUTURE_EXTENSION: ExecutiveMemoryFutureExtension = Object.freeze({
  storageBindings: null,
  retrievalBindings: null,
});

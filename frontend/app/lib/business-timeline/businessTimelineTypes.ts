/**
 * APP-7:1 — Business Timeline Platform domain types.
 * Immutable contract vocabulary — no storage, visualization, or execution.
 */

import type {
  BUSINESS_TIMELINE_CATEGORY_KEYS,
  BUSINESS_TIMELINE_EVENT_TYPE_KEYS,
  BUSINESS_TIMELINE_IMPORTANCE_KEYS,
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_SOURCE_KEYS,
  BUSINESS_TIMELINE_STATUS_KEYS,
} from "./businessTimelineConstants.ts";

export type BusinessEventId = string;
export type BusinessTimelineId = string;
export type BusinessEventTypeId = string;
export type BusinessWorkspaceId = string;
export type BusinessTag = string;

export type BusinessCertificationStatus = "pending" | "pass" | "fail";
export type BusinessFreezeState = "open" | "frozen";
export type BusinessArchitectureStatus = "build" | "certified";

export type BusinessEventCategory = (typeof BUSINESS_TIMELINE_CATEGORY_KEYS)[number];
export type BusinessEventType = (typeof BUSINESS_TIMELINE_EVENT_TYPE_KEYS)[number];
export type BusinessEventImportance = (typeof BUSINESS_TIMELINE_IMPORTANCE_KEYS)[number];
export type BusinessEventStatus = (typeof BUSINESS_TIMELINE_STATUS_KEYS)[number];
export type BusinessEventSource = (typeof BUSINESS_TIMELINE_SOURCE_KEYS)[number];

export type BusinessPlatformIdentity = Readonly<{
  appId: "APP-7";
  title: "Business Timeline";
  platformId: "business-timeline-platform";
  version: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  status: BusinessArchitectureStatus;
  certificationStatus: BusinessCertificationStatus;
  freezeState: BusinessFreezeState;
  architectureVersion: string;
}>;

export type BusinessEventMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type BusinessEvent = Readonly<{
  id: BusinessEventId;
  workspaceId: BusinessWorkspaceId;
  title: string;
  description: string;
  category: BusinessEventCategory;
  type: BusinessEventType;
  importance: BusinessEventImportance;
  status: BusinessEventStatus;
  source: BusinessEventSource;
  createdAt: string;
  occurredAt: string;
  createdBy: string;
  tags: readonly BusinessTag[];
  metadata: BusinessEventMetadata;
  version: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type BusinessTimelineRegistration = Readonly<{
  timelineId: BusinessTimelineId;
  workspaceId: BusinessWorkspaceId;
  label: string;
  description: string;
  registeredAt: string;
  readOnly: true;
}>;

export type BusinessTimelineRegistrationInput = Readonly<{
  timelineId: BusinessTimelineId;
  workspaceId: BusinessWorkspaceId;
  label: string;
  description: string;
}>;

export type BusinessEventTypeRegistration = Readonly<{
  typeId: BusinessEventTypeId;
  label: string;
  description: string;
  supportedCategories: readonly BusinessEventCategory[];
  supportedStatuses: readonly BusinessEventStatus[];
  supportedImportanceLevels: readonly BusinessEventImportance[];
  metadata?: Readonly<Record<string, string>>;
}>;

export type BusinessEventTypeRecord = Readonly<{
  typeId: BusinessEventTypeId;
  label: string;
  description: string;
  supportedCategories: readonly BusinessEventCategory[];
  supportedStatuses: readonly BusinessEventStatus[];
  supportedImportanceLevels: readonly BusinessEventImportance[];
  metadata: Readonly<Record<string, string>>;
  registeredAt: string;
  readOnly: true;
}>;

export type BusinessCategoryRegistration = Readonly<{
  categoryId: BusinessEventCategory;
  label: string;
  description: string;
}>;

export type BusinessStatusRegistration = Readonly<{
  statusId: BusinessEventStatus;
  label: string;
  description: string;
  terminal: boolean;
}>;

export type BusinessImportanceRegistration = Readonly<{
  importanceId: BusinessEventImportance;
  label: string;
  description: string;
  rank: number;
}>;

export type BusinessMetadataExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  description: string;
}>;

export type BusinessFutureExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
}>;

export type BusinessValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type BusinessValidationResult = Readonly<{
  valid: boolean;
  issues: readonly BusinessValidationIssue[];
  readOnly: true;
}>;

export type BusinessPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type BusinessTimelineRegistrySnapshot = Readonly<{
  registryVersion: string;
  timelineCount: number;
  timelineIds: readonly BusinessTimelineId[];
  eventTypeCount: number;
  categoryCount: number;
  statusTypeCount: number;
  importanceTypeCount: number;
  metadataExtensionCount: number;
  futureExtensionCount: number;
  readOnly: true;
}>;

export type BusinessPlatformState = Readonly<{
  platformId: "business-timeline-platform";
  foundationVersion: string;
  contractVersion: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  timelineCount: number;
  registeredTimelineIds: readonly BusinessTimelineId[];
  eventTypeCount: number;
  supportedCategories: readonly BusinessEventCategory[];
  supportedEventTypes: readonly BusinessEventType[];
  supportedImportanceLevels: readonly BusinessEventImportance[];
  supportedStatuses: readonly BusinessEventStatus[];
  supportedSources: readonly BusinessEventSource[];
  timestamp: string;
  readOnly: true;
}>;

export type BusinessFutureCompatibility = Readonly<{
  app7Ready: boolean;
  eventsReady: boolean;
  storageReady: boolean;
  visualizationReady: boolean;
  dashboardReady: boolean;
  assistantReady: boolean;
  analyticsReady: boolean;
  scenarioTimelineConsumerReady: boolean;
  decisionTimelineConsumerReady: boolean;
  workspaceConsumerReady: boolean;
  readOnly: true;
  metadataOnly: true;
}>;

export type BusinessPlatformValidationReport = Readonly<{
  valid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  manifestValid: boolean;
  compatibilityValid: boolean;
  workspaceIsolationValid: boolean;
  timelineIdentityValid: boolean;
  issues: readonly BusinessValidationIssue[];
  readOnly: true;
}>;

export type BusinessCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type BusinessCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-7/1";
  contractVersion: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  checks: readonly BusinessCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

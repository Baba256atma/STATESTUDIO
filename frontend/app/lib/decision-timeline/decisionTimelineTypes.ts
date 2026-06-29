/**
 * APP-6:1 — Decision Timeline Platform domain types.
 * Immutable contract vocabulary — no storage, analytics, or execution.
 */

import type {
  DECISION_TIMELINE_EVENT_TYPE_KEYS,
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_CATEGORY_KEYS,
  DECISION_TIMELINE_SOURCE_KEYS,
  DECISION_TIMELINE_STATUS_KEYS,
} from "./decisionTimelineConstants.ts";

export type DecisionId = string;
export type DecisionEventId = string;
export type DecisionTypeId = string;
export type DecisionWorkspaceId = string;
export type DecisionReferenceId = string;
export type DecisionTag = string;

export type DecisionCertificationStatus = "pending" | "pass" | "fail";
export type DecisionFreezeState = "open" | "frozen";
export type DecisionArchitectureStatus = "build" | "certified";

export type DecisionStatus = (typeof DECISION_TIMELINE_STATUS_KEYS)[number];
export type DecisionSource = (typeof DECISION_TIMELINE_SOURCE_KEYS)[number];
export type DecisionCategory = (typeof DECISION_TIMELINE_CATEGORY_KEYS)[number];
export type DecisionEventType = (typeof DECISION_TIMELINE_EVENT_TYPE_KEYS)[number];

export type DecisionPlatformIdentity = Readonly<{
  appId: "APP-6";
  title: "Decision Timeline";
  platformId: "decision-timeline-platform";
  version: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  status: DecisionArchitectureStatus;
  certificationStatus: DecisionCertificationStatus;
  freezeState: DecisionFreezeState;
  architectureVersion: string;
}>;

export type DecisionMetadata = Readonly<{
  metadataVersion: string;
  owner: string;
  tags: readonly DecisionTag[];
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionContext = Readonly<{
  workspaceId: DecisionWorkspaceId;
  sourceModule: string;
  actorId?: string;
  sessionId?: string;
  readOnly: true;
}>;

export type DecisionReference = Readonly<{
  referenceId: DecisionReferenceId;
  referenceType: string;
  label: string;
  uri?: string;
  readOnly: true;
}>;

export type Decision = Readonly<{
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  status: DecisionStatus;
  source: DecisionSource;
  category: DecisionCategory;
  title: string;
  summary: string;
  decidedAt: string;
  contractVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  decisionTypeId?: DecisionTypeId;
  metadata?: DecisionMetadata;
  context?: DecisionContext;
  references?: readonly DecisionReference[];
  tags?: readonly DecisionTag[];
  readOnly: true;
}>;

export type DecisionEvent = Readonly<{
  eventId: DecisionEventId;
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  eventType: DecisionEventType;
  title: string;
  summary: string;
  occurredAt: string;
  sourceModule: string;
  contractVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionTimelineEntry = Readonly<{
  entryId: string;
  decisionId: DecisionId;
  workspaceId: DecisionWorkspaceId;
  event: DecisionEvent;
  sequenceNumber: number;
  recordedAt: string;
  readOnly: true;
}>;

export type DecisionTypeRegistration = Readonly<{
  typeId: DecisionTypeId;
  label: string;
  description: string;
  supportedStatuses: readonly DecisionStatus[];
  supportedCategories: readonly DecisionCategory[];
  supportedEventTypes: readonly DecisionEventType[];
  metadata?: Readonly<Record<string, string>>;
}>;

export type DecisionType = Readonly<{
  typeId: DecisionTypeId;
  label: string;
  description: string;
  supportedStatuses: readonly DecisionStatus[];
  supportedCategories: readonly DecisionCategory[];
  supportedEventTypes: readonly DecisionEventType[];
  metadata: Readonly<Record<string, string>>;
  registeredAt: string;
  readOnly: true;
}>;

export type DecisionCategoryRegistration = Readonly<{
  categoryId: DecisionCategory;
  label: string;
  description: string;
}>;

export type DecisionStatusRegistration = Readonly<{
  statusId: DecisionStatus;
  label: string;
  description: string;
  terminal: boolean;
}>;

export type DecisionMetadataExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  description: string;
}>;

export type DecisionFutureExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
}>;

export type DecisionValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type DecisionValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DecisionValidationIssue[];
  readOnly: true;
}>;

export type DecisionPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type DecisionTimelineRegistrySnapshot = Readonly<{
  registryVersion: string;
  decisionTypeCount: number;
  decisionTypeIds: readonly DecisionTypeId[];
  categoryCount: number;
  statusTypeCount: number;
  metadataExtensionCount: number;
  futureExtensionCount: number;
  readOnly: true;
}>;

export type DecisionPlatformState = Readonly<{
  platformId: "decision-timeline-platform";
  foundationVersion: string;
  contractVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  decisionTypeCount: number;
  registeredDecisionTypeIds: readonly DecisionTypeId[];
  supportedStatuses: readonly DecisionStatus[];
  supportedSources: readonly DecisionSource[];
  supportedCategories: readonly DecisionCategory[];
  supportedEventTypes: readonly DecisionEventType[];
  timestamp: string;
  readOnly: true;
}>;

export type DecisionFutureCompatibility = Readonly<{
  app6Ready: boolean;
  eventsReady: boolean;
  storageReady: boolean;
  replayReady: boolean;
  analyticsReady: boolean;
  outcomesReady: boolean;
  comparisonReady: boolean;
  dashboardReady: boolean;
  assistantReady: boolean;
  mlReady: boolean;
  scenarioTimelineConsumerReady: boolean;
  executiveIntentConsumerReady: boolean;
  executiveMemoryConsumerReady: boolean;
  executiveTimeConsumerReady: boolean;
  readOnly: true;
  metadataOnly: true;
}>;

export type DecisionPlatformValidationReport = Readonly<{
  valid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  manifestValid: boolean;
  compatibilityValid: boolean;
  workspaceIsolationValid: boolean;
  timelineIdentityValid: boolean;
  issues: readonly DecisionValidationIssue[];
  readOnly: true;
}>;

export type DecisionCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-6/1";
  contractVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  checks: readonly DecisionCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

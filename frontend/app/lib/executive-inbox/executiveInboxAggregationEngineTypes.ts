/**
 * APP-11:2 — Executive Inbox Aggregation Engine domain types.
 */

import type {
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES,
} from "./executiveInboxAggregationEngineConstants.ts";
import type { ExecutiveInboxSourceType } from "./executiveInboxTypes.ts";

export type InboxItemId = string;
export type InboxWorkspaceId = string;
export type InboxAggregationSessionId = string;
export type InboxAggregationPipelineStage = (typeof EXECUTIVE_INBOX_AGGREGATION_PIPELINE_STAGES)[number];

export type ExecutiveInboxAggregationMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ExecutiveInboxSourceReference = Readonly<{
  sourceId: string;
  sourceType: ExecutiveInboxSourceType;
  platformId: string;
  appId: string;
  recordId: string;
  sourceVersion: string;
  readOnly: true;
}>;

export type ExecutiveInboxItemProvenance = Readonly<{
  originatingPlatform: string;
  originatingRecordId: string;
  workspaceId: InboxWorkspaceId;
  sourceVersion: string;
  aggregationVersion: typeof EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;
  engineVersion: typeof EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-11/1";
  sourceApps: readonly string[];
  readOnly: true;
}>;

export type ExecutiveInboxItem = Readonly<{
  itemId: InboxItemId;
  sourceType: ExecutiveInboxSourceType;
  sourceId: string;
  workspaceId: InboxWorkspaceId;
  businessContext: string;
  summary: string;
  sourceReference: ExecutiveInboxSourceReference;
  provenance: ExecutiveInboxItemProvenance;
  aggregationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;
  metadata: ExecutiveInboxAggregationMetadata;
  readOnly: true;
}>;

export type ExecutiveInboxAggregate = Readonly<{
  aggregateId: string;
  workspaceId: InboxWorkspaceId;
  sessionId: InboxAggregationSessionId;
  items: readonly ExecutiveInboxItem[];
  itemCount: number;
  aggregationTimestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxAggregationSession = Readonly<{
  sessionId: InboxAggregationSessionId;
  workspaceId: InboxWorkspaceId;
  label: string;
  sourceTypes: readonly ExecutiveInboxSourceType[];
  aggregationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveInboxAggregationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveInboxAggregationValidation = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveInboxAggregationValidationIssue[];
  readOnly: true;
}>;

export type InboxAggregationRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;
  itemCount: number;
  itemIds: readonly InboxItemId[];
  readOnly: true;
}>;

export type InboxAggregationEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type InboxAggregationEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: InboxAggregationEngineError | null;
  readOnly: true;
}>;

export type CertifiedInboxSourceRecordInput = Readonly<{
  sourceId: string;
  sourceType: ExecutiveInboxSourceType;
  workspaceId: InboxWorkspaceId;
  platformId: string;
  appId: string;
  recordId: string;
  businessContext: string;
  summary: string;
  sourceVersion: string;
  sourceApps: readonly string[];
}>;

export type NormalizedInboxSourceRecord = Readonly<{
  sourceId: string;
  sourceType: ExecutiveInboxSourceType;
  workspaceId: InboxWorkspaceId;
  platformId: string;
  appId: string;
  recordId: string;
  businessContext: string;
  summary: string;
  sourceVersion: string;
  sourceApps: readonly string[];
  normalizationSignature: string;
  readOnly: true;
}>;

export type ExecutiveInboxAggregationRequest = Readonly<{
  workspaceId: InboxWorkspaceId;
  sessionId: InboxAggregationSessionId;
  sessionLabel: string;
  sourceRecords: readonly CertifiedInboxSourceRecordInput[];
  sourceTypes?: readonly ExecutiveInboxSourceType[];
  aggregationTimestamp?: string;
}>;

export type ExecutiveInboxAggregationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: InboxWorkspaceId;
  session: ExecutiveInboxAggregationSession;
  aggregate: ExecutiveInboxAggregate;
  aggregatedItems: readonly ExecutiveInboxItem[];
  registeredItemIds: readonly InboxItemId[];
  skippedRecords: number;
  pipelineStages: readonly InboxAggregationPipelineStage[];
  aggregationTimestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxAggregationEngineState = Readonly<{
  engineId: "executive-inbox-aggregation-engine";
  contractVersion: typeof EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredItemCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxAggregationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxAggregationCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-11/2";
  contractVersion: typeof EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveInboxAggregationCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function inboxAggregationEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): InboxAggregationEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

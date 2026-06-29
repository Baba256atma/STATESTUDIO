/**
 * APP-4:11 — Executive Assistant Memory Integration domain types.
 */

import type { ExecutiveMemoryCategory, ExecutiveMemoryId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";
import type { EXECUTIVE_ASSISTANT_MEMORY_PERMISSION_KEYS } from "./executiveAssistantMemoryIntegrationConstants.ts";

export type ExecutiveAssistantMemoryPermission =
  (typeof EXECUTIVE_ASSISTANT_MEMORY_PERMISSION_KEYS)[number];

export type ExecutiveAssistantMemoryRequest = Readonly<{
  recordId?: ExecutiveMemoryId;
  workspaceId?: ExecutiveMemoryWorkspaceId;
  intentId?: string;
  scenarioId?: string;
  decisionId?: string;
  contextId?: string;
  goalId?: string;
  category?: ExecutiveMemoryCategory;
  retrievalProfileId?: string;
  allowArchived?: boolean;
  allowLocked?: boolean;
  includeSuperseded?: boolean;
  limit?: number;
  readOnly: true;
}>;

export type CreateExecutiveAssistantMemoryRequestInput = Readonly<
  Omit<ExecutiveAssistantMemoryRequest, "readOnly">
>;

export type ExecutiveAssistantMemoryReference = Readonly<{
  memoryId: ExecutiveMemoryId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  category: ExecutiveMemoryCategory;
  versionId: string;
  semanticVersion: string;
  readOnly: true;
}>;

export type ExecutiveAssistantMemoryCitation = Readonly<{
  memoryId: ExecutiveMemoryId;
  memoryType: ExecutiveMemoryCategory;
  versionId: string;
  semanticVersion: string;
  confidenceScore: number | null;
  confidenceLevel: string | null;
  lifecycleState: string;
  governanceState: string | null;
  retrievalProfileId: string;
  rankingProfileId: string;
  selectionReasons: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantMemoryExplanation = Readonly<{
  memoryId: ExecutiveMemoryId;
  score: number;
  retrievalProfileId: string;
  reasons: readonly string[];
  readOnly: true;
}>;

export type ExecutiveAssistantMemorySelection = Readonly<{
  record: ExecutiveMemoryStoredRecord;
  rank: number;
  score: number;
  permission: ExecutiveAssistantMemoryPermission;
  citation: ExecutiveAssistantMemoryCitation;
  explanation: ExecutiveAssistantMemoryExplanation;
  readOnly: true;
}>;

export type ExecutiveAssistantMemoryResponse = Readonly<{
  success: boolean;
  reason: string;
  selections: readonly ExecutiveAssistantMemorySelection[];
  permission: ExecutiveAssistantMemoryPermission;
  retrievalProfileId: string;
  executionTimeMs: number;
  error: ExecutiveAssistantMemoryIntegrationError | null;
  readOnly: true;
}>;

export type ExecutiveAssistantMemoryIntegrationError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveAssistantRetrievalProfile = Readonly<{
  profileId: string;
  label: string;
  description: string;
  rankingProfileId: string;
  readOnly: true;
}>;

export type ExecutiveAssistantMemoryAccessResult = Readonly<{
  allowed: boolean;
  permission: ExecutiveAssistantMemoryPermission;
  reason: string;
  readOnly: true;
}>;

export type ExecutiveAssistantMemoryStatistics = Readonly<{
  assistantRetrievalCount: number;
  citationCount: number;
  accessDenialCount: number;
  totalExecutionTimeMs: number;
  averageRetrievalTimeMs: number;
  profileUsage: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveAssistantMemoryIntegrationEngineState = Readonly<{
  engineId: "executive-assistant-memory-integration-engine";
  contractVersion: string;
  initialized: boolean;
  retrievalProfileCount: number;
  timestamp: string;
  readOnly: true;
}>;

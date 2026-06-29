/**
 * APP-4:10 — Executive Memory Lifecycle domain types.
 */

import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";
import type {
  EXECUTIVE_MEMORY_LIFECYCLE_STATE_KEYS,
  EXECUTIVE_MEMORY_LIFECYCLE_VERSION_OPERATION_KEYS,
  EXECUTIVE_MEMORY_RETENTION_POLICY_TYPE_KEYS,
} from "./executiveMemoryLifecycleConstants.ts";

export type ExecutiveMemoryGovernanceState = (typeof EXECUTIVE_MEMORY_LIFECYCLE_STATE_KEYS)[number];
export type ExecutiveMemoryVersionOperation =
  (typeof EXECUTIVE_MEMORY_LIFECYCLE_VERSION_OPERATION_KEYS)[number];
export type ExecutiveMemoryRetentionPolicyType =
  (typeof EXECUTIVE_MEMORY_RETENTION_POLICY_TYPE_KEYS)[number];

export type ExecutiveMemoryLifecycleAuditMetadata = Readonly<{
  author: string;
  sourceModule: string;
  reason: string | null;
  readOnly: true;
}>;

export type ExecutiveMemoryLifecycle = Readonly<{
  memoryId: ExecutiveMemoryId;
  canonicalMemoryId: ExecutiveMemoryId;
  governanceState: ExecutiveMemoryGovernanceState;
  currentVersionId: string;
  retentionPolicyId: string;
  supersededBy: ExecutiveMemoryId | null;
  mergedInto: ExecutiveMemoryId | null;
  splitFrom: ExecutiveMemoryId | null;
  lockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  audit: ExecutiveMemoryLifecycleAuditMetadata;
  readOnly: true;
}>;

export type ExecutiveMemoryVersionRecord = Readonly<{
  versionId: string;
  memoryId: ExecutiveMemoryId;
  canonicalMemoryId: ExecutiveMemoryId;
  parentVersionId: string | null;
  semanticVersion: string;
  schemaVersion: string;
  author: string;
  operation: ExecutiveMemoryVersionOperation;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveMemoryVersionHistory = Readonly<{
  canonicalMemoryId: ExecutiveMemoryId;
  versions: readonly ExecutiveMemoryVersionRecord[];
  latestVersionId: string | null;
  readOnly: true;
}>;

export type ExecutiveMemoryRetentionPolicy = Readonly<{
  policyId: string;
  label: string;
  policyType: ExecutiveMemoryRetentionPolicyType;
  archiveAfterDays: number | null;
  description: string;
  readOnly: true;
}>;

export type ExecutiveMemoryMergeOperation = Readonly<{
  operationId: string;
  sourceMemoryIds: readonly ExecutiveMemoryId[];
  mergedMemoryId: ExecutiveMemoryId;
  author: string;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveMemorySplitOperation = Readonly<{
  operationId: string;
  sourceMemoryId: ExecutiveMemoryId;
  targetMemoryIds: readonly ExecutiveMemoryId[];
  author: string;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveMemorySupersedeOperation = Readonly<{
  operationId: string;
  obsoleteMemoryId: ExecutiveMemoryId;
  replacementMemoryId: ExecutiveMemoryId;
  author: string;
  createdAt: string;
  readOnly: true;
}>;

export type ExecutiveMemoryIntegrityIssue = Readonly<{
  code: string;
  message: string;
  memoryId?: ExecutiveMemoryId;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryIntegrityReport = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveMemoryIntegrityIssue[];
  inspectedAt: string;
  recordsInspected: number;
  readOnly: true;
}>;

export type ExecutiveMemoryLifecycleStatistics = Readonly<{
  totalVersions: number;
  mergedMemories: number;
  splitMemories: number;
  supersededMemories: number;
  archivedMemories: number;
  integrityViolations: number;
  retentionPolicyUsage: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveMemoryLifecycleError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryLifecycleResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ExecutiveMemoryLifecycleError | null;
  readOnly: true;
}>;

export type CreateMemoryVersionInput = Readonly<{
  memoryId: ExecutiveMemoryId;
  author: string;
  operation?: ExecutiveMemoryVersionOperation;
  timestamp: string;
  reason?: string | null;
}>;

export type MergeExecutiveMemoriesInput = Readonly<{
  sourceMemoryIds: readonly ExecutiveMemoryId[];
  mergedMemoryId: ExecutiveMemoryId;
  author: string;
  timestamp: string;
  reason?: string | null;
}>;

export type SplitExecutiveMemoryTarget = Readonly<{
  memoryId: ExecutiveMemoryId;
  label: string;
}>;

export type SplitExecutiveMemoryInput = Readonly<{
  sourceMemoryId: ExecutiveMemoryId;
  targets: readonly SplitExecutiveMemoryTarget[];
  author: string;
  timestamp: string;
  reason?: string | null;
}>;

export type SupersedeExecutiveMemoryInput = Readonly<{
  obsoleteMemoryId: ExecutiveMemoryId;
  replacementMemoryId: ExecutiveMemoryId;
  author: string;
  timestamp: string;
  reason?: string | null;
}>;

export type ExecutiveMemoryVersionComparison = Readonly<{
  leftVersionId: string;
  rightVersionId: string;
  semanticVersionDelta: number;
  schemaVersionMatch: boolean;
  leftCreatedAt: string;
  rightCreatedAt: string;
  readOnly: true;
}>;

export type ExecutiveMemoryLifecycleEngineState = Readonly<{
  engineId: "executive-memory-lifecycle-engine";
  contractVersion: string;
  initialized: boolean;
  governedMemoryCount: number;
  registeredPolicyCount: number;
  timestamp: string;
  readOnly: true;
}>;

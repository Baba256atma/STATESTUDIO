/**
 * APP-4:3 — Executive Memory storage domain types.
 */

import type { ExecutiveMemoryCategory, ExecutiveMemoryId, ExecutiveMemoryProviderId, ExecutiveMemoryResult, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import type { ExecutiveMemoryMetadata } from "./executiveMemoryMetadata.ts";
import type { ExecutiveMemoryBody, ExecutiveMemoryHeader } from "./executiveMemoryMetadata.ts";
import type { ExecutiveMemoryAssumption, ExecutiveMemoryConstraint, ExecutiveMemoryEvidence, ExecutiveMemoryLessonLearned, ExecutiveMemoryOutcome } from "./executiveMemoryEvidence.ts";
import type { ExecutiveMemoryConfidence } from "./executiveMemoryConfidence.ts";
import type { ExecutiveMemoryDecision } from "./executiveMemoryDecision.ts";
import type { ExecutiveMemoryGoal } from "./executiveMemoryGoal.ts";
import type { ExecutiveMemoryReference, ExecutiveMemoryRelationship } from "./executiveMemoryReference.ts";
import type { ExecutiveMemoryIntent, ExecutiveMemoryScenario } from "./executiveMemoryScenario.ts";
import type { ExecutiveMemoryBusinessContext, ExecutiveMemoryTag } from "./executiveMemoryMetadata.ts";
import type {
  EXECUTIVE_MEMORY_STORAGE_LIFECYCLE_KEYS,
  EXECUTIVE_MEMORY_STORAGE_PROVIDER_KINDS,
} from "./executiveMemoryStorageConstants.ts";

export type ExecutiveMemoryLifecycleState = (typeof EXECUTIVE_MEMORY_STORAGE_LIFECYCLE_KEYS)[number];
export type ExecutiveMemoryStorageProviderKind = (typeof EXECUTIVE_MEMORY_STORAGE_PROVIDER_KINDS)[number];

export type ExecutiveMemoryStoredRecord = Readonly<{
  record: ExecutiveMemoryRecord;
  lifecycle: ExecutiveMemoryLifecycleState;
  storageRevision: number;
  storedAt: string;
  archivedAt: string | null;
  readOnly: true;
}>;

export type ExecutiveMemoryStorageState = Readonly<{
  engineId: "executive-memory-storage-engine";
  contractVersion: string;
  providerKind: ExecutiveMemoryStorageProviderKind;
  recordCount: number;
  activeCount: number;
  archivedCount: number;
  initialized: boolean;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveMemoryStorageStatistics = Readonly<{
  totalRecords: number;
  activeRecords: number;
  archivedRecords: number;
  providerCounts: Readonly<Record<string, number>>;
  categoryCounts: Readonly<Record<string, number>>;
  schemaVersions: Readonly<Record<string, number>>;
  workspaceCounts: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export type ExecutiveMemoryListQuery = Readonly<{
  workspaceId?: ExecutiveMemoryWorkspaceId;
  providerId?: ExecutiveMemoryProviderId;
  category?: ExecutiveMemoryCategory;
  lifecycle?: ExecutiveMemoryLifecycleState;
}>;

export type ExecutiveMemoryUpdateInput = Readonly<{
  header?: Readonly<Partial<Omit<ExecutiveMemoryHeader, "readOnly">>>;
  body?: Readonly<{
    narrative?: string;
    keyPoints?: readonly string[];
  }>;
  goal?: ExecutiveMemoryGoal | null;
  intent?: ExecutiveMemoryIntent | null;
  scenario?: ExecutiveMemoryScenario | null;
  decision?: ExecutiveMemoryDecision | null;
  evidence?: readonly ExecutiveMemoryEvidence[];
  confidence?: ExecutiveMemoryConfidence | null;
  references?: readonly ExecutiveMemoryReference[];
  tags?: readonly ExecutiveMemoryTag[];
  businessContext?: ExecutiveMemoryBusinessContext | null;
  assumptions?: readonly ExecutiveMemoryAssumption[];
  constraints?: readonly ExecutiveMemoryConstraint[];
  outcomes?: readonly ExecutiveMemoryOutcome[];
  lessonsLearned?: readonly ExecutiveMemoryLessonLearned[];
  relationships?: readonly ExecutiveMemoryRelationship[];
  metadata?: Readonly<{
    customMetadata?: Readonly<Record<string, string>>;
    extensionMetadata?: Readonly<Record<string, string>>;
  }>;
}>;

export type ExecutiveMemoryStorageError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ExecutiveMemoryStorageResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ExecutiveMemoryStorageError | null;
  readOnly: true;
}>;

export type ExecutiveMemoryStorageTransactionSnapshot = Readonly<{
  records: ReadonlyMap<ExecutiveMemoryId, ExecutiveMemoryStoredRecord>;
  readOnly: true;
}>;

export type ExecutiveMemoryStorageProviderCapabilities = Readonly<{
  kind: ExecutiveMemoryStorageProviderKind;
  supportsTransactions: boolean;
  supportsArchive: boolean;
  implemented: boolean;
  readOnly: true;
}>;

export type ExecutiveMemoryRepositoryResult<T> = ExecutiveMemoryStorageResult<T>;
export type ExecutiveMemoryPlatformStorageResult<T> = ExecutiveMemoryResult<T>;

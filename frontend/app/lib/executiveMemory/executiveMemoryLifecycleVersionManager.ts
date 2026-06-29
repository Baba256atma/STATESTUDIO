/**
 * APP-4:10 — Executive Memory version manager.
 */

import { getExecutiveMemoryById as getStoredExecutiveMemoryById } from "./executiveMemoryRetrievalEngine.ts";
import { updateExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  appendExecutiveMemoryVersionRecord,
  commitExecutiveMemoryLifecycle,
  getExecutiveMemoryLifecycle,
  getExecutiveMemoryVersionRecords,
} from "./executiveMemoryLifecycleRegistry.ts";
import {
  bumpExecutiveMemorySemanticVersion,
  createExecutiveMemoryLifecycle,
  createExecutiveMemoryLifecycleAuditMetadata,
  createExecutiveMemoryVersionHistory,
  createExecutiveMemoryVersionRecord,
} from "./executiveMemoryLifecycleModel.ts";
import {
  validateExecutiveMemoryVersionChain,
  validateExecutiveMemoryVersionRecord,
} from "./executiveMemoryLifecycleValidator.ts";
import { initializeExecutiveMemoryRetentionPolicies } from "./executiveMemoryLifecycleRetentionManager.ts";
import { EXECUTIVE_MEMORY_RETENTION_POLICY_IDS } from "./executiveMemoryLifecycleConstants.ts";
import type {
  CreateMemoryVersionInput,
  ExecutiveMemoryVersionComparison,
  ExecutiveMemoryVersionHistory,
  ExecutiveMemoryVersionRecord,
} from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

export function registerGovernedExecutiveMemory(input: {
  memoryId: ExecutiveMemoryId;
  author: string;
  timestamp: string;
  governanceState?: "draft" | "active";
}): Readonly<{ success: boolean; reason: string }> {
  initializeExecutiveMemoryRetentionPolicies();
  const stored = getStoredExecutiveMemoryById(input.memoryId);
  if (!stored.success || !stored.data) {
    return Object.freeze({ success: false, reason: `Memory not found: ${input.memoryId}.` });
  }
  if (getExecutiveMemoryLifecycle(input.memoryId)) {
    return Object.freeze({ success: false, reason: `Lifecycle already registered: ${input.memoryId}.` });
  }

  const versionId = `version-${input.memoryId}-001`;
  const version = createExecutiveMemoryVersionRecord({
    versionId,
    memoryId: input.memoryId,
    canonicalMemoryId: input.memoryId,
    parentVersionId: null,
    semanticVersion: stored.data.record.version.semanticVersion,
    schemaVersion: stored.data.record.schemaVersion,
    author: input.author,
    operation: "create",
    createdAt: input.timestamp,
  });

  appendExecutiveMemoryVersionRecord(input.memoryId, version);
  commitExecutiveMemoryLifecycle(
    createExecutiveMemoryLifecycle({
      memoryId: input.memoryId,
      governanceState: input.governanceState ?? "active",
      currentVersionId: versionId,
      retentionPolicyId: EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.keepForever,
      createdAt: input.timestamp,
      updatedAt: input.timestamp,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: input.author,
        sourceModule: "executive-memory-lifecycle",
        reason: null,
      }),
    })
  );

  return Object.freeze({ success: true, reason: "Governed memory registered." });
}

export function createMemoryVersion(
  input: CreateMemoryVersionInput
): Readonly<{ success: boolean; reason: string; version: ExecutiveMemoryVersionRecord | null }> {
  initializeExecutiveMemoryRetentionPolicies();
  const stored = getStoredExecutiveMemoryById(input.memoryId);
  if (!stored.success || !stored.data) {
    return Object.freeze({ success: false, reason: `Memory not found: ${input.memoryId}.`, version: null });
  }

  if (!getExecutiveMemoryLifecycle(input.memoryId)) {
    const registered = registerGovernedExecutiveMemory({
      memoryId: input.memoryId,
      author: input.author,
      timestamp: input.timestamp,
    });
    if (!registered.success) {
      return Object.freeze({ success: false, reason: registered.reason, version: null });
    }
  }

  const lifecycle = getExecutiveMemoryLifecycle(input.memoryId)!;
  const canonicalMemoryId = lifecycle.canonicalMemoryId;
  const history = getExecutiveMemoryVersionRecords(canonicalMemoryId);
  const latest = history.at(-1);
  const nextSemantic = bumpExecutiveMemorySemanticVersion(latest?.semanticVersion ?? "1.0.0");
  const versionId = `version-${input.memoryId}-${String(history.length + 1).padStart(3, "0")}`;

  const version = createExecutiveMemoryVersionRecord({
    versionId,
    memoryId: input.memoryId,
    canonicalMemoryId,
    parentVersionId: latest?.versionId ?? null,
    semanticVersion: nextSemantic,
    schemaVersion: stored.data.record.schemaVersion,
    author: input.author,
    operation: input.operation ?? "update",
    createdAt: input.timestamp,
  });

  const validation = validateExecutiveMemoryVersionRecord(version);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      version: null,
    });
  }

  appendExecutiveMemoryVersionRecord(canonicalMemoryId, version);
  updateExecutiveMemory(
    input.memoryId,
    Object.freeze({
      version: Object.freeze({
        ...stored.data.record.version,
        versionId,
        semanticVersion: nextSemantic,
        createdAt: input.timestamp,
      }),
    }),
    input.timestamp
  );

  commitExecutiveMemoryLifecycle(
    Object.freeze({
      ...lifecycle,
      currentVersionId: versionId,
      updatedAt: input.timestamp,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: input.author,
        sourceModule: "executive-memory-lifecycle",
        reason: input.reason ?? lifecycle.audit.reason,
      }),
      readOnly: true as const,
    })
  );

  const chainValidation = validateExecutiveMemoryVersionChain(canonicalMemoryId);
  if (!chainValidation.valid) {
    return Object.freeze({
      success: false,
      reason: chainValidation.issues.map((entry) => entry.message).join("; "),
      version: null,
    });
  }

  return Object.freeze({ success: true, reason: "Version created.", version });
}

export function getMemoryVersionHistory(memoryId: ExecutiveMemoryId): ExecutiveMemoryVersionHistory {
  const lifecycle = getExecutiveMemoryLifecycle(memoryId);
  const canonicalMemoryId = lifecycle?.canonicalMemoryId ?? memoryId;
  return createExecutiveMemoryVersionHistory(canonicalMemoryId, getExecutiveMemoryVersionRecords(canonicalMemoryId));
}

export function getLatestVersion(memoryId: ExecutiveMemoryId): ExecutiveMemoryVersionRecord | null {
  const history = getMemoryVersionHistory(memoryId);
  return history.versions.at(-1) ?? null;
}

export function compareVersions(
  leftVersionId: string,
  rightVersionId: string,
  canonicalMemoryId: ExecutiveMemoryId
): ExecutiveMemoryVersionComparison | null {
  const records = getExecutiveMemoryVersionRecords(canonicalMemoryId);
  const left = records.find((entry) => entry.versionId === leftVersionId);
  const right = records.find((entry) => entry.versionId === rightVersionId);
  if (!left || !right) return null;

  const leftParts = left.semanticVersion.split(".").map(Number);
  const rightParts = right.semanticVersion.split(".").map(Number);
  const semanticVersionDelta = (rightParts[2] ?? 0) - (leftParts[2] ?? 0);

  return Object.freeze({
    leftVersionId,
    rightVersionId,
    semanticVersionDelta,
    schemaVersionMatch: left.schemaVersion === right.schemaVersion,
    leftCreatedAt: left.createdAt,
    rightCreatedAt: right.createdAt,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryVersionManager = Object.freeze({
  registerGovernedExecutiveMemory,
  createMemoryVersion,
  getMemoryVersionHistory,
  getLatestVersion,
  compareVersions,
});

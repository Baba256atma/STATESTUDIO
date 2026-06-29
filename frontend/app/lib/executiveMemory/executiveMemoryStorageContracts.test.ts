import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import { initializeExecutiveMemoryPlatform, resetExecutiveMemoryPlatformForTests } from "./executiveMemoryPlatform.ts";
import { registerExecutiveMemoryProvider } from "./executiveMemoryRegistry.ts";
import { validateExecutiveMemoryRecordShape } from "./executiveMemoryRecordValidation.ts";
import {
  EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_STORAGE_ERROR_CODES,
} from "./executiveMemoryStorageConstants.ts";
import {
  EXECUTIVE_MEMORY_STORAGE_IDENTITY,
  EXECUTIVE_MEMORY_STORAGE_SELF_MANIFEST,
  ExecutiveMemoryStorageContracts,
} from "./executiveMemoryStorageContracts.ts";
import {
  archiveExecutiveMemory,
  createExecutiveMemory,
  deleteExecutiveMemory,
  getExecutiveMemories,
  getExecutiveMemoryById,
  getExecutiveMemoryMetadata,
  getExecutiveMemoryStatistics,
  hasExecutiveMemory,
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
  restoreExecutiveMemory,
  saveExecutiveMemory,
  updateExecutiveMemory,
} from "./executiveMemoryStorageEngine.ts";
import { createExecutiveMemoryConfidence } from "./executiveMemoryConfidence.ts";
import { createExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";

function registerStorageTestProvider(): void {
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "executive-memory-foundation-provider",
      label: "Foundation Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["decision", "goal", "evidence"] as const),
    }),
    FIXED_TIME
  );
}

test.beforeEach(() => {
  resetExecutiveMemoryPlatformForTests();
  resetExecutiveMemoryStorageEngineForTests();
  registerStorageTestProvider();
  initializeExecutiveMemoryStorageEngine(FIXED_TIME);
});

test("exports APP-4:3 storage identity and extends APP-4:1 and APP-4:2", () => {
  assert.equal(EXECUTIVE_MEMORY_STORAGE_IDENTITY.phaseId, "APP-4/3");
  assert.equal(EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION, "APP-4/3");
  assert.equal(ExecutiveMemoryStorageContracts.version, "APP-4/3");
});

test("creates and retrieves executive memory records", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  const created = createExecutiveMemory(record, FIXED_TIME);
  assert.equal(created.success, true);
  assert.equal(hasExecutiveMemory(record.id), true);
  const stored = getExecutiveMemoryById(record.id);
  assert.ok(stored);
  assert.equal(stored?.record.id, record.id);
  assert.equal(stored?.lifecycle, "active");
});

test("save updates existing records without duplicate rejection", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  assert.equal(createExecutiveMemory(record, FIXED_TIME).success, true);
  const saved = saveExecutiveMemory(record, UPDATE_TIME);
  assert.equal(saved.success, true);
  assert.equal(saved.data?.storageRevision, 2);
});

test("updates executive memory with controlled partial changes", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const updated = updateExecutiveMemory(
    record.id,
    Object.freeze({
      header: Object.freeze({ summary: "Updated executive summary." }),
    }),
    UPDATE_TIME
  );
  assert.equal(updated.success, true);
  assert.equal(updated.data?.record.header.summary, "Updated executive summary.");
  assert.equal(updated.data?.record.updatedAt, UPDATE_TIME);
  assert.notEqual(updated.data?.record.version.semanticVersion, record.version.semanticVersion);
});

test("archives and restores executive memory records", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const archived = archiveExecutiveMemory(record.id, UPDATE_TIME);
  assert.equal(archived.success, true);
  assert.equal(archived.data?.lifecycle, "archived");
  assert.ok(archived.data?.archivedAt);

  const restored = restoreExecutiveMemory(record.id, UPDATE_TIME);
  assert.equal(restored.success, true);
  assert.equal(restored.data?.lifecycle, "active");
  assert.equal(restored.data?.archivedAt, null);
});

test("delete performs soft archive only", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const deleted = deleteExecutiveMemory(record.id, UPDATE_TIME);
  assert.equal(deleted.success, true);
  assert.equal(deleted.data?.lifecycle, "archived");
  assert.ok(getExecutiveMemoryById(record.id));
});

test("rejects duplicate record ids on create", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  assert.equal(createExecutiveMemory(record, FIXED_TIME).success, true);
  const duplicate = createExecutiveMemory(record, FIXED_TIME);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, EXECUTIVE_MEMORY_STORAGE_ERROR_CODES.duplicateId);
});

test("rejects invalid schema on create", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  const invalid = Object.freeze({
    ...record,
    confidence: createExecutiveMemoryConfidence({
      confidenceId: "bad-confidence",
      score: 2,
      level: "high",
      source: "test",
      explanation: "invalid",
      calculationMethod: "test",
    }),
  });
  const result = createExecutiveMemory(invalid, FIXED_TIME);
  assert.equal(result.success, false);
  assert.equal(result.error?.code, EXECUTIVE_MEMORY_STORAGE_ERROR_CODES.validationFailure);
});

test("rejects unregistered provider on create", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  const invalid = createExecutiveMemoryRecord({
    ...record,
    providerId: "provider-not-registered",
    metadata: Object.freeze({
      ...record.metadata,
      memoryId: "memory-unregistered-provider",
    }),
    id: "memory-unregistered-provider",
  });
  const result = createExecutiveMemory(invalid, FIXED_TIME);
  assert.equal(result.success, false);
  assert.equal(result.error?.code, EXECUTIVE_MEMORY_STORAGE_ERROR_CODES.invalidProvider);
});

test("enforces validation before commit and rolls back failed transactions", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const beforeCount = getExecutiveMemories().length;
  const invalidUpdate = updateExecutiveMemory(
    record.id,
    Object.freeze({
      confidence: createExecutiveMemoryConfidence({
        confidenceId: "bad-confidence",
        score: -1,
        level: "high",
        source: "test",
        explanation: "invalid",
        calculationMethod: "test",
      }),
    }),
    UPDATE_TIME
  );
  assert.equal(invalidUpdate.success, false);
  assert.equal(getExecutiveMemories().length, beforeCount);
  assert.equal(getExecutiveMemoryById(record.id)?.record.confidence?.score, record.confidence?.score ?? null);
});

test("preserves metadata and version on stored records", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const metadata = getExecutiveMemoryMetadata(record.id);
  assert.ok(metadata);
  assert.equal(metadata?.memoryId, record.id);
  assert.equal(metadata?.workspaceId, record.workspaceId);
  const stored = getExecutiveMemoryById(record.id);
  assert.equal(stored?.record.version.contractVersion, record.version.contractVersion);
  assert.equal(stored?.record.version.compatibility.app41Compatible, true);
});

test("computes lightweight storage statistics", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME, "decision");
  const goalRecord = buildExecutiveMemoryRecordExample(FIXED_TIME, "goal");
  createExecutiveMemory(record, FIXED_TIME);
  createExecutiveMemory(
    createExecutiveMemoryRecord({
      ...goalRecord,
      id: "memory-record-example-002",
      category: "goal",
      metadata: Object.freeze({
        ...goalRecord.metadata,
        memoryId: "memory-record-example-002",
        category: "goal",
      }),
    }),
    FIXED_TIME
  );
  archiveExecutiveMemory(record.id, UPDATE_TIME);

  const stats = getExecutiveMemoryStatistics();
  assert.equal(stats.totalRecords, 2);
  assert.equal(stats.activeRecords, 1);
  assert.equal(stats.archivedRecords, 1);
  assert.equal(stats.providerCounts["executive-memory-foundation-provider"], 2);
  assert.ok(stats.categoryCounts.decision >= 1);
  assert.ok(stats.schemaVersions["1.0.0"] >= 1);
});

test("lists records with lifecycle and workspace filters only", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const active = getExecutiveMemories(Object.freeze({ lifecycle: "active" }));
  assert.equal(active.length, 1);
  const archived = getExecutiveMemories(Object.freeze({ lifecycle: "archived" }));
  assert.equal(archived.length, 0);
});

test("validates stored record immutability", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const stored = getExecutiveMemoryById(record.id);
  assert.equal(Object.isFrozen(stored), true);
  assert.equal(Object.isFrozen(stored?.record), true);
  assert.equal(Object.isFrozen(stored?.record.metadata), true);
});

test("validates APP-4:3 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_MEMORY_STORAGE_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveMemoryStorageEngine.ts",
      allowedFiles: EXECUTIVE_MEMORY_STORAGE_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_STORAGE_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-4:2 record contracts remain valid", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  assert.equal(validateExecutiveMemoryRecordShape(record).valid, true);
});

test("regression: APP-4:1 foundation platform initializes independently", () => {
  resetExecutiveMemoryPlatformForTests();
  const init = initializeExecutiveMemoryPlatform(FIXED_TIME);
  assert.equal(init.success, true);
});

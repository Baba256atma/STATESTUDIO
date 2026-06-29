import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import { initializeExecutiveMemoryPlatform, resetExecutiveMemoryPlatformForTests } from "./executiveMemoryPlatform.ts";
import { registerExecutiveMemoryProvider } from "./executiveMemoryRegistry.ts";
import { validateExecutiveMemoryRecordShape } from "./executiveMemoryRecordValidation.ts";
import {
  archiveExecutiveMemory,
  createExecutiveMemory,
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "./executiveMemoryStorageEngine.ts";
import { createExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import {
  EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES,
} from "./executiveMemoryRetrievalConstants.ts";
import { createExecutiveMemoryQuery } from "./executiveMemoryQuery.ts";
import {
  countExecutiveMemories,
  findArchivedExecutiveMemories,
  findExecutiveMemories,
  findExecutiveMemoriesByCategory,
  findExecutiveMemoriesByDecision,
  findExecutiveMemoriesByGoal,
  findExecutiveMemoriesByIntent,
  findExecutiveMemoriesByProvider,
  findExecutiveMemoriesByReference,
  findExecutiveMemoriesByScenario,
  findExecutiveMemoriesByTag,
  findExecutiveMemoriesByWorkspace,
  getExecutiveMemoryById,
  getRecentExecutiveMemories,
  initializeExecutiveMemoryRetrievalEngine,
  resetExecutiveMemoryRetrievalEngineForTests,
} from "./executiveMemoryRetrievalEngine.ts";
import {
  EXECUTIVE_MEMORY_RETRIEVAL_IDENTITY,
  EXECUTIVE_MEMORY_RETRIEVAL_SELF_MANIFEST,
  ExecutiveMemoryRetrievalContracts,
} from "./executiveMemoryRetrievalContracts.ts";
import { validateExecutiveMemoryQuery } from "./executiveMemoryQueryValidator.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";
const LATER_TIME = "2026-01-03T00:00:00.000Z";

function registerTestEnvironment(): void {
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
  initializeExecutiveMemoryStorageEngine(FIXED_TIME);
  initializeExecutiveMemoryRetrievalEngine(FIXED_TIME);
}

function seedExampleRecord(timestamp: string = FIXED_TIME) {
  const record = buildExecutiveMemoryRecordExample(timestamp);
  createExecutiveMemory(record, timestamp);
  return record;
}

test.beforeEach(() => {
  resetExecutiveMemoryPlatformForTests();
  resetExecutiveMemoryStorageEngineForTests();
  resetExecutiveMemoryRetrievalEngineForTests();
  registerTestEnvironment();
});

test("exports APP-4:4 retrieval identity and extends prior APP-4 phases", () => {
  assert.equal(EXECUTIVE_MEMORY_RETRIEVAL_IDENTITY.phaseId, "APP-4/4");
  assert.equal(EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION, "APP-4/4");
  assert.equal(ExecutiveMemoryRetrievalContracts.version, "APP-4/4");
});

test("retrieves executive memory by id", () => {
  const record = seedExampleRecord();
  const result = getExecutiveMemoryById(record.id);
  assert.equal(result.success, true);
  assert.equal(result.data?.record.id, record.id);
  assert.equal(result.statistics.queryType, "by_id");
});

test("returns empty result for unknown id without throwing", () => {
  const result = getExecutiveMemoryById("memory-record-missing-001");
  assert.equal(result.success, true);
  assert.equal(result.data, null);
  assert.equal(result.statistics.recordsReturned, 0);
});

test("finds executive memories by workspace", () => {
  const record = seedExampleRecord();
  const result = findExecutiveMemoriesByWorkspace(record.workspaceId);
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
  assert.equal(result.statistics.queryType, "by_workspace");
});

test("finds executive memories by goal", () => {
  const record = seedExampleRecord();
  const result = findExecutiveMemoriesByGoal(record.goal!.goalId);
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
});

test("finds executive memories by intent", () => {
  const record = seedExampleRecord();
  const result = findExecutiveMemoriesByIntent(record.intent!.intentId);
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
});

test("finds executive memories by scenario", () => {
  const record = seedExampleRecord();
  const result = findExecutiveMemoriesByScenario(record.scenario!.scenarioId);
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
});

test("finds executive memories by decision", () => {
  const record = seedExampleRecord();
  const result = findExecutiveMemoriesByDecision(record.decision!.decisionId);
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
});

test("finds executive memories by category", () => {
  seedExampleRecord();
  const result = findExecutiveMemoriesByCategory("decision");
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
});

test("finds executive memories by provider", () => {
  seedExampleRecord();
  const result = findExecutiveMemoriesByProvider("executive-memory-foundation-provider");
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
});

test("finds executive memories by reference id", () => {
  const record = seedExampleRecord();
  const referenceId = record.references[0]?.referenceId;
  assert.ok(referenceId);
  const result = findExecutiveMemoriesByReference(referenceId);
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
});

test("finds executive memories by tag", () => {
  const record = seedExampleRecord();
  const tag = record.tags[0]?.tagId;
  assert.ok(tag);
  const result = findExecutiveMemoriesByTag(tag);
  assert.equal(result.success, true);
  assert.equal(result.records.length, 1);
});

test("finds archived executive memories", () => {
  const record = seedExampleRecord();
  archiveExecutiveMemory(record.id, UPDATE_TIME);
  const active = findExecutiveMemories(createExecutiveMemoryQuery({ lifecycleState: "active" }));
  const archived = findArchivedExecutiveMemories();
  assert.equal(active.records.length, 0);
  assert.equal(archived.records.length, 1);
  assert.equal(archived.records[0]?.lifecycle, "archived");
});

test("returns recent executive memories sorted by updatedAt desc", () => {
  const first = seedExampleRecord(FIXED_TIME);
  const second = createExecutiveMemoryRecord({
    ...buildExecutiveMemoryRecordExample(UPDATE_TIME),
    id: "memory-record-example-002",
    metadata: Object.freeze({
      ...buildExecutiveMemoryRecordExample(UPDATE_TIME).metadata,
      memoryId: "memory-record-example-002",
    }),
    updatedAt: UPDATE_TIME,
    createdAt: UPDATE_TIME,
  });
  createExecutiveMemory(second, UPDATE_TIME);
  const recent = getRecentExecutiveMemories(2);
  assert.equal(recent.success, true);
  assert.equal(recent.records[0]?.record.id, second.id);
  assert.equal(recent.records[1]?.record.id, first.id);
});

test("supports deterministic sorting and pagination", () => {
  seedExampleRecord(FIXED_TIME);
  createExecutiveMemory(
    createExecutiveMemoryRecord({
      ...buildExecutiveMemoryRecordExample(LATER_TIME),
      id: "memory-record-example-003",
      metadata: Object.freeze({
        ...buildExecutiveMemoryRecordExample(LATER_TIME).metadata,
        memoryId: "memory-record-example-003",
      }),
    }),
    LATER_TIME
  );

  const sorted = findExecutiveMemories(
    createExecutiveMemoryQuery({
      sortBy: "id",
      sortDirection: "desc",
      limit: 1,
      offset: 0,
    })
  );
  assert.equal(sorted.records.length, 1);
  assert.equal(sorted.totalMatched, 2);
  assert.equal(sorted.records[0]?.record.id, "memory-record-example-003");
});

test("counts executive memories for a query", () => {
  seedExampleRecord();
  const count = countExecutiveMemories(createExecutiveMemoryQuery({ category: "decision" }));
  assert.equal(count.success, true);
  assert.equal(count.data, 1);
  assert.equal(count.statistics.queryType, "count");
});

test("rejects invalid query categories", () => {
  const validation = validateExecutiveMemoryQuery(createExecutiveMemoryQuery({ category: "chat_memory" as never }));
  assert.equal(validation.valid, false);
  const result = findExecutiveMemories(createExecutiveMemoryQuery({ category: "chat_memory" as never }));
  assert.equal(result.success, false);
  assert.equal(result.error?.code, EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES.queryValidationFailure);
});

test("rejects invalid lifecycle states", () => {
  const validation = validateExecutiveMemoryQuery(
    createExecutiveMemoryQuery({ lifecycleState: "deleted" as never })
  );
  assert.equal(validation.valid, false);
});

test("rejects invalid pagination and sort options", () => {
  assert.equal(validateExecutiveMemoryQuery(createExecutiveMemoryQuery({ limit: -1 })).valid, false);
  assert.equal(validateExecutiveMemoryQuery(createExecutiveMemoryQuery({ sortBy: "relevance" as never })).valid, false);
});

test("rejects malformed identifiers", () => {
  const validation = validateExecutiveMemoryQuery(createExecutiveMemoryQuery({ id: "   " }));
  assert.equal(validation.valid, false);
  const result = getExecutiveMemoryById("   ");
  assert.equal(result.success, false);
  assert.equal(result.error?.code, EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES.malformedIdentifier);
});

test("preserves deterministic ordering for equal queries", () => {
  seedExampleRecord();
  createExecutiveMemory(
    createExecutiveMemoryRecord({
      ...buildExecutiveMemoryRecordExample(FIXED_TIME, "goal"),
      id: "memory-record-example-004",
      category: "goal",
      metadata: Object.freeze({
        ...buildExecutiveMemoryRecordExample(FIXED_TIME, "goal").metadata,
        memoryId: "memory-record-example-004",
        category: "goal",
      }),
    }),
    FIXED_TIME
  );
  const first = findExecutiveMemories(createExecutiveMemoryQuery({ sortBy: "id", sortDirection: "asc" }));
  const second = findExecutiveMemories(createExecutiveMemoryQuery({ sortBy: "id", sortDirection: "asc" }));
  assert.deepEqual(
    first.records.map((entry) => entry.record.id),
    second.records.map((entry) => entry.record.id)
  );
});

test("returns empty results for unmatched filters without error", () => {
  const result = findExecutiveMemoriesByGoal("goal-does-not-exist");
  assert.equal(result.success, true);
  assert.equal(result.records.length, 0);
  assert.equal(result.totalMatched, 0);
});

test("validates APP-4:4 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_MEMORY_RETRIEVAL_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveMemoryRetrievalEngine.ts",
      allowedFiles: EXECUTIVE_MEMORY_RETRIEVAL_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_RETRIEVAL_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-4:2 record contracts remain valid", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  assert.equal(validateExecutiveMemoryRecordShape(record).valid, true);
});

test("regression: APP-4:3 storage create still works", () => {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  const created = createExecutiveMemory(record, FIXED_TIME);
  assert.equal(created.success, true);
});

test("regression: APP-4:1 foundation initializes independently", () => {
  resetExecutiveMemoryPlatformForTests();
  const init = initializeExecutiveMemoryPlatform(FIXED_TIME);
  assert.equal(init.success, true);
});

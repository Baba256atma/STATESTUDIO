import assert from "node:assert/strict";
import test from "node:test";

import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import { createExecutiveMemoryConfidence } from "./executiveMemoryConfidence.ts";
import { initializeExecutiveMemoryPlatform, resetExecutiveMemoryPlatformForTests } from "./executiveMemoryPlatform.ts";
import { registerExecutiveMemoryProvider } from "./executiveMemoryRegistry.ts";
import { createExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import { validateExecutiveMemoryRecordShape } from "./executiveMemoryRecordValidation.ts";
import {
  initializeExecutiveMemoryRetrievalEngine,
  resetExecutiveMemoryRetrievalEngineForTests,
} from "./executiveMemoryRetrievalEngine.ts";
import {
  createExecutiveMemory,
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "./executiveMemoryStorageEngine.ts";
import {
  initializeExecutiveIntentMemoryLinkEngine,
  resetExecutiveIntentMemoryLinkEngineForTests,
} from "./executiveIntentMemoryLinkEngine.ts";
import {
  initializeExecutiveScenarioMemoryEngine,
  resetExecutiveScenarioMemoryEngineForTests,
} from "./executiveScenarioMemoryEngine.ts";
import {
  initializeExecutiveDecisionMemoryEngine,
  resetExecutiveDecisionMemoryEngineForTests,
} from "./executiveDecisionMemoryEngine.ts";
import {
  initializeExecutiveContextMemoryEngine,
  resetExecutiveContextMemoryEngineForTests,
} from "./executiveContextMemoryEngine.ts";
import {
  initializeExecutiveMemorySearchEngine,
  resetExecutiveMemorySearchEngineForTests,
} from "./executiveMemorySearchEngine.ts";
import {
  EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_LIFECYCLE_ERROR_CODES,
  EXECUTIVE_MEMORY_RETENTION_POLICY_IDS,
} from "./executiveMemoryLifecycleConstants.ts";
import {
  archiveMemoryLifecycle,
  compareVersions,
  createMemoryVersion,
  getExecutiveMemoryLifecycleStatistics,
  getLatestVersion,
  getMemoryVersionHistory,
  getRetentionPolicies,
  initializeExecutiveMemoryLifecycleEngine,
  inspectMemoryIntegrity,
  inspectMergeHistory,
  mergeExecutiveMemories,
  registerGovernedMemory,
  resetExecutiveMemoryLifecycleEngineForTests,
  restoreExecutiveMemoryVersion,
  restoreSupersededMemory,
  splitExecutiveMemory,
  supersedeExecutiveMemory,
  applyRetentionPolicy,
  validateMerge,
  validateMemoryLifecycle,
} from "./executiveMemoryLifecycleEngine.ts";
import { validateExecutiveMemoryLifecycleTransition } from "./executiveMemoryLifecycleValidator.ts";
import {
  EXECUTIVE_MEMORY_LIFECYCLE_IDENTITY,
  EXECUTIVE_MEMORY_LIFECYCLE_SELF_MANIFEST,
  ExecutiveMemoryLifecycleContracts,
} from "./executiveMemoryLifecycleContracts.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";
const AUTHOR = "executive-governance";

function registerLifecycleEnvironment() {
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
  initializeExecutiveIntentMemoryLinkEngine(FIXED_TIME);
  initializeExecutiveScenarioMemoryEngine(FIXED_TIME);
  initializeExecutiveDecisionMemoryEngine(FIXED_TIME);
  initializeExecutiveContextMemoryEngine(FIXED_TIME);
  initializeExecutiveMemorySearchEngine(FIXED_TIME);
  initializeExecutiveMemoryLifecycleEngine(FIXED_TIME);
}

function seedSecondaryRecord(id: string, timestamp: string) {
  const base = buildExecutiveMemoryRecordExample(timestamp);
  return createExecutiveMemoryRecord({
    ...base,
    id,
    metadata: Object.freeze({ ...base.metadata, memoryId: id }),
    confidence: createExecutiveMemoryConfidence({
      confidenceId: `confidence-${id}`,
      score: 0.75,
      level: "medium",
      source: "executive-review",
      explanation: "Secondary governed record.",
      calculationMethod: "executive_assessment_v1",
    }),
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

function seedGovernedPair() {
  const primary = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(primary, FIXED_TIME);
  registerGovernedMemory(primary.id, AUTHOR, FIXED_TIME);

  const secondary = seedSecondaryRecord("memory-record-example-002", UPDATE_TIME);
  createExecutiveMemory(secondary, UPDATE_TIME);
  registerGovernedMemory(secondary.id, AUTHOR, UPDATE_TIME);

  return { primary, secondary };
}

test.beforeEach(() => {
  resetExecutiveMemoryPlatformForTests();
  resetExecutiveMemoryStorageEngineForTests();
  resetExecutiveMemoryRetrievalEngineForTests();
  resetExecutiveIntentMemoryLinkEngineForTests();
  resetExecutiveScenarioMemoryEngineForTests();
  resetExecutiveDecisionMemoryEngineForTests();
  resetExecutiveContextMemoryEngineForTests();
  resetExecutiveMemorySearchEngineForTests();
  resetExecutiveMemoryLifecycleEngineForTests();
});

test("exports APP-4:10 lifecycle identity and extends APP-4 phases", () => {
  assert.equal(EXECUTIVE_MEMORY_LIFECYCLE_IDENTITY.phaseId, "APP-4/10");
  assert.equal(EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION, "APP-4/10");
  assert.equal(ExecutiveMemoryLifecycleContracts.version, "APP-4/10");
});

test("registers governed memory and creates versions", () => {
  registerLifecycleEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  assert.equal(registerGovernedMemory(record.id, AUTHOR, FIXED_TIME).success, true);

  const version = createMemoryVersion({
    memoryId: record.id,
    author: AUTHOR,
    timestamp: UPDATE_TIME,
  });
  assert.equal(version.success, true);
  assert.equal(getMemoryVersionHistory(record.id).versions.length, 2);
  assert.ok(getLatestVersion(record.id));
});

test("compares version history deterministically", () => {
  registerLifecycleEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);
  createMemoryVersion({ memoryId: record.id, author: AUTHOR, timestamp: UPDATE_TIME });

  const history = getMemoryVersionHistory(record.id);
  const comparison = compareVersions(
    history.versions[0]!.versionId,
    history.versions[1]!.versionId,
    record.id
  );
  assert.ok(comparison);
  assert.equal(comparison?.semanticVersionDelta, 1);
});

test("merges executive memories with lineage preservation", () => {
  registerLifecycleEnvironment();
  const { primary, secondary } = seedGovernedPair();
  const mergeValidation = validateMerge(
    Object.freeze({
      sourceMemoryIds: Object.freeze([primary.id, secondary.id]),
      mergedMemoryId: "memory-merged-001",
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  assert.equal(mergeValidation.valid, true);

  const merged = mergeExecutiveMemories(
    Object.freeze({
      sourceMemoryIds: Object.freeze([primary.id, secondary.id]),
      mergedMemoryId: "memory-merged-001",
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  assert.equal(merged.success, true);
  assert.equal(inspectMergeHistory().length, 1);
});

test("rejects merge conflicts for duplicate merged id", () => {
  registerLifecycleEnvironment();
  seedGovernedPair();
  const conflict = mergeExecutiveMemories(
    Object.freeze({
      sourceMemoryIds: Object.freeze(["memory-record-example-001", "memory-record-example-002"]),
      mergedMemoryId: "memory-record-example-001",
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  assert.equal(conflict.success, false);
  assert.match(conflict.reason, /merge/i);
});

test("splits executive memory into derived records", () => {
  registerLifecycleEnvironment();
  const { primary } = seedGovernedPair();
  const split = splitExecutiveMemory(
    Object.freeze({
      sourceMemoryId: primary.id,
      targets: Object.freeze([
        Object.freeze({ memoryId: "memory-split-a", label: "Split A" }),
        Object.freeze({ memoryId: "memory-split-b", label: "Split B" }),
      ]),
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  assert.equal(split.success, true);
});

test("supersedes and restores executive memory", () => {
  registerLifecycleEnvironment();
  const { primary, secondary } = seedGovernedPair();
  const superseded = supersedeExecutiveMemory(
    Object.freeze({
      obsoleteMemoryId: primary.id,
      replacementMemoryId: secondary.id,
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  assert.equal(superseded.success, true);

  const restored = restoreSupersededMemory({
    memoryId: primary.id,
    author: AUTHOR,
    timestamp: UPDATE_TIME,
  });
  assert.equal(restored.success, true);
});

test("archives lifecycle and restores version", () => {
  registerLifecycleEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);
  createMemoryVersion({ memoryId: record.id, author: AUTHOR, timestamp: UPDATE_TIME });
  const firstVersion = getMemoryVersionHistory(record.id).versions[0]!.versionId;

  const archived = archiveMemoryLifecycle({
    memoryId: record.id,
    author: AUTHOR,
    timestamp: UPDATE_TIME,
  });
  assert.equal(archived.success, true);
  assert.equal(archived.data?.governanceState, "archived");

  const restored = restoreExecutiveMemoryVersion({
    memoryId: record.id,
    versionId: firstVersion,
    author: AUTHOR,
    timestamp: UPDATE_TIME,
  });
  assert.equal(restored.success, true);
  assert.equal(restored.data?.governanceState, "active");
});

test("rejects invalid lifecycle transitions", () => {
  registerLifecycleEnvironment();
  const { primary } = seedGovernedPair();
  mergeExecutiveMemories(
    Object.freeze({
      sourceMemoryIds: Object.freeze(["memory-record-example-001", "memory-record-example-002"]),
      mergedMemoryId: "memory-merged-transition-test",
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  const invalid = validateExecutiveMemoryLifecycleTransition({
    memoryId: primary.id,
    toState: "active",
  });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.issues[0]?.code, "invalid_transition");
});

test("applies retention policies", () => {
  registerLifecycleEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);

  const policies = getRetentionPolicies();
  assert.ok(policies.some((entry) => entry.policyId === EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.protectedMemory));

  const applied = applyRetentionPolicy({
    memoryId: record.id,
    policyId: EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.regulatoryRetention,
    timestamp: UPDATE_TIME,
  });
  assert.equal(applied.success, true);
});

test("inspects memory integrity for governed records", () => {
  registerLifecycleEnvironment();
  seedGovernedPair();
  const report = inspectMemoryIntegrity(UPDATE_TIME);
  assert.equal(report.recordsInspected >= 2, true);
  assert.equal(validateMemoryLifecycle("memory-record-example-001").valid, true);
});

test("computes lifecycle statistics", () => {
  registerLifecycleEnvironment();
  seedGovernedPair();
  mergeExecutiveMemories(
    Object.freeze({
      sourceMemoryIds: Object.freeze(["memory-record-example-001", "memory-record-example-002"]),
      mergedMemoryId: "memory-merged-stats",
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  const stats = getExecutiveMemoryLifecycleStatistics(UPDATE_TIME);
  assert.ok(stats.totalVersions >= 2);
  assert.ok(stats.mergedMemories >= 1);
});

test("validates APP-4:10 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_MEMORY_LIFECYCLE_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveMemoryLifecycleEngine.ts",
      allowedFiles: EXECUTIVE_MEMORY_LIFECYCLE_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_LIFECYCLE_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid, true);
});

test("regression: APP-4:4 retrieval remains operational", () => {
  registerLifecycleEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  assert.equal(registerGovernedMemory(record.id, AUTHOR, FIXED_TIME).success, true);
});

test("regression: APP-4:9 search engine initializes independently", () => {
  resetExecutiveMemoryLifecycleEngineForTests();
  initializeExecutiveMemorySearchEngine(FIXED_TIME);
  assert.equal(initializeExecutiveMemoryLifecycleEngine(FIXED_TIME).success, true);
});

test("rejects split with insufficient targets", () => {
  registerLifecycleEnvironment();
  const { primary } = seedGovernedPair();
  const split = splitExecutiveMemory(
    Object.freeze({
      sourceMemoryId: primary.id,
      targets: Object.freeze([Object.freeze({ memoryId: "memory-only-one", label: "Only One" })]),
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  assert.equal(split.success, false);
  assert.match(split.reason, /split/i);
});

test("rejects invalid retention policy application", () => {
  registerLifecycleEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);
  const applied = applyRetentionPolicy({
    memoryId: record.id,
    policyId: "retention-missing",
    timestamp: UPDATE_TIME,
  });
  assert.equal(applied.success, false);
});

test("validates version chain after version creation", () => {
  registerLifecycleEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);
  createMemoryVersion({ memoryId: record.id, author: AUTHOR, timestamp: UPDATE_TIME });
  assert.equal(validateMemoryLifecycle(record.id).valid, true);
});

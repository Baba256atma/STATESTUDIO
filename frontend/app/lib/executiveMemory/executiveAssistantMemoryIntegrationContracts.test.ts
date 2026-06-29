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
  searchExecutiveMemories,
} from "./executiveMemorySearchEngine.ts";
import {
  archiveMemoryLifecycle,
  initializeExecutiveMemoryLifecycleEngine,
  mergeExecutiveMemories,
  registerGovernedMemory,
  resetExecutiveMemoryLifecycleEngineForTests,
  supersedeExecutiveMemory,
} from "./executiveMemoryLifecycleEngine.ts";
import {
  commitExecutiveMemoryLifecycle,
  getExecutiveMemoryLifecycle,
} from "./executiveMemoryLifecycleRegistry.ts";
import {
  createExecutiveMemoryLifecycle,
  createExecutiveMemoryLifecycleAuditMetadata,
} from "./executiveMemoryLifecycleModel.ts";
import {
  EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION,
  EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ERROR_CODES,
  EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS,
} from "./executiveAssistantMemoryIntegrationConstants.ts";
import {
  evaluateExecutiveAssistantMemoryPermission,
  validateAssistantMemoryAccess,
  buildAssistantMemoryCitation,
  explainAssistantMemorySelection,
  getAssistantMemoryIntegrationStatistics,
  initializeExecutiveAssistantMemoryIntegrationEngine,
  listAssistantRetrievalProfiles,
  resetExecutiveAssistantMemoryIntegrationEngineForTests,
  retrieveAssistantMemory,
  retrieveAssistantMemoryByContext,
  retrieveAssistantMemoryByDecision,
  retrieveAssistantMemoryByIntent,
  retrieveAssistantMemoryByScenario,
  retrieveAssistantMemoryByWorkspace,
  EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_IDENTITY,
  EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_SELF_MANIFEST,
  ExecutiveAssistantMemoryIntegrationContracts,
} from "./executiveAssistantMemoryIntegrationContracts.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";
const AUTHOR = "executive-governance";

function registerIntegrationEnvironment() {
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
  initializeExecutiveAssistantMemoryIntegrationEngine(FIXED_TIME);
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

function seedPrimaryRecord() {
  const primary = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(primary, FIXED_TIME);
  registerGovernedMemory(primary.id, AUTHOR, FIXED_TIME);
  return primary;
}

function seedPair() {
  const primary = seedPrimaryRecord();
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
  resetExecutiveAssistantMemoryIntegrationEngineForTests();
});

test("exports APP-4:11 identity and extends APP-4 phases", () => {
  assert.equal(EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_IDENTITY.phaseId, "APP-4/11");
  assert.equal(EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_CONTRACT_VERSION, "APP-4/11");
  assert.equal(ExecutiveAssistantMemoryIntegrationContracts.version, "APP-4/11");
});

test("initializes assistant integration engine with retrieval profiles", () => {
  registerIntegrationEnvironment();
  const profiles = listAssistantRetrievalProfiles();
  assert.equal(profiles.length, 5);
  assert.ok(profiles.some((entry) => entry.profileId === EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.executiveSummary));
});

test("rejects invalid retrieval profile", () => {
  registerIntegrationEnvironment();
  seedPrimaryRecord();
  const validation = validateAssistantMemoryAccess(
    Object.freeze({
      workspaceId: "ws-memory-record-001",
      retrievalProfileId: "assistant-invalid-profile",
      readOnly: true as const,
    })
  );
  assert.equal(validation.valid, false);
  assert.equal(validation.issues[0]?.code, "invalid_profile");
});

test("rejects request without retrieval filter", () => {
  registerIntegrationEnvironment();
  const validation = validateAssistantMemoryAccess(
    Object.freeze({
      retrievalProfileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.executiveSummary,
      readOnly: true as const,
    })
  );
  assert.equal(validation.valid, false);
  assert.equal(validation.issues[0]?.code, "invalid_request");
});

test("rejects invalid limit", () => {
  registerIntegrationEnvironment();
  const validation = validateAssistantMemoryAccess(
    Object.freeze({
      workspaceId: "ws-memory-record-001",
      limit: 999,
      readOnly: true as const,
    })
  );
  assert.equal(validation.valid, false);
});

test("retrieves memory by record id with citation", () => {
  registerIntegrationEnvironment();
  const record = seedPrimaryRecord();
  const response = retrieveAssistantMemory(
    Object.freeze({
      recordId: record.id,
      readOnly: true as const,
    })
  );
  assert.equal(response.success, true);
  assert.equal(response.selections.length, 1);
  assert.equal(response.selections[0]?.citation.memoryId, record.id);
  assert.equal(response.selections[0]?.citation.memoryType, "decision");
  assert.equal(response.selections[0]?.citation.semanticVersion, "1.0.0");
  assert.equal(response.selections[0]?.permission, "read_allowed");
});

test("retrieves memory by intent", () => {
  registerIntegrationEnvironment();
  seedPrimaryRecord();
  const response = retrieveAssistantMemoryByIntent("intent-expansion-001");
  assert.equal(response.success, true);
  assert.ok(response.selections.length >= 1);
  assert.equal(response.selections[0]?.record.record.intent?.intentId, "intent-expansion-001");
});

test("retrieves memory by decision with decision review profile", () => {
  registerIntegrationEnvironment();
  seedPrimaryRecord();
  const response = retrieveAssistantMemoryByDecision("decision-expansion-001", {
    retrievalProfileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.decisionReview,
  });
  assert.equal(response.success, true);
  assert.equal(response.retrievalProfileId, EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.decisionReview);
  assert.ok(response.selections.length >= 1);
});

test("retrieves memory by scenario", () => {
  registerIntegrationEnvironment();
  seedPrimaryRecord();
  const response = retrieveAssistantMemoryByScenario("scenario-eu-expansion-001");
  assert.equal(response.success, true);
  assert.ok(response.selections.length >= 1);
});

test("retrieves memory by context", () => {
  registerIntegrationEnvironment();
  seedPrimaryRecord();
  const response = retrieveAssistantMemoryByContext("context-eu-001");
  assert.equal(response.success, true);
  assert.ok(response.selections.length >= 1);
});

test("retrieves by workspace with deterministic ordering", () => {
  registerIntegrationEnvironment();
  const { primary, secondary } = seedPair();
  const first = retrieveAssistantMemoryByWorkspace(primary.workspaceId);
  const second = retrieveAssistantMemoryByWorkspace(primary.workspaceId);
  assert.equal(first.success, true);
  assert.equal(first.selections.length, 2);
  const ids = first.selections.map((entry) => entry.record.record.id);
  assert.ok(ids.includes(primary.id));
  assert.ok(ids.includes(secondary.id));
  for (let index = 1; index < first.selections.length; index += 1) {
    const previous = first.selections[index - 1]!;
    const current = first.selections[index]!;
    assert.ok(current.rank >= previous.rank);
    if (current.rank === previous.rank) {
      assert.ok(current.record.record.id.localeCompare(previous.record.record.id) >= 0);
    }
  }
  assert.deepEqual(
    first.selections.map((entry) => ({ id: entry.record.record.id, rank: entry.rank, score: entry.score })),
    second.selections.map((entry) => ({ id: entry.record.record.id, rank: entry.rank, score: entry.score }))
  );
});

test("builds deterministic citation metadata", () => {
  registerIntegrationEnvironment();
  const record = seedPrimaryRecord();
  const stored = retrieveAssistantMemory(Object.freeze({ recordId: record.id, readOnly: true as const }));
  const selection = stored.selections[0]!;
  const citation = buildAssistantMemoryCitation({
    record: selection.record,
    retrievalProfileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.executiveSummary,
    rankingProfileId: "default",
    selectionReasons: Object.freeze(["Same workspace", "Highest confidence"]),
  });
  assert.ok(citation);
  assert.equal(citation!.memoryId, record.id);
  assert.equal(citation!.confidenceScore, 0.82);
  assert.equal(citation!.selectionReasons.length, 2);
  assert.equal(citation!.readOnly, true);
});

test("explains selection with deterministic reasons", () => {
  registerIntegrationEnvironment();
  const record = seedPrimaryRecord();
  const stored = retrieveAssistantMemory(Object.freeze({ recordId: record.id, readOnly: true as const }));
  const explanation = explainAssistantMemorySelection({
    record: stored.selections[0]!.record,
    retrievalProfileId: EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.executiveSummary,
    score: stored.selections[0]!.score,
    rankingReasons: Object.freeze(["+ Same workspace", "+ Highest confidence"]),
  });
  assert.equal(explanation.memoryId, record.id);
  assert.deepEqual(explanation.reasons, Object.freeze(["Same workspace", "Highest confidence"]));
});

test("denies locked memory without allowLocked", () => {
  registerIntegrationEnvironment();
  const record = seedPrimaryRecord();
  const lifecycle = getExecutiveMemoryLifecycle(record.id);
  assert.ok(lifecycle);
  commitExecutiveMemoryLifecycle(
    createExecutiveMemoryLifecycle({
      ...lifecycle!,
      governanceState: "locked",
      lockedAt: UPDATE_TIME,
      updatedAt: UPDATE_TIME,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: AUTHOR,
        sourceModule: "executive-assistant-memory-integration-test",
        reason: "Locked for certification.",
      }),
    })
  );
  const access = evaluateExecutiveAssistantMemoryPermission({
    memoryId: record.id,
    allowLocked: false,
  });
  assert.equal(access.allowed, false);
  assert.equal(access.permission, "locked_access");
});

test("allows locked memory with allowLocked", () => {
  registerIntegrationEnvironment();
  const record = seedPrimaryRecord();
  const lifecycle = getExecutiveMemoryLifecycle(record.id);
  commitExecutiveMemoryLifecycle(
    createExecutiveMemoryLifecycle({
      ...lifecycle!,
      governanceState: "locked",
      lockedAt: UPDATE_TIME,
      updatedAt: UPDATE_TIME,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: AUTHOR,
        sourceModule: "executive-assistant-memory-integration-test",
        reason: "Locked for certification.",
      }),
    })
  );
  const response = retrieveAssistantMemory(
    Object.freeze({
      recordId: record.id,
      allowLocked: true,
      readOnly: true as const,
    })
  );
  assert.equal(response.success, true);
  assert.equal(response.selections.length, 1);
});

test("permits archived memory access by default", () => {
  registerIntegrationEnvironment();
  const record = seedPrimaryRecord();
  archiveMemoryLifecycle({ memoryId: record.id, author: AUTHOR, timestamp: UPDATE_TIME });
  const response = retrieveAssistantMemory(
    Object.freeze({
      recordId: record.id,
      readOnly: true as const,
    })
  );
  assert.equal(response.success, true);
  assert.equal(response.permission, "archived_access");
});

test("denies archived memory when allowArchived is false", () => {
  registerIntegrationEnvironment();
  const record = seedPrimaryRecord();
  archiveMemoryLifecycle({ memoryId: record.id, author: AUTHOR, timestamp: UPDATE_TIME });
  const response = retrieveAssistantMemory(
    Object.freeze({
      recordId: record.id,
      allowArchived: false,
      readOnly: true as const,
    })
  );
  assert.equal(response.success, false);
  assert.equal(response.error?.code, EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ERROR_CODES.accessDenied);
});

test("restricts superseded memory without includeSuperseded", () => {
  registerIntegrationEnvironment();
  const { primary, secondary } = seedPair();
  supersedeExecutiveMemory(
    Object.freeze({
      obsoleteMemoryId: primary.id,
      replacementMemoryId: secondary.id,
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  const access = evaluateExecutiveAssistantMemoryPermission({ memoryId: primary.id });
  assert.equal(access.allowed, false);
  assert.equal(access.permission, "lifecycle_restricted");
});

test("denies merged source memory access", () => {
  registerIntegrationEnvironment();
  const { primary } = seedPair();
  mergeExecutiveMemories(
    Object.freeze({
      sourceMemoryIds: Object.freeze(["memory-record-example-001", "memory-record-example-002"]),
      mergedMemoryId: "memory-merged-assistant-test",
      author: AUTHOR,
      timestamp: UPDATE_TIME,
    })
  );
  const access = evaluateExecutiveAssistantMemoryPermission({ memoryId: primary.id });
  assert.equal(access.allowed, false);
  assert.equal(access.permission, "read_denied");
});

test("tracks integration statistics", () => {
  registerIntegrationEnvironment();
  seedPrimaryRecord();
  retrieveAssistantMemoryByWorkspace("ws-memory-record-001");
  const stats = getAssistantMemoryIntegrationStatistics();
  assert.equal(stats.assistantRetrievalCount, 1);
  assert.ok(stats.citationCount >= 1);
  assert.ok(stats.averageRetrievalTimeMs >= 0);
  assert.ok(stats.profileUsage[EXECUTIVE_ASSISTANT_RETRIEVAL_PROFILE_IDS.executiveSummary] >= 1);
});

test("validates APP-4:11 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveAssistantMemoryIntegrationGateway.ts",
      allowedFiles: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid, true);
});

test("regression: APP-4:9 search remains operational", () => {
  registerIntegrationEnvironment();
  seedPrimaryRecord();
  assert.equal(
    searchExecutiveMemories(Object.freeze({ recordId: "memory-record-example-001" })).records.length,
    1
  );
});

test("regression: APP-4:10 lifecycle registration remains operational", () => {
  registerIntegrationEnvironment();
  const record = seedPrimaryRecord();
  assert.equal(getExecutiveMemoryLifecycle(record.id)?.governanceState, "active");
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import { initializeExecutiveMemoryPlatform, resetExecutiveMemoryPlatformForTests } from "./executiveMemoryPlatform.ts";
import { registerExecutiveMemoryProvider } from "./executiveMemoryRegistry.ts";
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
  EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_DECISION_MEMORY_ERROR_CODES,
  EXECUTIVE_DECISION_MEMORY_SCHEMA_VERSION,
} from "./executiveDecisionMemoryConstants.ts";
import {
  createExecutiveDecisionAlternative,
  createExecutiveDecisionConfidence,
  createExecutiveDecisionEvidence,
  createExecutiveDecisionMemoryMetadata,
  createExecutiveDecisionMemoryReference,
  createExecutiveDecisionMemoryVersion,
  createExecutiveDecisionOutcome,
  createExecutiveDecisionRationale,
} from "./executiveDecisionMemoryModel.ts";
import {
  archiveDecisionMemory,
  createDecisionMemory,
  getDecisionMemories,
  getDecisionMemoryByDecision,
  getDecisionMemoryByGoal,
  getDecisionMemoryById,
  getDecisionMemoryByIntent,
  getDecisionMemoryByKPI,
  getDecisionMemoryByRisk,
  getDecisionMemoryByScenario,
  getDecisionMemoryByWorkspace,
  getExecutiveDecisionMemoryStatistics,
  hasDecisionMemory,
  initializeExecutiveDecisionMemoryEngine,
  inspectDecisionMemoryGraph,
  registerExecutiveDecisionTarget,
  resetExecutiveDecisionMemoryEngineForTests,
  restoreDecisionMemory,
  updateDecisionMemory,
  validateDecisionMemory,
} from "./executiveDecisionMemoryEngine.ts";
import {
  EXECUTIVE_DECISION_MEMORY_IDENTITY,
  EXECUTIVE_DECISION_MEMORY_SELF_MANIFEST,
  ExecutiveDecisionMemoryContracts,
} from "./executiveDecisionMemoryContracts.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";

function registerDecisionMemoryEnvironment() {
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

  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);

  registerExecutiveDecisionTarget(
    Object.freeze({
      decisionId: record.decision!.decisionId,
      workspaceId: record.workspaceId,
      status: record.decision!.status,
    }),
    FIXED_TIME
  );

  return { record };
}

function buildDecisionMemoryInput(
  memoryId: string,
  env: ReturnType<typeof registerDecisionMemoryEnvironment>
) {
  const { record } = env;
  return Object.freeze({
    memoryId,
    decisionId: record.decision!.decisionId,
    workspaceId: record.workspaceId,
    goalId: record.goal!.goalId,
    intentId: record.intent!.intentId,
    scenarioId: record.scenario!.scenarioId,
    executiveMemoryIds: Object.freeze([record.id]),
    riskIds: Object.freeze(["risk-eu-expansion-001"]),
    kpiIds: Object.freeze(["kpi-revenue-001"]),
    objectIds: Object.freeze(["object-market-001"]),
    relationshipIds: Object.freeze(["relationship-expansion-001"]),
    timelineIds: Object.freeze(["timeline-expansion-001"]),
    assumptions: Object.freeze(["European demand remains stable."]),
    evidence: Object.freeze([
      createExecutiveDecisionEvidence({
        evidenceId: "evidence-decision-001",
        source: "executive-review",
        summary: "Decision evidence captured for memory.",
        capturedAt: FIXED_TIME,
        reliability: "high",
      }),
    ]),
    constraints: Object.freeze([]),
    alternatives: Object.freeze([
      createExecutiveDecisionAlternative({
        alternativeId: "alt-delay-expansion",
        label: "Delay expansion",
        description: "Postpone European entry by one quarter.",
        rejectedReason: "Competitive window closing.",
      }),
    ]),
    rationale: createExecutiveDecisionRationale({
      rationaleId: "rationale-expansion-001",
      summary: "Approve European expansion",
      explanation: "Validated demand and acceptable risk profile.",
      decidedBy: "executive-committee",
      decidedAt: FIXED_TIME,
    }),
    confidence: createExecutiveDecisionConfidence({
      confidenceId: "confidence-decision-001",
      score: 0.82,
      level: "high",
      source: "executive-review",
      explanation: "Strong evidence and aligned scenario analysis.",
    }),
    expectedOutcomes: Object.freeze([
      createExecutiveDecisionOutcome({
        outcomeId: "outcome-revenue-growth",
        label: "Revenue growth",
        description: "Projected revenue uplift from expansion.",
        kind: "expected",
        status: "projected",
      }),
    ]),
    actualOutcomes: Object.freeze([]),
    lessonsLearned: Object.freeze(["Validate regulatory constraints early."]),
    references: Object.freeze([
      createExecutiveDecisionMemoryReference({
        referenceId: "ref-decision-memory-001",
        referenceType: "decision",
        targetId: record.decision!.decisionId,
        label: "Primary decision",
      }),
    ]),
    metadata: createExecutiveDecisionMemoryMetadata({
      title: "European expansion decision memory",
      summary: "Structured decision memory for executive review.",
      owner: "executive-owner",
      sourceModule: "executive-decision-memory",
    }),
    version: createExecutiveDecisionMemoryVersion({
      versionId: `version-${memoryId}`,
      semanticVersion: "1.0.0",
      schemaVersion: EXECUTIVE_DECISION_MEMORY_SCHEMA_VERSION,
      contractVersion: EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION,
      createdAt: FIXED_TIME,
    }),
    createdAt: FIXED_TIME,
    updatedAt: FIXED_TIME,
  });
}

test.beforeEach(() => {
  resetExecutiveMemoryPlatformForTests();
  resetExecutiveMemoryStorageEngineForTests();
  resetExecutiveMemoryRetrievalEngineForTests();
  resetExecutiveIntentMemoryLinkEngineForTests();
  resetExecutiveScenarioMemoryEngineForTests();
  resetExecutiveDecisionMemoryEngineForTests();
});

test("exports APP-4:7 decision memory identity and extends APP-4 phases", () => {
  assert.equal(EXECUTIVE_DECISION_MEMORY_IDENTITY.phaseId, "APP-4/7");
  assert.equal(EXECUTIVE_DECISION_MEMORY_CONTRACT_VERSION, "APP-4/7");
  assert.equal(ExecutiveDecisionMemoryContracts.version, "APP-4/7");
});

test("creates and retrieves decision memory", () => {
  const env = registerDecisionMemoryEnvironment();
  const created = createDecisionMemory(buildDecisionMemoryInput("decision-memory-001", env));
  assert.equal(created.success, true);
  assert.equal(hasDecisionMemory("decision-memory-001"), true);
  const memory = getDecisionMemoryById("decision-memory-001");
  assert.ok(memory);
  assert.equal(memory?.decisionId, env.record.decision!.decisionId);
});

test("updates decision memory with metadata preservation", () => {
  const env = registerDecisionMemoryEnvironment();
  createDecisionMemory(buildDecisionMemoryInput("decision-memory-update-001", env));
  const updated = updateDecisionMemory(
    "decision-memory-update-001",
    Object.freeze({ metadata: Object.freeze({ summary: "Updated decision memory summary." }) }),
    UPDATE_TIME
  );
  assert.equal(updated.success, true);
  assert.equal(updated.data?.metadata.summary, "Updated decision memory summary.");
  assert.equal(updated.data?.metadata.owner, "executive-owner");
  assert.notEqual(updated.data?.version.semanticVersion, "1.0.0");
});

test("archives and restores decision memory", () => {
  const env = registerDecisionMemoryEnvironment();
  createDecisionMemory(buildDecisionMemoryInput("decision-memory-archive-001", env));
  const archived = archiveDecisionMemory("decision-memory-archive-001", UPDATE_TIME);
  assert.equal(archived.success, true);
  assert.equal(archived.data?.lifecycle, "archived");

  const restored = restoreDecisionMemory("decision-memory-archive-001", UPDATE_TIME);
  assert.equal(restored.success, true);
  assert.equal(restored.data?.lifecycle, "active");
});

test("rejects duplicate active decision memory", () => {
  const env = registerDecisionMemoryEnvironment();
  assert.equal(createDecisionMemory(buildDecisionMemoryInput("decision-memory-dup-a", env)).success, true);
  const duplicate = createDecisionMemory(buildDecisionMemoryInput("decision-memory-dup-b", env));
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, EXECUTIVE_DECISION_MEMORY_ERROR_CODES.duplicateMemory);
});

test("rejects unregistered decision targets", () => {
  const env = registerDecisionMemoryEnvironment();
  const invalid = createDecisionMemory(
    Object.freeze({
      ...buildDecisionMemoryInput("decision-memory-invalid", env),
      decisionId: "decision-unregistered-001",
    })
  );
  assert.equal(invalid.success, false);
  assert.match(invalid.reason, /not registered/i);
});

test("validates workspace consistency with registered decision", () => {
  const env = registerDecisionMemoryEnvironment();
  const invalid = createDecisionMemory(
    Object.freeze({
      ...buildDecisionMemoryInput("decision-memory-ws-mismatch", env),
      workspaceId: "ws-mismatch-001",
    })
  );
  assert.equal(invalid.success, false);
  assert.match(invalid.reason, /workspace/i);
});

test("validates confidence and rationale constraints", () => {
  const env = registerDecisionMemoryEnvironment();
  const created = createDecisionMemory(buildDecisionMemoryInput("decision-memory-validation-001", env));
  assert.equal(created.success, true);

  const invalidConfidence = Object.freeze({
    ...created.data!,
    confidence: createExecutiveDecisionConfidence({
      confidenceId: "confidence-invalid",
      score: 1.5,
      level: "high",
      source: "test",
      explanation: "Invalid score.",
    }),
  });
  assert.equal(validateDecisionMemory(invalidConfidence).valid, false);

  const invalidRationale = Object.freeze({
    ...created.data!,
    rationale: createExecutiveDecisionRationale({
      rationaleId: "rationale-invalid",
      summary: "Bad timestamp",
      explanation: "Test",
      decidedBy: "tester",
      decidedAt: "not-a-date",
    }),
  });
  assert.equal(validateDecisionMemory(invalidRationale).valid, false);
});

test("validates duplicate outcomes and evidence", () => {
  const env = registerDecisionMemoryEnvironment();
  const created = createDecisionMemory(buildDecisionMemoryInput("decision-memory-outcome-001", env));
  assert.equal(created.success, true);
  const invalid = Object.freeze({
    ...created.data!,
    expectedOutcomes: Object.freeze([
      createExecutiveDecisionOutcome({
        outcomeId: "dup-outcome",
        label: "A",
        description: "First",
        kind: "expected",
        status: "projected",
      }),
      createExecutiveDecisionOutcome({
        outcomeId: "dup-outcome",
        label: "B",
        description: "Duplicate",
        kind: "expected",
        status: "projected",
      }),
    ]),
  });
  assert.equal(validateDecisionMemory(invalid).valid, false);
});

test("queries decision memory by decision goal intent scenario workspace risk and kpi", () => {
  const env = registerDecisionMemoryEnvironment();
  const input = buildDecisionMemoryInput("decision-memory-query-001", env);
  createDecisionMemory(input);

  assert.equal(getDecisionMemoryByDecision(env.record.decision!.decisionId).length, 1);
  assert.equal(getDecisionMemoryByGoal(input.goalId!).length, 1);
  assert.equal(getDecisionMemoryByIntent(input.intentId!).length, 1);
  assert.equal(getDecisionMemoryByScenario(input.scenarioId!).length, 1);
  assert.equal(getDecisionMemoryByWorkspace(input.workspaceId).length, 1);
  assert.equal(getDecisionMemoryByRisk("risk-eu-expansion-001").length, 1);
  assert.equal(getDecisionMemoryByKPI("kpi-revenue-001").length, 1);
});

test("inspects decision memory graph relationships", () => {
  const env = registerDecisionMemoryEnvironment();
  createDecisionMemory(buildDecisionMemoryInput("decision-memory-graph-001", env));
  const graph = inspectDecisionMemoryGraph({ memoryId: "decision-memory-graph-001" });
  assert.equal(graph.decisionId, env.record.decision!.decisionId);
  assert.ok(graph.linkedGoalIds.length > 0);
  assert.ok(graph.linkedExecutiveMemoryIds.length > 0);
  assert.ok(graph.linkedEvidenceIds.length > 0);
  assert.ok(graph.linkedOutcomeIds.length > 0);
});

test("computes lightweight decision memory statistics", () => {
  const env = registerDecisionMemoryEnvironment();
  createDecisionMemory(buildDecisionMemoryInput("decision-memory-stats-001", env));
  archiveDecisionMemory("decision-memory-stats-001", UPDATE_TIME);
  createDecisionMemory(buildDecisionMemoryInput("decision-memory-stats-002", env));

  const stats = getExecutiveDecisionMemoryStatistics();
  assert.equal(stats.totalMemories, 2);
  assert.equal(stats.activeMemories, 1);
  assert.equal(stats.archivedMemories, 1);
  assert.ok(stats.memoriesByDecision[env.record.decision!.decisionId] >= 2);
});

test("preserves deterministic ordering for decision memory lists", () => {
  const env = registerDecisionMemoryEnvironment();
  registerExecutiveDecisionTarget(
    Object.freeze({ decisionId: "decision-order-002", workspaceId: env.record.workspaceId }),
    FIXED_TIME
  );
  createDecisionMemory(
    Object.freeze({
      ...buildDecisionMemoryInput("decision-memory-order-b", env),
      decisionId: "decision-order-002",
    })
  );
  createDecisionMemory(buildDecisionMemoryInput("decision-memory-order-a", env));
  assert.deepEqual(
    getDecisionMemories().map((entry) => entry.memoryId),
    ["decision-memory-order-a", "decision-memory-order-b"]
  );
});

test("validates APP-4:7 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_DECISION_MEMORY_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveDecisionMemoryEngine.ts",
      allowedFiles: EXECUTIVE_DECISION_MEMORY_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_DECISION_MEMORY_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid, true);
});

test("regression: APP-4:3 storage and APP-4:4 retrieval remain operational", () => {
  const env = registerDecisionMemoryEnvironment();
  assert.equal(hasDecisionMemory("missing"), false);
  assert.ok(env.record.id);
});

test("regression: APP-4:5 intent memory link engine initializes independently", () => {
  resetExecutiveDecisionMemoryEngineForTests();
  initializeExecutiveIntentMemoryLinkEngine(FIXED_TIME);
  assert.equal(initializeExecutiveDecisionMemoryEngine(FIXED_TIME).success, true);
});

test("regression: APP-4:6 scenario memory engine initializes independently", () => {
  resetExecutiveDecisionMemoryEngineForTests();
  initializeExecutiveScenarioMemoryEngine(FIXED_TIME);
  assert.equal(initializeExecutiveDecisionMemoryEngine(FIXED_TIME).success, true);
});

test("regression: APP-2 scenario identity contracts remain valid", () => {
  const scenario = resolveScenarioIdentityExample();
  assert.equal(validateScenarioIdentityShape(scenario).valid, true);
});

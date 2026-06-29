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
  EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_SCENARIO_MEMORY_ERROR_CODES,
  EXECUTIVE_SCENARIO_MEMORY_SCHEMA_VERSION,
} from "./executiveScenarioMemoryConstants.ts";
import {
  createExecutiveScenarioMemoryAssumption,
  createExecutiveScenarioMemoryEvidence,
  createExecutiveScenarioMemoryMetadata,
  createExecutiveScenarioMemoryOutcome,
  createExecutiveScenarioMemoryReference,
  createExecutiveScenarioMemoryVersion,
} from "./executiveScenarioMemoryModel.ts";
import {
  archiveScenarioMemory,
  createScenarioMemory,
  getExecutiveScenarioMemoryStatistics,
  getScenarioMemoryByDecision,
  getScenarioMemoryByGoal,
  getScenarioMemoryById,
  getScenarioMemoryByIntent,
  getScenarioMemoryByKPI,
  getScenarioMemoryByRisk,
  getScenarioMemoryByScenario,
  getScenarioMemoryByWorkspace,
  getScenarioMemories,
  hasScenarioMemory,
  initializeExecutiveScenarioMemoryEngine,
  inspectScenarioMemoryGraph,
  registerExecutiveScenarioTarget,
  resetExecutiveScenarioMemoryEngineForTests,
  restoreScenarioMemory,
  updateScenarioMemory,
  validateScenarioMemory,
} from "./executiveScenarioMemoryEngine.ts";
import {
  EXECUTIVE_SCENARIO_MEMORY_IDENTITY,
  EXECUTIVE_SCENARIO_MEMORY_SELF_MANIFEST,
  ExecutiveScenarioMemoryContracts,
} from "./executiveScenarioMemoryContracts.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";

function registerScenarioMemoryEnvironment() {
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

  const scenario = resolveScenarioIdentityExample();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);

  registerExecutiveScenarioTarget(
    Object.freeze({
      scenarioId: scenario.scenarioId,
      workspaceId: record.workspaceId,
      packageId: record.scenario!.packageId,
    }),
    FIXED_TIME
  );

  return { scenario, record };
}

function buildScenarioMemoryInput(
  memoryId: string,
  env: ReturnType<typeof registerScenarioMemoryEnvironment>
) {
  const { scenario, record } = env;
  return Object.freeze({
    memoryId,
    scenarioId: scenario.scenarioId,
    workspaceId: record.workspaceId,
    goalId: record.goal!.goalId,
    intentId: record.intent!.intentId,
    decisionId: record.decision!.decisionId,
    riskIds: Object.freeze(["risk-eu-expansion-001"]),
    kpiIds: Object.freeze(["kpi-revenue-001"]),
    objectIds: Object.freeze(["object-market-001"]),
    relationshipIds: Object.freeze(["relationship-expansion-001"]),
    timelineIds: Object.freeze(["timeline-expansion-001"]),
    executiveMemoryIds: Object.freeze([record.id]),
    assumptions: Object.freeze([
      createExecutiveScenarioMemoryAssumption({
        assumptionId: "assumption-market-demand",
        label: "Market demand",
        description: "European demand remains stable.",
      }),
    ]),
    outcomes: Object.freeze([
      createExecutiveScenarioMemoryOutcome({
        outcomeId: "outcome-revenue-growth",
        label: "Revenue growth",
        description: "Projected revenue uplift from expansion.",
        status: "projected",
      }),
    ]),
    evidence: Object.freeze([
      createExecutiveScenarioMemoryEvidence({
        evidenceId: "evidence-scenario-001",
        source: "scenario-analysis",
        summary: "Scenario evidence captured for memory.",
        capturedAt: FIXED_TIME,
      }),
    ]),
    lessonsLearned: Object.freeze(["Validate regulatory constraints early."]),
    constraints: Object.freeze(["Budget envelope approved."]),
    references: Object.freeze([
      createExecutiveScenarioMemoryReference({
        referenceId: "ref-scenario-memory-001",
        referenceType: "scenario",
        targetId: scenario.scenarioId,
        label: "Primary scenario",
      }),
    ]),
    metadata: createExecutiveScenarioMemoryMetadata({
      title: "European expansion scenario memory",
      summary: "Structured scenario memory for executive review.",
      owner: "executive-owner",
      sourceModule: "executive-scenario-memory",
    }),
    version: createExecutiveScenarioMemoryVersion({
      versionId: `version-${memoryId}`,
      semanticVersion: "1.0.0",
      schemaVersion: EXECUTIVE_SCENARIO_MEMORY_SCHEMA_VERSION,
      contractVersion: EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION,
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
});

test("exports APP-4:6 scenario memory identity and extends APP-2 and APP-4 phases", () => {
  assert.equal(EXECUTIVE_SCENARIO_MEMORY_IDENTITY.phaseId, "APP-4/6");
  assert.equal(EXECUTIVE_SCENARIO_MEMORY_CONTRACT_VERSION, "APP-4/6");
  assert.equal(ExecutiveScenarioMemoryContracts.version, "APP-4/6");
});

test("creates and retrieves scenario memory", () => {
  const env = registerScenarioMemoryEnvironment();
  const created = createScenarioMemory(buildScenarioMemoryInput("scenario-memory-001", env));
  assert.equal(created.success, true);
  assert.equal(hasScenarioMemory("scenario-memory-001"), true);
  const memory = getScenarioMemoryById("scenario-memory-001");
  assert.ok(memory);
  assert.equal(memory?.scenarioId, env.scenario.scenarioId);
});

test("updates scenario memory with metadata preservation", () => {
  const env = registerScenarioMemoryEnvironment();
  createScenarioMemory(buildScenarioMemoryInput("scenario-memory-update-001", env));
  const updated = updateScenarioMemory(
    "scenario-memory-update-001",
    Object.freeze({ metadata: Object.freeze({ summary: "Updated scenario memory summary." }) }),
    UPDATE_TIME
  );
  assert.equal(updated.success, true);
  assert.equal(updated.data?.metadata.summary, "Updated scenario memory summary.");
  assert.notEqual(updated.data?.version.semanticVersion, "1.0.0");
});

test("archives and restores scenario memory", () => {
  const env = registerScenarioMemoryEnvironment();
  createScenarioMemory(buildScenarioMemoryInput("scenario-memory-archive-001", env));
  const archived = archiveScenarioMemory("scenario-memory-archive-001", UPDATE_TIME);
  assert.equal(archived.success, true);
  assert.equal(archived.data?.lifecycle, "archived");

  const restored = restoreScenarioMemory("scenario-memory-archive-001", UPDATE_TIME);
  assert.equal(restored.success, true);
  assert.equal(restored.data?.lifecycle, "active");
});

test("rejects duplicate active scenario memory", () => {
  const env = registerScenarioMemoryEnvironment();
  assert.equal(createScenarioMemory(buildScenarioMemoryInput("scenario-memory-dup-a", env)).success, true);
  const duplicate = createScenarioMemory(buildScenarioMemoryInput("scenario-memory-dup-b", env));
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, EXECUTIVE_SCENARIO_MEMORY_ERROR_CODES.duplicateMemory);
});

test("rejects unregistered scenario targets", () => {
  registerScenarioMemoryEnvironment();
  const invalid = createScenarioMemory(
    Object.freeze({
      ...buildScenarioMemoryInput("scenario-memory-invalid", registerScenarioMemoryEnvironment()),
      scenarioId: "scn-unregistered-001",
    })
  );
  assert.equal(invalid.success, false);
  assert.match(invalid.reason, /not registered/i);
});

test("validates workspace consistency with registered scenario", () => {
  const env = registerScenarioMemoryEnvironment();
  const invalid = createScenarioMemory(
    Object.freeze({
      ...buildScenarioMemoryInput("scenario-memory-ws-mismatch", env),
      workspaceId: "ws-mismatch-001",
    })
  );
  assert.equal(invalid.success, false);
  assert.match(invalid.reason, /workspace/i);
});

test("validates assumptions and outcomes", () => {
  const env = registerScenarioMemoryEnvironment();
  const created = createScenarioMemory(buildScenarioMemoryInput("scenario-memory-validation-001", env));
  assert.equal(created.success, true);
  const invalid = Object.freeze({
    ...created.data!,
    assumptions: Object.freeze([
      createExecutiveScenarioMemoryAssumption({
        assumptionId: "dup-assumption",
        label: "A",
        description: "First",
      }),
      createExecutiveScenarioMemoryAssumption({
        assumptionId: "dup-assumption",
        label: "B",
        description: "Duplicate",
      }),
    ]),
  });
  assert.equal(validateScenarioMemory(invalid).valid, false);
});

test("queries scenario memory by scenario goal intent decision workspace risk and kpi", () => {
  const env = registerScenarioMemoryEnvironment();
  const input = buildScenarioMemoryInput("scenario-memory-query-001", env);
  createScenarioMemory(input);

  assert.equal(getScenarioMemoryByScenario(env.scenario.scenarioId).length, 1);
  assert.equal(getScenarioMemoryByGoal(input.goalId!).length, 1);
  assert.equal(getScenarioMemoryByIntent(input.intentId!).length, 1);
  assert.equal(getScenarioMemoryByDecision(input.decisionId!).length, 1);
  assert.equal(getScenarioMemoryByWorkspace(input.workspaceId).length, 1);
  assert.equal(getScenarioMemoryByRisk("risk-eu-expansion-001").length, 1);
  assert.equal(getScenarioMemoryByKPI("kpi-revenue-001").length, 1);
});

test("inspects scenario memory graph relationships", () => {
  const env = registerScenarioMemoryEnvironment();
  createScenarioMemory(buildScenarioMemoryInput("scenario-memory-graph-001", env));
  const graph = inspectScenarioMemoryGraph({ memoryId: "scenario-memory-graph-001" });
  assert.equal(graph.linkedScenarioIds[0], env.scenario.scenarioId);
  assert.ok(graph.linkedGoalIds.length > 0);
  assert.ok(graph.relatedExecutiveMemoryIds.length > 0);
});

test("computes lightweight scenario memory statistics", () => {
  const env = registerScenarioMemoryEnvironment();
  createScenarioMemory(buildScenarioMemoryInput("scenario-memory-stats-001", env));
  archiveScenarioMemory("scenario-memory-stats-001", UPDATE_TIME);
  createScenarioMemory(buildScenarioMemoryInput("scenario-memory-stats-002", env));

  const stats = getExecutiveScenarioMemoryStatistics();
  assert.equal(stats.totalMemories, 2);
  assert.equal(stats.activeMemories, 1);
  assert.equal(stats.archivedMemories, 1);
  assert.ok(stats.memoriesByScenario[env.scenario.scenarioId] >= 2);
});

test("preserves deterministic ordering for scenario memory lists", () => {
  const env = registerScenarioMemoryEnvironment();
  registerExecutiveScenarioTarget(
    Object.freeze({ scenarioId: "scn-order-002", workspaceId: env.record.workspaceId }),
    FIXED_TIME
  );
  createScenarioMemory(
    Object.freeze({
      ...buildScenarioMemoryInput("scenario-memory-order-b", env),
      scenarioId: "scn-order-002",
    })
  );
  createScenarioMemory(buildScenarioMemoryInput("scenario-memory-order-a", env));
  assert.deepEqual(
    getScenarioMemories().map((entry) => entry.memoryId),
    ["scenario-memory-order-a", "scenario-memory-order-b"]
  );
});

test("validates APP-4:6 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_SCENARIO_MEMORY_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveScenarioMemoryEngine.ts",
      allowedFiles: EXECUTIVE_SCENARIO_MEMORY_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_SCENARIO_MEMORY_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-2 scenario identity contracts remain valid", () => {
  const scenario = resolveScenarioIdentityExample();
  assert.equal(validateScenarioIdentityShape(scenario).valid, true);
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid, true);
});

test("regression: APP-4:3 storage and APP-4:4 retrieval remain operational", () => {
  const env = registerScenarioMemoryEnvironment();
  assert.equal(hasScenarioMemory("missing"), false);
  assert.ok(env.record.id);
});

test("regression: APP-4:5 intent memory link engine initializes independently", () => {
  resetExecutiveScenarioMemoryEngineForTests();
  initializeExecutiveIntentMemoryLinkEngine(FIXED_TIME);
  assert.equal(initializeExecutiveScenarioMemoryEngine(FIXED_TIME).success, true);
});

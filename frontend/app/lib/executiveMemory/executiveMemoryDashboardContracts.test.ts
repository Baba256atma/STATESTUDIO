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
  initializeExecutiveMemoryLifecycleEngine,
  registerGovernedMemory,
  resetExecutiveMemoryLifecycleEngineForTests,
} from "./executiveMemoryLifecycleEngine.ts";
import {
  initializeExecutiveAssistantMemoryIntegrationEngine,
  resetExecutiveAssistantMemoryIntegrationEngineForTests,
  retrieveAssistantMemoryByWorkspace,
} from "./executiveAssistantMemoryIntegrationContracts.ts";
import {
  EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_DASHBOARD_HEALTH_THRESHOLDS,
} from "./executiveMemoryDashboardConstants.ts";
import {
  analyzeExecutiveMemoryDashboardHealth,
  getExecutiveMemoryAssistantSummary,
  getExecutiveMemoryCategorySummary,
  getExecutiveMemoryDashboard,
  getExecutiveMemoryDashboardStatistics,
  getExecutiveMemoryHealth,
  getExecutiveMemoryIntegritySummary,
  getExecutiveMemoryLifecycleSummary,
  getExecutiveMemorySearchSummary,
  getExecutiveMemorySummary,
  getExecutiveMemoryWorkspaceSummary,
  initializeExecutiveMemoryDashboardEngine,
  resetExecutiveMemoryDashboardEngineForTests,
  validateExecutiveMemoryDashboard,
  EXECUTIVE_MEMORY_DASHBOARD_IDENTITY,
  EXECUTIVE_MEMORY_DASHBOARD_SELF_MANIFEST,
  ExecutiveMemoryDashboardContracts,
} from "./executiveMemoryDashboardContracts.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";
const AUTHOR = "executive-governance";

function registerDashboardEnvironment() {
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
  initializeExecutiveMemoryDashboardEngine(FIXED_TIME);
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

function seedGovernedPlatform() {
  const primary = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(primary, FIXED_TIME);
  registerGovernedMemory(primary.id, AUTHOR, FIXED_TIME);

  const secondary = seedSecondaryRecord("memory-record-example-002", UPDATE_TIME);
  createExecutiveMemory(secondary, UPDATE_TIME);
  registerGovernedMemory(secondary.id, AUTHOR, UPDATE_TIME);

  searchExecutiveMemories(Object.freeze({ workspaceId: primary.workspaceId }));
  retrieveAssistantMemoryByWorkspace(primary.workspaceId);

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
  resetExecutiveMemoryDashboardEngineForTests();
});

test("exports APP-4:12 dashboard identity and extends APP-4 phases", () => {
  assert.equal(EXECUTIVE_MEMORY_DASHBOARD_IDENTITY.phaseId, "APP-4/12");
  assert.equal(EXECUTIVE_MEMORY_DASHBOARD_CONTRACT_VERSION, "APP-4/12");
  assert.equal(ExecutiveMemoryDashboardContracts.version, "APP-4/12");
});

test("initializes dashboard engine", () => {
  registerDashboardEnvironment();
  assert.equal(initializeExecutiveMemoryDashboardEngine(FIXED_TIME).success, true);
});

test("generates full executive memory dashboard", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const dashboard = getExecutiveMemoryDashboard(FIXED_TIME);
  assert.equal(dashboard.success, true);
  assert.equal(dashboard.summary.totalMemories, 2);
  assert.equal(dashboard.readOnly, true);
  assert.ok(dashboard.generatedAt.length > 0);
});

test("reports platform summary counts", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const summary = getExecutiveMemorySummary(FIXED_TIME);
  assert.equal(summary.totalMemories, 2);
  assert.equal(summary.activeMemories, 2);
  assert.equal(summary.archivedMemories, 0);
  assert.equal(summary.lockedMemories, 0);
});

test("reports workspace summary distribution", () => {
  registerDashboardEnvironment();
  const { primary } = seedGovernedPlatform();
  const workspace = getExecutiveMemoryWorkspaceSummary(FIXED_TIME);
  assert.equal(workspace.activeWorkspaces, 1);
  assert.equal(workspace.memoriesPerWorkspace[primary.workspaceId], 2);
  assert.equal(workspace.workspaceDistribution.length, 1);
  assert.equal(workspace.workspaceDistribution[0]?.percentage, 1);
});

test("reports category summary", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const category = getExecutiveMemoryCategorySummary(FIXED_TIME);
  assert.equal(category.decisionMemories, 2);
  assert.equal(category.intentMemories, 0);
  assert.equal(category.otherMemories, 0);
});

test("reports lifecycle summary", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const lifecycle = getExecutiveMemoryLifecycleSummary(FIXED_TIME);
  assert.ok(lifecycle.versionCount >= 2);
  assert.equal(lifecycle.mergeCount, 0);
  assert.ok(Object.keys(lifecycle.retentionPolicyUsage).length >= 1);
});

test("reports integrity summary for governed platform", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const integrity = getExecutiveMemoryIntegritySummary(FIXED_TIME);
  assert.equal(integrity.valid, true);
  assert.equal(integrity.brokenReferences, 0);
  assert.equal(integrity.orphanRecords, 0);
});

test("reports search summary from APP-4:9 statistics", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const search = getExecutiveMemorySearchSummary(FIXED_TIME);
  assert.ok(search.searchesExecuted >= 1);
  assert.ok(search.averageSearchTimeMs >= 0);
});

test("reports assistant summary from APP-4:11 statistics", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const assistant = getExecutiveMemoryAssistantSummary(FIXED_TIME);
  assert.equal(assistant.retrievalCount, 1);
  assert.ok(assistant.citationCount >= 1);
});

test("computes healthy status for governed platform", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const health = getExecutiveMemoryHealth(FIXED_TIME);
  assert.equal(health.level, "healthy");
});

test("computes warning status for ungoverned records", () => {
  registerDashboardEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const health = getExecutiveMemoryHealth(FIXED_TIME, {
    ...EXECUTIVE_MEMORY_DASHBOARD_HEALTH_THRESHOLDS,
    ungovernedRecordWarning: 1,
  });
  assert.equal(health.level, "warning");
});

test("validates dashboard section consistency", () => {
  registerDashboardEnvironment();
  const dashboard = getExecutiveMemoryDashboard(FIXED_TIME);
  const validation = validateExecutiveMemoryDashboard({
    summary: dashboard.summary,
    health: dashboard.health,
    integrity: dashboard.integrity,
    lifecycle: dashboard.lifecycle,
    workspace: dashboard.workspace,
    category: dashboard.category,
    search: dashboard.search,
    assistant: dashboard.assistant,
    usage: dashboard.usage,
    statistics: dashboard.statistics,
    generatedAt: dashboard.generatedAt,
    readOnly: true as const,
  });
  assert.equal(validation.valid, true);
});

test("produces deterministic dashboard output", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const first = getExecutiveMemoryDashboard(FIXED_TIME);
  const second = getExecutiveMemoryDashboard(FIXED_TIME);
  assert.deepEqual(
    {
      summary: first.summary,
      workspace: first.workspace,
      category: first.category,
      lifecycle: first.lifecycle,
      integrity: first.integrity,
      search: first.search,
      assistant: first.assistant,
      usage: first.usage,
    },
    {
      summary: second.summary,
      workspace: second.workspace,
      category: second.category,
      lifecycle: second.lifecycle,
      integrity: second.integrity,
      search: second.search,
      assistant: second.assistant,
      usage: second.usage,
    }
  );
});

test("handles empty platform without exceptions", () => {
  registerDashboardEnvironment();
  const dashboard = getExecutiveMemoryDashboard(FIXED_TIME);
  assert.equal(dashboard.success, true);
  assert.equal(dashboard.summary.totalMemories, 0);
  assert.equal(dashboard.health.level, "healthy");
  assert.equal(dashboard.workspace.activeWorkspaces, 0);
});

test("tracks dashboard refresh statistics", () => {
  registerDashboardEnvironment();
  getExecutiveMemoryDashboard(FIXED_TIME);
  getExecutiveMemoryDashboard(FIXED_TIME);
  const stats = getExecutiveMemoryDashboardStatistics();
  assert.equal(stats.dashboardRefreshes, 2);
  assert.ok(stats.averageAggregationDurationMs >= 0);
});

test("analyzes critical health from integrity violations", () => {
  const health = analyzeExecutiveMemoryDashboardHealth({
    summary: Object.freeze({
      totalMemories: 10,
      activeMemories: 5,
      archivedMemories: 5,
      supersededMemories: 0,
      mergedMemories: 0,
      splitMemories: 0,
      lockedMemories: 0,
      ungovernedMemories: 0,
      readOnly: true as const,
    }),
    integrity: Object.freeze({
      valid: false,
      brokenReferences: 2,
      invalidVersionChains: 2,
      orphanRecords: 2,
      validationFailures: 0,
      integrityWarnings: 0,
      recordsInspected: 10,
      readOnly: true as const,
    }),
    assistant: Object.freeze({
      retrievalCount: 0,
      citationCount: 0,
      profileUsage: Object.freeze({}),
      accessDenials: 0,
      averageRetrievalTimeMs: 0,
      readOnly: true as const,
    }),
    thresholds: Object.freeze({
      integrityViolationWarning: 1,
      integrityViolationCritical: 5,
      ungovernedRecordWarning: 1,
      archivedRatioWarning: 0.5,
      accessDenialWarning: 3,
      accessDenialCritical: 10,
    }),
  });
  assert.equal(health.level, "critical");
});

test("validates APP-4:12 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_MEMORY_DASHBOARD_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveMemoryDashboardEngine.ts",
      allowedFiles: EXECUTIVE_MEMORY_DASHBOARD_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_DASHBOARD_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid, true);
});

test("regression: APP-4:9 search remains operational", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  assert.equal(
    searchExecutiveMemories(Object.freeze({ recordId: "memory-record-example-001" })).records.length,
    1
  );
});

test("regression: APP-4:10 lifecycle registration remains operational", () => {
  registerDashboardEnvironment();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  assert.equal(registerGovernedMemory(record.id, AUTHOR, FIXED_TIME).success, true);
});

test("regression: APP-4:11 assistant retrieval remains operational", () => {
  registerDashboardEnvironment();
  seedGovernedPlatform();
  const response = retrieveAssistantMemoryByWorkspace("ws-memory-record-001");
  assert.equal(response.success, true);
});

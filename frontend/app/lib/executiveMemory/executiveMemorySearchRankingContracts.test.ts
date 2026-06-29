import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import { createExecutiveMemoryConfidence } from "./executiveMemoryConfidence.ts";
import { initializeExecutiveMemoryPlatform, resetExecutiveMemoryPlatformForTests } from "./executiveMemoryPlatform.ts";
import { registerExecutiveMemoryProvider } from "./executiveMemoryRegistry.ts";
import { createExecutiveMemoryReference } from "./executiveMemoryReference.ts";
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
  EXECUTIVE_MEMORY_RANKING_PROFILE_IDS,
  EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_SEARCH_RANKING_ERROR_CODES,
} from "./executiveMemorySearchRankingConstants.ts";
import { createExecutiveMemoryRankingRule } from "./executiveMemorySearchRankingModel.ts";
import {
  explainExecutiveMemoryRanking,
  getRankingProfiles,
  getRankingStatistics,
  initializeExecutiveMemorySearchEngine,
  rankExecutiveMemories,
  registerExecutiveMemoryRankingProfile,
  resetExecutiveMemorySearchEngineForTests,
  searchExecutiveMemories,
  validateExecutiveMemorySearchQuery,
} from "./executiveMemorySearchEngine.ts";
import {
  EXECUTIVE_MEMORY_SEARCH_RANKING_IDENTITY,
  EXECUTIVE_MEMORY_SEARCH_RANKING_SELF_MANIFEST,
  ExecutiveMemorySearchRankingContracts,
} from "./executiveMemorySearchRankingContracts.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";
const LATER_TIME = "2026-01-03T00:00:00.000Z";

function registerSearchEnvironment() {
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
}

function seedSearchRecords() {
  const primary = buildExecutiveMemoryRecordExample(FIXED_TIME);
  const withRiskKpi = createExecutiveMemoryRecord({
    ...primary,
    references: Object.freeze([
      ...primary.references,
      createExecutiveMemoryReference({
        referenceId: "ref-risk-001",
        referenceType: "risk",
        targetId: "risk-eu-expansion-001",
        label: "EU expansion risk",
        module: "risk",
        workspaceId: primary.workspaceId,
      }),
      createExecutiveMemoryReference({
        referenceId: "ref-kpi-001",
        referenceType: "kpi",
        targetId: "kpi-revenue-001",
        label: "Revenue KPI",
        module: "kpi",
        workspaceId: primary.workspaceId,
      }),
    ]),
  });
  createExecutiveMemory(withRiskKpi, FIXED_TIME);

  const secondaryBase = buildExecutiveMemoryRecordExample(UPDATE_TIME);
  const secondary = createExecutiveMemoryRecord({
    ...secondaryBase,
    id: "memory-record-example-002",
    confidence: createExecutiveMemoryConfidence({
      confidenceId: "confidence-002",
      score: 0.94,
      level: "high",
      source: "executive-review",
      explanation: "Higher confidence secondary record.",
      calculationMethod: "executive_assessment_v1",
    }),
    createdAt: UPDATE_TIME,
    updatedAt: LATER_TIME,
    metadata: Object.freeze({
      ...secondaryBase.metadata,
      memoryId: "memory-record-example-002",
    }),
  });
  createExecutiveMemory(secondary, UPDATE_TIME);

  return { primary: withRiskKpi, secondary };
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
});

test("exports APP-4:9 search ranking identity and extends APP-4 phases", () => {
  assert.equal(EXECUTIVE_MEMORY_SEARCH_RANKING_IDENTITY.phaseId, "APP-4/9");
  assert.equal(EXECUTIVE_MEMORY_SEARCH_RANKING_CONTRACT_VERSION, "APP-4/9");
  assert.equal(ExecutiveMemorySearchRankingContracts.version, "APP-4/9");
});

test("performs structured search through retrieval engine", () => {
  registerSearchEnvironment();
  const { primary } = seedSearchRecords();
  const result = searchExecutiveMemories(Object.freeze({ workspaceId: primary.workspaceId }));
  assert.equal(result.success, true);
  assert.equal(result.records.length, 2);
  assert.equal(result.rankedResults.length, 2);
});

test("filters by workspace goal intent scenario and decision", () => {
  registerSearchEnvironment();
  const { primary } = seedSearchRecords();

  assert.equal(
    searchExecutiveMemories(Object.freeze({ workspaceId: primary.workspaceId })).records.length,
    2
  );
  assert.equal(
    searchExecutiveMemories(Object.freeze({ goalId: primary.goal!.goalId })).records.length,
    2
  );
  assert.equal(
    searchExecutiveMemories(Object.freeze({ intentId: primary.intent!.intentId })).records.length,
    2
  );
  assert.equal(
    searchExecutiveMemories(Object.freeze({ scenarioId: primary.scenario!.scenarioId })).records.length,
    2
  );
  assert.equal(
    searchExecutiveMemories(Object.freeze({ decisionId: primary.decision!.decisionId })).records.length,
    2
  );
});

test("filters by context risk and kpi metadata", () => {
  registerSearchEnvironment();
  const { primary } = seedSearchRecords();

  assert.equal(
    searchExecutiveMemories(Object.freeze({ contextId: primary.businessContext!.contextId })).records.length,
    2
  );
  assert.equal(
    searchExecutiveMemories(Object.freeze({ riskId: "risk-eu-expansion-001" })).records.length,
    1
  );
  assert.equal(
    searchExecutiveMemories(Object.freeze({ kpiId: "kpi-revenue-001" })).records.length,
    1
  );
});

test("ranks by highest confidence profile", () => {
  registerSearchEnvironment();
  seedSearchRecords();
  const result = searchExecutiveMemories(
    Object.freeze({
      workspaceId: "ws-memory-record-001",
      rankingProfileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.highestConfidence,
    })
  );
  assert.equal(result.rankedResults[0]?.record.record.id, "memory-record-example-002");
  assert.ok((result.rankedResults[0]?.score ?? 0) >= (result.rankedResults[1]?.score ?? 0));
});

test("ranks by recency profile", () => {
  registerSearchEnvironment();
  seedSearchRecords();
  const result = searchExecutiveMemories(
    Object.freeze({
      workspaceId: "ws-memory-record-001",
      rankingProfileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.recentFirst,
    })
  );
  assert.equal(result.rankedResults[0]?.record.record.id, "memory-record-example-002");
});

test("provides rule-based ranking explanation", () => {
  registerSearchEnvironment();
  const { primary } = seedSearchRecords();
  const search = searchExecutiveMemories(
    Object.freeze({
      workspaceId: primary.workspaceId,
      intentId: primary.intent!.intentId,
      rankingProfileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.intentFocus,
    })
  );
  const top = search.rankedResults[0];
  assert.ok(top);
  assert.ok(top.explanation.score >= 0);
  assert.ok(top.explanation.reasons.length > 0);
  assert.ok(top.explanation.reasons.some((entry) => entry.reason.includes("intent")));

  const explained = explainExecutiveMemoryRanking({
    record: top.record,
    query: Object.freeze({ workspaceId: primary.workspaceId, intentId: primary.intent!.intentId }),
    profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.intentFocus,
  });
  assert.equal(explained.recordId, top.record.record.id);
});

test("selects predefined ranking profiles", () => {
  registerSearchEnvironment();
  const profiles = getRankingProfiles();
  assert.ok(profiles.some((profile) => profile.profileId === EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.default));
  assert.ok(profiles.some((profile) => profile.profileId === EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.scenarioFocus));
  assert.ok(profiles.some((profile) => profile.profileId === EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.decisionFocus));
  assert.ok(profiles.some((profile) => profile.profileId === EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.contextFocus));
});

test("rejects invalid ranking profile", () => {
  registerSearchEnvironment();
  seedSearchRecords();
  const result = searchExecutiveMemories(
    Object.freeze({ workspaceId: "ws-memory-record-001", rankingProfileId: "profile-does-not-exist" })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /profile/i);
});

test("rejects invalid confidence range and malformed query", () => {
  registerSearchEnvironment();
  assert.equal(
    validateExecutiveMemorySearchQuery(
      Object.freeze({ confidenceMin: 1.5, readOnly: true as const })
    ).valid,
    false
  );
  const result = searchExecutiveMemories(Object.freeze({ confidenceMin: 2 }));
  assert.equal(result.success, false);
  assert.equal(result.error?.code, EXECUTIVE_MEMORY_SEARCH_RANKING_ERROR_CODES.validationFailure);
});

test("registers custom ranking profile and rejects duplicates", () => {
  registerSearchEnvironment();
  const created = registerExecutiveMemoryRankingProfile(
    Object.freeze({
      profileId: "custom-profile-001",
      label: "Custom",
      description: "Custom deterministic profile.",
      rules: Object.freeze([
        createExecutiveMemoryRankingRule({
          ruleId: "custom-workspace",
          ruleType: "workspace_match",
          weight: 50,
          enabled: true,
        }),
      ]),
    })
  );
  assert.equal(created.success, true);
  const duplicate = registerExecutiveMemoryRankingProfile(
    Object.freeze({
      profileId: "custom-profile-001",
      label: "Duplicate",
      description: "Duplicate profile.",
      rules: Object.freeze([
        createExecutiveMemoryRankingRule({
          ruleId: "custom-workspace-dup",
          ruleType: "workspace_match",
          weight: 50,
          enabled: true,
        }),
      ]),
    })
  );
  assert.equal(duplicate.success, false);
});

test("preserves deterministic ordering for equal searches", () => {
  registerSearchEnvironment();
  seedSearchRecords();
  const query = Object.freeze({ workspaceId: "ws-memory-record-001" });
  const first = searchExecutiveMemories(query);
  const second = searchExecutiveMemories(query);
  assert.deepEqual(
    first.rankedResults.map((entry) => entry.record.record.id),
    second.rankedResults.map((entry) => entry.record.record.id)
  );
});

test("returns empty results without error for unmatched filters", () => {
  registerSearchEnvironment();
  seedSearchRecords();
  const result = searchExecutiveMemories(Object.freeze({ workspaceId: "ws-no-match-001" }));
  assert.equal(result.success, true);
  assert.equal(result.records.length, 0);
  assert.equal(result.error, null);
});

test("computes lightweight search and ranking statistics", () => {
  registerSearchEnvironment();
  seedSearchRecords();
  searchExecutiveMemories(Object.freeze({ workspaceId: "ws-memory-record-001" }));
  const stats = getRankingStatistics();
  assert.equal(stats.searchesExecuted, 1);
  assert.ok(stats.averageExecutionTimeMs >= 0);
  assert.ok(stats.profileUsage.default >= 1);
  assert.ok(stats.filterUsage.workspaceId >= 1);
});

test("validates APP-4:9 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_MEMORY_SEARCH_RANKING_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveMemorySearchEngine.ts",
      allowedFiles: EXECUTIVE_MEMORY_SEARCH_RANKING_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MEMORY_SEARCH_RANKING_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid, true);
});

test("regression: APP-4:4 retrieval remains operational", () => {
  registerSearchEnvironment();
  seedSearchRecords();
  assert.equal(
    searchExecutiveMemories(Object.freeze({ recordId: "memory-record-example-001" })).records.length,
    1
  );
});

test("regression: APP-4:5 through APP-4:8 engines initialize independently", () => {
  resetExecutiveMemorySearchEngineForTests();
  initializeExecutiveIntentMemoryLinkEngine(FIXED_TIME);
  initializeExecutiveScenarioMemoryEngine(FIXED_TIME);
  initializeExecutiveDecisionMemoryEngine(FIXED_TIME);
  initializeExecutiveContextMemoryEngine(FIXED_TIME);
  assert.equal(initializeExecutiveMemorySearchEngine(FIXED_TIME).success, true);
});

test("regression: APP-2 scenario identity contracts remain valid", () => {
  const scenario = resolveScenarioIdentityExample();
  assert.equal(validateScenarioIdentityShape(scenario).valid, true);
});

test("rankExecutiveMemories ranks provided records independently", () => {
  registerSearchEnvironment();
  const { primary } = seedSearchRecords();
  const retrieval = searchExecutiveMemories(Object.freeze({ workspaceId: primary.workspaceId }));
  const reranked = rankExecutiveMemories({
    records: retrieval.records,
    query: Object.freeze({ workspaceId: primary.workspaceId, readOnly: true as const }),
    profileId: EXECUTIVE_MEMORY_RANKING_PROFILE_IDS.decisionFocus,
  });
  assert.equal(reranked.length, 2);
  assert.equal(reranked[0]?.rank, 1);
});

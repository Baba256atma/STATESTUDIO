import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { buildCrossScenarioLearningFoundation } from "../cross-scenario-learning/crossScenarioLearningFoundation.ts";
import {
  getOutcomes,
  initializeOutcomeLearningEngine,
  learnHistoricalOutcomes,
  resetOutcomeLearningEngineForTests,
  unregisterOutcome,
} from "../cross-scenario-learning/outcomeLearningEngine.ts";
import { extractExecutivePatterns, initializePatternExtractionEngine, resetPatternExtractionEngineForTests } from "../cross-scenario-learning/patternExtractionEngine.ts";
import { compareScenarioSimilarity, initializeSimilarityEngine, resetSimilarityEngineForTests } from "../cross-scenario-learning/similarityEngine.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import {
  enableAutomaticMonitoring,
  listAutomaticMonitoringPolicies,
  resetAutomaticMonitoringRuntimeForTests,
} from "../data-reality/automaticMonitoringRuntime.ts";
import { listCsvRealDataImports, resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import {
  appendDecisionMemoryEntry,
  loadDecisionMemoryEntries,
  type DecisionMemoryStorage,
} from "../decision/memory/decisionMemoryStore.ts";
import { applySceneOrgSavedSceneCollectionMutation } from "../scene-org/sceneOrgSavedSceneCollectionMutation.ts";
import { listSceneOrgSavedScenesForManagerWorkspace } from "../scene-org/sceneOrgSavedSceneCollectionAccess.ts";
import {
  SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION,
  sceneOrgSavedSceneDurabilityIdentity,
} from "../scene-org/sceneOrgSavedSceneDurability.ts";
import { createSceneOrgSavedScene } from "../scene-org/sceneOrgWorkspacePlacementContract.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { getActiveWorkspaceId, resetWorkspaceRegistryForTests, setActiveWorkspace } from "../workspace/workspaceRegistryStore.ts";
import { resolveActiveDemoProfileStageMaterials } from "./demoProfileStageCatalog.ts";
import {
  forgetDemoProfileMemoryForTests,
  openManufacturingDemo,
  openProjectDemo,
  readActiveDemoProfile,
  resetDemoProfileForTests,
  restoreDemoProfileSelectionFromSession,
} from "./demoProfileStore.ts";
import { resetActiveDemo } from "./demoProfileReset.ts";

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetAutomaticMonitoringRuntimeForTests();
  resetOutcomeLearningEngineForTests();
  resetPatternExtractionEngineForTests();
  resetSimilarityEngineForTests();
});

function memory(): DecisionMemoryStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  };
}

function scene(sceneId: string, name: string, demoProfileId?: "manufacturing" | "project") {
  return createSceneOrgSavedScene({
    sceneId,
    name,
    kind: "SAVED",
    sceneIntentType: "manager-view",
    managerWorkspaceId: DEMO_WORKSPACE_ID,
    demoProfileId: demoProfileId ?? null,
    canonicalReferences: [],
    layout: {
      presentationDepth: "minimum",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
  });
}

test("profiles share demo_workspace and keep their own CSV and stage objects", () => {
  openManufacturingDemo();
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  const manufacturingIds = resolveActiveDemoProfileStageMaterials()?.catalog.objects.map((object) => object.id);
  openProjectDemo();
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "project");
  const project = resolveActiveDemoProfileStageMaterials();
  assert.ok(project);
  assert.equal(project.catalog.objects.some((object) => manufacturingIds?.includes(object.id)), false);
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId.startsWith("demo-profile:manufacturing:")), true);
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId.startsWith("demo-profile:project:")), true);
  openManufacturingDemo();
  assert.deepEqual(
    resolveActiveDemoProfileStageMaterials()?.catalog.objects.map((object) => object.id),
    manufacturingIds,
  );
});

test("scenes, decisions, executions, memory, and monitoring stay with their profile", () => {
  const store = memory();
  openManufacturingDemo();
  appendDecisionMemoryEntry({
    workspaceId: DEMO_WORKSPACE_ID,
    entry: {
      id: "memory-m",
      created_at: 1,
      title: "Manufacturing memory",
      source: "manual",
    },
    storage: store,
  });
  const decisions = createNexoraCanonicalDecisionRuntime();
  const manufacturingDecision = decisions.adapter.transitionDecision({
    decisionId: "decision-m",
    action: "approve",
    title: "Manufacturing decision",
    workspaceId: DEMO_WORKSPACE_ID,
  });
  assert.equal(manufacturingDecision.status, "applied");
  const executions = createNexoraCanonicalExecutionRuntime({ decisionRuntime: decisions.adapter });
  const manufacturingExecution = executions.createExecution({ decisionId: "decision-m", workspaceId: DEMO_WORKSPACE_ID });
  assert.equal(manufacturingExecution.status, "created");
  enableAutomaticMonitoring({
    workspaceId: DEMO_WORKSPACE_ID,
    connectionId: "connection-m",
    targetId: "target-m",
    frequency: "daily",
    enabledAt: "2026-08-31T00:00:00.000Z",
  });

  openProjectDemo();
  appendDecisionMemoryEntry({
    workspaceId: DEMO_WORKSPACE_ID,
    entry: {
      id: "memory-p",
      created_at: 2,
      title: "Project memory",
      source: "manual",
    },
    storage: store,
  });
  assert.deepEqual(loadDecisionMemoryEntries(DEMO_WORKSPACE_ID, null, store).map((entry) => entry.id), ["memory-p"]);
  assert.equal(listAutomaticMonitoringPolicies(DEMO_WORKSPACE_ID).some((policy) => policy.connectionId === "connection-m"), false);
  const foreign = decisions.adapter.transitionDecision({
    decisionId: "decision-m",
    action: "reject",
    title: "Manufacturing decision",
    workspaceId: DEMO_WORKSPACE_ID,
  });
  assert.equal(foreign.status, "transition-not-allowed");
  assert.equal(decisions.adapter.getDecision("decision-m")?.status, "Approved");
  const foreignExecution = executions.transitionExecution({ executionId: "execution-decision-m", action: "start" });
  assert.equal(foreignExecution.status, "transition-not-allowed");
  assert.equal(executions.getExecution("execution-decision-m")?.status, "planned");

  const scenes = [
    scene("scene-m", "Manufacturing scene", "manufacturing"),
    scene("scene-p", "Project scene", "project"),
    scene("scene-legacy", "Legacy scene"),
  ];
  assert.deepEqual(
    listSceneOrgSavedScenesForManagerWorkspace(scenes, DEMO_WORKSPACE_ID).map((entry) => entry.sceneId),
    ["scene-p"],
  );
  const renamed = applySceneOrgSavedSceneCollectionMutation({
    scenes,
    managerWorkspaceId: DEMO_WORKSPACE_ID,
    mutation: { kind: "rename", sceneId: "scene-m", name: "Stolen" },
    persist: () => ({ persisted: true, reason: "persisted" }),
  });
  assert.equal(renamed.status, "not-found");
  assert.equal(scenes[0]?.name, "Manufacturing scene");
});

test("reset restores one profile and preserves the other, legacy records, and a company", () => {
  const company = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  assert.ok(company);
  openManufacturingDemo();
  openProjectDemo();
  const projectImports = listCsvRealDataImports(DEMO_WORKSPACE_ID).filter((entry) => entry.importId.startsWith("demo-profile:project:"));
  openManufacturingDemo();
  const scenes = [
    scene("scene-m", "Manufacturing scene", "manufacturing"),
    scene("scene-p", "Project scene", "project"),
    scene("scene-legacy", "Legacy scene"),
  ];
  const reset = resetActiveDemo({
    sceneStorage: {
      getItem: () => JSON.stringify({
        identity: sceneOrgSavedSceneDurabilityIdentity,
        version: SCENE_ORG_SAVED_SCENE_DURABILITY_VERSION,
        scenes,
      }),
      setItem: () => undefined,
    },
  });
  assert.equal(reset.status, "reset");
  assert.equal(reset.profileId, "manufacturing");
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(listCsvRealDataImports(company.workspaceId).some((entry) => entry.importId.startsWith("demo-profile:")), false);
  assert.equal(projectImports.every((entry) => listCsvRealDataImports(DEMO_WORKSPACE_ID).some((current) => current.importId === entry.importId)), true);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  forgetDemoProfileMemoryForTests();
  assert.equal(readActiveDemoProfile(), null);
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(restoreDemoProfileSelectionFromSession(), "manufacturing");
});

test("outcomes registered for one profile stay out of the other profile", () => {
  const fixedTime = "2026-08-31T00:00:00.000Z";
  buildCrossScenarioLearningFoundation(fixedTime);
  initializePatternExtractionEngine(fixedTime);
  initializeSimilarityEngine(fixedTime);
  initializeOutcomeLearningEngine(fixedTime);
  const patterns = extractExecutivePatterns({
    workspaceId: DEMO_WORKSPACE_ID,
    scenarios: [
      {
        scenarioId: "scenario-001",
        workspaceId: DEMO_WORKSPACE_ID,
        scenarioTitle: "Manufacturing outcome",
        patternCategory: "growth",
        patternType: "strategy_outcome",
        strategyChain: ["Increase Marketing Budget", "Sales Increased", "Profit Increased", "Risk Stable"],
        decisionIds: ["decision-001"],
        outcomeSummary: "Profit Increased with stable risk profile.",
        timelineReferences: ["timeline-001"],
        journalReferences: ["journal-001"],
        confidenceReferences: ["confidence-001"],
        confidenceVersion: "APP-9/1",
        sourceApps: ["APP-5", "APP-6", "APP-8", "APP-9"],
      },
      {
        scenarioId: "scenario-002",
        workspaceId: DEMO_WORKSPACE_ID,
        scenarioTitle: "Manufacturing outcome 2",
        patternCategory: "growth",
        patternType: "strategy_outcome",
        strategyChain: ["Increase Marketing Budget", "Sales Increased", "Profit Increased", "Risk Stable"],
        decisionIds: ["decision-002"],
        outcomeSummary: "Profit Increased with stable risk profile.",
        timelineReferences: ["timeline-002"],
        journalReferences: ["journal-002"],
        confidenceReferences: ["confidence-002"],
        confidenceVersion: "APP-9/1",
        sourceApps: ["APP-5", "APP-6", "APP-8", "APP-9"],
      },
    ],
    extractionTimestamp: "2026-08-31T00:00:00.000Z",
    patternNamePrefix: "Manufacturing",
    minOccurrences: 2,
  }).extractedPatterns;
  const patternId = patterns[0]?.patternId;
  assert.ok(patternId);
  const similarity = compareScenarioSimilarity({
    query: {
      scenarioId: "scenario-query",
      workspaceId: DEMO_WORKSPACE_ID,
      businessGoal: "Expand market share",
      strategyChain: ["Increase Marketing Budget", "Sales Increased", "Profit Increased", "Risk Stable"],
      objectTypes: ["campaign"],
      kpiDirection: "increase",
      riskProfile: "stable",
      decisionType: "executive",
      timelinePhase: "execution",
      outcomeType: "Profit Increased with stable risk profile.",
      patternCategory: "growth",
      workspaceDomain: "manufacturing",
      readOnly: true,
    },
    historicalScenarios: [{
      scenarioId: "scenario-001",
      workspaceId: DEMO_WORKSPACE_ID,
      businessGoal: "Expand market share",
      strategyChain: ["Increase Marketing Budget", "Sales Increased", "Profit Increased", "Risk Stable"],
      objectTypes: ["campaign"],
      kpiDirection: "increase",
      riskProfile: "stable",
      decisionType: "executive",
      timelinePhase: "execution",
      outcomeType: "Profit Increased with stable risk profile.",
      patternCategory: "growth",
      workspaceDomain: "manufacturing",
      readOnly: true,
    }],
    patterns,
    comparedAt: "2026-08-31T00:00:00.000Z",
  });
  const similarityResultId = similarity.patternResults[0]?.similarityResultId ?? similarity.scenarioResults[0]?.similarityResultId ?? "";
  openManufacturingDemo();
  const learned = learnHistoricalOutcomes({
    workspaceId: DEMO_WORKSPACE_ID,
    learningTimestamp: "2026-08-31T00:00:00.000Z",
    records: [{
      scenarioId: "scenario-001",
      workspaceId: DEMO_WORKSPACE_ID,
      businessGoal: "Expand market share",
      finalOutcomeCategory: "strong_success",
      kpiChangeSummary: "Revenue increased 18% with stable margins.",
      riskChangeSummary: "Risk profile remained stable.",
      decisionSummary: "Approved manufacturing plan.",
      relatedPatternIds: [patternId],
      relatedSimilarityResultIds: [similarityResultId],
      decisionIds: ["decision-001"],
      journalEntryIds: ["journal-001"],
      timelineReferences: ["timeline-001"],
      confidenceVersion: "APP-9/1",
      sourceApps: ["APP-5", "APP-6", "APP-7", "APP-8", "APP-9", "APP-10/2", "APP-10/3"],
      recordedAt: "2026-08-31T00:00:00.000Z",
    }],
  });
  assert.equal(learned.learnedOutcomes.length > 0, true);
  const outcomeId = learned.learnedOutcomes[0]?.outcome.outcomeId;
  assert.ok(outcomeId);
  assert.equal(getOutcomes(DEMO_WORKSPACE_ID).some((entry) => entry.outcome.outcomeId === outcomeId), true);
  openProjectDemo();
  assert.equal(getOutcomes(DEMO_WORKSPACE_ID).some((entry) => entry.outcome.outcomeId === outcomeId), false);
  assert.equal(unregisterOutcome(outcomeId).success, false);
  openManufacturingDemo();
  assert.equal(getOutcomes(DEMO_WORKSPACE_ID).some((entry) => entry.outcome.outcomeId === outcomeId), true);
});

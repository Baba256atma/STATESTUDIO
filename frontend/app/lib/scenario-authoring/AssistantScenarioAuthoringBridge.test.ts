import test from "node:test";
import assert from "node:assert/strict";

import {
  AssistantScenarioAuthoringBridge,
  buildAssistantScenarioAuthoringAssistance,
  resetAssistantScenarioAuthoringBridgeForTests,
} from "./AssistantScenarioAuthoringBridge.ts";
import {
  ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTIC,
  ASSISTANT_SCENARIO_AUTHORING_READY_DIAGNOSTIC,
  S1_ASSISTANT_BRIDGE_COMPLETE_TAG,
} from "./assistantScenarioAuthoringBridgeContract.ts";
import { resetExecutiveScenarioSummaryForTests } from "../scenario-intelligence/ExecutiveScenarioSummary.ts";
import { resetScenarioGenerationRuntimeForTests } from "../scenario-intelligence/ScenarioGenerationRuntime.ts";
import { resetScenarioBuilderEngineForTests } from "../scenario-intelligence/ScenarioBuilderEngine.ts";
import { resetObjectImpactSimulationEngineForTests } from "../scenario-intelligence/ObjectImpactSimulationEngine.ts";
import { resetRelationshipImpactSimulationEngineForTests } from "../scenario-intelligence/RelationshipImpactSimulationEngine.ts";
import { resetKpiImpactSimulationEngineForTests } from "../scenario-intelligence/KpiImpactSimulationEngine.ts";
import { resetRiskImpactSimulationEngineForTests } from "../scenario-intelligence/RiskImpactSimulationEngine.ts";
import { resetExecutiveRiskSummaryForTests } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import { resetObjectRiskEngineForTests } from "../risk-intelligence/ObjectRiskEngine.ts";
import { resetRelationshipRiskEngineForTests } from "../risk-intelligence/RelationshipRiskEngine.ts";
import { resetKpiRiskEngineForTests } from "../risk-intelligence/KpiRiskEngine.ts";
import { resetRiskPropagationEngineForTests } from "../risk-intelligence/RiskPropagationEngine.ts";
import { resetExecutiveObjectIntelligenceSummaryForTests } from "../object-intelligence/ExecutiveObjectIntelligenceSummary.ts";
import { resetObjectIntelligenceRuntimeForTests } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import { resetObjectHealthEngineForTests } from "../object-intelligence/ObjectHealthEngine.ts";
import { resetObjectImportanceEngineForTests } from "../object-intelligence/ObjectImportanceEngine.ts";
import { resetObjectTrendEngineForTests } from "../object-intelligence/ObjectTrendEngine.ts";
import { resetExecutiveRelationshipSummaryForTests } from "../relationship-intelligence/ExecutiveRelationshipSummary.ts";
import { resetRelationshipIntelligenceRuntimeForTests } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import { resetDependencyIntelligenceEngineForTests } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { resetExecutiveKpiSummaryForTests } from "../kpi-intelligence/ExecutiveKpiSummary.ts";
import { resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { resetKpiHealthEngineForTests } from "../kpi-intelligence/KpiHealthEngine.ts";
import { resetKpiTrendEngineForTests } from "../kpi-intelligence/KpiTrendEngine.ts";

const SAMPLE_SCENE = {
  scene: {
    objects: [
      {
        id: "supplier-1",
        label: "Primary Supplier",
        type: "supplier",
        active: false,
        sourceConfidence: 15,
      },
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        activityLevel: 55,
      },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
        status: "healthy",
        confidence: 75,
        metadata: { supplyRisk: 85, dependency: 88 },
      },
    ],
    kpis: [
      { id: "revenue", label: "Revenue", category: "Revenue", value: 80, target: 100, direction: "up" },
    ],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
};

test.beforeEach(() => {
  resetAssistantScenarioAuthoringBridgeForTests();
  resetExecutiveScenarioSummaryForTests();
  resetScenarioGenerationRuntimeForTests();
  resetScenarioBuilderEngineForTests();
  resetObjectImpactSimulationEngineForTests();
  resetRelationshipImpactSimulationEngineForTests();
  resetKpiImpactSimulationEngineForTests();
  resetRiskImpactSimulationEngineForTests();
  resetExecutiveRiskSummaryForTests();
  resetObjectRiskEngineForTests();
  resetRelationshipRiskEngineForTests();
  resetKpiRiskEngineForTests();
  resetRiskPropagationEngineForTests();
  resetExecutiveObjectIntelligenceSummaryForTests();
  resetObjectIntelligenceRuntimeForTests();
  resetObjectHealthEngineForTests();
  resetObjectImportanceEngineForTests();
  resetObjectTrendEngineForTests();
  resetExecutiveRelationshipSummaryForTests();
  resetRelationshipIntelligenceRuntimeForTests();
  resetDependencyIntelligenceEngineForTests();
  resetExecutiveKpiSummaryForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetKpiHealthEngineForTests();
  resetKpiTrendEngineForTests();
});

test("exports S1 assistant bridge completion tag", () => {
  assert.equal(S1_ASSISTANT_BRIDGE_COMPLETE_TAG, "[S1_ASSISTANT_BRIDGE_COMPLETE]");
  assert.equal(ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTIC, "[ASSISTANT_SCENARIO_AUTHORING]");
  assert.equal(ASSISTANT_SCENARIO_AUTHORING_READY_DIAGNOSTIC, "[ASSISTANT_SCENARIO_AUTHORING_READY]");
});

test("provides draft field explanations structure suggestions and missing inputs", () => {
  const assistance = buildAssistantScenarioAuthoringAssistance({
    sceneJson: SAMPLE_SCENE,
    partialDraft: {
      scenarioType: "risk",
      name: "Supplier Delay",
    },
  });

  assert.equal(assistance.readOnly, true);
  assert.equal(assistance.draftAssistanceOnly, true);
  assert.equal(assistance.simulationActive, false);
  assert.equal(assistance.sceneMutation, false);
  assert.equal(assistance.routingMutation, false);
  assert.equal(assistance.topologyMutation, false);
  assert.ok(assistance.fieldExplanations.length >= 5);
  assert.equal(assistance.structureSuggestions.length, 4);
  assert.ok(assistance.missingInputs.length > 0);
  assert.ok(assistance.draftGuidance.includes("does not execute simulations"));
  assert.equal(assistance.diagnostics.includes(ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTIC), true);
  assert.equal(assistance.diagnostics.includes(ASSISTANT_SCENARIO_AUTHORING_READY_DIAGNOSTIC), true);
  assert.equal(assistance.scenarioIntelligence.readOnly, true);
  assert.equal(assistance.scenarioIntelligence.simulationActive, false);
});

test("consumes scenario intelligence without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  AssistantScenarioAuthoringBridge.buildAssistantScenarioAuthoringAssistance({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
});

import test from "node:test";
import assert from "node:assert/strict";

import {
  AnalyzeIntelligenceBinding,
  resolveAnalyzeIntelligenceBinding,
  resetAnalyzeIntelligenceBindingForTests,
} from "./AnalyzeIntelligenceBinding.ts";
import { resetExecutiveIntelligenceAdapterForTests } from "./ExecutiveIntelligenceAdapter.ts";
import { resetAnalyzeIntelligenceProfileForTests } from "./AnalyzeIntelligenceProfile.ts";
import {
  ANALYZE_BINDING_DIAGNOSTIC,
  ANALYZE_BINDING_READY_DIAGNOSTIC,
  INT1_ANALYZE_BINDING_COMPLETE_TAG,
} from "./analyzeIntelligenceBindingContract.ts";
import { EMPTY_ANALYZE_INTELLIGENCE_PROFILE } from "./analyzeIntelligenceProfileContract.ts";
import { attachAnalyzeIntelligenceBinding } from "../dashboard/analyze/analyzeIntelligenceBindingBridge.ts";
import { resetExecutiveObjectIntelligenceSummaryForTests } from "../object-intelligence/ExecutiveObjectIntelligenceSummary.ts";
import { resetObjectIntelligenceRuntimeForTests } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import { resetObjectHealthEngineForTests } from "../object-intelligence/ObjectHealthEngine.ts";
import { resetObjectImpactEngineForTests } from "../object-intelligence/ObjectImpactEngine.ts";
import { resetObjectConfidenceEngineForTests } from "../object-intelligence/ObjectConfidenceEngine.ts";
import { resetObjectTrendEngineForTests } from "../object-intelligence/ObjectTrendEngine.ts";
import { resetObjectImportanceEngineForTests } from "../object-intelligence/ObjectImportanceEngine.ts";
import { resetExecutiveRelationshipSummaryForTests } from "../relationship-intelligence/ExecutiveRelationshipSummary.ts";
import { resetRelationshipIntelligenceRuntimeForTests } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import { resetRelationshipStrengthEngineForTests } from "../relationship-intelligence/RelationshipStrengthEngine.ts";
import { resetDependencyIntelligenceEngineForTests } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { resetRelationshipInfluenceEngineForTests } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { resetRelationshipRiskExposureEngineForTests } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";
import { resetExecutiveKpiSummaryForTests } from "../kpi-intelligence/ExecutiveKpiSummary.ts";
import { resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { resetKpiDiscoveryEngineForTests } from "../kpi-intelligence/KpiDiscoveryEngine.ts";
import { resetKpiHealthEngineForTests } from "../kpi-intelligence/KpiHealthEngine.ts";
import { resetKpiTrendEngineForTests } from "../kpi-intelligence/KpiTrendEngine.ts";
import { resetKpiDependencyEngineForTests } from "../kpi-intelligence/KpiDependencyEngine.ts";
import { resetKpiImpactEngineForTests } from "../kpi-intelligence/KpiImpactEngine.ts";
import { resetExecutiveRiskSummaryForTests } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../risk-intelligence/RiskIntelligenceRuntime.ts";
import { resetObjectRiskEngineForTests } from "../risk-intelligence/ObjectRiskEngine.ts";
import { resetRelationshipRiskEngineForTests } from "../risk-intelligence/RelationshipRiskEngine.ts";
import { resetKpiRiskEngineForTests } from "../risk-intelligence/KpiRiskEngine.ts";
import { resetRiskPropagationEngineForTests } from "../risk-intelligence/RiskPropagationEngine.ts";
import { resetExecutiveScenarioSummaryForTests } from "../scenario-intelligence/ExecutiveScenarioSummary.ts";
import { resetScenarioGenerationRuntimeForTests } from "../scenario-intelligence/ScenarioGenerationRuntime.ts";
import { resetScenarioBuilderEngineForTests } from "../scenario-intelligence/ScenarioBuilderEngine.ts";
import { resetObjectImpactSimulationEngineForTests } from "../scenario-intelligence/ObjectImpactSimulationEngine.ts";
import { resetRelationshipImpactSimulationEngineForTests } from "../scenario-intelligence/RelationshipImpactSimulationEngine.ts";
import { resetKpiImpactSimulationEngineForTests } from "../scenario-intelligence/KpiImpactSimulationEngine.ts";
import { resetRiskImpactSimulationEngineForTests } from "../scenario-intelligence/RiskImpactSimulationEngine.ts";

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
    ],
    relationships: [],
    kpis: [{ id: "revenue", label: "Revenue", category: "Revenue", value: 80, target: 100 }],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
};

test.beforeEach(() => {
  resetAnalyzeIntelligenceBindingForTests();
  resetExecutiveIntelligenceAdapterForTests();
  resetAnalyzeIntelligenceProfileForTests();
  resetExecutiveObjectIntelligenceSummaryForTests();
  resetObjectIntelligenceRuntimeForTests();
  resetObjectHealthEngineForTests();
  resetObjectImpactEngineForTests();
  resetObjectConfidenceEngineForTests();
  resetObjectTrendEngineForTests();
  resetObjectImportanceEngineForTests();
  resetExecutiveRelationshipSummaryForTests();
  resetRelationshipIntelligenceRuntimeForTests();
  resetRelationshipStrengthEngineForTests();
  resetDependencyIntelligenceEngineForTests();
  resetRelationshipInfluenceEngineForTests();
  resetRelationshipRiskExposureEngineForTests();
  resetExecutiveKpiSummaryForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetKpiDiscoveryEngineForTests();
  resetKpiHealthEngineForTests();
  resetKpiTrendEngineForTests();
  resetKpiDependencyEngineForTests();
  resetKpiImpactEngineForTests();
  resetExecutiveRiskSummaryForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetObjectRiskEngineForTests();
  resetRelationshipRiskEngineForTests();
  resetKpiRiskEngineForTests();
  resetRiskPropagationEngineForTests();
  resetExecutiveScenarioSummaryForTests();
  resetScenarioGenerationRuntimeForTests();
  resetScenarioBuilderEngineForTests();
  resetObjectImpactSimulationEngineForTests();
  resetRelationshipImpactSimulationEngineForTests();
  resetKpiImpactSimulationEngineForTests();
  resetRiskImpactSimulationEngineForTests();
});

test("exports INT-1 analyze binding completion tag", () => {
  assert.equal(INT1_ANALYZE_BINDING_COMPLETE_TAG, "[INT1_ANALYZE_BINDING_COMPLETE]");
  assert.equal(ANALYZE_BINDING_DIAGNOSTIC, "[ANALYZE_BINDING]");
  assert.equal(ANALYZE_BINDING_READY_DIAGNOSTIC, "[ANALYZE_BINDING_READY]");
});

test("object selected binds selected object through adapter to analyze profile", () => {
  const binding = resolveAnalyzeIntelligenceBinding({
    objectId: "supplier-1",
    objectName: "Primary Supplier",
    selectedObjectId: "supplier-1",
    sceneJson: SAMPLE_SCENE,
  });

  assert.equal(binding.bindingStatus, "bound");
  assert.equal(binding.readOnly, true);
  assert.equal(binding.sceneMutation, false);
  assert.equal(binding.diagnostics.includes(ANALYZE_BINDING_DIAGNOSTIC), true);
  assert.equal(binding.diagnostics.includes(ANALYZE_BINDING_READY_DIAGNOSTIC), true);
  assert.ok(binding.view);
  assert.equal(binding.view?.objectId, "supplier-1");
  assert.ok(binding.profile);
  assert.ok(binding.adapterLayerCount > 0);
});

test("object missing preserves empty binding state", () => {
  const binding = resolveAnalyzeIntelligenceBinding({ objectId: null, sceneJson: SAMPLE_SCENE });
  assert.equal(binding.bindingStatus, "missing_object");
  assert.equal(binding.view, null);
  assert.equal(binding.profile, null);
});

test("no intelligence preserves missing intelligence binding state", () => {
  const binding = resolveAnalyzeIntelligenceBinding({
    objectId: "supplier-1",
    profile: EMPTY_ANALYZE_INTELLIGENCE_PROFILE,
    sceneJson: { scene: { objects: [], relationships: [], kpis: [], risks: [] } },
  });

  assert.equal(binding.bindingStatus, "missing_intelligence");
  assert.equal(binding.view, null);
  assert.equal(binding.profile, null);
});

test("bridge attaches intelligence without mutating analyze context fields", () => {
  const context = attachAnalyzeIntelligenceBinding(
    Object.freeze({
      objectId: "supplier-1",
      objectName: "Primary Supplier",
      analysisStatus: "ready",
      analysisStatusLabel: "Ready",
      modules: Object.freeze([]),
      intelligence: null,
      executiveSummary: null,
    }),
    { objectId: "supplier-1", sceneJson: SAMPLE_SCENE }
  );

  assert.ok(context);
  assert.equal(context.objectId, "supplier-1");
  assert.ok(context.intelligence);
  assert.equal(context.intelligence?.bindingStatus, "bound");
  assert.equal(Object.isFrozen(context), true);
});

test("reads scene payload without mutating source records", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  AnalyzeIntelligenceBinding.resolveAnalyzeIntelligenceBinding({
    objectId: "supplier-1",
    sceneJson,
  });

  assert.equal(JSON.stringify(sceneJson), before);
});

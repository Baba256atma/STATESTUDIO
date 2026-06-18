import test from "node:test";
import assert from "node:assert/strict";

import {
  RiskExplanationEngine,
  buildRiskExplanationRegistry,
  resetRiskExplanationEngineForTests,
} from "./RiskExplanationEngine.ts";
import {
  INT3_RISK_EXPLANATION_COMPLETE_TAG,
  RISK_EXPLANATION_ENGINE_DIAGNOSTIC,
  RISK_EXPLANATION_READY_DIAGNOSTIC,
} from "./riskExplanationEngineContract.ts";
import { resetExecutiveRiskSummaryForTests } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../risk-intelligence/RiskIntelligenceRuntime.ts";
import { resetObjectRiskEngineForTests } from "../risk-intelligence/ObjectRiskEngine.ts";
import { resetRelationshipRiskEngineForTests } from "../risk-intelligence/RelationshipRiskEngine.ts";
import { resetKpiRiskEngineForTests } from "../risk-intelligence/KpiRiskEngine.ts";
import { resetRiskPropagationEngineForTests } from "../risk-intelligence/RiskPropagationEngine.ts";
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
        relationships: [{ status: "broken", confidence: 20 }],
      },
      {
        id: "inventory-1",
        label: "Inventory",
        type: "inventory",
        activityLevel: 55,
      },
      {
        id: "production-1",
        label: "Production",
        type: "production",
        role: "executive",
        importance: 90,
        active: false,
        sourceConfidence: 20,
      },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
        direction: "uni",
        metadata: { supplyRisk: 85, dependency: 88, strength: 0.9, redundancy: 6 },
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "rel-dependency",
        sourceId: "inventory-1",
        targetId: "production-1",
        type: "dependency",
        direction: "uni",
        metadata: { operationalRisk: 90, dependency: 92, redundancy: 8 },
        createdAt: "2026-01-02T00:00:00.000Z",
      },
    ],
    kpis: [
      {
        id: "schedule",
        label: "Schedule",
        objectId: "production-1",
        value: 42,
        target: 60,
        category: "Schedule",
        confidence: 55,
      },
    ],
    kpiSnapshots: [
      { kpiId: "schedule", value: 58, capturedAt: "2026-01-01T00:00:00.000Z" },
      { kpiId: "schedule", value: 50, capturedAt: "2026-02-01T00:00:00.000Z" },
      { kpiId: "schedule", value: 42, capturedAt: "2026-03-01T00:00:00.000Z" },
    ],
  },
};

test.beforeEach(() => {
  resetRiskExplanationEngineForTests();
  resetExecutiveRiskSummaryForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetObjectRiskEngineForTests();
  resetRelationshipRiskEngineForTests();
  resetKpiRiskEngineForTests();
  resetRiskPropagationEngineForTests();
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
  resetKpiHealthEngineForTests();
  resetKpiTrendEngineForTests();
});

test("exports INT-3 risk explanation completion tag", () => {
  assert.equal(INT3_RISK_EXPLANATION_COMPLETE_TAG, "[INT3_RISK_EXPLANATION_COMPLETE]");
  assert.equal(RISK_EXPLANATION_ENGINE_DIAGNOSTIC, "[RISK_EXPLANATION_ENGINE]");
  assert.equal(RISK_EXPLANATION_READY_DIAGNOSTIC, "[RISK_EXPLANATION_READY]");
});

test("generates template-driven executive risk explanations", () => {
  const registry = buildRiskExplanationRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.explanationReady, true);
  assert.ok(registry.explanationCount > 0);
  assert.ok(registry.explanations.length > 0);

  const objectExplanation = registry.explanations.find(
    (entry) => entry.nodeKind === "object" && entry.nodeId === "supplier-1"
  );
  assert.ok(objectExplanation);

  for (const explanation of registry.explanations) {
    assert.ok(explanation.riskScoreExplanation.length > 0);
    assert.ok(explanation.propagationExplanation.length > 0);
    assert.ok(explanation.whatIsRisky.length > 0);
    assert.ok(explanation.whyItIsRisky.length > 0);
    assert.ok(explanation.executiveSummary.length > 0);
    assert.ok(explanation.whatIsRisky.toLowerCase().includes("risky"));
    assert.ok(explanation.whyItIsRisky.toLowerCase().includes("risky"));
  }

  assert.ok(
    registry.explanations.some((entry) => entry.nodeKind === "chain" || entry.whereRiskPropagates)
  );
  assert.ok(registry.explanations.some((entry) => entry.vulnerabilityExplanation));

  assert.equal(registry.diagnostics.includes(RISK_EXPLANATION_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RISK_EXPLANATION_READY_DIAGNOSTIC), true);
});

test("consumes risk intelligence without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  RiskExplanationEngine.buildRiskExplanationRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
});

import test from "node:test";
import assert from "node:assert/strict";

import {
  ObjectExplanationEngine,
  buildObjectExplanationRegistry,
  resetObjectExplanationEngineForTests,
} from "./ObjectExplanationEngine.ts";
import {
  INT3_OBJECT_EXPLANATION_COMPLETE_TAG,
  OBJECT_EXPLANATION_ENGINE_DIAGNOSTIC,
  OBJECT_EXPLANATION_READY_DIAGNOSTIC,
} from "./objectExplanationEngineContract.ts";
import { resetExecutiveObjectIntelligenceSummaryForTests } from "../object-intelligence/ExecutiveObjectIntelligenceSummary.ts";
import { resetObjectIntelligenceRuntimeForTests } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import { resetObjectHealthEngineForTests } from "../object-intelligence/ObjectHealthEngine.ts";
import { resetObjectImpactEngineForTests } from "../object-intelligence/ObjectImpactEngine.ts";
import { resetObjectConfidenceEngineForTests } from "../object-intelligence/ObjectConfidenceEngine.ts";
import { resetObjectTrendEngineForTests } from "../object-intelligence/ObjectTrendEngine.ts";
import { resetObjectImportanceEngineForTests } from "../object-intelligence/ObjectImportanceEngine.ts";
import { resetObjectRiskEngineForTests } from "../risk-intelligence/ObjectRiskEngine.ts";

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
  resetObjectExplanationEngineForTests();
  resetExecutiveObjectIntelligenceSummaryForTests();
  resetObjectIntelligenceRuntimeForTests();
  resetObjectHealthEngineForTests();
  resetObjectImpactEngineForTests();
  resetObjectConfidenceEngineForTests();
  resetObjectTrendEngineForTests();
  resetObjectImportanceEngineForTests();
  resetObjectRiskEngineForTests();
});

test("exports INT-3 object explanation completion tag", () => {
  assert.equal(INT3_OBJECT_EXPLANATION_COMPLETE_TAG, "[INT3_OBJECT_EXPLANATION_COMPLETE]");
  assert.equal(OBJECT_EXPLANATION_ENGINE_DIAGNOSTIC, "[OBJECT_EXPLANATION_ENGINE]");
  assert.equal(OBJECT_EXPLANATION_READY_DIAGNOSTIC, "[OBJECT_EXPLANATION_READY]");
});

test("generates template-driven executive object explanations", () => {
  const registry = buildObjectExplanationRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.explanationReady, true);
  assert.ok(registry.explanationCount > 0);
  assert.ok(registry.explanations.length > 0);

  for (const explanation of registry.explanations) {
    assert.ok(explanation.healthExplanation.length > 0);
    assert.ok(explanation.impactExplanation.length > 0);
    assert.ok(explanation.trendExplanation.length > 0);
    assert.ok(explanation.importanceExplanation.length > 0);
    assert.ok(explanation.riskExplanation.length > 0);
    assert.ok(explanation.confidenceExplanation.length > 0);
    assert.ok(explanation.executiveSummary.length > 0);
    assert.ok(explanation.executiveSummary.includes(explanation.label));
  }

  assert.equal(registry.diagnostics.includes(OBJECT_EXPLANATION_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(OBJECT_EXPLANATION_READY_DIAGNOSTIC), true);
});

test("consumes object intelligence without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  ObjectExplanationEngine.buildObjectExplanationRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
});

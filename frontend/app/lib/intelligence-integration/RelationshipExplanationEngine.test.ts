import test from "node:test";
import assert from "node:assert/strict";

import {
  RelationshipExplanationEngine,
  buildRelationshipExplanationRegistry,
  resetRelationshipExplanationEngineForTests,
} from "./RelationshipExplanationEngine.ts";
import {
  INT3_RELATIONSHIP_EXPLANATION_COMPLETE_TAG,
  RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_EXPLANATION_READY_DIAGNOSTIC,
} from "./relationshipExplanationEngineContract.ts";
import { resetExecutiveRelationshipSummaryForTests } from "../relationship-intelligence/ExecutiveRelationshipSummary.ts";
import { resetRelationshipIntelligenceRuntimeForTests } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import { resetRelationshipStrengthEngineForTests } from "../relationship-intelligence/RelationshipStrengthEngine.ts";
import { resetDependencyIntelligenceEngineForTests } from "../relationship-intelligence/DependencyIntelligenceEngine.ts";
import { resetRelationshipInfluenceEngineForTests } from "../relationship-intelligence/RelationshipInfluenceEngine.ts";
import { resetRelationshipRiskExposureEngineForTests } from "../relationship-intelligence/RelationshipRiskExposureEngine.ts";

const SAMPLE_SCENE = {
  scene: {
    objects: [
      { id: "supplier-1", label: "Primary Supplier", tags: ["supplier"] },
      { id: "inventory-1", label: "Inventory", tags: ["inventory"] },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
        direction: "uni",
        status: "healthy",
        confidence: 62,
        metadata: {
          confidence: 62,
          dependencyWeight: 90,
          riskExposure: 84,
          supplyRisk: 95,
          dependency: 88,
        },
      },
    ],
  },
};

test.beforeEach(() => {
  resetRelationshipExplanationEngineForTests();
  resetExecutiveRelationshipSummaryForTests();
  resetRelationshipIntelligenceRuntimeForTests();
  resetRelationshipStrengthEngineForTests();
  resetDependencyIntelligenceEngineForTests();
  resetRelationshipInfluenceEngineForTests();
  resetRelationshipRiskExposureEngineForTests();
});

test("exports INT-3 relationship explanation completion tag", () => {
  assert.equal(
    INT3_RELATIONSHIP_EXPLANATION_COMPLETE_TAG,
    "[INT3_RELATIONSHIP_EXPLANATION_COMPLETE]"
  );
  assert.equal(RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTIC, "[RELATIONSHIP_EXPLANATION_ENGINE]");
  assert.equal(RELATIONSHIP_EXPLANATION_READY_DIAGNOSTIC, "[RELATIONSHIP_EXPLANATION_READY]");
});

test("generates template-driven executive relationship explanations", () => {
  const registry = buildRelationshipExplanationRegistry({ sceneJson: SAMPLE_SCENE });

  assert.equal(registry.readOnly, true);
  assert.equal(registry.sceneMutation, false);
  assert.equal(registry.objectMutation, false);
  assert.equal(registry.explanationReady, true);
  assert.ok(registry.explanationCount > 0);
  assert.ok(registry.explanations.length > 0);

  const supplyExplanation = registry.explanations.find(
    (entry) => entry.relationshipId === "rel-supply"
  );
  assert.ok(supplyExplanation);

  for (const explanation of registry.explanations) {
    assert.ok(explanation.dependencyExplanation.length > 0);
    assert.ok(explanation.influenceExplanation.length > 0);
    assert.ok(explanation.strengthExplanation.length > 0);
    assert.ok(explanation.riskExposureExplanation.length > 0);
    assert.ok(explanation.executiveSummary.length > 0);
    assert.ok(explanation.executiveSummary.includes("→"));
  }

  assert.ok(supplyExplanation!.whyDependencyCritical);
  assert.ok(supplyExplanation!.whyInfluenceStrong);
  assert.ok(supplyExplanation!.whyExposureHigh);
  assert.ok(supplyExplanation!.whyDependencyCritical!.includes("critical"));
  assert.ok(supplyExplanation!.whyInfluenceStrong!.includes("strong"));
  assert.ok(supplyExplanation!.whyExposureHigh!.includes("high"));

  assert.equal(registry.diagnostics.includes(RELATIONSHIP_EXPLANATION_ENGINE_DIAGNOSTIC), true);
  assert.equal(registry.diagnostics.includes(RELATIONSHIP_EXPLANATION_READY_DIAGNOSTIC), true);
});

test("consumes relationship intelligence without mutating scene payload", () => {
  const sceneJson = structuredClone(SAMPLE_SCENE);
  const before = JSON.stringify(sceneJson);

  RelationshipExplanationEngine.buildRelationshipExplanationRegistry({ sceneJson });

  assert.equal(JSON.stringify(sceneJson), before);
});

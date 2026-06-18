import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveRelationshipSummary,
  getExecutiveRelationshipSummary,
  resetExecutiveRelationshipSummaryForTests,
} from "./ExecutiveRelationshipSummary.ts";
import {
  EXEC_RELATIONSHIP_READY_DIAGNOSTIC,
  EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTIC,
} from "./executiveRelationshipSummaryContract.ts";

test.beforeEach(() => {
  resetExecutiveRelationshipSummaryForTests();
});

test("builds executive relationship summary with top risks dependencies influencers and attention", () => {
  const summary = buildExecutiveRelationshipSummary({
    intelligenceProfiles: [
      {
        relationshipId: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        relationshipType: "supplies",
        strength: 82,
        dependency: 90,
        influence: 88,
        confidence: 62,
        riskExposure: 70,
      },
      {
        relationshipId: "rel-info",
        sourceId: "ops-1",
        targetId: "exec-1",
        relationshipType: "information",
        strength: 55,
        dependency: 35,
        influence: 72,
        confidence: 90,
        riskExposure: 25,
      },
    ],
    strengthProfiles: [
      {
        relationshipId: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        relationshipType: "supplies",
        strengthScore: 86,
        strengthLevel: "Critical",
        strengthFactors: { interactionFrequency: 90, sharedDependencies: 80, relationshipHistory: 85, dataConfidence: 88 },
        strengthReasoning: ["Critical strength."],
      },
      {
        relationshipId: "rel-info",
        sourceId: "ops-1",
        targetId: "exec-1",
        relationshipType: "information",
        strengthScore: 58,
        strengthLevel: "Moderate",
        strengthFactors: { interactionFrequency: 60, sharedDependencies: 20, relationshipHistory: 70, dataConfidence: 80 },
        strengthReasoning: ["Moderate strength."],
      },
    ],
    dependencyProfiles: [
      {
        relationshipId: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        relationshipType: "supplies",
        dependencyScore: 88,
        dependencyLevel: "Critical Dependency",
        singlePointOfFailure: true,
        dependencyFactors: { dependencyWeight: 90, directionCriticality: 85, redundancy: 10, continuityRisk: 92 },
        dependencyReasoning: ["SPoF."],
      },
      {
        relationshipId: "rel-info",
        sourceId: "ops-1",
        targetId: "exec-1",
        relationshipType: "information",
        dependencyScore: 36,
        dependencyLevel: "Independent",
        singlePointOfFailure: false,
        dependencyFactors: { dependencyWeight: 25, directionCriticality: 40, redundancy: 80, continuityRisk: 30 },
        dependencyReasoning: ["Independent."],
      },
    ],
    riskExposureProfiles: [
      {
        relationshipId: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        relationshipType: "supplies",
        riskExposureScore: 84,
        riskExposureLevel: "High",
        riskTypes: ["Operational Risk", "Supply Risk", "Execution Risk"],
        riskExposureFactors: { operationalRisk: 85, financialRisk: 45, supplyRisk: 95, executionRisk: 78 },
        riskExposureReasoning: ["High risk."],
      },
      {
        relationshipId: "rel-info",
        sourceId: "ops-1",
        targetId: "exec-1",
        relationshipType: "information",
        riskExposureScore: 32,
        riskExposureLevel: "Low",
        riskTypes: [],
        riskExposureFactors: { operationalRisk: 35, financialRisk: 20, supplyRisk: 20, executionRisk: 40 },
        riskExposureReasoning: ["Low risk."],
      },
    ],
  });

  assert.equal(summary.relationshipCount, 2);
  assert.equal(summary.averageStrengthScore, 72);
  assert.equal(summary.averageDependencyScore, 62);
  assert.equal(summary.averageInfluenceScore, 80);
  assert.equal(summary.averageConfidenceScore, 76);
  assert.equal(summary.averageRiskExposureScore, 58);
  assert.equal(summary.topRisks[0], "rel-supply: risk 84");
  assert.equal(summary.topDependencies[0], "rel-supply: dependency 88");
  assert.equal(summary.topInfluencers[0], "rel-supply: influence 88");
  assert.equal(summary.recommendedAttention[0]?.relationshipId, "rel-supply");
  assert.equal(summary.recommendedAttention[0]?.attentionLevel, "prioritize");
  assert.equal(summary.diagnostics.includes(EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTIC), true);
  assert.equal(summary.diagnostics.includes(EXEC_RELATIONSHIP_READY_DIAGNOSTIC), true);
  assert.equal(summary.sceneMutation, false);
  assert.equal(summary.objectMutation, false);
  assert.equal(summary.routingMutation, false);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(Object.isFrozen(summary.topRisks), true);
  assert.equal(Object.isFrozen(summary.recommendedAttention), true);
  assert.equal(getExecutiveRelationshipSummary().relationshipCount, 2);
});

test("returns empty executive relationship summary when no profiles are available", () => {
  const summary = buildExecutiveRelationshipSummary();

  assert.equal(summary.relationshipCount, 0);
  assert.equal(summary.executiveSummary, "No relationship intelligence is available.");
  assert.equal(summary.recommendedAttention.length, 0);
});

test("aggregator derives relationship profiles from scene without mutation", () => {
  const relationship: Record<string, unknown> = {
    id: "rel-1",
    sourceId: "supplier-1",
    targetId: "inventory-1",
    type: "supplies",
    direction: "uni",
    metadata: { confidence: 65, dependencyWeight: 90, riskExposure: 80 },
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  const source = { id: "supplier-1", tags: ["supplier"] };
  const target = { id: "inventory-1", tags: ["inventory"] };
  const scene = { scene: { relationships: [relationship], objects: [source, target] } };
  const beforeScene = JSON.stringify(scene);

  const summary = buildExecutiveRelationshipSummary({ sceneJson: scene });

  assert.equal(JSON.stringify(scene), beforeScene);
  assert.equal(Object.prototype.hasOwnProperty.call(relationship, "recommendedAttention"), false);
  assert.equal(summary.relationshipCount, 1);
  assert.equal(summary.executiveSummary.includes("Executive relationship intelligence covers 1 relationship"), true);
});

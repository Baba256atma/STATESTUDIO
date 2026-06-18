import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveObjectIntelligenceSummary,
  getExecutiveObjectIntelligenceSummary,
  resetExecutiveObjectIntelligenceSummaryForTests,
} from "./ExecutiveObjectIntelligenceSummary.ts";
import {
  EXEC_OBJECT_INTELLIGENCE_DIAGNOSTIC,
  EXEC_OBJECT_INTELLIGENCE_READY_DIAGNOSTIC,
} from "./executiveObjectIntelligenceSummaryContract.ts";

test.beforeEach(() => {
  resetExecutiveObjectIntelligenceSummaryForTests();
});

test("builds executive intelligence summary across health, impact, confidence, trend, and importance", () => {
  const summary = buildExecutiveObjectIntelligenceSummary({
    healthProfiles: [
      { objectId: "supplier-1", healthScore: 92, healthState: "Healthy", factors: { dataCompleteness: 100, activityLevel: 90, relationshipStability: 88, sourceConfidence: 90 } },
      { objectId: "inventory-1", healthScore: 42, healthState: "Critical", factors: { dataCompleteness: 60, activityLevel: 30, relationshipStability: 40, sourceConfidence: 45 } },
    ],
    impactProfiles: [
      { objectId: "supplier-1", impactScore: 88, impactLevel: "Critical", impactFactors: { relationshipCount: 90, connectedKpis: 85, connectedRisks: 80, businessDependency: 95 } },
      { objectId: "inventory-1", impactScore: 72, impactLevel: "High", impactFactors: { relationshipCount: 70, connectedKpis: 75, connectedRisks: 65, businessDependency: 78 } },
    ],
    confidenceProfiles: [
      { objectId: "supplier-1", confidenceScore: 91, confidenceExplanation: "Strong confidence.", confidenceReasoning: ["Verified."], confidenceFactors: { dataQuality: 95, dataFreshness: 90, sourceReliability: 92, relationshipCertainty: 88 } },
      { objectId: "inventory-1", confidenceScore: 48, confidenceExplanation: "Limited confidence.", confidenceReasoning: ["Weak source."], confidenceFactors: { dataQuality: 50, dataFreshness: 45, sourceReliability: 42, relationshipCertainty: 55 } },
    ],
    trendProfiles: [
      { objectId: "supplier-1", trendDirection: "Improving", trendStrength: 70, trendEvidence: [70, 82, 92], trendReasoning: ["Improving."] },
      { objectId: "inventory-1", trendDirection: "Declining", trendStrength: 64, trendEvidence: [72, 58, 42], trendReasoning: ["Declining."] },
    ],
    importanceProfiles: [
      { objectId: "supplier-1", importanceScore: 90, importanceLevel: "Strategic", importanceFactors: { businessInfluence: 90, executiveRelevance: 95, dependencyWeight: 85, topologyCentrality: 90 }, importanceReasoning: ["Strategic."] },
      { objectId: "inventory-1", importanceScore: 76, importanceLevel: "Important", importanceFactors: { businessInfluence: 75, executiveRelevance: 70, dependencyWeight: 80, topologyCentrality: 78 }, importanceReasoning: ["Important."] },
    ],
  });

  assert.equal(summary.objectCount, 2);
  assert.equal(summary.averageHealthScore, 67);
  assert.equal(summary.averageImpactScore, 80);
  assert.equal(summary.averageConfidenceScore, 70);
  assert.equal(summary.averageImportanceScore, 83);
  assert.equal(summary.improvingCount, 1);
  assert.equal(summary.decliningCount, 1);
  assert.equal(summary.diagnostics.includes(EXEC_OBJECT_INTELLIGENCE_DIAGNOSTIC), true);
  assert.equal(summary.diagnostics.includes(EXEC_OBJECT_INTELLIGENCE_READY_DIAGNOSTIC), true);
  assert.equal(summary.topStrengths.some((entry) => entry.includes("supplier-1")), true);
  assert.equal(summary.topWeaknesses.some((entry) => entry.includes("inventory-1")), true);
  assert.equal(summary.recommendedAttention[0]?.objectId, "inventory-1");
  assert.equal(summary.recommendedAttention[0]?.attentionLevel, "prioritize");
  assert.equal(summary.sceneMutation, false);
  assert.equal(summary.simulation, false);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(Object.isFrozen(summary.profiles), true);
  assert.equal(Object.isFrozen(summary.topStrengths), true);
  assert.equal(Object.isFrozen(summary.topWeaknesses), true);
  assert.equal(Object.isFrozen(summary.recommendedAttention), true);
  assert.equal(getExecutiveObjectIntelligenceSummary().objectCount, 2);
});

test("returns empty executive summary when no profiles are available", () => {
  const summary = buildExecutiveObjectIntelligenceSummary();

  assert.equal(summary.objectCount, 0);
  assert.equal(summary.executiveSummary, "No object intelligence is available.");
  assert.equal(summary.recommendedAttention.length, 0);
});

test("aggregator computes profiles from scene objects without mutation", () => {
  const source: Record<string, unknown> = {
    id: "revenue-1",
    label: "Revenue",
    type: "revenue",
    health: 82,
    impactScore: 88,
    confidence: 90,
    importance: 86,
    role: "executive hub",
    businessInfluence: 90,
  };
  const before = JSON.stringify(source);

  const summary = buildExecutiveObjectIntelligenceSummary({ sceneObjects: [source] });

  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.prototype.hasOwnProperty.call(source, "recommendedAttention"), false);
  assert.equal(summary.objectCount, 1);
  assert.equal(summary.executiveSummary.includes("Executive object intelligence covers 1 object"), true);
});

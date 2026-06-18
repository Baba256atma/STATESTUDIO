import assert from "node:assert/strict";
import test from "node:test";

import {
  EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY,
  RELATIONSHIP_VISUALIZATION_CONTRACT_DIAGNOSTIC,
  RELATIONSHIP_VISUALIZATION_READY_DIAGNOSTIC,
  type RelationshipVisualizationContract,
} from "./relationshipVisualizationContract.ts";

test("defines visualization-ready relationship intelligence without rendering authority", () => {
  const visualizationProfile: RelationshipVisualizationContract = Object.freeze({
    relationshipId: "rel-market-risk",
    sourceId: "market",
    targetId: "risk",
    strengthScore: 78,
    dependencyScore: 64,
    riskExposureScore: 82,
    influenceDirection: "source-to-target",
  });

  assert.equal(visualizationProfile.strengthScore, 78);
  assert.equal(visualizationProfile.dependencyScore, 64);
  assert.equal(visualizationProfile.riskExposureScore, 82);
  assert.equal(visualizationProfile.influenceDirection, "source-to-target");
  assert.equal(Object.isFrozen(visualizationProfile), true);
});

test("publishes frozen empty visualization registry with diagnostics", () => {
  assert.equal(EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY.relationshipCount, 0);
  assert.equal(EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY.sceneMutation, false);
  assert.equal(EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY.dashboardMutation, false);
  assert.equal(EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY.renderingMutation, false);
  assert.equal(
    EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY.diagnostics.includes(
      RELATIONSHIP_VISUALIZATION_CONTRACT_DIAGNOSTIC
    ),
    true
  );
  assert.equal(
    EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY.diagnostics.includes(
      RELATIONSHIP_VISUALIZATION_READY_DIAGNOSTIC
    ),
    true
  );
  assert.equal(Object.isFrozen(EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY), true);
  assert.equal(Object.isFrozen(EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY.relationships), true);
});

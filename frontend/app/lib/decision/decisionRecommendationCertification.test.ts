import test from "node:test";
import assert from "node:assert/strict";

import {
  D1_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  D1_CERTIFICATION_FREEZE_TAGS,
  D1_CERTIFIED_TAG,
  D1_DECISION_RECOMMENDATION_CERTIFICATION_TAG,
  DECISION_RECOMMENDATION_COMPLETE_TAG,
} from "./decisionRecommendationCertificationContract.ts";
import { runDecisionRecommendationCertification } from "./decisionRecommendationCertification.ts";

test("exports D1 decision recommendation certification tags and diagnostic", () => {
  assert.equal(D1_CERTIFIED_TAG, "[D1_CERTIFIED]");
  assert.equal(DECISION_RECOMMENDATION_COMPLETE_TAG, "[DECISION_RECOMMENDATION_COMPLETE]");
  assert.equal(D1_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[D1_CERTIFICATION_COMPLETE]");
  assert.deepEqual(D1_CERTIFICATION_FREEZE_TAGS, [
    "[D1_CERTIFIED]",
    "[DECISION_RECOMMENDATION_COMPLETE]",
  ]);
});

test("D1 decision recommendation certification passes gates A through O", () => {
  const result = runDecisionRecommendationCertification({ buildPassed: true, testsPassed: true });

  assert.equal(result.tag, D1_DECISION_RECOMMENDATION_CERTIFICATION_TAG);
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 15);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(D1_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("D1 decision recommendation certification exposes required validation gates", () => {
  const result = runDecisionRecommendationCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Decision Contract works"), true);
  assert.equal(gateNames.includes("Input Aggregator works"), true);
  assert.equal(gateNames.includes("Option Scoring Engine works"), true);
  assert.equal(gateNames.includes("Tradeoff Analysis Engine works"), true);
  assert.equal(gateNames.includes("Recommendation Engine works"), true);
  assert.equal(gateNames.includes("Decision Explanation Builder works"), true);
  assert.equal(gateNames.includes("Dashboard Binding works"), true);
  assert.equal(gateNames.includes("Assistant Binding works"), true);
  assert.equal(gateNames.includes("No Scene mutations"), true);
  assert.equal(gateNames.includes("No Topology mutations"), true);
  assert.equal(gateNames.includes("No Routing changes"), true);
  assert.equal(gateNames.includes("No DS mutations"), true);
  assert.equal(gateNames.includes("No Simulation mutations"), true);
  assert.equal(gateNames.includes("Build passes"), true);
  assert.equal(gateNames.includes("Tests pass"), true);
});

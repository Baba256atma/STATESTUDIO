import test from "node:test";
import assert from "node:assert/strict";

import {
  D2_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  D2_CERTIFICATION_FREEZE_TAGS,
  D2_CERTIFIED_TAG,
  D2_DECISION_CONFIDENCE_CERTIFICATION_TAG,
  DECISION_CONFIDENCE_COMPLETE_TAG,
} from "./decisionConfidenceCertificationContract.ts";
import { runDecisionConfidenceCertification } from "./decisionConfidenceCertification.ts";

test("exports D2 decision confidence certification tags and diagnostic", () => {
  assert.equal(D2_CERTIFIED_TAG, "[D2_CERTIFIED]");
  assert.equal(DECISION_CONFIDENCE_COMPLETE_TAG, "[DECISION_CONFIDENCE_COMPLETE]");
  assert.equal(D2_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[D2_CERTIFICATION_COMPLETE]");
  assert.deepEqual(D2_CERTIFICATION_FREEZE_TAGS, [
    "[D2_CERTIFIED]",
    "[DECISION_CONFIDENCE_COMPLETE]",
  ]);
});

test("D2 decision confidence certification passes gates A through P", () => {
  const result = runDecisionConfidenceCertification({ buildPassed: true, testsPassed: true });

  assert.equal(result.tag, D2_DECISION_CONFIDENCE_CERTIFICATION_TAG);
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 16);
  assert.equal(result.gates.every((entry) => entry.status === "PASS"), true);
  assert.equal(result.diagnostics.includes(D2_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("D2 decision confidence certification exposes required validation gates", () => {
  const result = runDecisionConfidenceCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Decision Confidence Contract works"), true);
  assert.equal(gateNames.includes("Evidence Strength Engine works"), true);
  assert.equal(gateNames.includes("Uncertainty Detection Engine works"), true);
  assert.equal(gateNames.includes("Recommendation Confidence Scoring works"), true);
  assert.equal(gateNames.includes("Confidence Explanation Builder works"), true);
  assert.equal(gateNames.includes("Dashboard Binding works"), true);
  assert.equal(gateNames.includes("Assistant Binding works"), true);
  assert.equal(gateNames.includes("Recommendation ranking unchanged"), true);
  assert.equal(gateNames.includes("No Scene mutations"), true);
  assert.equal(gateNames.includes("No Topology mutations"), true);
  assert.equal(gateNames.includes("No Routing changes"), true);
  assert.equal(gateNames.includes("No DS mutations"), true);
  assert.equal(gateNames.includes("No Simulation mutations"), true);
  assert.equal(gateNames.includes("No Decision execution"), true);
  assert.equal(gateNames.includes("Build passes"), true);
  assert.equal(gateNames.includes("Tests pass"), true);
});

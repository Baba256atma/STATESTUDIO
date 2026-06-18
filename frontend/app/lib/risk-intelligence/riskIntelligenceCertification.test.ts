import test from "node:test";
import assert from "node:assert/strict";

import {
  DS6_CERTIFICATION_FREEZE_TAGS,
  DS_6_9_RISK_INTELLIGENCE_CERTIFICATION_TAG,
} from "./riskIntelligenceCertificationContract.ts";
import { runRiskIntelligenceCertification } from "./riskIntelligenceCertification.ts";
import {
  DS6_CERTIFIED_TAG,
  RISK_INTELLIGENCE_COMPLETE_TAG,
} from "./riskIntelligenceContract.ts";

test("exports DS-6 freeze tags", () => {
  assert.equal(DS6_CERTIFIED_TAG, "[DS6_CERTIFIED]");
  assert.equal(RISK_INTELLIGENCE_COMPLETE_TAG, "[RISK_INTELLIGENCE_COMPLETE]");
  assert.deepEqual(DS6_CERTIFICATION_FREEZE_TAGS, ["[DS6_CERTIFIED]", "[RISK_INTELLIGENCE_COMPLETE]"]);
});

test("DS-6:9 certification passes all gates", () => {
  const result = runRiskIntelligenceCertification();

  assert.equal(result.tag, DS_6_9_RISK_INTELLIGENCE_CERTIFICATION_TAG);
  assert.equal(result.version, "6.9.0");
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 13);
  assert.equal(
    result.gates.every((gate) => gate.status === "PASS"),
    true
  );
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("certification validates object relationship KPI propagation aggregator scenario and visualization layers", () => {
  const result = runRiskIntelligenceCertification();
  const gateNames = result.gates.map((gate) => gate.name);

  assert.equal(gateNames.includes("Runtime Created"), true);
  assert.equal(gateNames.includes("Object Risk Engine"), true);
  assert.equal(gateNames.includes("Relationship Risk Engine"), true);
  assert.equal(gateNames.includes("KPI Risk Engine"), true);
  assert.equal(gateNames.includes("Propagation Engine"), true);
  assert.equal(gateNames.includes("Aggregator"), true);
  assert.equal(gateNames.includes("Scenario Foundation"), true);
  assert.equal(gateNames.includes("Visualization Contract"), true);
});

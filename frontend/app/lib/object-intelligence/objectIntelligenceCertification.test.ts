import test from "node:test";
import assert from "node:assert/strict";

import {
  DS3_CERTIFIED_TAG,
  OBJECT_INTELLIGENCE_COMPLETE_TAG,
} from "./objectIntelligenceCertificationContract.ts";
import { runObjectIntelligenceCertification } from "./objectIntelligenceCertification.ts";

test("exports DS-3 freeze tags", () => {
  assert.equal(DS3_CERTIFIED_TAG, "[DS3_CERTIFIED]");
  assert.equal(OBJECT_INTELLIGENCE_COMPLETE_TAG, "[OBJECT_INTELLIGENCE_COMPLETE]");
});

test("DS-3:8 certification passes all gates", () => {
  const result = runObjectIntelligenceCertification();
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 11);
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
});

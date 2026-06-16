import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_5C_FINAL_RUNTIME_CERTIFICATION_TAG,
} from "./mrp5cFinalRuntimeCertificationContract.ts";
import {
  resetMrp5cFinalRuntimeCertificationForTests,
  runMrp5cFinalRuntimeCertification,
} from "./mrp5cFinalRuntimeCertification.ts";

test.beforeEach(() => {
  resetMrp5cFinalRuntimeCertificationForTests();
});

test("MRP 5C final runtime certification passes all gates", () => {
  const result = runMrp5cFinalRuntimeCertification({ force: true });

  assert.equal(result.tag, MRP_5C_FINAL_RUNTIME_CERTIFICATION_TAG);
  assert.equal(result.certified, true);
  assert.ok(result.finalStatus === "PASS" || result.finalStatus === "PASS WITH WARNINGS");

  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id} ${gate.name}: ${gate.detail}`);
  }

  assert.equal(result.gates.find((gate) => gate.id === "H")?.status, "PASS");
});

test("MRP 5C certification caches result until forced", () => {
  const first = runMrp5cFinalRuntimeCertification({ force: true });
  const second = runMrp5cFinalRuntimeCertification();
  assert.equal(first, second);
});

import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_PHASE2_COMPLETE_TAG,
  SVIE_RISK_LAYER_CERTIFICATION_TAG,
  SVIE_CERTIFICATION_RISK_RUNTIME_LOG,
  SVIE_CERTIFICATION_EXECUTIVE_READY_LOG,
} from "./svieRiskLayerCertificationContract.ts";
import {
  resetSvieRiskLayerCertificationForTests,
  runSvieRiskLayerCertification,
} from "./svieRiskLayerCertification.ts";

test.beforeEach(() => {
  resetSvieRiskLayerCertificationForTests();
});

test("runSvieRiskLayerCertification passes all gates", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const result = runSvieRiskLayerCertification({ force: true });

    assert.equal(result.tag, SVIE_RISK_LAYER_CERTIFICATION_TAG);
    assert.equal(result.phaseCompleteTag, SVIE_PHASE2_COMPLETE_TAG);
    assert.equal(result.certified, true);
    assert.ok(result.finalStatus === "PASS" || result.finalStatus === "PASS WITH WARNINGS");
    assert.deepEqual(result.freezeTags, [SVIE_RISK_LAYER_CERTIFICATION_TAG, SVIE_PHASE2_COMPLETE_TAG]);

    for (const gate of result.gates) {
      assert.notEqual(gate.status, "FAIL", `${gate.id} ${gate.name}: ${gate.detail}`);
    }

    assert.equal(result.gates.find((gate) => gate.id === "H")?.status, "PASS");
    assert.ok(logs.includes(SVIE_CERTIFICATION_RISK_RUNTIME_LOG));
    assert.ok(logs.includes(SVIE_CERTIFICATION_EXECUTIVE_READY_LOG));
  } finally {
    console.debug = originalDebug;
  }
});

test("SVIE risk layer certification caches result until forced", () => {
  const first = runSvieRiskLayerCertification({ force: true });
  const second = runSvieRiskLayerCertification();
  assert.equal(first, second);
});

test("SVIE risk layer certification exposes gates A through H", () => {
  const result = runSvieRiskLayerCertification({ force: true });
  assert.deepEqual(
    result.gates.map((gate) => gate.id),
    ["A", "B", "C", "D", "E", "F", "G", "H"]
  );
});

import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_PHASE4_COMPLETE_TAG,
  SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_TAG,
} from "./svieScenarioVisualIntelligenceCertificationContract.ts";
import {
  resetSvieScenarioVisualIntelligenceCertificationForTests,
  runSvieScenarioVisualIntelligenceCertification,
} from "./svieScenarioVisualIntelligenceCertification.ts";

test.beforeEach(() => {
  resetSvieScenarioVisualIntelligenceCertificationForTests();
});

test("runSvieScenarioVisualIntelligenceCertification passes all gates", () => {
  const result = runSvieScenarioVisualIntelligenceCertification({ force: true });
  assert.equal(result.tag, SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_TAG);
  assert.equal(result.phaseCompleteTag, SVIE_PHASE4_COMPLETE_TAG);
  assert.equal(result.certified, true);
  assert.notEqual(result.finalStatus, "FAIL");
  assert.equal(result.gates.length, 12);
  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
  assert.equal(result.freezeTags.length, 2);
});

test("certification result is cached until forced", () => {
  const first = runSvieScenarioVisualIntelligenceCertification({ force: true });
  const second = runSvieScenarioVisualIntelligenceCertification();
  assert.equal(first, second);
});

test("exports phase 4 freeze tags when certified", () => {
  const result = runSvieScenarioVisualIntelligenceCertification({ force: true });
  assert.ok(result.freezeTags.includes(SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_TAG));
  assert.ok(result.freezeTags.includes(SVIE_PHASE4_COMPLETE_TAG));
});

import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_TAG,
  SVIE_PHASE3_COMPLETE_TAG,
} from "./svieAdvisoryVisualIntelligenceCertificationContract.ts";
import {
  resetSvieAdvisoryVisualIntelligenceCertificationForTests,
  runSvieAdvisoryVisualIntelligenceCertification,
} from "./svieAdvisoryVisualIntelligenceCertification.ts";

test.beforeEach(() => {
  resetSvieAdvisoryVisualIntelligenceCertificationForTests();
});

test("runSvieAdvisoryVisualIntelligenceCertification passes all gates", () => {
  const result = runSvieAdvisoryVisualIntelligenceCertification({ force: true });
  assert.equal(result.tag, SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_TAG);
  assert.equal(result.phaseCompleteTag, SVIE_PHASE3_COMPLETE_TAG);
  assert.equal(result.certified, true);
  assert.notEqual(result.finalStatus, "FAIL");
  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
  assert.equal(result.freezeTags.length, 2);
});

test("certification result is cached until forced", () => {
  const first = runSvieAdvisoryVisualIntelligenceCertification({ force: true });
  const second = runSvieAdvisoryVisualIntelligenceCertification();
  assert.equal(first, second);
});

test("exports phase 3 freeze tags when certified", () => {
  const result = runSvieAdvisoryVisualIntelligenceCertification({ force: true });
  assert.ok(result.freezeTags.includes(SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_TAG));
  assert.ok(result.freezeTags.includes(SVIE_PHASE3_COMPLETE_TAG));
});

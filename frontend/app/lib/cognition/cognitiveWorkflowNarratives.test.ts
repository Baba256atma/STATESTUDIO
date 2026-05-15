import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCognitiveStageSummary,
  labelForCognitiveStage,
} from "./cognitiveWorkflowNarratives.ts";

test("cognitive workflow narratives are calm and executive-oriented", () => {
  assert.equal(labelForCognitiveStage("strategic_framing"), "Strategic Framing");
  assert.match(buildCognitiveStageSummary({
    stage: "comparison",
    focus: "Supplier dependency",
  }), /strategic alternatives/);
  assert.match(buildCognitiveStageSummary({
    stage: "monitoring",
    focus: "Supplier dependency",
  }), /propagation drift/);
});

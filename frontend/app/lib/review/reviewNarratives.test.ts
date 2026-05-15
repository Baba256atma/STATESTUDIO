import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDecisionReviewRationale,
  buildDecisionReviewSummary,
  buildDecisionReviewTitle,
} from "./reviewNarratives.ts";

test("review narratives are reflective and non-judgmental", () => {
  assert.match(buildDecisionReviewTitle({
    status: "stabilized",
    focus: "Supplier diversification",
  }), /stabilized/);
  assert.match(buildDecisionReviewSummary({
    status: "superseded",
  }), /Updated evidence/);
  assert.match(buildDecisionReviewRationale({
    status: "monitoring",
  }), /observational/);
});

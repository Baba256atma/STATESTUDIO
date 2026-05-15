import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { OperationalPropagationPreview } from "../propagationPreviewTypes.ts";
import {
  getPropagationExecutiveSummary,
  getPropagationRiskLabel,
  getPropagationRiskTone,
} from "../propagationPresentation.ts";

describe("propagationPresentation", () => {
  it("labels and tones resolve safely", () => {
    assert.ok(getPropagationRiskLabel("high").includes("High"));
    assert.equal(getPropagationRiskTone("bogus"), "neutral");
  });

  it("executive summary falls back to preview summary when no nodes", () => {
    const p: OperationalPropagationPreview = {
      id: "1",
      sourceObjectIds: [],
      affectedObjectIds: [],
      propagationNodes: [],
      highestRiskLevel: "low",
      summary: "No preview.",
      generatedAt: "t",
    };
    assert.equal(getPropagationExecutiveSummary(p), "No preview.");
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveNexoraVisualGuidanceIntent } from "./nexoraVisualGuidanceIntent.ts";

describe("Visual guidance intent", () => {
  it("Show me delivery over time is TREND", () => {
    const intent = resolveNexoraVisualGuidanceIntent({
      utterance: "Show me delivery over time",
    });
    assert.equal(intent.kind, "RESOLVE");
    assert.equal(intent.purpose, "TREND");
    assert.equal(intent.subjectId, "delivery");
  });

  it("How has delivery changed? is the same TREND purpose", () => {
    const intent = resolveNexoraVisualGuidanceIntent({
      utterance: "How has delivery changed?",
    });
    assert.equal(intent.purpose, "TREND");
  });

  it("Show me the problems is not visual", () => {
    assert.equal(
      resolveNexoraVisualGuidanceIntent({ utterance: "Show me the problems" }).kind,
      "NONE",
    );
  });

  it("Show Capacity Problem is not visual", () => {
    assert.equal(
      resolveNexoraVisualGuidanceIntent({ utterance: "Show Capacity Problem" }).kind,
      "NONE",
    );
  });

  it("Show me where Data is is not visual", () => {
    assert.equal(
      resolveNexoraVisualGuidanceIntent({
        utterance: "Show me where I add data",
      }).kind,
      "NONE",
    );
  });

  it("Show Delivery is object navigation, not a chart", () => {
    assert.equal(
      resolveNexoraVisualGuidanceIntent({ utterance: "Show Delivery." }).kind,
      "NONE",
    );
  });

  it("bare Show me is not visual", () => {
    assert.equal(resolveNexoraVisualGuidanceIntent({ utterance: "Show me" }).kind, "NONE");
  });

  it("Compare these scenarios is not visual intelligence", () => {
    assert.equal(
      resolveNexoraVisualGuidanceIntent({
        utterance: "Compare these scenarios.",
      }).kind,
      "NONE",
    );
  });

  it("Compare them is not visual without evidence language", () => {
    assert.equal(
      resolveNexoraVisualGuidanceIntent({ utterance: "Compare them." }).kind,
      "NONE",
    );
  });

  it("Compare delivery across periods is visual COMPARE", () => {
    const intent = resolveNexoraVisualGuidanceIntent({
      utterance: "Compare delivery across the two periods",
    });
    assert.equal(intent.kind, "RESOLVE");
    assert.equal(intent.purpose, "COMPARE");
  });

  it("I want to improve delivery performance is not visual", () => {
    assert.equal(
      resolveNexoraVisualGuidanceIntent({
        utterance: "I want to improve delivery performance.",
      }).kind,
      "NONE",
    );
  });

  it("Improve delivery is not a causality inspect", () => {
    assert.equal(
      resolveNexoraVisualGuidanceIntent({
        utterance: "We need to improve delivery reliability.",
      }).kind,
      "NONE",
    );
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveNexoraUiGuidanceIntent } from "./nexoraUiGuidanceIntent.ts";

describe("UI guidance intent", () => {
  it("How do I add my data? locates Data without treating it as an action", () => {
    const intent = resolveNexoraUiGuidanceIntent({
      utterance: "How do I add my data?",
    });
    assert.equal(intent.kind, "LOCATE_UI");
    assert.equal(intent.target, "DATA_ENTRY");
  });

  it("paraphrase Where can I upload information? uses the same target", () => {
    const intent = resolveNexoraUiGuidanceIntent({
      utterance: "Where can I upload information?",
    });
    assert.equal(intent.target, "DATA_ENTRY");
    assert.equal(intent.kind, "LOCATE_UI");
  });

  it("Add this data is action, not Guided Attention", () => {
    const intent = resolveNexoraUiGuidanceIntent({
      utterance: "Add this data",
    });
    assert.equal(intent.kind, "UI_ACTION");
  });

  it("Show me the problems is not Guided Attention", () => {
    const intent = resolveNexoraUiGuidanceIntent({
      utterance: "Show me the problems",
    });
    assert.equal(intent.kind, "NONE");
  });

  it("contextual Show me uses a pending offer", () => {
    const intent = resolveNexoraUiGuidanceIntent({
      utterance: "Show me",
      pendingOfferTarget: "DATA_ENTRY",
    });
    assert.equal(intent.kind, "LOCATE_UI");
    assert.equal(intent.target, "DATA_ENTRY");
    assert.equal(intent.usesPendingOffer, true);
  });

  it("How do I go back? locates Back without navigating", () => {
    const intent = resolveNexoraUiGuidanceIntent({
      utterance: "How do I go back?",
    });
    assert.equal(intent.kind, "LOCATE_UI");
    assert.equal(intent.target, "BACK_CONTROL");
  });

  it("Go back is action, not location guidance", () => {
    assert.equal(
      resolveNexoraUiGuidanceIntent({ utterance: "Go back" }).kind,
      "UI_ACTION",
    );
  });

  it("Where do objects appear? locates the Stage", () => {
    const intent = resolveNexoraUiGuidanceIntent({
      utterance: "Where do objects appear?",
    });
    assert.equal(intent.target, "STAGE");
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CHAT_FIRST_ASSISTANT_FREEZE_V1,
  validateAssistantRuntimeFreeze,
} from "./assistantRuntimeFreezeContract.ts";

describe("assistant runtime freeze contract", () => {
  it("freezes the chat-first assistant architecture", () => {
    assert.equal(CHAT_FIRST_ASSISTANT_FREEZE_V1.id, "CHAT_FIRST_ASSISTANT_FREEZE_V1");
    assert.equal(
      CHAT_FIRST_ASSISTANT_FREEZE_V1.architecture.accordion,
      "single_open_support_panel_runtime"
    );
    assert.ok(CHAT_FIRST_ASSISTANT_FREEZE_V1.invariants.includes("external_store_snapshots_are_stable"));
  });

  it("validates all Assistant freeze components", () => {
    const result = validateAssistantRuntimeFreeze();
    assert.equal(result.overall, "pass");
    assert.equal(result.components.AssistantAccordion, "pass");
    assert.equal(result.components.SuggestedQuestions, "pass");
    assert.equal(result.components.ChatRuntime, "pass");
    assert.equal(result.components.ScrollContainers, "pass");
    assert.equal(result.components.ObjectContextBridge, "pass");
  });
});


import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  guardAssistantConversationAction,
  guardAssistantForbiddenIntelligenceAction,
  resetAssistantRule12BoundaryRuntimeForTests,
} from "./assistantRule12BoundaryRuntime.ts";

describe("assistant Rule #12 boundary runtime", () => {
  beforeEach(() => {
    resetAssistantRule12BoundaryRuntimeForTests();
  });

  it("blocks Assistant from inventing unsupported risk scores", () => {
    const blocked = guardAssistantForbiddenIntelligenceAction({
      action: "invent_risk_score",
      workspaceId: "risk",
    });
    assert.equal(blocked.allowed, false);
  });

  it("blocks Assistant from inventing unsupported scenario forecasts", () => {
    const blocked = guardAssistantForbiddenIntelligenceAction({
      action: "invent_scenario_forecast",
      workspaceId: "scenario",
    });
    assert.equal(blocked.allowed, false);
  });

  it("allows grounded Assistant explanation of workspace intelligence", () => {
    const allowed = guardAssistantConversationAction({
      action: "explain_workspace_intelligence",
      workspaceId: "timeline",
      hasWorkspaceGrounding: true,
    });
    assert.equal(allowed.allowed, true);
  });
});

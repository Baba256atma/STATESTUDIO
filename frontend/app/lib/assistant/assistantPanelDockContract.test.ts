import assert from "node:assert/strict";
import test from "node:test";

import {
  ASSISTANT_PANEL_DOCK_CONTRACT_RECOVERED_DIAGNOSTIC,
  ASSISTANT_PANEL_DOCK_CONTRACT_REQUIRED_EXPORTS,
  ASSISTANT_PANEL_DOCK_DEFINITIONS,
  type AssistantPanelDockId,
} from "./assistantPanelDockContract.ts";

test("exports recovered assistant panel dock contract symbols for MRP consumers", () => {
  assert.equal(
    ASSISTANT_PANEL_DOCK_CONTRACT_RECOVERED_DIAGNOSTIC,
    "[ASSISTANT_PANEL_DOCK_CONTRACT_RECOVERED]"
  );
  assert.equal(ASSISTANT_PANEL_DOCK_CONTRACT_REQUIRED_EXPORTS.length, 2);
  assert.equal(
    ASSISTANT_PANEL_DOCK_CONTRACT_REQUIRED_EXPORTS.includes("ASSISTANT_PANEL_DOCK_DEFINITIONS"),
    true
  );
  assert.equal(
    ASSISTANT_PANEL_DOCK_CONTRACT_REQUIRED_EXPORTS.includes("AssistantPanelDockId"),
    true
  );

  const panelId: AssistantPanelDockId = "insight";
  assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS[panelId].id, "insight");
  assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS[panelId].label, "Insight");
  assert.equal(typeof ASSISTANT_PANEL_DOCK_DEFINITIONS[panelId].icon, "string");
  assert.equal(ASSISTANT_PANEL_DOCK_DEFINITIONS.questions.label, "Executive Questions");
});

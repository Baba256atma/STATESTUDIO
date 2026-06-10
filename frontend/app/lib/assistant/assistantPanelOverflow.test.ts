import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL,
  detectAssistantPanelOverflow,
  resolveAssistantPanelOverflowTrace,
} from "./assistantPanelOverflowContract.ts";
import {
  ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX,
  resolveAssistantPanelMaxHeightPx,
  resolveAssistantPanelScrollContainerStyle,
} from "./assistantPanelOverflowTokens.ts";
import {
  resetAssistantPanelOverflowForTests,
  setAssistantPanelOverflow,
} from "./assistantPanelOverflowRuntime.ts";

describe("assistantPanelOverflow", () => {
  afterEach(() => {
    resetAssistantPanelOverflowForTests();
  });

  it("Test 1 — long Guidance content triggers overflow detection", () => {
    assert.equal(detectAssistantPanelOverflow(320, 192), true);
    assert.equal(ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL.guidance, "medium");
    assert.equal(resolveAssistantPanelMaxHeightPx("guidance"), ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX.medium);
  });

  it("Test 2 — long Scenario content triggers overflow detection", () => {
    assert.equal(detectAssistantPanelOverflow(260, 192), true);
    assert.equal(ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL.scenario, "medium");
  });

  it("Test 3 — Guidance scroll container is independently bounded", () => {
    const guidanceStyle = resolveAssistantPanelScrollContainerStyle({
      panelId: "guidance",
      visible: true,
    });
    const actionsStyle = resolveAssistantPanelScrollContainerStyle({
      panelId: "actions",
      visible: true,
    });
    assert.equal(guidanceStyle.overflowY, "auto");
    assert.equal(guidanceStyle.overscrollBehavior, "contain");
    assert.notEqual(guidanceStyle.maxHeight, actionsStyle.maxHeight);
  });

  it("Test 4 — Scenario scroll container is independently bounded", () => {
    const style = resolveAssistantPanelScrollContainerStyle({
      panelId: "scenario",
      visible: true,
    });
    assert.equal(style.maxHeight, 192);
    assert.equal(style.overflowY, "auto");
  });

  it("Test 5 — collapsed panel hides scrollbar surface", () => {
    const style = resolveAssistantPanelScrollContainerStyle({
      panelId: "guidance",
      visible: false,
    });
    assert.equal(style.maxHeight, 0);
    assert.equal(style.overflowY, "hidden");
    assert.equal(style.pointerEvents, "none");
  });

  it("Test 6 — suggestions tier is compact", () => {
    assert.equal(resolveAssistantPanelMaxHeightPx("suggestions"), 128);
  });

  it("Test 7 — actions tier is small", () => {
    assert.equal(resolveAssistantPanelMaxHeightPx("actions"), 144);
  });

  it("Test 8 — short content does not report overflow", () => {
    assert.equal(detectAssistantPanelOverflow(120, 192), false);
  });

  it("Test 9 — overflow trace format", () => {
    assert.match(
      resolveAssistantPanelOverflowTrace({ panel: "decision", overflow: false }),
      /panel=decision\noverflow=false/
    );
    setAssistantPanelOverflow("decision", false);
    setAssistantPanelOverflow("decision", false);
  });

  it("Test 10 — scroll containers use overscroll containment", () => {
    for (const panelId of ["suggestions", "guidance", "scenario", "decision", "actions"] as const) {
      const style = resolveAssistantPanelScrollContainerStyle({ panelId, visible: true });
      assert.equal(style.overscrollBehavior, "contain");
      assert.equal(style.overflowX, "hidden");
    }
  });
});

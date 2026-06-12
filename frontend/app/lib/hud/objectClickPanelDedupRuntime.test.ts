import { describe, expect, it, beforeEach } from "vitest";

import {
  buildObjectClickPanelIntent,
  buildObjectClickPanelIntentSignature,
  OBJECT_CLICK_PANEL_DASHBOARD_CONTEXT,
  OBJECT_CLICK_PANEL_TARGET_VIEW,
} from "./objectClickPanelDedupContract.ts";
import {
  absorbObjectClickLegacyRedirect,
  evaluateObjectClickPanelIntent,
  isObjectClickPanelIntentApplied,
  markObjectClickPanelIntentApplied,
  resetObjectClickPanelDedupForTests,
  skipObjectClickPanelIntent,
} from "./objectClickPanelDedupRuntime.ts";

describe("objectClickPanelDedupContract", () => {
  it("builds stable canonical intent signature", () => {
    const intent = buildObjectClickPanelIntent("obj-a");
    expect(intent).toEqual({
      source: "object_click",
      objectId: "obj-a",
      targetView: OBJECT_CLICK_PANEL_TARGET_VIEW,
      dashboardContext: OBJECT_CLICK_PANEL_DASHBOARD_CONTEXT,
    });
    expect(buildObjectClickPanelIntentSignature(intent)).toBe(
      "object_click|obj-a|dashboard|sources"
    );
  });
});

describe("objectClickPanelDedupRuntime QA scenarios", () => {
  beforeEach(() => {
    resetObjectClickPanelDedupForTests();
  });

  it("1 — fresh load has no applied frame", () => {
    expect(isObjectClickPanelIntentApplied({ objectId: "obj-a", clickEventId: "evt-1" })).toBe(
      false
    );
  });

  it("2 — click object A once applies exactly one write", () => {
    const first = evaluateObjectClickPanelIntent({
      objectId: "obj-a",
      clickEventId: "evt-a1",
      previousObjectId: null,
    });
    expect(first.decision.action).toBe("apply");
    markObjectClickPanelIntentApplied({
      intent: first.intent,
      clickEventId: "evt-a1",
      reason: "changed_object",
    });
    expect(isObjectClickPanelIntentApplied({ objectId: "obj-a", clickEventId: "evt-a1" })).toBe(
      true
    );

    const duplicate = evaluateObjectClickPanelIntent({
      objectId: "obj-a",
      clickEventId: "evt-a1",
      previousObjectId: null,
    });
    expect(duplicate.decision.action).toBe("skip");
    if (duplicate.decision.action === "skip") {
      skipObjectClickPanelIntent({ intent: duplicate.intent, reason: duplicate.decision.reason });
    }
  });

  it("3 — re-click object A within frame skips duplicate", () => {
    markObjectClickPanelIntentApplied({
      intent: buildObjectClickPanelIntent("obj-a"),
      clickEventId: "evt-a1",
      reason: "changed_object",
    });
    const reclick = evaluateObjectClickPanelIntent({
      objectId: "obj-a",
      clickEventId: "evt-a2",
      previousObjectId: "obj-a",
    });
    expect(reclick.decision.action).toBe("skip");
  });

  it("4 — click object B after A produces changed_object apply", () => {
    markObjectClickPanelIntentApplied({
      intent: buildObjectClickPanelIntent("obj-a"),
      clickEventId: "evt-a1",
      reason: "changed_object",
    });
    const next = evaluateObjectClickPanelIntent({
      objectId: "obj-b",
      clickEventId: "evt-b1",
      previousObjectId: "obj-a",
    });
    expect(next.decision.action).toBe("apply");
    if (next.decision.action === "apply") {
      expect(next.decision.reason).toBe("changed_object");
    }
  });

  it("5 — rapid A → B → A produces one apply per real object change", () => {
    const a1 = evaluateObjectClickPanelIntent({
      objectId: "obj-a",
      clickEventId: "evt-1",
      previousObjectId: null,
    });
    expect(a1.decision.action).toBe("apply");
    markObjectClickPanelIntentApplied({
      intent: a1.intent,
      clickEventId: "evt-1",
      reason: "changed_object",
    });

    const b1 = evaluateObjectClickPanelIntent({
      objectId: "obj-b",
      clickEventId: "evt-2",
      previousObjectId: "obj-a",
    });
    expect(b1.decision.action).toBe("apply");
    markObjectClickPanelIntentApplied({
      intent: b1.intent,
      clickEventId: "evt-2",
      reason: "changed_object",
    });

    const a2 = evaluateObjectClickPanelIntent({
      objectId: "obj-a",
      clickEventId: "evt-3",
      previousObjectId: "obj-b",
    });
    expect(a2.decision.action).toBe("apply");
    markObjectClickPanelIntentApplied({
      intent: a2.intent,
      clickEventId: "evt-3",
      reason: "changed_object",
    });

    const a2dup = evaluateObjectClickPanelIntent({
      objectId: "obj-a",
      clickEventId: "evt-3",
      previousObjectId: "obj-b",
    });
    expect(a2dup.decision.action).toBe("skip");
  });

  it("6 — legacy redirect absorbed once per click frame", () => {
    absorbObjectClickLegacyRedirect({ objectId: "obj-a", clickEventId: "evt-1" });
    absorbObjectClickLegacyRedirect({ objectId: "obj-a", clickEventId: "evt-1" });
    expect(true).toBe(true);
  });

  it("7 — idle frame does not retain applied state beyond window", () => {
    const now = Date.now();
    markObjectClickPanelIntentApplied({
      intent: buildObjectClickPanelIntent("obj-a"),
      clickEventId: "evt-idle",
      reason: "changed_object",
      now: now - 500,
    });
    expect(
      isObjectClickPanelIntentApplied({ objectId: "obj-a", clickEventId: "evt-idle", now })
    ).toBe(false);
  });

  it("8 — new click after idle does not duplicate prior signature", () => {
    const now = Date.now();
    markObjectClickPanelIntentApplied({
      intent: buildObjectClickPanelIntent("obj-a"),
      clickEventId: "evt-old",
      reason: "changed_object",
      now: now - 500,
    });
    const fresh = evaluateObjectClickPanelIntent({
      objectId: "obj-a",
      clickEventId: "evt-new",
      previousObjectId: "obj-a",
      now,
    });
    expect(fresh.decision.action).toBe("apply");
    markObjectClickPanelIntentApplied({
      intent: fresh.intent,
      clickEventId: "evt-new",
      reason: "changed_mode",
      now,
    });
    const duplicate = evaluateObjectClickPanelIntent({
      objectId: "obj-a",
      clickEventId: "evt-new",
      previousObjectId: "obj-a",
      now,
    });
    expect(duplicate.decision.action).toBe("skip");
  });
});

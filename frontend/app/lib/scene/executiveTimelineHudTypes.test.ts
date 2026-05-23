import { describe, expect, it } from "vitest";

import {
  EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS,
  buildExecutiveTimelineHudModel,
} from "./executiveTimelineHudTypes";

describe("executiveTimelineHudTypes", () => {
  it("returns timeline events with an active node", () => {
    const model = buildExecutiveTimelineHudModel({});
    expect(model.events.length).toBeGreaterThanOrEqual(2);
    expect(model.events.some((event) => event.status === "active")).toBe(true);
    expect(model.focusedEventId).toBeTruthy();
  });

  it("exposes future scenario track hooks", () => {
    const model = buildExecutiveTimelineHudModel({});
    expect(model.scenarioTracks?.length).toBeGreaterThan(0);
  });

  it("keeps canonical placeholder story labels", () => {
    expect(EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS.map((event) => event.title)).toEqual([
      "Baseline",
      "Supplier Delay",
      "Inventory Risk",
      "Scenario Simulated",
      "Decision Accepted",
      "Execution Pending",
    ]);
  });
});

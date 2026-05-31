import { describe, expect, it } from "vitest";

import {
  getStableTimelineDisplayTimeForRender,
} from "./useHydratedTimelineDisplayTime";

describe("useHydratedTimelineDisplayTime", () => {
  it("defers ISO formatting until after hydration", () => {
    expect(
      getStableTimelineDisplayTimeForRender({
        timestampIso: "2026-05-20T23:03:00.000Z",
        timestamp: "Now",
      })
    ).toBe("");
  });

  it("renders semantic timestamps during SSR and first client paint", () => {
    expect(
      getStableTimelineDisplayTimeForRender({
        timestamp: "Now",
      })
    ).toBe("Now");
    expect(
      getStableTimelineDisplayTimeForRender({
        timestamp: "T-4h",
      })
    ).toBe("T-4h");
  });
});

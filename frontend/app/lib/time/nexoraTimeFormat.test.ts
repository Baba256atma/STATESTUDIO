import { describe, expect, it } from "vitest";

import {
  formatNexoraTimelineTime,
  resolveNexoraTimelineDisplayTime,
  resetNexoraTimeFormatForTests,
} from "./nexoraTimeFormat";

describe("nexoraTimeFormat", () => {
  it("formats timestamps as deterministic UTC HH:mm", () => {
    expect(formatNexoraTimelineTime("2026-05-20T14:03:00.000Z")).toBe("14:03");
    expect(formatNexoraTimelineTime(1_746_000_000_000)).toBe(
      formatNexoraTimelineTime(new Date(1_746_000_000_000))
    );
  });

  it("returns empty string for invalid input", () => {
    expect(formatNexoraTimelineTime("Now")).toBe("");
    expect(formatNexoraTimelineTime(null)).toBe("");
  });

  it("prefers timestampIso and falls back to semantic labels", () => {
    resetNexoraTimeFormatForTests();
    expect(
      resolveNexoraTimelineDisplayTime({
        timestampIso: "2026-05-20T14:03:00.000Z",
      })
    ).toBe("14:03");
    expect(
      resolveNexoraTimelineDisplayTime({
        timestamp: "Now",
      })
    ).toBe("Now");
  });
});

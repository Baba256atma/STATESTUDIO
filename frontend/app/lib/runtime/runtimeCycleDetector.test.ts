import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  getRecentRuntimeCycleEvents,
  recordRuntimeCycleEvent,
  resetRuntimeCycleDetectorForTests,
} from "./runtimeCycleDetector";

describe("runtimeCycleDetector", () => {
  beforeEach(() => {
    resetRuntimeCycleDetectorForTests();
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  it("records cycle events without mutating state", () => {
    recordRuntimeCycleEvent("HudDrift", { signature: "a", source: "scene-activity" });
    recordRuntimeCycleEvent("PanelSalvage", { signature: "b" });

    const events = getRecentRuntimeCycleEvents();
    expect(events).toHaveLength(2);
    expect(events[0]?.kind).toBe("HudDrift");
    expect(events[1]?.kind).toBe("PanelSalvage");
  });

  it("emits CycleDetected when the same sequence repeats 4+ times within 2s", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const sequence = [
      ["HudDrift", "a"],
      ["PanelSalvage", "b"],
    ] as const;

    for (let cycle = 0; cycle < 4; cycle += 1) {
      for (const [kind, signature] of sequence) {
        recordRuntimeCycleEvent(kind, { signature });
      }
      vi.advanceTimersByTime(100);
    }

    expect(warn).toHaveBeenCalledWith(
      "[Nexora][CycleDetected]",
      expect.objectContaining({
        sequence: ["HudDrift", "PanelSalvage"],
        repeatCount: 4,
      })
    );

    warn.mockRestore();
  });
});

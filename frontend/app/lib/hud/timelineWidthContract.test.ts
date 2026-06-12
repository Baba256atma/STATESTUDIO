import { describe, expect, it, beforeEach } from "vitest";

import { resolveTimelineSceneWidthRatio } from "./timelineZoneContract.ts";
import {
  TIMELINE_LEFT,
  TIMELINE_RIGHT,
} from "../scene/sceneHudInsetContract.ts";
import {
  commitTimelineHeightSnapshot,
  commitTimelineWidthSnapshot,
  getSceneVisibleWidth,
  getTimelineSafeMargins,
  getTimelineTargetWidth,
  resetTimelineWidthContractForTests,
  resolveTimelineDisplayHeight,
  resolveTimelineWidthSnapshot,
  toTimelineDisplayState,
  timelineDisplayStateFromHeightMode,
} from "./timelineWidthContract.ts";

describe("timelineWidthContract", () => {
  beforeEach(() => {
    resetTimelineWidthContractForTests();
  });

  it("resolveTimelineWidthSnapshot uses unified edge inset width", () => {
    const snapshot = resolveTimelineWidthSnapshot(1000);
    expect(snapshot.timelineTargetWidth).toBe(1000 - TIMELINE_LEFT - TIMELINE_RIGHT);
    expect(snapshot.ratio).toBe(resolveTimelineSceneWidthRatio(1000));
    expect(snapshot.timelineLeft).toBe(TIMELINE_LEFT);
  });

  it("commitTimelineWidthSnapshot ignores duplicate writes", () => {
    const first = commitTimelineWidthSnapshot(1320);
    const second = commitTimelineWidthSnapshot(1320);
    expect(first).toBeTruthy();
    expect(second).toBeNull();
    expect(getSceneVisibleWidth()).toBe(1320);
    expect(getTimelineTargetWidth()).toBe(1320 - TIMELINE_LEFT - TIMELINE_RIGHT);
  });

  it("getTimelineTargetWidth accepts explicit scene width", () => {
    expect(getTimelineTargetWidth(800)).toBe(800 - TIMELINE_LEFT - TIMELINE_RIGHT);
  });

  it("getTimelineSafeMargins returns scene HUD gaps", () => {
    const margins = getTimelineSafeMargins();
    expect(margins.bottom).toBeGreaterThan(0);
    expect(margins.toMrp).toBeGreaterThan(0);
    expect(margins.toObjectPanel).toBeGreaterThan(0);
    expect(margins.toScenePanel).toBeGreaterThan(0);
  });

  it("timeline display state maps height modes", () => {
    expect(toTimelineDisplayState("compact")).toBe("compact");
    expect(toTimelineDisplayState("collapsed")).toBe("compact");
    expect(timelineDisplayStateFromHeightMode("expanded")).toBe("expanded");
  });

  it("resolveTimelineDisplayHeight targets compact and expanded bands", () => {
    expect(resolveTimelineDisplayHeight("compact")).toBe(80);
    expect(resolveTimelineDisplayHeight("expanded")).toBe(300);
  });

  it("commitTimelineHeightSnapshot ignores duplicate height writes", () => {
    expect(commitTimelineHeightSnapshot("compact", 80)).toBe(true);
    expect(commitTimelineHeightSnapshot("compact", 80)).toBe(false);
  });
});

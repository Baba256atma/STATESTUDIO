import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  applyExecutiveObjectScaleProfile,
  buildExecutiveApplyScaleSignature,
  diffExecutiveScaleSignature,
  resolveExecutiveBaseObjectScale,
  resetExecutiveObjectScaleProfileForTests,
} from "./executiveObjectScaleProfile";
import { resetExecutiveDensityInstrumentationForTests } from "./executiveDensityInstrumentation";
import {
  normalizeExecutiveObjectScale,
  resetExecutiveSceneCompositionLogsForTests,
} from "../executiveSceneComposition";

describe("executiveObjectScaleProfile idempotency", () => {
  beforeEach(() => {
    resetExecutiveObjectScaleProfileForTests();
    resetExecutiveDensityInstrumentationForTests();
    resetExecutiveSceneCompositionLogsForTests();
    vi.restoreAllMocks();
  });

  it("builds stable apply dependency signatures", () => {
    const signature = buildExecutiveApplyScaleSignature({
      profileId: "STRATEGIC",
      inputScale: 0.72,
      selected: false,
    });
    expect(signature).toBe("STRATEGIC|0.72|0");
  });

  it("reports changed dependencies between apply signatures", () => {
    const previous = buildExecutiveApplyScaleSignature({
      profileId: "STRATEGIC",
      inputScale: 0.72,
      selected: false,
    });
    const next = buildExecutiveApplyScaleSignature({
      profileId: "STRATEGIC",
      inputScale: 0.72,
      selected: true,
    });
    expect(diffExecutiveScaleSignature(previous, next)).toEqual(["selected"]);
  });

  it("returns cached normalized scale without repeated logs", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    const first = applyExecutiveObjectScaleProfile({ scale: 0.72, selected: false });
    const second = applyExecutiveObjectScaleProfile({ scale: 0.72, selected: false });

    expect(first).toBe(second);
    const objectScaleLogs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][ObjectScale]");
    expect(objectScaleLogs).toHaveLength(1);
    expect(objectScaleLogs[0]?.[1]).toMatchObject({
      dependencySignature: "STRATEGIC|0.72|0",
      inputScale: 0.72,
      selected: false,
    });
  });

  it("dedupes object scale logs by two-decimal scale buckets", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    applyExecutiveObjectScaleProfile({ scale: 0.721, selected: false });
    applyExecutiveObjectScaleProfile({ scale: 0.722, selected: false });

    const objectScaleLogs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][ObjectScale]");
    expect(objectScaleLogs).toHaveLength(1);
  });

  it("returns cached base scale without repeated logs", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    const first = resolveExecutiveBaseObjectScale({ role: "core" });
    const second = resolveExecutiveBaseObjectScale({ role: "core" });

    expect(first).toBe(second);
    const objectScaleLogs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][ObjectScale]");
    expect(objectScaleLogs).toHaveLength(1);
  });

  it("memoizes normalizeExecutiveObjectScale wrapper inputs", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    const first = normalizeExecutiveObjectScale({
      scale: 0.52,
      objectCount: 8,
      selected: false,
    });
    const second = normalizeExecutiveObjectScale({
      scale: 0.52,
      objectCount: 8,
      selected: false,
    });

    expect(first).toBe(second);
    const objectScaleLogs = infoSpy.mock.calls.filter((call) => call[0] === "[E2:90][ObjectScale]");
    expect(objectScaleLogs).toHaveLength(1);
  });

  it("dedupes scene scale logs by rounded semantic scale signatures", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    normalizeExecutiveObjectScale({
      scale: 0.721,
      objectCount: 8,
      selected: false,
    });
    normalizeExecutiveObjectScale({
      scale: 0.722,
      objectCount: 8,
      selected: false,
    });

    const sceneScaleLogs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][ExecutiveSceneScale]");
    expect(sceneScaleLogs).toHaveLength(1);
    expect(sceneScaleLogs[0]?.[1]).toMatchObject({
      objectCount: 8,
      density: "small",
      selected: false,
      inputScale: 0.72,
      normalizedScale: expect.any(Number),
    });
    expect(sceneScaleLogs[0]?.[1]?.normalizedScale).toBeGreaterThan(0.76);
  });
});

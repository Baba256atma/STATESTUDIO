import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  analyzeExecutiveSceneBounds,
  computeTightFormationBounds,
  detectExecutiveObjectClusters,
  measureExecutiveEmptySpace,
  resetExecutiveSceneFramingForTests,
  resolveExecutiveSceneFraming,
} from "./index";
import { resetExecutiveDensityCompressionForTests } from "../objectScaling/executiveDensityCompressionRuntime";
import {
  resetExecutiveCameraPresetRegistryForTests,
  resolveExecutiveCameraPresetFrame,
} from "../camera/executiveCameraPresetRegistry";

function buildScene(objects: Array<{ id: string; position: [number, number, number] }>, relationships?: unknown[]) {
  return {
    scene: {
      objects: objects.map((object) => ({
        id: object.id,
        position: object.position,
      })),
      relationships: relationships ?? [],
    },
  };
}

describe("E2:91 executive scene framing", () => {
  beforeEach(() => {
    resetExecutiveSceneFramingForTests();
    resetExecutiveDensityCompressionForTests();
    resetExecutiveCameraPresetRegistryForTests();
    vi.restoreAllMocks();
  });

  it("compresses sparse scenes toward tight operational bounds", () => {
    const sceneJson = buildScene([
      { id: "a", position: [0, 0, 0] },
      { id: "b", position: [18, 0, 0] },
      { id: "c", position: [-16, 0, 0] },
    ]);

    const analysis = analyzeExecutiveSceneBounds({ sceneJson });
    expect(analysis.object?.span).toBeGreaterThan(20);

    const formation = computeTightFormationBounds(
      analysis.objects.map((entry) => entry.position),
      analysis.objects.length
    );
    expect(Math.max(...formation.size)).toBeLessThan(analysis.object!.span);

    const framing = resolveExecutiveSceneFraming({
      sceneJson,
      preset: "EXECUTIVE",
      mode: "3D",
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    expect(framing).not.toBeNull();
    expect(framing!.boundsAnalysis.operational.span).toBeLessThan(analysis.object!.span);
    expect(framing!.readabilityScore).toBeGreaterThanOrEqual(80);
    expect(framing!.cameraRadius).toBeLessThan(45);
  });

  it("detects clusters and improves readability for grouped objects", () => {
    const sceneJson = buildScene([
      { id: "core-1", position: [0, 0, 0], },
      { id: "core-2", position: [1.2, 0, 0.4] },
      { id: "core-3", position: [-0.8, 0, 0.6] },
      { id: "far-1", position: [24, 0, 0] },
    ] as any);

    const analysis = analyzeExecutiveSceneBounds({ sceneJson });
    const clusters = detectExecutiveObjectClusters({
      objects: analysis.objects,
      relationships: [],
    });
    expect(clusters.length).toBeGreaterThanOrEqual(2);
  });

  it("applies stronger compression for fit scene preset", () => {
    const sceneJson = buildScene([
      { id: "a", position: [0, 0, 0] },
      { id: "b", position: [12, 0, 0] },
      { id: "c", position: [0, 0, 12] },
    ]);

    const executive = resolveExecutiveSceneFraming({
      sceneJson,
      preset: "EXECUTIVE",
      mode: "3D",
    });
    const fit = resolveExecutiveSceneFraming({
      sceneJson,
      preset: "FIT_SCENE",
      mode: "3D",
    });

    expect(fit!.cameraRadius).toBeLessThan(executive!.cameraRadius);
  });

  it("includes relationship bounds in global view framing", () => {
    const sceneJson = buildScene(
      [
        { id: "a", position: [0, 0, 0] },
        { id: "b", position: [2, 0, 0] },
        { id: "c", position: [20, 0, 0] },
      ],
      [{ source_id: "a", target_id: "c" }]
    );

    const framing = resolveExecutiveSceneFraming({
      sceneJson,
      preset: "GLOBAL",
      mode: "3D",
    });
    expect(framing!.boundsAnalysis.relationship).not.toBeNull();
    expect(framing!.readabilityScore).toBeGreaterThan(0);
  });

  it("memoizes framing diagnostics by signature", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const sceneJson = buildScene([
      { id: "a", position: [0, 0, 0] },
      { id: "b", position: [1, 0, 0] },
    ]);

    resolveExecutiveSceneFraming({ sceneJson, preset: "EXECUTIVE", mode: "3D" });
    resolveExecutiveSceneFraming({ sceneJson, preset: "EXECUTIVE", mode: "3D" });

    const framingLogs = infoSpy.mock.calls.filter((call) => call[0] === "[E2:91][SceneFraming]");
    expect(framingLogs).toHaveLength(1);
  });

  it("routes camera preset frames through the framing engine", () => {
    const sceneJson = buildScene([
      { id: "a", position: [0, 0, 0] },
      { id: "b", position: [14, 0, 0] },
    ]);

    const frame = resolveExecutiveCameraPresetFrame({
      preset: "GLOBAL",
      mode: "3D",
      sceneJson,
      viewportWidth: 1600,
      viewportHeight: 900,
    });

    expect(frame.position.every(Number.isFinite)).toBe(true);
    expect(frame.lookAt.every(Number.isFinite)).toBe(true);
    expect(Math.hypot(frame.position[0] - frame.lookAt[0], frame.position[2] - frame.lookAt[2])).toBeLessThan(40);
  });

  it("measures empty space and triggers recovery threshold", () => {
    const measurement = measureExecutiveEmptySpace({
      rawSpan: 30,
      operationalSpan: 8,
      objectCount: 6,
      clusterCount: 2,
    });
    expect(measurement.emptySpaceRatio).toBeGreaterThan(0.5);
    expect(measurement.exceedsThreshold).toBe(true);
    expect(measurement.recoveryCompression).toBeLessThan(1);
  });
});

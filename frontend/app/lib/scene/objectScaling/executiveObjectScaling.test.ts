import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deriveExecutiveObjectImportanceTier,
  resetExecutiveDensityCompressionForTests,
  resetExecutiveLabelScalingForTests,
  resetExecutiveObjectScalingForTests,
  resolveExecutiveDensityCompression,
  resolveExecutiveLabelScale,
  resolveExecutiveObjectScale,
  resolveExecutivePresentationTier,
} from "./index";
import {
  normalizeExecutiveObjectScale,
  resetExecutiveSceneCompositionLogsForTests,
} from "../executiveSceneComposition";

describe("E2:90 executive object scaling", () => {
  beforeEach(() => {
    resetExecutiveObjectScalingForTests();
    resetExecutiveLabelScalingForTests();
    resetExecutiveDensityCompressionForTests();
    resetExecutiveSceneCompositionLogsForTests();
    vi.restoreAllMocks();
  });

  it("uses larger presentation tiers for sparse scenes", () => {
    expect(resolveExecutivePresentationTier(4)).toBe("critical");
    expect(resolveExecutivePresentationTier(8)).toBe("large");
    expect(resolveExecutivePresentationTier(80)).toBe("tiny");
  });

  it("boosts object scale for low object counts", () => {
    const sparse = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 8,
      importance: "supporting",
    });
    const dense = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 120,
      importance: "supporting",
    });
    expect(sparse.scale).toBeGreaterThan(dense.scale);
    expect(sparse.scale).toBeGreaterThanOrEqual(0.76);
  });

  it("emphasizes critical objects without exceeding caps", () => {
    const critical = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "critical",
      selected: true,
      focused: true,
    });
    const minor = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "minor",
    });
    expect(critical.scale).toBeGreaterThan(minor.scale);
    expect(critical.scale).toBeLessThanOrEqual(1.48);
  });

  it("applies subtle focus and hover boosts", () => {
    const base = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "supporting",
    });
    const hovered = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "supporting",
      hovered: true,
    });
    const focused = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "supporting",
      focused: true,
    });
    expect(hovered.scale).toBeGreaterThan(base.scale);
    expect(focused.scale).toBeGreaterThan(hovered.scale);
  });

  it("memoizes scale results by signature", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    const first = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 8,
      objectId: "node-a",
    });
    const second = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 8,
      objectId: "node-b",
    });

    expect(first.scale).toBe(second.scale);
    const logs = infoSpy.mock.calls.filter((call) => call[0] === "[E2:90][ObjectScale]");
    expect(logs).toHaveLength(1);
  });

  it("compresses camera distance for sparse scenes", () => {
    const sparse = resolveExecutiveDensityCompression({ objectCount: 6 });
    const dense = resolveExecutiveDensityCompression({ objectCount: 80 });
    expect(sparse.cameraDistanceMultiplier).toBeLessThan(dense.cameraDistanceMultiplier);
    expect(sparse.emptySpaceReduction).toBeGreaterThan(dense.emptySpaceReduction);
  });

  it("scales labels for readability and collision priority", () => {
    const sparseLabel = resolveExecutiveLabelScale({
      objectCount: 8,
      importance: "important",
      baseFontSizePx: 12,
    });
    const crowdedMinor = resolveExecutiveLabelScale({
      objectCount: 120,
      importance: "minor",
      baseFontSizePx: 12,
      index: 4,
    });
    expect(sparseLabel.fontSizePx).toBeGreaterThanOrEqual(11);
    expect(sparseLabel.fontSizePx).toBeGreaterThan(crowdedMinor.fontSizePx);
    expect(sparseLabel.priority).toBeGreaterThan(crowdedMinor.priority);
  });

  it("derives importance from scanner and relationship context", () => {
    expect(
      deriveExecutiveObjectImportanceTier({
        scannerSeverity: "critical",
      })
    ).toBe("critical");
    expect(
      deriveExecutiveObjectImportanceTier({
        connectedToSelected: true,
      })
    ).toBe("important");
    expect(
      deriveExecutiveObjectImportanceTier({
        role: "context",
      })
    ).toBe("minor");
  });

  it("routes normalizeExecutiveObjectScale through the executive runtime", () => {
    const normalized = normalizeExecutiveObjectScale({
      scale: 0.52,
      objectCount: 8,
      selected: false,
    });
    expect(normalized).toBeGreaterThan(0.76);
  });
});

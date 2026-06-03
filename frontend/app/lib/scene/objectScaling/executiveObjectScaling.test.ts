import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyExecutiveObjectScaleGovernance,
  deriveExecutiveObjectImportanceTier,
  EXECUTIVE_VIEW_MODE_SCALE_LIMITS,
  resetExecutiveDensityCompressionForTests,
  resetExecutiveLabelScalingForTests,
  resetExecutiveObjectScaleGovernanceForTests,
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
    resetExecutiveObjectScaleGovernanceForTests();
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
      viewMode: "3D",
    });
    const dense = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 120,
      importance: "supporting",
      viewMode: "3D",
    });
    expect(sparse.scale).toBeGreaterThan(dense.scale);
    expect(sparse.scale).toBeGreaterThanOrEqual(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["3D"].minScale);
  });

  it("emphasizes critical objects without exceeding caps", () => {
    const critical = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "critical",
      selected: true,
      focused: true,
      viewMode: "3D",
    });
    const minor = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "minor",
      viewMode: "3D",
    });
    expect(critical.scale).toBeGreaterThan(minor.scale);
    expect(critical.scale).toBeLessThanOrEqual(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["3D"].selectedMaxScale);
  });

  it("applies subtle focus and hover boosts", () => {
    const base = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "supporting",
      viewMode: "3D",
    });
    const hovered = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "supporting",
      hovered: true,
      viewMode: "3D",
    });
    const focused = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 12,
      importance: "supporting",
      focused: true,
      viewMode: "3D",
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
      viewMode: "3D",
    });
    const second = resolveExecutiveObjectScale({
      rawScale: 0.72,
      objectCount: 8,
      objectId: "node-b",
      viewMode: "3D",
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
    expect(sparseLabel.fontSizePx).toBeGreaterThanOrEqual(crowdedMinor.fontSizePx);
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
    const normalized3d = normalizeExecutiveObjectScale({
      scale: 0.52,
      objectCount: 8,
      selected: false,
      viewMode: "3D",
    });
    expect(normalized3d).toBeGreaterThanOrEqual(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["3D"].minScale);
    expect(normalized3d).toBeLessThanOrEqual(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["3D"].maxScale);

    const normalized2d = normalizeExecutiveObjectScale({
      scale: 1.2,
      objectCount: 8,
      selected: false,
      viewMode: "2D",
    });
    expect(normalized2d).toBeLessThanOrEqual(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["2D"].maxScale);
  });
});

describe("P2 executive object scale governance", () => {
  beforeEach(() => {
    resetExecutiveObjectScalingForTests();
    resetExecutiveObjectScaleGovernanceForTests();
    vi.restoreAllMocks();
  });

  it("clamps 2D scales to the strategic map range", () => {
    const governed = applyExecutiveObjectScaleGovernance({
      rawScale: 1.4,
      baseScale: 1.4,
      viewMode: "2D",
      role: "center",
    });
    expect(governed.scale).toBeLessThanOrEqual(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["2D"].maxScale);
    expect(governed.scale).toBeGreaterThanOrEqual(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["2D"].minScale);
  });

  it("allows slightly larger selected objects in 3D without dominating", () => {
    const governed = applyExecutiveObjectScaleGovernance({
      rawScale: 1.5,
      baseScale: 1.5,
      viewMode: "3D",
      role: "center",
      selected: true,
      focused: true,
    });
    expect(governed.scale).toBeLessThanOrEqual(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["3D"].selectedMaxScale);
    expect(governed.scale).toBeGreaterThan(EXECUTIVE_VIEW_MODE_SCALE_LIMITS["3D"].maxScale);
  });

  it("logs governance once per object signature", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    applyExecutiveObjectScaleGovernance({
      objectId: "node-a",
      rawScale: 1,
      baseScale: 1,
      viewMode: "2D",
      role: "flow",
    });
    applyExecutiveObjectScaleGovernance({
      objectId: "node-a",
      rawScale: 1,
      baseScale: 1,
      viewMode: "2D",
      role: "flow",
    });

    const logs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][ObjectScaleGovernance]");
    expect(logs).toHaveLength(1);
  });
});

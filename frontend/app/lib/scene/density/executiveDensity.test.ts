import { describe, expect, it, beforeEach } from "vitest";

import {
  applyExecutiveObjectScaleProfile,
  DEFAULT_EXECUTIVE_SCALE_PROFILE,
  evaluateCameraStability,
  evaluateExecutiveSceneDensity,
  resolveAdaptiveSceneLabelState,
  resolveExecutiveBaseObjectScale,
  resolveExecutiveFocusWorkspaceState,
  resolveGridLayoutPosition,
  resolveNetworkLayoutPosition,
  resolveSpacedCatalogPlacementPosition,
  resetExecutiveCameraStabilityForTests,
  resetExecutiveDensityInstrumentationForTests,
  resetExecutiveObjectScaleProfileForTests,
  resetWorkspaceScaleMetricsForTests,
  computeWorkspaceScaleMetrics,
} from "./index";

describe("executive density runtimes", () => {
  beforeEach(() => {
    resetExecutiveDensityInstrumentationForTests();
    resetExecutiveObjectScaleProfileForTests();
    resetExecutiveCameraStabilityForTests();
    resetWorkspaceScaleMetricsForTests();
  });

  it("evaluates density snapshot with strategic scale recommendation", () => {
    const snapshot = evaluateExecutiveSceneDensity({
      objectCount: 24,
      relationshipCount: 18,
      boundsSize: [12, 2, 12],
      viewportWidth: 1440,
      viewportHeight: 900,
      layoutPreset: "balanced",
    });
    expect(snapshot.sceneDensity).toBe("dense");
    expect(snapshot.recommendedScale).toBeLessThan(0.62);
    expect(snapshot.recommendedSpacing).toBeGreaterThan(0.9);
  });

  it("applies strategic profile scale reduction", () => {
    const base = resolveExecutiveBaseObjectScale({ role: "core" });
    expect(base).toBeLessThan(0.58);
    const normalized = applyExecutiveObjectScaleProfile({ scale: 0.72, selected: false });
    expect(normalized).toBeLessThan(0.55);
    expect(DEFAULT_EXECUTIVE_SCALE_PROFILE).toBe("STRATEGIC");
  });

  it("suppresses disruptive auto-frame on incremental object growth", () => {
    const decision = evaluateCameraStability({
      trigger: "auto_frame",
      previousObjectCount: 8,
      nextObjectCount: 10,
      signatureChanged: true,
    });
    expect(decision.allowFullReframe).toBe(false);
    expect(decision.gentleOnly).toBe(true);
  });

  it("preserves executive context on object creation", () => {
    const decision = evaluateCameraStability({
      trigger: "object_created",
      previousObjectCount: 5,
      nextObjectCount: 6,
    });
    expect(decision.allowFullReframe).toBe(false);
    expect(decision.maxDistanceDelta).toBeLessThanOrEqual(0.65);
  });

  it("resolves grid and network layout positions within bounds", () => {
    const grid = resolveGridLayoutPosition({ mode: "GRID", index: 9, objectCount: 20, spacing: 1.2 });
    const network = resolveNetworkLayoutPosition({ mode: "NETWORK", index: 9, objectCount: 20, spacing: 1.1 });
    expect(Math.hypot(grid[0], grid[2])).toBeLessThanOrEqual(8.5);
    expect(Math.hypot(network[0], network[2])).toBeLessThanOrEqual(8.5);
  });

  it("finds spaced placement without overlap", () => {
    const existing = [
      [0, 0, 0] as const,
      [1.2, 0, 0.4] as const,
    ];
    const placement = resolveSpacedCatalogPlacementPosition(existing as any, 2, {
      objectCount: 3,
    });
    expect(placement.position).toHaveLength(3);
    expect(placement.reason).toContain("slot");
  });

  it("transitions label density by object count", () => {
    const minimal = resolveAdaptiveSceneLabelState({ objectCount: 60, cameraDistance: 24 });
    expect(minimal.mode).toBe("MINIMAL");
    const full = resolveAdaptiveSceneLabelState({
      objectCount: 4,
      cameraDistance: 16,
      selected: true,
    });
    expect(full.mode).toBe("FULL");
  });

  it("emphasizes selected object and de-emphasizes unrelated nodes", () => {
    const selected = resolveExecutiveFocusWorkspaceState({
      objectId: "a",
      selectedObjectId: "a",
      relatedObjectIds: ["b"],
    });
    const unrelated = resolveExecutiveFocusWorkspaceState({
      objectId: "z",
      selectedObjectId: "a",
      relatedObjectIds: ["b"],
    });
    expect(selected.scaleMultiplier).toBeGreaterThan(unrelated.scaleMultiplier);
    expect(unrelated.opacity).toBeLessThan(selected.opacity);
  });

  it("tracks internal workspace scale metrics", () => {
    const metrics = computeWorkspaceScaleMetrics({
      totalObjects: 50,
      visibleObjects: 48,
      relationships: 32,
    });
    expect(metrics.totalObjects).toBe(50);
    expect(metrics.layoutHealth).toBeGreaterThan(0);
    expect(metrics.layoutHealth).toBeLessThanOrEqual(1);
  });
});

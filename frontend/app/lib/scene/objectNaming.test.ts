import { beforeEach, describe, expect, it } from "vitest";

import type { SceneObject } from "../sceneTypes";
import {
  normalizeExecutiveObjectName,
  resetExecutiveObjectNamingLogsForTests,
  resolveExecutiveObjectName,
} from "./executiveObjectNamingRuntime";
import { resolveObjectLabelPlacement, resetObjectLabelPlacementLogsForTests } from "./objectLabelPlacementRuntime";
import {
  resetObjectLabelDiagnosticGuardForTests,
} from "./objectLabelDiagnosticGuard";
import { resetObjectLabelRuntimeCacheForTests } from "./objectLabelRuntimeCache";
import {
  resolveObjectNameDensityProfile,
  resolveObjectNameDensityTier,
  resetObjectNameDensityLogsForTests,
  shouldRenderExecutiveObjectName,
} from "./objectNameDensityProfile";
import { DEFAULT_OBJECT_NAME_PROFILE, resolveObjectNameRenderingProfile } from "./objectNameRenderingProfile";
import { resolveExecutiveObjectSelectionHighlight } from "./executiveObjectSelectionHighlight";
import {
  auditExecutiveSceneReadability,
  resetExecutiveSceneReadabilityAuditLogsForTests,
} from "./executiveSceneReadabilityAudit";

const sampleObject = (overrides: Partial<SceneObject> = {}): SceneObject =>
  ({
    id: "revenue_node",
    name: "Revenue",
    type: "sphere",
    tags: ["finance"],
    ...overrides,
  }) as SceneObject;

describe("executiveObjectNamingRuntime", () => {
  it("resolves stable executive names from object metadata", () => {
    resetExecutiveObjectNamingLogsForTests();
    expect(resolveExecutiveObjectName({ object: sampleObject(), index: 0 })).toBe("Revenue");
    expect(normalizeExecutiveObjectName("  Supplier Hub  ")).toBe("Supplier Hub");
  });

  it("truncates overly long names", () => {
    const longName = "A".repeat(50);
    expect(normalizeExecutiveObjectName(longName).endsWith("…")).toBe(true);
  });
});

describe("objectNameRenderingProfile", () => {
  it("defaults to below-object lightweight typography", () => {
    const profile = resolveObjectNameRenderingProfile();
    expect(profile.placement).toBe("below");
    expect(profile.singleLine).toBe(true);
    expect(profile.fontSizePx).toBe(DEFAULT_OBJECT_NAME_PROFILE.fontSizePx);
  });
});

describe("objectNameDensityProfile", () => {
  beforeEach(() => {
    resetObjectNameDensityLogsForTests();
    resetObjectLabelRuntimeCacheForTests();
    resetObjectLabelDiagnosticGuardForTests();
  });

  it("maps object counts to density tiers", () => {
    expect(resolveObjectNameDensityTier(8)).toBe("sparse");
    expect(resolveObjectNameDensityTier(20)).toBe("normal");
    expect(resolveObjectNameDensityTier(40)).toBe("dense");
    expect(resolveObjectNameDensityTier(80)).toBe("critical");
  });

  it("shows all names until critical density", () => {
    expect(
      shouldRenderExecutiveObjectName({ objectCount: 25, selected: false, focused: false, index: 3 })
    ).toBe(true);
    expect(
      shouldRenderExecutiveObjectName({ objectCount: 100, selected: false, focused: false, index: 3 })
    ).toBe(false);
    expect(
      shouldRenderExecutiveObjectName({ objectCount: 100, selected: true, focused: false, index: 3 })
    ).toBe(true);
  });

  it("adjusts font size by density", () => {
    expect(resolveObjectNameDensityProfile(8).fontSizePx).toBeGreaterThan(
      resolveObjectNameDensityProfile(60).fontSizePx
    );
  });
});

describe("objectLabelPlacementRuntime", () => {
  beforeEach(() => {
    resetObjectLabelPlacementLogsForTests();
    resetObjectLabelRuntimeCacheForTests();
    resetObjectLabelDiagnosticGuardForTests();
  });

  it("places labels below objects with relationship-aware offset", () => {
    const profile = resolveObjectNameRenderingProfile();
    const sparse = resolveObjectLabelPlacement({
      baseScaleY: 1,
      objectScale: 1,
      profile,
      index: 0,
      objectCount: 8,
      relationshipDensity: 0,
    });
    const dense = resolveObjectLabelPlacement({
      baseScaleY: 1,
      objectScale: 1,
      profile,
      index: 1,
      objectCount: 40,
      relationshipDensity: 6,
    });
    expect(sparse.y).toBeGreaterThan(0);
    expect(dense.y).toBeGreaterThanOrEqual(sparse.y);
  });
});

describe("executiveObjectSelectionHighlight", () => {
  it("communicates selection through ring emphasis", () => {
    const idle = resolveExecutiveObjectSelectionHighlight({ selected: false, focused: false });
    const selected = resolveExecutiveObjectSelectionHighlight({ selected: true, focused: false, theme: "night" });
    expect(idle.showRing).toBe(false);
    expect(selected.showRing).toBe(true);
    expect(selected.ringScale).toBeGreaterThan(idle.ringScale);
  });
});

describe("executiveSceneReadabilityAudit", () => {
  it("flags legacy tooltip presence and clutter risk", () => {
    resetExecutiveSceneReadabilityAuditLogsForTests();
    const report = auditExecutiveSceneReadability({
      objectCount: 60,
      visibleNameCount: 60,
      legacyTooltipCount: 1,
      selectedObjectId: "revenue",
      densityTier: "dense",
    });
    expect(report.warnings).toContain("legacy_floating_tooltips_detected");
    expect(report.estimatedOverlapRisk).toBe("medium");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deriveExecutiveObjectVisualCategory,
  logExecutiveGraphicsProfileOnce,
  resetExecutiveGraphicsProfileLogsForTests,
  resolveExecutiveGraphicsViewProfile,
  resolveExecutiveObjectMaterialPreset,
  resolveExecutiveVisualHierarchyTier,
} from "./executiveGraphicsProfile";

describe("executiveGraphicsProfile", () => {
  beforeEach(() => {
    resetExecutiveGraphicsProfileLogsForTests();
    vi.restoreAllMocks();
  });

  it("maps finance and customer semantics to executive categories", () => {
    expect(
      deriveExecutiveObjectVisualCategory({ label: "Cash Pressure", tags: ["liquidity"] })
    ).toBe("finance_pressure");
    expect(
      deriveExecutiveObjectVisualCategory({ label: "Customer Trust", tags: ["outcome"] })
    ).toBe("customer_outcome");
    expect(
      deriveExecutiveObjectVisualCategory({ label: "Supplier Network", tags: ["supplier", "flow"] })
    ).toBe("flow");
  });

  it("prioritizes selected hierarchy over role", () => {
    expect(
      resolveExecutiveVisualHierarchyTier({
        selected: true,
        visualRole: "background",
      })
    ).toBe("selected");
  });

  it("returns view-mode specific profiles", () => {
    const map2d = resolveExecutiveGraphicsViewProfile("2D");
    const map3d = resolveExecutiveGraphicsViewProfile("3D");
    expect(map2d.visualProfile).toBe("executive_strategic_map");
    expect(map3d.visualProfile).toBe("executive_command_center");
    expect(map2d.relationshipLineDominance).toBeGreaterThan(map3d.relationshipLineDominance);
  });

  it("applies compact 2D material tuning", () => {
    const preset = resolveExecutiveObjectMaterialPreset({
      category: "flow",
      viewMode: "2D",
      hierarchyTier: "supporting",
    });
    const preset3d = resolveExecutiveObjectMaterialPreset({
      category: "flow",
      viewMode: "3D",
      hierarchyTier: "supporting",
    });
    expect(preset.opacityMul).toBeLessThan(preset3d.opacityMul);
    expect(preset.roughness).toBeGreaterThanOrEqual(preset3d.roughness);
  });

  it("logs graphics profile once per signature", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    logExecutiveGraphicsProfileOnce({ viewMode: "3D", objectCount: 10 });
    logExecutiveGraphicsProfileOnce({ viewMode: "3D", objectCount: 10 });
    const logs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][GraphicsProfile]");
    expect(logs).toHaveLength(1);
  });
});

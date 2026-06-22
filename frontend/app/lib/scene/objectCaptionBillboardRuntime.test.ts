import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  emitBillboardLabelActive,
  emitBillboardLabelCameraFacingEnabled,
  emitBillboardLabelMounted,
  emitObjectCaptionBillboardEnabled,
  resetObjectCaptionBillboardRuntimeForTests,
  resolveObjectCaptionBillboardState,
  trackBillboardLabelOrientationUpdated,
  trackObjectCaptionCameraFacingUpdated,
} from "./objectCaptionBillboardRuntime";
import { resetDiagnosticSwitchForTests } from "../runtime/diagnosticSwitch";

describe("objectCaptionBillboardRuntime", () => {
  beforeEach(() => {
    resetObjectCaptionBillboardRuntimeForTests();
    resetDiagnosticSwitchForTests();
    vi.restoreAllMocks();
  });

  it("enables drei billboard enforcement in 3D only", () => {
    expect(resolveObjectCaptionBillboardState("3D")).toEqual({
      billboardEnabled: true,
      useSpriteTransform: false,
    });
    expect(resolveObjectCaptionBillboardState("2D")).toEqual({
      billboardEnabled: false,
      useSpriteTransform: false,
    });
  });

  it("emits billboard label diagnostics once per object", () => {
    const debug = vi.spyOn(globalThis.console, "debug").mockImplementation(() => {});
    emitBillboardLabelMounted("obj-a", "3D");
    emitBillboardLabelMounted("obj-a", "3D");
    emitBillboardLabelCameraFacingEnabled("obj-a", "3D");
    emitBillboardLabelActive("obj-a", "3D");

    expect(debug).toHaveBeenCalledTimes(3);
    expect(debug.mock.calls.map((call) => call[0])).toEqual([
      "[BillboardLabel] Label Mounted",
      "[BillboardLabel] Camera Facing Enabled",
      "[BillboardLabel] Billboard Active",
    ]);
  });

  it("keeps legacy caption diagnostic aliases", () => {
    const debug = vi.spyOn(globalThis.console, "debug").mockImplementation(() => {});
    emitObjectCaptionBillboardEnabled("obj-a", "3D");
    emitObjectCaptionBillboardEnabled("obj-a", "3D");
    expect(debug.mock.calls.some((call) => call[0] === "[BillboardLabel] Label Mounted")).toBe(true);
    expect(debug.mock.calls.some((call) => call[0] === "[BillboardLabel] Billboard Active")).toBe(true);
  });

  it("throttles orientation updated diagnostics", () => {
    const debug = vi.spyOn(globalThis.console, "debug").mockImplementation(() => {});
    const camera = {
      position: { x: 0, y: 4, z: 8 },
      quaternion: { w: 1 },
    };
    trackBillboardLabelOrientationUpdated(camera, "obj-a");
    trackBillboardLabelOrientationUpdated(camera, "obj-a");
    trackBillboardLabelOrientationUpdated(
      { position: { x: 1, y: 4, z: 8 }, quaternion: { w: 0.99 } },
      "obj-b"
    );
    trackObjectCaptionCameraFacingUpdated(camera, "obj-a");
    expect(debug).toHaveBeenCalledTimes(1);
    expect(debug.mock.calls[0]?.[0]).toBe("[BillboardLabel] Orientation Updated");
  });
});

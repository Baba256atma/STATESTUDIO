import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { DEFAULT_OVERLAY_VISIBILITY } from "./overlayContracts";
import {
  getOverlayRuntimeServerVisibility,
  getOverlayRuntimeVisibility,
  resetOverlayRuntimeForTests,
  setOverlayTypeVisibility,
  subscribeOverlayRuntime,
  syncSceneOverlays,
} from "./overlayRuntime";
import { resetOverlayInstrumentationForTests } from "./overlayInstrumentation";
import { resolveSceneOverlays } from "./resolveSceneOverlays";
import type { PropagationOverlayState } from "../simulation/propagationTypes";

describe("overlayRuntime", () => {
  beforeEach(() => {
    resetOverlayRuntimeForTests();
    resetOverlayInstrumentationForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("tracks overlay visibility toggles", () => {
    expect(getOverlayRuntimeVisibility().propagation).toBe(DEFAULT_OVERLAY_VISIBILITY.propagation);
    setOverlayTypeVisibility("propagation", false, "manual");
    expect(getOverlayRuntimeVisibility().propagation).toBe(false);
  });

  it("returns stable visibility snapshots between reads", () => {
    const first = getOverlayRuntimeVisibility();
    const second = getOverlayRuntimeVisibility();
    expect(first).toBe(second);
  });

  it("updates cached snapshot only when visibility changes", () => {
    const before = getOverlayRuntimeVisibility();
    setOverlayTypeVisibility("propagation", before.propagation, "manual");
    expect(getOverlayRuntimeVisibility()).toBe(before);

    setOverlayTypeVisibility("propagation", !before.propagation, "manual");
    const after = getOverlayRuntimeVisibility();
    expect(after).not.toBe(before);
    expect(after.propagation).toBe(!before.propagation);
  });

  it("returns a stable server snapshot reference", () => {
    expect(getOverlayRuntimeServerVisibility()).toBe(getOverlayRuntimeServerVisibility());
  });

  it("does not invoke listeners during subscription", () => {
    const listener = vi.fn();
    subscribeOverlayRuntime(listener);
    expect(listener).not.toHaveBeenCalled();
  });

  it("registers and removes overlays through sync", () => {
    syncSceneOverlays(
      [
        {
          id: "propagation:test",
          type: "propagation",
          sourceIds: ["a"],
          targetIds: ["b"],
          visible: true,
        },
      ],
      "runtime"
    );
    syncSceneOverlays([], "runtime");
    expect(getOverlayRuntimeVisibility().risk_flow).toBe(true);
  });
});

describe("resolveSceneOverlays", () => {
  it("builds propagation and dependency overlays from existing contracts", () => {
    const propagation: PropagationOverlayState = {
      active: true,
      source_object_id: "supplier-a",
      mode: "preview",
      impacted_nodes: [
        { object_id: "supplier-a", depth: 0, strength: 0.9, role: "source" },
        { object_id: "inventory-b", depth: 1, strength: 0.7, role: "impacted" },
      ],
      impacted_edges: [{ from: "supplier-a", to: "inventory-b", depth: 1, strength: 0.7 }],
      meta: { timestamp: 1, source_kind: "fallback_preview" },
    };

    const overlays = resolveSceneOverlays({
      propagation,
      decisionPath: null,
      sceneJson: {
        scene: {
          objects: [{ id: "supplier-a", dependencies: ["inventory-b"] }],
        },
      },
    });

    expect(overlays.some((overlay) => overlay.type === "propagation")).toBe(true);
    expect(overlays.some((overlay) => overlay.type === "dependency")).toBe(true);
  });
});

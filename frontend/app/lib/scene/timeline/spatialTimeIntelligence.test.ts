import { describe, expect, it } from "vitest";

import { EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS } from "../executiveTimelineHudTypes";
import {
  buildSpatialTimeIntelligenceState,
  mergeTimelineSpatialObjectSelection,
  resolveSpatialTimelineAnchor,
  resolveTimelineSpatialObjectSelection,
} from "./spatialTimeIntelligenceRuntime";
import {
  hoverTimelineSpatialEvent,
  resetTimelineSpatialInteractionForTests,
  selectTimelineSpatialEvent,
} from "./spatialTimeIntelligenceStore";

describe("spatialTimeIntelligenceRuntime", () => {
  it("anchors supplier and inventory placeholder events to matching scene objects", () => {
    const anchor = resolveSpatialTimelineAnchor(
      EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS.find((event) => event.id === "supplier_delay")!,
      {
        sceneObjects: [
          { id: "supplier_a", label: "Supplier A", position: [1, 0, 0] },
          { id: "warehouse_b", label: "Warehouse B", position: [2, 0, 0] },
        ],
      }
    );

    expect(anchor.kind).toBe("object");
    expect(anchor.objectId).toBe("supplier_a");
    expect(anchor.markerType).toBe("risk");
  });

  it("builds scene selection when a timeline event is selected", () => {
    resetTimelineSpatialInteractionForTests();
    selectTimelineSpatialEvent("inventory_risk", { focusObjectId: null, source: "test" });

    const state = buildSpatialTimeIntelligenceState({
      events: EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS,
      sceneObjects: [
        { id: "supplier_a", label: "Supplier A", position: [1, 0, 0] },
        { id: "inventory_b", label: "Inventory B", position: [2, 0, 0] },
      ],
      interaction: selectTimelineSpatialEvent("inventory_risk"),
    });

    const selection = resolveTimelineSpatialObjectSelection({ state });
    expect(selection?.highlighted_objects).toContain("inventory_b");
    expect(selection?.dim_unrelated_objects).toBe(true);
  });

  it("highlights hovered events without requiring selection", () => {
    resetTimelineSpatialInteractionForTests();
    hoverTimelineSpatialEvent("supplier_delay");

    const state = buildSpatialTimeIntelligenceState({
      events: EXECUTIVE_TIMELINE_PLACEHOLDER_EVENTS,
      sceneObjects: [{ id: "supplier_a", label: "Supplier A", position: [1, 0, 0] }],
      interaction: hoverTimelineSpatialEvent("supplier_delay"),
    });

    const selection = resolveTimelineSpatialObjectSelection({ state });
    expect(selection?.highlighted_objects).toContain("supplier_a");
  });

  it("merges timeline selection with existing scene selection", () => {
    const merged = mergeTimelineSpatialObjectSelection(
      { highlighted_objects: ["warehouse_b"], dim_unrelated_objects: false },
      { highlighted_objects: ["supplier_a"], risk_sources: ["supplier_a"], risk_targets: ["warehouse_b"], dim_unrelated_objects: true }
    );

    expect(merged?.highlighted_objects).toEqual(expect.arrayContaining(["supplier_a", "warehouse_b"]));
    expect(merged?.risk_sources).toEqual(["supplier_a"]);
    expect(merged?.dim_unrelated_objects).toBe(true);
  });
});

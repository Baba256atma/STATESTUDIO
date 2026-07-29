/**
 * Scene HUD layout / collision contracts.
 * AD-SCENE-01: executiveSceneToolbar.zone = TOP_CENTER (narrow E2:56 supersession).
 */
import { describe, expect, it } from "vitest";

import {
  AD_SCENE_01_DECISION_ID,
  CANONICAL_HUD_ANCHORS,
  enforceCanonicalAnchor,
  getCanonicalHudZone,
  hudZoneToDockZone,
} from "./executiveHudLayoutGovernance";
import { runExecutiveLayoutAudit, resetExecutiveLayoutAuditLogsForTests } from "./executiveLayoutAuditRuntime";
import {
  EXECUTIVE_SCENE_HUD_GRID,
  resolveExecutiveTopBaseline,
  resolveUnifiedTopRowPlacement,
} from "./executiveTopAlignmentRuntime";
import { resolveExecutiveTopHudSafeZone } from "./executiveTopHudSafeZone";
import {
  buildHudLayoutPanels,
  detectSceneHudCollisions,
  type HudLayoutPanel,
} from "./sceneHudCollisionRuntime";
import { resolveSceneNavigationToolbarPlacement } from "./sceneNavigationPlacement";
import { getSceneHudRegistration, resolveSceneHudVisibility, SCENE_HUD_REGISTRY } from "./sceneHudRegistry";
import { resolveTimelineSafeZone } from "./timelineSafeZoneRuntime";
import { resolveToolbarSafeZone } from "./toolbarSafeZoneRuntime";
import { resolveWorkspaceLayoutContract } from "../ui/workspaceLayoutController";

describe("executiveTopAlignmentRuntime", () => {
  it("uses the same top baseline for all top-row panels", () => {
    const placement = resolveUnifiedTopRowPlacement(1440);
    const sceneTop = resolveExecutiveTopBaseline(1440);
    expect(placement.top).toBe(sceneTop);
    expect(placement.top).toBe(EXECUTIVE_SCENE_HUD_GRID.topMargin);
    expect(placement.top).toBe(12);

    const panels = buildHudLayoutPanels({
      viewportWidth: 1440,
      viewportHeight: 900,
      toolbarTop: sceneTop,
      visiblePanels: {
        sceneInfoHud: true,
        objectInfoHud: true,
        executiveSceneToolbar: true,
      },
    });

    const sceneInfo = panels.find((panel) => panel.panelId === "sceneInfoHud");
    const toolbar = panels.find((panel) => panel.panelId === "executiveSceneToolbar");
    const objectInfo = panels.find((panel) => panel.panelId === "objectInfoHud");

    expect(sceneInfo?.rect.y).toBe(sceneTop);
    expect(toolbar?.rect.y).toBe(sceneTop);
    expect(objectInfo?.rect.y).toBe(sceneTop);
    expect(toolbar?.zone).toBe(CANONICAL_HUD_ANCHORS.executiveSceneToolbar);
    expect(toolbar?.zone).toBe("TOP_CENTER");
    // Geometry-derived: left / center / right lanes do not overlap at 1440.
    expect(detectSceneHudCollisions(panels)).toEqual([]);
  });
});

describe("executiveTopHudSafeZone", () => {
  it("reserves horizontal lanes without lowering the toolbar", () => {
    const zone = resolveExecutiveTopHudSafeZone({
      viewportWidth: 1440,
      sceneInfoVisible: true,
      objectInfoVisible: true,
    });
    expect(zone.top).toBe(EXECUTIVE_SCENE_HUD_GRID.topMargin);
    expect(zone.top).toBe(12);
    expect(zone.leftLaneEnd).toBeLessThan(zone.rightLaneStart);
  });
});

describe("executiveHudLayoutGovernance", () => {
  it("enforces canonical anchors", () => {
    expect(AD_SCENE_01_DECISION_ID).toBe("AD-SCENE-01");
    expect(getCanonicalHudZone("sceneInfoHud")).toBe("LEFT_TOP");
    expect(getCanonicalHudZone("executiveSceneToolbar")).toBe(CANONICAL_HUD_ANCHORS.executiveSceneToolbar);
    expect(getCanonicalHudZone("executiveSceneToolbar")).toBe("TOP_CENTER");
    expect(getCanonicalHudZone("objectInfoHud")).toBe("RIGHT_TOP");
    expect(getCanonicalHudZone("executiveStatusHud")).toBe("RIGHT_TOP");
    expect(getCanonicalHudZone("timelineHud")).toBe("BOTTOM_CENTER");
    expect(enforceCanonicalAnchor("objectInfoHud", "LEFT_TOP")).toBe("RIGHT_TOP");
    // Fail-closed: requested RIGHT_TOP for toolbar is overridden to AD-SCENE-01 canonical.
    expect(enforceCanonicalAnchor("executiveSceneToolbar", "RIGHT_TOP")).toBe("TOP_CENTER");
  });
});

describe("sceneHudRegistry", () => {
  it("hides object info when nothing selected and empty state when selected", () => {
    expect(
      resolveSceneHudVisibility("objectInfoHud", {
        selectedObjectId: null,
        pipelineStatus: "ready",
        devSurfaces: false,
        panelVisible: true,
      })
    ).toBe(false);
    expect(
      resolveSceneHudVisibility("objectInfoEmptyPlaceholder", {
        selectedObjectId: "revenue",
        pipelineStatus: "ready",
        devSurfaces: false,
        panelVisible: true,
      })
    ).toBe(false);
  });

  it("keeps AD-SCENE-01 toolbar zone aligned with governance and placement", () => {
    const toolbarEntry = getSceneHudRegistration("executiveSceneToolbar");
    expect(toolbarEntry.zone).toBe(CANONICAL_HUD_ANCHORS.executiveSceneToolbar);
    expect(toolbarEntry.zone).toBe("TOP_CENTER");
    expect(toolbarEntry.zone).not.toBe("RIGHT_TOP");

    const contract = resolveWorkspaceLayoutContract("analysis", 1280);
    const placement = resolveSceneNavigationToolbarPlacement(contract);
    expect(placement.top).toBe(EXECUTIVE_SCENE_HUD_GRID.topMargin);
    expect(placement.left).toBe("50%");

    const toolbarPanels = Object.values(SCENE_HUD_REGISTRY).filter(
      (entry) => entry.panelId === "executiveSceneToolbar"
    );
    expect(toolbarPanels).toHaveLength(1);
  });
});

describe("sceneHudCollisionRuntime", () => {
  it("stacks status hud below object info on right top", () => {
    const panels = buildHudLayoutPanels({
      viewportWidth: 1440,
      viewportHeight: 900,
      visiblePanels: {
        objectInfoHud: true,
        executiveStatusHud: true,
        sceneInfoHud: true,
        executiveSceneToolbar: true,
      },
    });
    const status = panels.find((panel) => panel.panelId === "executiveStatusHud");
    const objectInfo = panels.find((panel) => panel.panelId === "objectInfoHud");
    const toolbar = panels.find((panel) => panel.panelId === "executiveSceneToolbar");
    expect(status && objectInfo).toBeTruthy();
    expect(status!.rect.y).toBeGreaterThan(objectInfo!.rect.y);
    expect(toolbar?.zone).toBe("TOP_CENTER");
    expect(panels.filter((panel) => panel.panelId === "executiveSceneToolbar")).toHaveLength(1);
    // Geometry-derived after AD-SCENE-01 alignment (no RIGHT_TOP toolbar false positives).
    expect(detectSceneHudCollisions(panels)).toEqual([]);
  });

  it("detects intentionally constructed positive-area overlap", () => {
    const overlapping: HudLayoutPanel[] = [
      {
        panelId: "objectInfoHud",
        zone: "RIGHT_TOP",
        priority: 100,
        visible: true,
        rect: { x: 100, y: 12, width: 200, height: 100 },
      },
      {
        panelId: "executiveStatusHud",
        zone: "RIGHT_TOP",
        priority: 70,
        visible: true,
        rect: { x: 150, y: 40, width: 200, height: 100 },
      },
    ];
    const collisions = detectSceneHudCollisions(overlapping);
    expect(collisions).toHaveLength(1);
    expect(collisions[0]?.[0].panelId).toBe("objectInfoHud");
    expect(collisions[0]?.[1].panelId).toBe("executiveStatusHud");
  });

  it("does not flag separated top-center and right-top geometry", () => {
    const separated: HudLayoutPanel[] = [
      {
        panelId: "executiveSceneToolbar",
        zone: "TOP_CENTER",
        priority: 120,
        visible: true,
        rect: { x: 540, y: 12, width: 360, height: 44 },
      },
      {
        panelId: "objectInfoHud",
        zone: "RIGHT_TOP",
        priority: 100,
        visible: true,
        rect: { x: 1084, y: 12, width: 344, height: 240 },
      },
    ];
    expect(detectSceneHudCollisions(separated)).toEqual([]);
  });

  it("does not treat positive-area overlap as a shared baseline", () => {
    const sameBaselineOverlap: HudLayoutPanel[] = [
      {
        panelId: "executiveSceneToolbar",
        zone: "TOP_CENTER",
        priority: 120,
        visible: true,
        rect: { x: 900, y: 12, width: 360, height: 44 },
      },
      {
        panelId: "objectInfoHud",
        zone: "RIGHT_TOP",
        priority: 100,
        visible: true,
        rect: { x: 1000, y: 12, width: 344, height: 240 },
      },
    ];
    expect(detectSceneHudCollisions(sameBaselineOverlap).length).toBeGreaterThan(0);
  });
});

describe("toolbar and timeline safe zones", () => {
  it("keeps toolbar on unified top baseline", () => {
    const contract = resolveWorkspaceLayoutContract("executive", 1440);
    const zone = resolveToolbarSafeZone({
      contract,
      objectInfoVisible: true,
      statusHudVisible: false,
    });
    expect(zone.top).toBe(12);
    expect(zone.left).toBeGreaterThan(200);
  });

  it("reserves bottom space for timeline", () => {
    const zone = resolveTimelineSafeZone({
      viewportWidth: 1440,
      viewportHeight: 900,
      timelineVisible: true,
      quickActionsVisible: true,
      timelineExpanded: false,
    });
    expect(zone.bottomOffset).toBeGreaterThan(96);
  });
});

describe("executiveLayoutAuditRuntime", () => {
  it("reports zero collisions for canonical layout", () => {
    resetExecutiveLayoutAuditLogsForTests();
    const contract = resolveWorkspaceLayoutContract("executive", 1440);
    const report = runExecutiveLayoutAudit({
      contract,
      selectedObjectId: "revenue",
      pipelineStatus: "ready",
      visiblePanels: {
        sceneInfoHud: true,
        objectInfoHud: true,
        timelineHud: true,
        executiveSceneToolbar: true,
      },
    });
    expect(report.collisionsDetected).toBe(0);
    expect(report.invalidAnchors).toEqual([]);
    expect(report.layoutWarnings).not.toContain("toolbar_collision_detected");
    expect(Object.keys(SCENE_HUD_REGISTRY).length).toBeGreaterThan(5);
  });
});

describe("AD-SCENE-01 toolbar zone invariants", () => {
  it("preserves unrelated anchors, immutability, and fail-closed docking", () => {
    expect(CANONICAL_HUD_ANCHORS.objectInfoHud).toBe("RIGHT_TOP");
    expect(CANONICAL_HUD_ANCHORS.executiveStatusHud).toBe("RIGHT_TOP");
    expect(CANONICAL_HUD_ANCHORS.sceneInfoHud).toBe("LEFT_TOP");
    expect(EXECUTIVE_SCENE_HUD_GRID.topMargin).toBe(12);
    expect(Object.isFrozen(CANONICAL_HUD_ANCHORS)).toBe(true);
    expect(Object.isFrozen(SCENE_HUD_REGISTRY)).toBe(true);
    expect(Object.isFrozen(EXECUTIVE_SCENE_HUD_GRID)).toBe(true);

    expect(hudZoneToDockZone("TOP_CENTER")).toBe("top-center");
    expect(hudZoneToDockZone("RIGHT_TOP")).toBe("top-right");
    // Unknown / fall-through zones fail closed to bottom-right.
    expect(hudZoneToDockZone("NOT_A_ZONE" as never)).toBe("bottom-right");
  });
});

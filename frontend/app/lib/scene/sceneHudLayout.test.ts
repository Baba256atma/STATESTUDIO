import { describe, expect, it } from "vitest";

import { enforceCanonicalAnchor, getCanonicalHudZone } from "./executiveHudLayoutGovernance";
import { runExecutiveLayoutAudit } from "./executiveLayoutAuditRuntime";
import {
  resolveExecutiveTopBaseline,
  resolveUnifiedTopRowPlacement,
} from "./executiveTopAlignmentRuntime";
import { resolveExecutiveTopHudSafeZone } from "./executiveTopHudSafeZone";
import { buildHudLayoutPanels, detectSceneHudCollisions } from "./sceneHudCollisionRuntime";
import { resolveSceneHudVisibility, SCENE_HUD_REGISTRY } from "./sceneHudRegistry";
import { resolveTimelineSafeZone } from "./timelineSafeZoneRuntime";
import { resolveToolbarSafeZone } from "./toolbarSafeZoneRuntime";
import { resolveWorkspaceLayoutContract } from "../ui/workspaceLayoutController";

describe("executiveTopAlignmentRuntime", () => {
  it("uses the same top baseline for all top-row panels", () => {
    const placement = resolveUnifiedTopRowPlacement(1440);
    const sceneTop = resolveExecutiveTopBaseline(1440);
    expect(placement.top).toBe(sceneTop);
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
    expect(detectSceneHudCollisions(panels).length).toBe(0);
  });
});

describe("executiveTopHudSafeZone", () => {
  it("reserves horizontal lanes without lowering the toolbar", () => {
    const zone = resolveExecutiveTopHudSafeZone({
      viewportWidth: 1440,
      sceneInfoVisible: true,
      objectInfoVisible: true,
    });
    expect(zone.top).toBe(12);
    expect(zone.leftLaneEnd).toBeLessThan(zone.rightLaneStart);
  });
});

describe("executiveHudLayoutGovernance", () => {
  it("enforces canonical anchors", () => {
    expect(getCanonicalHudZone("sceneInfoHud")).toBe("LEFT_TOP");
    expect(getCanonicalHudZone("executiveSceneToolbar")).toBe("TOP_CENTER");
    expect(getCanonicalHudZone("objectInfoHud")).toBe("RIGHT_TOP");
    expect(getCanonicalHudZone("timelineHud")).toBe("BOTTOM_CENTER");
    expect(enforceCanonicalAnchor("objectInfoHud", "LEFT_TOP")).toBe("RIGHT_TOP");
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
    expect(status && objectInfo).toBeTruthy();
    expect(status!.rect.y).toBeGreaterThan(objectInfo!.rect.y);
    expect(detectSceneHudCollisions(panels).length).toBe(0);
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
    expect(Object.keys(SCENE_HUD_REGISTRY).length).toBeGreaterThan(5);
  });
});

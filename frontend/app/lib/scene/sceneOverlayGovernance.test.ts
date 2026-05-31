import { describe, expect, it } from "vitest";

import {
  auditSceneOverlaySurfaces,
  shouldRenderSceneOverlay,
  type SceneOverlayGovernanceContext,
} from "./sceneOverlayOwnershipAudit";
import { getExecutiveTopicOwner } from "./executiveOverlayOwnershipRegistry";
import { mayOverlayRemainPermanentlyVisible } from "./sceneOverlayPriority";

const cleanContext = (overrides: Partial<SceneOverlayGovernanceContext> = {}): SceneOverlayGovernanceContext => ({
  cleanPresentation: true,
  sceneInfoVisible: true,
  objectInfoVisible: true,
  timelineVisible: true,
  toolbarVisible: true,
  selectedObjectId: null,
  orientationElapsedSeconds: 5,
  orientationWelcomeVisible: false,
  pipelineStatus: "ready",
  objectCount: 3,
  ...overrides,
});

describe("executiveOverlayOwnershipRegistry", () => {
  it("assigns canonical owners", () => {
    expect(getExecutiveTopicOwner("system_health")).toBe("SCENE_INFO");
    expect(getExecutiveTopicOwner("object_health")).toBe("OBJECT_INFO");
    expect(getExecutiveTopicOwner("timeline_history")).toBe("TIMELINE");
  });
});

describe("sceneOverlayOwnershipAudit", () => {
  it("removes redundant monitoring surfaces in clean Type-C mode", () => {
    const ctx = cleanContext();
    expect(shouldRenderSceneOverlay("executiveOrientationPanel", ctx)).toBe(false);
    expect(shouldRenderSceneOverlay("executiveStatusHud", ctx)).toBe(false);
    expect(shouldRenderSceneOverlay("objectInfoHud", ctx)).toBe(false);
    expect(shouldRenderSceneOverlay("sceneInfoHud", ctx)).toBe(true);
    expect(shouldRenderSceneOverlay("timelineHud", ctx)).toBe(true);
  });

  it("keeps pipeline HUD for processing and error states", () => {
    expect(shouldRenderSceneOverlay("pipelineStatusHud", cleanContext({ pipelineStatus: "processing" }))).toBe(true);
    expect(shouldRenderSceneOverlay("pipelineStatusHud", cleanContext({ pipelineStatus: "error" }))).toBe(true);
    expect(shouldRenderSceneOverlay("pipelineStatusHud", cleanContext({ pipelineStatus: "ready" }))).toBe(false);
  });

  it("shows object info only when an object is selected", () => {
    expect(shouldRenderSceneOverlay("objectInfoHud", cleanContext({ selectedObjectId: "revenue" }))).toBe(true);
  });

  it("audits orientation panel as remove when scene info is visible", () => {
    const entry = auditSceneOverlaySurfaces(cleanContext()).find(
      (item) => item.overlayId === "executiveOrientationPanel"
    );
    expect(entry?.action).toBe("REMOVE");
  });
});

describe("sceneOverlayPriority", () => {
  it("allows only critical and important overlays to remain permanent", () => {
    expect(mayOverlayRemainPermanentlyVisible("sceneInfoHud")).toBe(true);
    expect(mayOverlayRemainPermanentlyVisible("executiveOrientationPanel")).toBe(false);
  });
});

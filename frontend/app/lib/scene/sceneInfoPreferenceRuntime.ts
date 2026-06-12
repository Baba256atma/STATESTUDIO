/** E2:60 — Scene Info collapse preference (load/persist after hydration only). */

import {
  getPanelCollapseState,
  setPanelCollapseState,
} from "../workspace/panelGovernanceRuntime";
import {
  traceScenePanelCollapseWrite,
} from "./scenePanelStateRuntime";
import {
  traceSceneInfoPreference,
  traceSceneInfoCollapsed,
} from "./sceneInfoHydrationContract";
import {
  DEFAULT_OBJECT_INFO_STATE,
  DEFAULT_SCENE_INFO_STATE,
} from "./sceneInfoInitialState";

export function getSceneInfoSSRInitialCollapsed(): boolean {
  return DEFAULT_SCENE_INFO_STATE.collapsed;
}

export function getObjectInfoSSRInitialCollapsed(): boolean {
  return DEFAULT_OBJECT_INFO_STATE.collapsed;
}

export function loadSceneInfoCollapsePreference(): boolean {
  const collapsed = getPanelCollapseState("sceneInfoHud") === "collapsed";
  traceSceneInfoPreference({ collapsed, source: "load_scene_info" });
  return collapsed;
}

export function persistSceneInfoCollapsePreference(
  collapsed: boolean,
  source: "event" | "effect" = "effect"
): void {
  const nextState = collapsed ? "collapsed" : "expanded";
  const previousState = getPanelCollapseState("sceneInfoHud");
  if (previousState === nextState) {
    traceScenePanelCollapseWrite({ collapsed, source, skipped: true });
    return;
  }
  setPanelCollapseState("sceneInfoHud", nextState);
  traceScenePanelCollapseWrite({ collapsed, source });
  traceSceneInfoPreference({ collapsed, source: "persist_scene_info" });
}

export function loadObjectInfoCollapsePreference(): boolean {
  return getPanelCollapseState("objectInfoHud") === "collapsed";
}

export function persistObjectInfoCollapsePreference(collapsed: boolean): void {
  setPanelCollapseState("objectInfoHud", collapsed ? "collapsed" : "expanded");
}

export function hydrateSceneInfoCollapseState(): {
  collapsed: boolean;
  storedPreference: boolean;
} {
  const storedPreference = loadSceneInfoCollapsePreference();
  traceSceneInfoCollapsed({
    serverCollapsed: getSceneInfoSSRInitialCollapsed(),
    clientCollapsed: storedPreference,
    storedPreference,
    hydrated: true,
  });
  return { collapsed: storedPreference, storedPreference };
}

export function hydrateObjectInfoCollapseState(): boolean {
  return loadObjectInfoCollapsePreference();
}

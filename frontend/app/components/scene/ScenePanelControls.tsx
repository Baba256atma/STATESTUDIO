"use client";

import React from "react";

import {
  SCENE_PANEL_COMMAND_STRIP_STYLE,
  scenePanelCommandButtonStyle,
} from "../../lib/hud/scenePanelHeaderActionStyle";
import {
  requestCameraPreset,
  requestSceneNavigationAction,
} from "../../lib/scene/sceneNavigationContract";
import {
  SCENE_PANEL_CONTROL_ACTIONS,
  traceScenePanelControlAction,
  type ScenePanelControlActionId,
} from "../../lib/scene/scenePanelControlsContract";
import {
  traceSceneCommandStrip,
  traceScenePanelCommandSurface,
} from "../../lib/scene/scenePanelCommandSurfaceContract";
import {
  getExecutiveFocusModeServerSnapshot,
  getExecutiveFocusModeSnapshot,
  subscribeExecutiveFocusMode,
  toggleExecutiveFocusMode,
} from "../../lib/workspace/executiveFocusModeRuntime";

export type ScenePanelControlsProps = {
  /** Permanent executive command strip under scene header. */
  variant?: "command-surface";
};

export function ScenePanelControls(_props: ScenePanelControlsProps): React.ReactElement {
  const focusModeActive = React.useSyncExternalStore(
    subscribeExecutiveFocusMode,
    () => getExecutiveFocusModeSnapshot().enabled,
    () => getExecutiveFocusModeServerSnapshot().enabled
  );

  React.useEffect(() => {
    traceScenePanelCommandSurface();
    traceSceneCommandStrip();
  }, []);

  const handleAction = React.useCallback((actionId: ScenePanelControlActionId) => {
    traceScenePanelControlAction(actionId);
    if (actionId === "global_view") {
      requestCameraPreset("global", "panel");
      return;
    }
    if (actionId === "fit_scene") {
      requestSceneNavigationAction("fit_scene", "panel");
      return;
    }
    toggleExecutiveFocusMode("panel");
  }, []);

  return (
    <div
      data-nx-section="scene-controls"
      data-nx-scene-controls-placement="command-surface"
      data-nx-scene-command-layout="horizontal"
      data-nx-scene-command-display="label"
      role="group"
      aria-label="Scene controls"
      style={SCENE_PANEL_COMMAND_STRIP_STYLE}
    >
      {SCENE_PANEL_CONTROL_ACTIONS.map((entry) => {
        const isFocus = entry.id === "focus";
        const active = isFocus && focusModeActive;
        return (
          <button
            key={entry.id}
            type="button"
            aria-pressed={isFocus ? active : undefined}
            aria-label={entry.title}
            title={entry.title}
            onClick={() => handleAction(entry.id)}
            style={scenePanelCommandButtonStyle(isFocus, active)}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}

export default ScenePanelControls;

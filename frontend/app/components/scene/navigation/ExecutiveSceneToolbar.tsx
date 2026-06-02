"use client";

import React, { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import {
  requestCameraPreset,
  requestSceneNavigationAction,
} from "../../../lib/scene/sceneNavigationContract";
import {
  EXECUTIVE_TOOLBAR_ACTIONS,
  logSceneToolbarActionRemoved,
  logSceneToolbarOwnership,
  logSceneToolbarSimplified,
  REMOVED_SCENE_TOOLBAR_ACTIONS,
  REMOVED_SCENE_TOOLBAR_MODES,
} from "../../../lib/scene/navigation/sceneToolbarActionRegistry";
import {
  executiveToolbarActionStyle,
  executiveToolbarLabelStyle,
  executiveToolbarSegmentStyle,
  executiveToolbarShellStyle,
} from "../../../lib/scene/navigation/executiveToolbarCompactLayout";
import { logExecutiveToolbarFinalized } from "../../../lib/scene/navigation/executiveNavigationGovernance";
import {
  getExecutiveFocusModeServerSnapshot,
  getExecutiveFocusModeSnapshot,
  subscribeExecutiveFocusMode,
  toggleExecutiveFocusMode,
} from "../../../lib/workspace/executiveFocusModeRuntime";
import {
  getWorkspaceViewMode,
  getWorkspaceViewModeServerSnapshot,
  setWorkspaceViewMode,
  subscribeWorkspaceViewMode,
} from "../../../lib/workspace/workspaceViewModeRuntime";
import { logToolbarViewModeClick } from "../../../lib/workspace/workspaceModeValidation";
import type { WorkspaceViewMode } from "../../../lib/workspace/workspaceViewModeTypes";
import { devLogOnSignatureChange } from "../../../lib/runtime/diagnosticIdleGate";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import { logSceneNavigationToolbarMounted } from "../../../lib/ui/sceneNavigationInstrumentation";
import { sceneToolbarDividerStyle, sceneToolbarShellStyle } from "./ExecutiveSceneToolbar.theme";

export type ExecutiveSceneToolbarProps = {
  themeMode?: NexoraHudThemeMode;
  density?: "desktop" | "tablet" | "mobile";
};

export function ExecutiveSceneToolbar(props: ExecutiveSceneToolbarProps): React.ReactElement {
  const mountedRef = useRef(false);
  const theme = useSceneHudTheme(props.themeMode ?? "night");
  const density = props.density ?? "desktop";
  const showLabels = density !== "mobile";
  const workspaceViewMode = useSyncExternalStore(
    subscribeWorkspaceViewMode,
    getWorkspaceViewMode,
    getWorkspaceViewModeServerSnapshot
  );
  const focusMode = useSyncExternalStore(
    subscribeExecutiveFocusMode,
    getExecutiveFocusModeSnapshot,
    getExecutiveFocusModeServerSnapshot
  );

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logSceneNavigationToolbarMounted();
    logSceneToolbarSimplified();
    logSceneToolbarOwnership();
    logExecutiveToolbarFinalized();
    REMOVED_SCENE_TOOLBAR_MODES.forEach((mode) => {
      logSceneToolbarActionRemoved(mode, "mode_removed_from_toolbar_e2_51");
    });
    REMOVED_SCENE_TOOLBAR_ACTIONS.forEach((action) => {
      logSceneToolbarActionRemoved(action, "removed_from_toolbar_e2_53");
    });
  }, []);

  const handleViewMode = useCallback((mode: WorkspaceViewMode) => {
    devLogOnSignatureChange(mode === "2D" ? "[E2:87][View2D]" : "[E2:87][View3D]", `${workspaceViewMode}->${mode}`, {
      requestedMode: mode,
      currentModeBefore: workspaceViewMode,
      source: "toolbar",
    });
    logToolbarViewModeClick(mode);
    setWorkspaceViewMode(mode, "toolbar");
  }, [workspaceViewMode]);

  const handleToolbarAction = useCallback((actionId: (typeof EXECUTIVE_TOOLBAR_ACTIONS)[number]["id"]) => {
    if (actionId === "focus_mode") {
      toggleExecutiveFocusMode("toolbar");
      return;
    }
    if (actionId === "global_view") {
      requestCameraPreset("global", "toolbar");
      return;
    }
    const action = EXECUTIVE_TOOLBAR_ACTIONS.find((entry) => entry.id === actionId);
    if (action?.navigationAction) {
      requestSceneNavigationAction(action.navigationAction, "toolbar");
    }
  }, []);

  return (
    <div
      data-nx="executive-scene-toolbar"
      data-hud="scene-navigation"
      data-nx-theme={theme.mode}
      data-nx-view-mode={workspaceViewMode}
      data-nx-focus-mode={focusMode.enabled ? "active" : "inactive"}
      style={executiveToolbarShellStyle(theme, sceneToolbarShellStyle(theme))}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      {(["2D", "3D"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          aria-label={`${mode} workspace view`}
          aria-pressed={workspaceViewMode === mode}
          title={mode === "2D" ? "Strategic 2D View" : "Immersive 3D View"}
          onClick={() => handleViewMode(mode)}
          style={executiveToolbarSegmentStyle(workspaceViewMode === mode, theme)}
        >
          {mode}
        </button>
      ))}

      <span aria-hidden style={sceneToolbarDividerStyle(theme)} />

      {EXECUTIVE_TOOLBAR_ACTIONS.map((action) => {
        const active = action.id === "focus_mode" && focusMode.enabled;
        return (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            aria-pressed={active}
            title={action.label}
            onClick={() => handleToolbarAction(action.id)}
            style={executiveToolbarActionStyle(theme, active)}
          >
            <span aria-hidden>{action.icon}</span>
            {showLabels ? <span style={executiveToolbarLabelStyle()}>{action.label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default ExecutiveSceneToolbar;

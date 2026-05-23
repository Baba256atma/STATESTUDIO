"use client";

import React, { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import {
  focusObject,
  requestCameraPreset,
  requestSceneNavigationAction,
  requestSceneNavigationMode,
} from "../../../lib/scene/sceneNavigationContract";
import {
  getSceneNavigationToolbarServerSnapshot,
  getSceneNavigationToolbarSnapshot,
  subscribeSceneNavigationStore,
} from "../../../lib/scene/sceneNavigationStore";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import { bindDocumentListener } from "../../../lib/dom/domListenerLifecycle";
import { logSceneNavigationToolbarMounted } from "../../../lib/ui/sceneNavigationInstrumentation";
import {
  CAMERA_PRESET_DEFINITIONS,
  SCENE_NAVIGATION_ACTIONS,
  SCENE_NAVIGATION_MODES,
  type SceneNavigationToolbarModel,
} from "./ExecutiveSceneToolbar.types";
import {
  sceneToolbarActionStyle,
  sceneToolbarDividerStyle,
  sceneToolbarPresetStyle,
  sceneToolbarSegmentStyle,
  sceneToolbarShellStyle,
} from "./ExecutiveSceneToolbar.theme";

export type ExecutiveSceneToolbarProps = {
  themeMode?: NexoraHudThemeMode;
  selectedObjectId?: string | null;
  density?: "desktop" | "tablet" | "mobile";
  onCreateImpactPath?: (sourceObjectId?: string | null) => void;
};

function useSceneNavigationToolbarState(): Pick<
  SceneNavigationToolbarModel,
  "navigationMode" | "selectedPresetId"
> {
  return useSyncExternalStore(
    subscribeSceneNavigationStore,
    getSceneNavigationToolbarSnapshot,
    getSceneNavigationToolbarServerSnapshot
  );
}

export function ExecutiveSceneToolbar(props: ExecutiveSceneToolbarProps): React.ReactElement {
  const mountedRef = useRef(false);
  const theme = useSceneHudTheme(props.themeMode ?? "night");
  const density = props.density ?? "desktop";
  const { navigationMode, selectedPresetId } = useSceneNavigationToolbarState();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const hasSelection = Boolean(props.selectedObjectId?.trim());

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logSceneNavigationToolbarMounted();
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (typeof document === "undefined" || document == null) return;
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    onFullscreenChange();
    return bindDocumentListener("fullscreenchange", onFullscreenChange, undefined, {
      component: "ExecutiveSceneToolbar",
      eventType: "fullscreenchange",
    });
  }, []);

  const presetLabel = useMemo(
    () => CAMERA_PRESET_DEFINITIONS.find((preset) => preset.id === selectedPresetId)?.label ?? "Global View",
    [selectedPresetId]
  );

  const handleFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await (document.documentElement.requestFullscreen?.() ?? Promise.resolve());
      }
    } catch {
      // Ignore unsupported fullscreen transitions.
    }
    requestSceneNavigationAction("fullscreen", "toolbar");
  }, []);

  const visibleActions = useMemo(() => {
    if (density === "mobile") {
      return SCENE_NAVIGATION_ACTIONS.filter((action) =>
        ["focus_selection", "fit_scene", "reset_view", "fullscreen"].includes(action.id)
      );
    }
    if (density === "tablet") {
      return SCENE_NAVIGATION_ACTIONS.filter((action) => action.id !== "zoom_out" && action.id !== "zoom_in");
    }
    return SCENE_NAVIGATION_ACTIONS;
  }, [density]);

  const visibleModes = useMemo(() => {
    if (density === "mobile") {
      return SCENE_NAVIGATION_MODES.filter((mode) => mode.id === "select" || mode.id === "orbit");
    }
    return SCENE_NAVIGATION_MODES;
  }, [density]);

  return (
    <div
      data-nx="executive-scene-toolbar"
      data-hud="scene-navigation"
      data-nx-theme={theme.mode}
      style={sceneToolbarShellStyle(theme)}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      {visibleModes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          aria-label={mode.label}
          aria-pressed={navigationMode === mode.id}
          title={mode.label}
          onClick={() => requestSceneNavigationMode(mode.id, "toolbar")}
          style={sceneToolbarSegmentStyle(theme, navigationMode === mode.id)}
        >
          <span aria-hidden>{mode.icon}</span>
          {density === "desktop" ? <span>{mode.label}</span> : null}
        </button>
      ))}

      <span aria-hidden style={sceneToolbarDividerStyle(theme)} />

      <button
        type="button"
        aria-label="Create Impact Path"
        title="Create Impact Path"
        disabled={!hasSelection || !props.onCreateImpactPath}
        onClick={() => props.onCreateImpactPath?.(props.selectedObjectId ?? null)}
        style={{
          ...sceneToolbarActionStyle(theme),
          opacity: hasSelection && props.onCreateImpactPath ? 1 : 0.45,
          cursor: hasSelection && props.onCreateImpactPath ? "pointer" : "not-allowed",
        }}
      >
        <span aria-hidden>↯</span>
        {density === "desktop" ? <span>Impact</span> : null}
      </button>

      <span aria-hidden style={sceneToolbarDividerStyle(theme)} />

      {visibleActions.map((action) => {
        const disabled = action.id === "focus_selection" && !hasSelection;
        const onClick = () => {
          if (action.id === "fullscreen") {
            void handleFullscreen();
            return;
          }
          if (action.id === "focus_selection") {
            if (props.selectedObjectId) focusObject(props.selectedObjectId, "toolbar");
            return;
          }
          requestSceneNavigationAction(action.id, "toolbar");
        };
        return (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            title={action.label}
            disabled={disabled}
            onClick={onClick}
            style={{
              ...sceneToolbarActionStyle(theme),
              opacity: disabled ? 0.45 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <span aria-hidden>{action.icon}</span>
          </button>
        );
      })}

      {density !== "mobile" ? (
        <>
          <span aria-hidden style={sceneToolbarDividerStyle(theme)} />
          <select
            aria-label="Camera preset"
            title="Camera preset"
            value={selectedPresetId}
            onChange={(event) => requestCameraPreset(event.target.value as typeof selectedPresetId, "toolbar")}
            style={sceneToolbarPresetStyle(theme)}
          >
            {CAMERA_PRESET_DEFINITIONS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </>
      ) : (
        <button
          type="button"
          aria-label={`Camera preset: ${presetLabel}`}
          title={`Camera preset: ${presetLabel}`}
          onClick={() => {
            const currentIndex = CAMERA_PRESET_DEFINITIONS.findIndex((preset) => preset.id === selectedPresetId);
            const next = CAMERA_PRESET_DEFINITIONS[(currentIndex + 1) % CAMERA_PRESET_DEFINITIONS.length];
            if (next) requestCameraPreset(next.id, "toolbar");
          }}
          style={sceneToolbarPresetStyle(theme)}
        >
          {presetLabel}
        </button>
      )}

      {isFullscreen ? (
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: theme.success,
            boxShadow:
              theme.mode === "night"
                ? `0 0 8px color-mix(in srgb, ${theme.success} 55%, transparent)`
                : undefined,
            flexShrink: 0,
          }}
        />
      ) : null}
    </div>
  );
}

export default ExecutiveSceneToolbar;

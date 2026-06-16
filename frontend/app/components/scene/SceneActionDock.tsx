"use client";

import React from "react";

import { formatObjectPanelTitle } from "../../lib/object-panel/objectPanelTitleContract";
import { emitObjectPanelActionRequest } from "../../lib/object-panel/objectPanelActionRouterContract";
import {
  SCENE_ACTION_DOCK_HEADER_ACTIONS,
  type SceneActionDockHeaderAction,
} from "../../lib/object-panel/objectPanelHeaderScenarioHotfixContract";
import { HudPanelToggleButton } from "../hud/HudPanelToggleButton";
import type { NexoraHudThemeTokens } from "../../lib/scene/nexoraHudTheme";
import { nexoraHudShellStyle } from "../../lib/scene/nexoraHudTheme";
import { SCENE_HUD_ZONE_METRICS } from "../../lib/scene/sceneHudZoneContract";

export type SceneActionDockActionId = SceneActionDockHeaderAction["id"];

type Props = {
  objectId: string;
  objectName: string;
  theme: NexoraHudThemeTokens;
  focusModeActive?: boolean;
  onExpandPanel?: () => void;
};

function dockButtonStyle(
  theme: NexoraHudThemeTokens,
  active = false
): React.CSSProperties {
  return {
    flex: "1 1 0",
    minWidth: 0,
    minHeight: 34,
    padding: "0 6px",
    borderRadius: 8,
    border: active ? "1px solid rgba(56,189,248,0.42)" : `1px solid ${theme.controlBorder}`,
    background: active
      ? "color-mix(in srgb, var(--nx-accent-soft) 36%, transparent)"
      : theme.buttonBackground,
    color: active ? theme.textPrimary : theme.buttonText,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    cursor: "pointer",
    lineHeight: 1.1,
  };
}

export function SceneActionDock(props: Props): React.ReactElement {
  const objectId = props.objectId.trim();

  const handleAction = (entry: SceneActionDockHeaderAction) => {
    if (entry.id === "object") {
      props.onExpandPanel?.();
      return;
    }
    if (entry.dashboardAction) {
      emitObjectPanelActionRequest({
        action: entry.dashboardAction,
        objectId,
        objectName: props.objectName,
      });
    }
  };

  return (
    <div
      data-nx="scene-action-dock"
      data-nx-object-id={objectId}
      data-object-panel-header-scenario-removed="true"
      style={nexoraHudShellStyle(
        props.theme,
        {
          width: SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth,
          maxWidth: "min(280px, 58vw)",
          padding: "8px 10px 10px",
          overflow: "hidden",
        },
        { surface: "objectInfoHud", edgeAnchor: "TOP_RIGHT" }
      )}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: props.theme.label,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {formatObjectPanelTitle(props.objectName)}
          </div>
        </div>
        <HudPanelToggleButton
          panelId="object"
          expanded={false}
          onClick={() => props.onExpandPanel?.()}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${SCENE_ACTION_DOCK_HEADER_ACTIONS.length}, minmax(0, 1fr))`,
          gap: 6,
        }}
      >
        {SCENE_ACTION_DOCK_HEADER_ACTIONS.map((entry) => {
          const active = entry.id === "focus" && props.focusModeActive;
          return (
            <button
              key={entry.id}
              type="button"
              aria-pressed={active}
              aria-label={entry.label}
              title={entry.label}
              onClick={() => handleAction(entry)}
              style={dockButtonStyle(props.theme, active)}
            >
              {entry.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SceneActionDock;

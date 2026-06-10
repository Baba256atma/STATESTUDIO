"use client";

import React from "react";

import { emitExecutiveObjectPanelAction } from "../../lib/object-panel/executiveActionPanelContract";
import { emitObjectPanelActionRequest } from "../../lib/object-panel/objectPanelActionRouterContract";
import type { NexoraHudThemeTokens } from "../../lib/scene/nexoraHudTheme";
import { nexoraHudShellStyle } from "../../lib/scene/nexoraHudTheme";
import { SCENE_HUD_ZONE_METRICS } from "../../lib/scene/sceneHudZoneContract";

export type SceneActionDockActionId = "object" | "focus" | "explain" | "scenario";

const DOCK_ACTIONS: ReadonlyArray<{
  id: SceneActionDockActionId;
  label: string;
  actionId?: string;
  dashboardAction?: "focus" | "scenario";
}> = Object.freeze([
  { id: "object", label: "Object" },
  { id: "focus", label: "Focus", dashboardAction: "focus" },
  { id: "explain", label: "Explain", actionId: "explain_object" },
  { id: "scenario", label: "Scenario", dashboardAction: "scenario" },
]);

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

  const handleAction = (entry: (typeof DOCK_ACTIONS)[number]) => {
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
      return;
    }
    if (entry.actionId) {
      emitExecutiveObjectPanelAction(entry.actionId, objectId);
    }
  };

  return (
    <div
      data-nx="scene-action-dock"
      data-nx-object-id={objectId}
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
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: props.theme.label,
            }}
          >
            Object Panel
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 12,
              fontWeight: 800,
              color: props.theme.textPrimary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {props.objectName}
          </div>
        </div>
        <button
          type="button"
          aria-label="Expand object panel"
          title="Expand object panel"
          onClick={props.onExpandPanel}
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 8,
            border: `1px solid ${props.theme.buttonBorder}`,
            background: props.theme.buttonBackground,
            color: props.theme.buttonText,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          ⛶
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
        {DOCK_ACTIONS.map((entry) => {
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

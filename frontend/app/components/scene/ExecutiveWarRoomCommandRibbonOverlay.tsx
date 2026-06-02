"use client";

import React from "react";

import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { nexoraHudShellStyle } from "../../lib/scene/nexoraHudTheme";
import { useFocusHudPresentation } from "../../lib/workspace/useFocusHudPresentation";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import type {
  ExecutiveWarRoomCommandId,
  ExecutiveWarRoomFocusMode,
  ExecutiveWarRoomHudModel,
} from "../../lib/scene/warroom/executiveWarRoomTypes";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { SceneHudOverlayRoot } from "./SceneHudOverlayRoot";

export type ExecutiveWarRoomCommandRibbonOverlayProps = {
  model: ExecutiveWarRoomHudModel;
  themeMode?: NexoraHudThemeMode;
  onCommand?: (commandId: ExecutiveWarRoomCommandId) => void;
  onFocusModeChange?: (mode: ExecutiveWarRoomFocusMode) => void;
};

function statusColor(level: ExecutiveWarRoomHudModel["statusLevel"], theme: ReturnType<typeof useSceneHudTheme>): string {
  if (level === "critical") return "#d86b6b";
  if (level === "elevated") return "#d4a24f";
  if (level === "warning") return "#c9b35a";
  return theme.accent;
}

function commandButtonStyle(
  theme: ReturnType<typeof useSceneHudTheme>,
  enabled: boolean,
  active = false
): React.CSSProperties {
  return {
    borderRadius: 8,
    border: `1px solid ${active ? theme.accent : theme.buttonBorder}`,
    background: active ? "color-mix(in srgb, var(--nx-accent-soft) 36%, transparent)" : theme.buttonBackground,
    color: theme.buttonText,
    padding: "5px 10px",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.45,
    whiteSpace: "nowrap",
  };
}

export function ExecutiveWarRoomCommandRibbonOverlay(
  props: ExecutiveWarRoomCommandRibbonOverlayProps
): React.ReactElement {
  const { getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("executiveStatusHud");
  const focusHud = useFocusHudPresentation("executiveStatusHud", placement.visible);
  const theme = useSceneHudTheme(props.themeMode ?? "night");
  const statusTone = statusColor(props.model.statusLevel, theme);
  const focusModes: ExecutiveWarRoomFocusMode[] = [
    "operations",
    "risk",
    "scenario",
    "recovery",
    "growth",
    "strategic",
  ];

  if (!placement.visible && !focusHud.preserveMount) return <></>;

  return (
    <SceneHudOverlayRoot
      panelId="executiveWarRoomRibbon"
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 7,
        pointerEvents: "none",
        width: "min(920px, calc(100vw - 420px))",
        ...focusHud.style,
      }}
    >
      <div
        data-nx="executive-war-room-ribbon"
        style={{
          ...nexoraHudShellStyle(
            theme,
            {
              width: "100%",
              padding: "8px 10px",
              display: "grid",
              gap: 8,
            },
            {
              surface: "executiveStatusHud",
              edgeAnchor: "CENTER_FLOATING",
            }
          ),
          pointerEvents: "auto",
        }}
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  color: theme.label,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Executive War Room
              </span>
              <span
                style={{
                  color: statusTone,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {props.model.statusLevel}
              </span>
              <span style={{ color: theme.textSecondary, fontSize: 10, fontWeight: 700 }}>
                {props.model.mission.missionLabel}
              </span>
            </div>
            <div
              style={{
                color: theme.textPrimary,
                fontSize: 12,
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {props.model.situation.headline}
            </div>
            <div
              style={{
                color: theme.textSecondary,
                fontSize: 11,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {props.model.advisorInsight ?? props.model.strategic.headline}
            </div>
          </div>
          <div style={{ display: "grid", gap: 2, textAlign: "right", flexShrink: 0 }}>
            <span style={{ color: theme.textSecondary, fontSize: 10 }}>Strategic {Math.round(props.model.kpis.strategicScore * 100)}</span>
            <span style={{ color: theme.textSecondary, fontSize: 10 }}>Readiness {Math.round(props.model.kpis.operationalReadiness * 100)}</span>
            <span style={{ color: theme.textSecondary, fontSize: 10 }}>Risk {Math.round(props.model.kpis.riskScore * 100)}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          {props.model.commands.map((command) => (
            <button
              key={command.id}
              type="button"
              title={command.hint}
              aria-label={command.label}
              disabled={!command.enabled}
              onClick={() => props.onCommand?.(command.id)}
              style={commandButtonStyle(theme, command.enabled)}
            >
              {command.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          {focusModes.map((mode) => (
            <button
              key={mode}
              type="button"
              aria-label={`${mode} focus mode`}
              onClick={() => props.onFocusModeChange?.(mode)}
              style={commandButtonStyle(theme, true, props.model.mission.focusMode === mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </SceneHudOverlayRoot>
  );
}

export default ExecutiveWarRoomCommandRibbonOverlay;

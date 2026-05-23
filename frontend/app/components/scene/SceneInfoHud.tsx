"use client";

import React from "react";

import {
  SCENE_INFO_FRSI_LABELS,
  SCENE_INFO_FRSI_PLACEHOLDER,
  SCENE_INFO_QUICK_ACTIONS,
  SCENE_INFO_VIEW_OPTIONS,
  type SceneInfoFrsiMetrics,
} from "../../lib/scene/sceneInfoHudTypes";
import {
  SCENE_INFO_LAYER_KEYS,
  SCENE_INFO_LAYER_LABELS,
  setSceneInfoLayerVisibility,
  type SceneInfoLayerKey,
} from "../../lib/scene/sceneInfoLayerVisibility";
import { useSceneInfoLayerVisibility } from "../../lib/scene/useSceneInfoLayerVisibility";
import { useViewportWidthListener } from "../../lib/dom/useDomListener";
import { resolveExecutiveWorkspaceBreakpoint } from "../../lib/ui/executiveWorkspaceLayout";
import type { PanelSizeMode } from "../../lib/ui/workspaceLayoutTypes";
import {
  logSceneInfoHudCollapsed,
  logSceneInfoHudExpanded,
  logSceneInfoHudMounted,
  logSceneLayerVisibilityChanged,
} from "../../lib/ui/sceneInfoHudInstrumentation";
import {
  nexoraHudSectionLabelStyle,
  nexoraHudShellStyle,
  type NexoraHudThemeMode,
} from "../../lib/scene/nexoraHudTheme";
import { sceneHudChipStyle, sceneHudControlButtonStyle, resolveSceneThemeTokens } from "../../lib/theme/sceneThemeTokens";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";
import { nx } from "../ui/nexoraTheme";

export type SceneInfoHudProps = {
  currentViewId?: string | null;
  currentViewLabel?: string | null;
  frsiMetrics?: SceneInfoFrsiMetrics;
  themeMode?: NexoraHudThemeMode;
  panelSizeMode?: PanelSizeMode;
  onAddObjectClick?: () => void;
  onCreateSystemClick?: () => void;
};

const sectionLabelStyle = (theme: ReturnType<typeof useSceneHudTheme>): React.CSSProperties => ({
  ...nexoraHudSectionLabelStyle(theme),
  marginBottom: 6,
});

const metricRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 6,
  alignItems: "center",
  padding: "3px 0",
};

const layerToggleStyle = (active: boolean, tokens: SceneThemeTokens): React.CSSProperties =>
  sceneHudChipStyle(tokens, active);

const actionButtonStyle = (tokens: SceneThemeTokens): React.CSSProperties => ({
  ...sceneHudControlButtonStyle(tokens),
  flex: "1 1 45%",
  minWidth: 0,
  opacity: 0.72,
  cursor: "not-allowed",
});

function resolveViewLabel(viewId: string | null | undefined, viewLabel: string | null | undefined): string {
  if (viewLabel?.trim()) return viewLabel.trim();
  const matched = SCENE_INFO_VIEW_OPTIONS.find((option) => option.id === viewId);
  if (matched) return matched.label;
  return SCENE_INFO_VIEW_OPTIONS[0]?.label ?? "Global View";
}

export function SceneInfoHud(props: SceneInfoHudProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const layerVisibility = useSceneInfoLayerVisibility();
  const [viewportWidth, setViewportWidth] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  const [collapsed, setCollapsed] = React.useState(false);
  const [selectedViewId, setSelectedViewId] = React.useState(
    () => props.currentViewId?.trim() || SCENE_INFO_VIEW_OPTIONS[0]?.id || "global"
  );

  const breakpoint = resolveExecutiveWorkspaceBreakpoint(viewportWidth);
  const isMobile = breakpoint === "mobile";
  const frsi = props.frsiMetrics ?? SCENE_INFO_FRSI_PLACEHOLDER;
  const currentViewLabel = resolveViewLabel(selectedViewId, props.currentViewLabel);

  React.useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logSceneInfoHudMounted();
  }, []);

  React.useEffect(() => {
    if (!props.currentViewId?.trim()) return;
    setSelectedViewId(props.currentViewId.trim());
  }, [props.currentViewId]);

  useViewportWidthListener(setViewportWidth, "SceneInfoHud");

  React.useEffect(() => {
    if (!isMobile) return;
    setCollapsed(true);
  }, [isMobile]);

  const handleToggleCollapsed = React.useCallback(() => {
    setCollapsed((value) => {
      if (value) {
        logSceneInfoHudExpanded();
      } else {
        logSceneInfoHudCollapsed();
      }
      return !value;
    });
  }, []);

  const handleLayerToggle = React.useCallback((key: SceneInfoLayerKey) => {
    const nextVisible = !layerVisibility[key];
    setSceneInfoLayerVisibility(key, nextVisible);
    logSceneLayerVisibilityChanged({ layer: key, visible: nextVisible });
  }, [layerVisibility]);

  const handleViewChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedViewId(event.target.value);
  }, []);

  const panelSizeMode = props.panelSizeMode ?? "normal";
  const compactWidth =
    panelSizeMode === "expanded"
      ? isMobile
        ? 200
        : breakpoint === "tablet"
          ? 248
          : 280
      : panelSizeMode === "compact"
        ? isMobile
          ? 148
          : breakpoint === "tablet"
            ? 180
            : 200
        : isMobile
          ? 168
          : breakpoint === "tablet"
            ? 208
            : 232;

  if (collapsed) {
    return (
      <div
        data-nx="scene-info-hud"
        data-hud="scene-info"
        data-nx-state="collapsed"
        style={{
          ...nexoraHudShellStyle(hudTheme, {
            width: 44,
            maxWidth: 44,
            padding: "8px 6px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            lineHeight: 1.4,
            overflow: "hidden",
          }),
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Expand scene info"
          title="Expand scene info"
          onClick={handleToggleCollapsed}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            border: `1px solid ${nx.border}`,
            background: nx.btnSecondaryBg,
            color: nx.textSoft,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          ⟩
        </button>
        <span
          aria-hidden
          style={{
            writingMode: "vertical-rl",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: nx.lowMuted,
          }}
        >
          Scene
        </span>
      </div>
    );
  }

  return (
    <div
      data-nx="scene-info-hud"
      data-hud="scene-info"
      data-nx-state="expanded"
      style={nexoraHudShellStyle(hudTheme, {
        width: compactWidth,
        maxWidth: "min(92vw, 260px)",
        fontSize: 11,
        lineHeight: 1.4,
        overflow: "hidden",
      })}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "9px 10px",
          borderBottom: `1px solid ${hudTheme.panelBorder}`,
          background: hudTheme.headerBackground,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: nx.text,
          }}
        >
          Scene Info
        </span>
        <button
          type="button"
          aria-label="Collapse scene info"
          title="Collapse scene info"
          onClick={handleToggleCollapsed}
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            border: `1px solid ${nx.borderSoft}`,
            background: "transparent",
            color: nx.muted,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ⟨
        </button>
      </header>

      <div style={{ padding: "10px 10px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        <section data-nx-section="current-view">
          <div style={sectionLabelStyle(hudTheme)}>Current View</div>
          <select
            aria-label="Scene view"
            value={selectedViewId}
            onChange={handleViewChange}
            style={{
              width: "100%",
              borderRadius: 8,
              border: `1px solid ${nx.borderSoft}`,
              background: "color-mix(in srgb, var(--nx-bg-control) 75%, transparent)",
              color: nx.text,
              fontSize: 11,
              fontWeight: 600,
              padding: "6px 8px",
              outline: "none",
            }}
          >
            {SCENE_INFO_VIEW_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={{ marginTop: 4, fontSize: 10, color: nx.lowMuted }}>{currentViewLabel}</div>
        </section>

        <section data-nx-section="frsi">
          <div style={sectionLabelStyle(hudTheme)}>FRSI Breakdown</div>
          <div
            style={{
              borderRadius: 9,
              border: `1px solid ${nx.borderSoft}`,
              background: "color-mix(in srgb, var(--nx-bg-control) 55%, transparent)",
              padding: "6px 8px",
            }}
          >
            {(Object.keys(SCENE_INFO_FRSI_LABELS) as Array<keyof typeof SCENE_INFO_FRSI_LABELS>).map((key) => (
              <div key={key} style={metricRowStyle}>
                <span style={{ color: nx.muted }}>{SCENE_INFO_FRSI_LABELS[key]}</span>
                <span style={{ color: nx.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {frsi[key].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section data-nx-section="layers">
          <div style={sectionLabelStyle(hudTheme)}>Layer Controls</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {SCENE_INFO_LAYER_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={layerVisibility[key]}
                onClick={() => handleLayerToggle(key)}
                style={layerToggleStyle(layerVisibility[key], tokens)}
              >
                {SCENE_INFO_LAYER_LABELS[key]}
              </button>
            ))}
          </div>
        </section>

        <section data-nx-section="quick-actions">
          <div style={sectionLabelStyle(hudTheme)}>Quick Scene Actions</div>
          {props.onAddObjectClick ? (
            <button
              type="button"
              aria-label="Add Object"
              title="Add Object from executive catalog"
              onClick={props.onAddObjectClick}
              style={{
                ...sceneHudControlButtonStyle(tokens),
                width: "100%",
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              + Add Object
            </button>
          ) : null}
          {props.onCreateSystemClick ? (
            <button
              type="button"
              aria-label="Create System"
              title="Generate a system from an executive domain template"
              onClick={props.onCreateSystemClick}
              style={{
                ...sceneHudControlButtonStyle(tokens),
                width: "100%",
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              Create System
            </button>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {SCENE_INFO_QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                disabled
                title={`${action.label} — reserved for E2:10`}
                style={actionButtonStyle(tokens)}
              >
                {action.label}
              </button>
            ))}
          </div>
          {/* E2:10 scene actions */}
          {/* E3 operational overlays */}
          {/* D3 live data overlays */}
          {/* simulation visualization */}
        </section>
      </div>
    </div>
  );
}

export default SceneInfoHud;

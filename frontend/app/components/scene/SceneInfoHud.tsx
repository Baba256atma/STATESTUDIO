"use client";

import React from "react";

import {
  SCENE_INFO_FRSI_LABELS,
  SCENE_INFO_FRSI_PLACEHOLDER,
  type SceneInfoFrsiMetrics,
} from "../../lib/scene/sceneInfoHudTypes";
import {
  SCENE_INFO_LAYER_KEYS,
  SCENE_INFO_LAYER_ICONS,
  SCENE_INFO_LAYER_LABELS,
  setSceneInfoLayerVisibility,
  type SceneInfoLayerKey,
} from "../../lib/scene/sceneInfoLayerVisibility";
import {
  markNoiseRemoved,
  shouldSurfaceOwnInformation,
} from "../../lib/workspace/minimalism";
import { useSceneInfoLayerVisibility } from "../../lib/scene/useSceneInfoLayerVisibility";
import { DEFAULT_SCENE_INFO_STATE } from "../../lib/scene/sceneInfoInitialState";
import { traceSceneInfoHydration } from "../../lib/scene/sceneInfoHydrationContract";
import {
  hydrateSceneInfoCollapseState,
  persistSceneInfoCollapsePreference,
} from "../../lib/scene/sceneInfoPreferenceRuntime";
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
import {
  registerGovernedPanel,
} from "../../lib/workspace/panelGovernanceRuntime";

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

export function SceneInfoHud(props: SceneInfoHudProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const layerVisibility = useSceneInfoLayerVisibility();
  const [viewportWidth, setViewportWidth] = React.useState(DEFAULT_SCENE_INFO_STATE.viewportWidth);
  const [collapsed, setCollapsed] = React.useState(DEFAULT_SCENE_INFO_STATE.collapsed);
  const [sceneInfoHydrated, setSceneInfoHydrated] = React.useState(false);

  const breakpoint = resolveExecutiveWorkspaceBreakpoint(viewportWidth);
  const isMobile = breakpoint === "mobile";
  const frsi = props.frsiMetrics ?? SCENE_INFO_FRSI_PLACEHOLDER;
  const showFrsiBreakdown = shouldSurfaceOwnInformation("frsi_breakdown", { surface: "scene_info" });

  React.useEffect(() => {
    markNoiseRemoved("scene_info_disabled_actions", "scene_info");
  }, []);

  React.useEffect(() => {
    const { collapsed: storedCollapsed } = hydrateSceneInfoCollapseState();
    setCollapsed(storedCollapsed);
    setSceneInfoHydrated(true);
    traceSceneInfoHydration({ hydrated: true, source: "preference_restore" });
  }, []);

  React.useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logSceneInfoHudMounted();
  }, []);

  useViewportWidthListener(setViewportWidth, "SceneInfoHud");

  React.useEffect(() => {
    if (!sceneInfoHydrated) return;
    if (!isMobile) return;
    setCollapsed(true);
    persistSceneInfoCollapsePreference(true);
  }, [isMobile, sceneInfoHydrated]);

  React.useEffect(() => {
    registerGovernedPanel({
      panelId: "sceneInfoHud",
      visible: true,
      collapsed,
      anchorZone: "top-left",
      priority: 10,
      title: "Scene Info",
    });
  }, [collapsed]);

  const handleToggleCollapsed = React.useCallback(() => {
    setCollapsed((value) => {
      const next = !value;
      persistSceneInfoCollapsePreference(next);
      if (value) {
        logSceneInfoHudExpanded();
      } else {
        logSceneInfoHudCollapsed();
      }
      return next;
    });
  }, []);

  const handleLayerToggle = React.useCallback((key: SceneInfoLayerKey) => {
    const nextVisible = !layerVisibility[key];
    setSceneInfoLayerVisibility(key, nextVisible);
    logSceneLayerVisibilityChanged({ layer: key, visible: nextVisible });
  }, [layerVisibility]);

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
          ...nexoraHudShellStyle(
            hudTheme,
            {
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
            },
            { surface: "sceneInfoHud", collapsed: true }
          ),
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
          ▶
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
      style={{
        ...nexoraHudShellStyle(
          hudTheme,
          {
            width: compactWidth,
            maxWidth: "min(92vw, 260px)",
            fontSize: 11,
            lineHeight: 1.4,
            overflow: "hidden",
          },
          { surface: "sceneInfoHud", edgeAnchor: "TOP_LEFT" }
        ),
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "7px 8px",
          borderBottom: `1px solid color-mix(in srgb, ${hudTheme.panelBorder} 55%, transparent)`,
          background: "transparent",
        }}
      >
        <span
          style={{
            ...sectionLabelStyle(hudTheme),
            marginBottom: 0,
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
          ◀
        </button>
      </header>

      <div style={{ padding: "10px 10px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {showFrsiBreakdown ? (
        <section data-nx-section="frsi">
          <div style={sectionLabelStyle(hudTheme)}>FRSI Breakdown</div>
          <div
            style={{
              borderRadius: 6,
              border: `1px solid color-mix(in srgb, ${nx.borderSoft} 65%, transparent)`,
              background: "color-mix(in srgb, var(--nx-bg-control) 42%, transparent)",
              padding: "5px 7px",
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
        ) : null}

        <section data-nx-section="layers">
          <div style={sectionLabelStyle(hudTheme)}>Layers</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {SCENE_INFO_LAYER_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={layerVisibility[key]}
                aria-label={SCENE_INFO_LAYER_LABELS[key]}
                title={SCENE_INFO_LAYER_LABELS[key]}
                onClick={() => handleLayerToggle(key)}
                style={{
                  ...layerToggleStyle(layerVisibility[key], tokens),
                  minWidth: 28,
                  width: 28,
                  height: 28,
                  padding: 0,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                }}
              >
                <span aria-hidden>{SCENE_INFO_LAYER_ICONS[key]}</span>
              </button>
            ))}
          </div>
        </section>

        {(props.onAddObjectClick || props.onCreateSystemClick) ? (
        <section data-nx-section="scene-actions">
          <div style={sectionLabelStyle(hudTheme)}>Scene Actions</div>
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
                fontWeight: 700,
              }}
            >
              Create System
            </button>
          ) : null}
        </section>
        ) : null}
      </div>
    </div>
  );
}

export default SceneInfoHud;

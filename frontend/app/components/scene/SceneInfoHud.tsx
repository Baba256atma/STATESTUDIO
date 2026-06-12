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
import {
  hydrateSceneInfoCollapseState,
  persistSceneInfoCollapsePreference,
} from "../../lib/scene/sceneInfoPreferenceRuntime";
import { DEFAULT_SCENE_INFO_STATE } from "../../lib/scene/sceneInfoInitialState";
import { traceSceneInfoHydration } from "../../lib/scene/sceneInfoHydrationContract";
import { traceNexoraScenePanelRole } from "../../lib/scene/scenePanelPurposeContract";
import type { SceneRuntimeSummary } from "../../lib/scene/sceneRuntimeSummary";
import { resolveSceneRuntimeSummary } from "../../lib/scene/sceneRuntimeSummary";
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
  type NexoraHudThemeTokens,
} from "../../lib/scene/nexoraHudTheme";
import { sceneHudChipStyle, resolveSceneThemeTokens } from "../../lib/theme/sceneThemeTokens";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";
import { nx } from "../ui/nexoraTheme";
import { registerGovernedPanel } from "../../lib/workspace/panelGovernanceRuntime";
import { ScenePanelControls } from "./ScenePanelControls";
import { ScenePanelExpansionSlots } from "./ScenePanelExpansionSlots";
import { HudPanelToggleButton } from "../hud/HudPanelToggleButton";
import { ScenePanelSceneActions } from "./ScenePanelSceneActions";
import { ScenePanelSystemHealth } from "./ScenePanelSystemHealth";
import { ScenePanelSystemStatus } from "./ScenePanelSystemStatus";
import {
  HUD_PANEL_HEADER_PADDING_STYLE,
  HUD_PANEL_SAFE_TEXT_STYLE,
  HUD_PANEL_SCROLL_BODY_STYLE,
  HUD_PANEL_STICKY_SHELL_STYLE,
  HUD_PANEL_SUBPANEL_GAP,
  traceHudPanelStickyHeader,
} from "../../lib/hud/hudPanelDesignContract";
import {
  SCENE_PANEL_EXPANDED_HEIGHT_RATIO,
  SCENE_PANEL_MINIMIZED_SHELL_STYLE,
  SCENE_PANEL_TOP_INSET_PX,
  SCENE_PANEL_WIDTH,
  traceScenePanelLayout,
  toScenePanelHeightMode,
} from "../../lib/scene/scenePanelWidthContract";

export type SceneInfoHudProps = {
  /** @deprecated Use sceneSummary.sceneTitle */
  currentViewId?: string | null;
  /** @deprecated Use sceneSummary.sceneTitle */
  currentViewLabel?: string | null;
  sceneSummary?: SceneRuntimeSummary | null;
  frsiMetrics?: SceneInfoFrsiMetrics;
  themeMode?: NexoraHudThemeMode;
  panelSizeMode?: PanelSizeMode;
  onAddObjectClick?: () => void;
  onCreateSystemClick?: () => void;
  onOpenTimelineClick?: () => void;
  onOpenWarRoomClick?: () => void;
};

const bodySectionStackStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: HUD_PANEL_SUBPANEL_GAP,
  minWidth: 0,
};

const metricRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 6,
  alignItems: "center",
  padding: "3px 0",
};

const sectionLabelStyle = (theme: NexoraHudThemeTokens): React.CSSProperties => ({
  ...nexoraHudSectionLabelStyle(theme),
  marginBottom: 6,
});

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
  const minimized = collapsed;
  const frsi = props.frsiMetrics ?? SCENE_INFO_FRSI_PLACEHOLDER;
  const showFrsiBreakdown = shouldSurfaceOwnInformation("frsi_breakdown", { surface: "scene_info" });
  const summary =
    props.sceneSummary ??
    resolveSceneRuntimeSummary({
      sceneJson: null,
      sceneTitle: props.currentViewLabel ?? "Executive Workspace",
      runtimeStatus: "loading",
    });

  React.useEffect(() => {
    markNoiseRemoved("scene_info_disabled_actions", "scene_info");
  }, []);

  React.useEffect(() => {
    traceNexoraScenePanelRole();
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
  }, [isMobile, sceneInfoHydrated]);

  const previousCollapsedRef = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    if (!sceneInfoHydrated) return;
    if (previousCollapsedRef.current === collapsed) return;
    previousCollapsedRef.current = collapsed;
    persistSceneInfoCollapsePreference(collapsed, "effect");
    registerGovernedPanel({
      panelId: "sceneInfoHud",
      visible: true,
      collapsed,
      anchorZone: "top-left",
      priority: 10,
      title: "Scene",
    });
    traceScenePanelLayout({
      top: SCENE_PANEL_TOP_INSET_PX,
      width: SCENE_PANEL_WIDTH,
      heightMode: toScenePanelHeightMode(minimized),
      heightRatio: SCENE_PANEL_EXPANDED_HEIGHT_RATIO,
      bodyVisible: !minimized,
    });
  }, [collapsed, minimized, sceneInfoHydrated]);

  React.useEffect(() => {
    if (!sceneInfoHydrated) return;
    traceHudPanelStickyHeader({ panel: "scene" });
  }, [minimized, sceneInfoHydrated]);

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

  const headerTitle = `SCENE : ${summary.sceneTitle}`;

  const titleRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: HUD_PANEL_SUBPANEL_GAP,
    minWidth: 0,
    width: "100%",
  };

  const commandSurfaceStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 2,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: HUD_PANEL_SUBPANEL_GAP,
    ...HUD_PANEL_HEADER_PADDING_STYLE,
    borderBottom: minimized
      ? undefined
      : `1px solid color-mix(in srgb, ${hudTheme.panelBorder} 55%, transparent)`,
    background: hudTheme.panelBackground,
    minWidth: 0,
    overflowX: "hidden",
  };

  return (
    <div
      data-nx="scene-info-hud"
      data-hud="scene-info"
      data-nx-role="system-control-center"
      data-nx-state={minimized ? "collapsed" : "expanded"}
      style={{
        ...nexoraHudShellStyle(
          hudTheme,
          {
            ...HUD_PANEL_STICKY_SHELL_STYLE,
            width: "100%",
            maxWidth: "100%",
            minWidth: SCENE_PANEL_WIDTH,
            fontSize: 11,
            lineHeight: 1.4,
            ...(minimized ? SCENE_PANEL_MINIMIZED_SHELL_STYLE : {}),
          },
          { surface: "sceneInfoHud", collapsed: minimized, edgeAnchor: minimized ? undefined : "TOP_LEFT" }
        ),
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={minimized ? undefined : (event) => event.stopPropagation()}
    >
      <div data-nx="scene-panel-command-surface" style={commandSurfaceStyle}>
        <div style={titleRowStyle}>
          <span
            style={{
              ...nexoraHudSectionLabelStyle(hudTheme),
              ...HUD_PANEL_SAFE_TEXT_STYLE,
              marginBottom: 0,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            {headerTitle}
          </span>
          <HudPanelToggleButton
            panelId="scene"
            expanded={!minimized}
            onClick={handleToggleCollapsed}
          />
        </div>
        <ScenePanelControls variant="command-surface" />
      </div>

      {!minimized ? (
        <div
          data-nx="scene-panel-scroll-body"
          style={HUD_PANEL_SCROLL_BODY_STYLE}
        >
          <div style={bodySectionStackStyle}>
            {showFrsiBreakdown ? (
              <section data-nx-section="frsi">
                <div style={sectionLabelStyle(hudTheme)}>FRSI</div>
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

            <ScenePanelSystemStatus theme={hudTheme} summary={summary} />
            <ScenePanelSceneActions
              theme={hudTheme}
              onAddObjectClick={props.onAddObjectClick}
              onCreateSystemClick={props.onCreateSystemClick}
              onOpenTimelineClick={props.onOpenTimelineClick}
              onOpenWarRoomClick={props.onOpenWarRoomClick}
            />
            <ScenePanelSystemHealth theme={hudTheme} summary={summary} />
            <ScenePanelExpansionSlots theme={hudTheme} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SceneInfoHud;

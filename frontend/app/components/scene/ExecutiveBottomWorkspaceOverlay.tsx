"use client";

import React from "react";

import type {
  ExecutiveTimelineHudModel,
} from "../../lib/scene/executiveTimelineHudTypes";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { nexoraHudShellStyle } from "../../lib/scene/nexoraHudTheme";
import { persistSceneHudAnchorPreference, sceneHudDockStyle } from "../../lib/hud/sceneHudAnchorRuntime";
import { getTimelineVisibleRegion } from "../../lib/hud/timelineVisibleRegionRuntime";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { useFocusHudPresentation } from "../../lib/workspace/useFocusHudPresentation";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import type {
  ExecutiveQuickActionId,
  ExecutiveQuickActionsDockModel,
} from "../../lib/ui/executiveQuickActionsTypes";
import {
  getBottomWorkspaceState,
  heightForBottomWorkspaceMode,
  hydrateBottomWorkspaceState,
  logTimelineVisibleZone,
  logBottomWorkspaceMetrics,
  selectBottomWorkspaceSurface,
  selectBottomWorkspaceTimelineEvent,
  toggleBottomWorkspace,
  type ExecutiveBottomWorkspaceHeightMode,
} from "../../lib/workspace/executiveBottomWorkspace";
import { registerGovernedPanel } from "../../lib/workspace/panelGovernanceRuntime";
import {
  buildExecutiveTimelineStoryItems,
  getTimelineStorySummary,
  timelineOutcomeMarkerGlyph,
  type TimelineStoryItem,
} from "../../lib/timeline/executiveTimelineRuntime";
import {
  logTimelineExpand,
  resolveTimelineCompression,
} from "../../lib/timeline/timelineCompressionRuntime";
import { useHydratedTimelineDisplayTime } from "../../lib/time/useHydratedTimelineDisplayTime";
import { SceneHudOverlayRoot } from "./SceneHudOverlayRoot";

export type ExecutiveBottomWorkspaceOverlayProps = {
  timeline: ExecutiveTimelineHudModel;
  quickActions?: {
    model: ExecutiveQuickActionsDockModel;
    onAction?: (actionId: ExecutiveQuickActionId) => void;
  } | null;
  themeMode?: NexoraHudThemeMode;
};

function nextMode(mode: ExecutiveBottomWorkspaceHeightMode): ExecutiveBottomWorkspaceHeightMode {
  if (mode === "collapsed") return "compact";
  if (mode === "compact") return "expanded";
  return "collapsed";
}

export function ExecutiveBottomWorkspaceOverlay(
  props: ExecutiveBottomWorkspaceOverlayProps
): React.ReactElement {
  const { getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("timelineHud");
  const focusHud = useFocusHudPresentation("timelineHud", placement.visible);
  const theme = useSceneHudTheme(props.themeMode ?? "night");
  const [state, setState] = React.useState(() => getBottomWorkspaceState());
  const compression = React.useMemo(
    () => resolveTimelineCompression(state.heightMode),
    [state.heightMode]
  );
  const storyItems = React.useMemo(
    () => buildExecutiveTimelineStoryItems(props.timeline, compression.mode).slice(0, compression.maxVisibleItems),
    [compression.maxVisibleItems, compression.mode, props.timeline]
  );
  const activeEvent =
    storyItems.find((event) => event.id === state.selectedTimelineEvent) ??
    storyItems.find((event) => event.id === props.timeline.focusedEventId) ??
    storyItems.find((event) => event.status === "active") ??
    storyItems[0] ??
    null;
  const activeEventTime = useHydratedTimelineDisplayTime({
    timestampIso: activeEvent?.timestampIso,
    timestamp: activeEvent?.timestamp,
  });
  const storySummary = getTimelineStorySummary(storyItems);
  const height = heightForBottomWorkspaceMode(state.heightMode);
  const compact = state.heightMode !== "expanded" && state.heightMode !== "full";
  const timelineRegion = getTimelineVisibleRegion();

  React.useEffect(() => {
    const hydrated = hydrateBottomWorkspaceState();
    setState({ ...hydrated });
  }, []);

  React.useEffect(() => {
    persistSceneHudAnchorPreference("timelineHud", "BOTTOM_CENTER");
  }, []);

  React.useEffect(() => {
    logBottomWorkspaceMetrics({
      mode: state.heightMode,
      height,
      eventCount: props.timeline.events.length,
      activeSurface: state.activeSurface,
    });
    logTimelineVisibleZone({
      bottomOffset: timelineRegion.bottomOffset,
      height,
      mode: state.heightMode,
    });
    registerGovernedPanel({
      panelId: "timelineHud",
      visible: true,
      collapsed: state.heightMode === "collapsed",
      anchorZone: "bottom-center",
      priority: 30,
      title: "Executive Bottom Workspace",
    });
  }, [height, props.timeline.events.length, state.activeSurface, state.heightMode, timelineRegion.bottomOffset]);

  if (!placement.visible && !focusHud.preserveMount) return <></>;

  return (
    <SceneHudOverlayRoot
      panelId="timelineHud"
      style={{
        ...sceneHudDockStyle({
          panelId: "timelineHud",
          anchor: "BOTTOM_CENTER",
          visible: focusHud.visible,
          collapsed: state.heightMode === "collapsed",
          maxWidth: timelineRegion.maxWidth,
          zIndex: placement.zIndex,
          transitionMs: 160,
          visiblePanelCount: 3,
        }),
        ...focusHud.style,
      }}
    >
        <div
          data-nx="executive-bottom-workspace"
          data-hud="timeline"
          data-nx-mode={state.heightMode}
          data-nx-theme={theme.mode}
          style={{
            ...nexoraHudShellStyle(
              theme,
              {
                width: state.heightMode === "expanded" ? "min(90vw, 940px)" : timelineRegion.maxWidth,
                height,
                maxHeight: state.heightMode === "full" ? "42vh" : height,
                padding: state.heightMode === "collapsed" ? "4px 8px" : "6px 8px",
                overflow: "hidden",
              },
              {
                surface: "timelineHud",
                edgeAnchor: "BOTTOM_CENTER",
                collapsed: state.heightMode === "collapsed",
              }
            ),
            display: "grid",
            gridTemplateColumns: state.heightMode === "collapsed" ? "1fr auto" : compression.showDetails ? "minmax(0, 1fr) minmax(180px, 230px) auto" : "minmax(0, 1fr) auto",
            gap: 8,
            alignItems: "stretch",
            pointerEvents: "auto",
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <section style={{ minWidth: 0, display: "grid", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ color: theme.label, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Decision Story
                </span>
                {activeEvent ? (
                  <span style={{ color: theme.textSecondary, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeEventTime ? `[${activeEventTime}] ` : ""}
                    {state.heightMode === "collapsed" ? storySummary : activeEvent.headline}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                title={`Switch to ${nextMode(state.heightMode)} mode`}
                aria-label="Toggle bottom workspace"
                onClick={() => {
                  const to = nextMode(state.heightMode);
                  logTimelineExpand({ from: state.heightMode, to });
                  setState({ ...toggleBottomWorkspace() });
                }}
                style={modeButtonStyle(theme)}
              >
                {state.heightMode === "collapsed" ? "▲" : state.heightMode === "compact" ? "▲" : "▼"}
              </button>
            </div>

            {state.heightMode !== "collapsed" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  overflowX: "auto",
                  paddingBottom: 2,
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {storyItems.map((event) => {
                  const active = activeEvent?.id === event.id;
                  return (
                    <DecisionStoryCard
                      key={event.id}
                      item={event}
                      active={active}
                      compact={compact}
                      showDetails={compression.showDetails}
                      theme={theme}
                      onClick={() => {
                        const next = selectBottomWorkspaceTimelineEvent(event.id);
                        setState({ ...next });
                      }}
                    />
                  );
                })}
              </div>
            ) : null}
          </section>

          {compression.showDetails ? (
            <section style={{ minWidth: 0, display: "grid", gap: 5, alignContent: "start" }}>
              <div style={{ color: theme.label, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Why It Matters
              </div>
              <ContextRow label="Cause" value={activeEvent?.cause ?? "System signal"} theme={theme} />
              <ContextRow label="Impact" value={activeEvent?.impact ?? "Context updated"} theme={theme} />
              <ContextRow label="Action" value={activeEvent?.action ?? "Inspect next"} theme={theme} />
            </section>
          ) : null}

          <section style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end", flexWrap: "wrap" }}>
            {props.quickActions?.model.actions.slice(0, 4).map((action) => (
              <button
                key={action.id}
                type="button"
                disabled={action.disabled}
                title={action.hint}
                aria-label={action.label}
                onClick={() => {
                  const next = selectBottomWorkspaceSurface("quick-navigation");
                  setState({ ...next });
                  props.quickActions?.onAction?.(action.id);
                }}
                style={{
                  width: state.heightMode === "collapsed" ? 30 : 34,
                  height: state.heightMode === "collapsed" ? 30 : 34,
                  borderRadius: 8,
                  border: `1px solid ${theme.buttonBorder}`,
                  background: theme.buttonBackground,
                  color: theme.buttonText,
                  opacity: action.disabled ? 0.5 : 1,
                  cursor: action.disabled ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {action.icon}
              </button>
            ))}
          </section>
        </div>
    </SceneHudOverlayRoot>
  );
}

function DecisionStoryCard(props: {
  item: TimelineStoryItem;
  active: boolean;
  compact: boolean;
  showDetails: boolean;
  theme: ReturnType<typeof useSceneHudTheme>;
  onClick: () => void;
}): React.ReactElement {
  const marker = timelineOutcomeMarkerGlyph(props.item.marker);
  const displayTime = useHydratedTimelineDisplayTime({
    timestampIso: props.item.timestampIso,
    timestamp: props.item.timestamp,
  });
  return (
    <button
      type="button"
      onClick={props.onClick}
      title={`${displayTime ? `[${displayTime}] ` : ""}${props.item.headline}. ${props.item.impact}`}
      style={{
        flex: "0 0 auto",
        minWidth: props.compact ? 148 : 174,
        maxWidth: props.compact ? 176 : 220,
        height: props.showDetails ? 86 : 44,
        borderRadius: 8,
        border: `1px solid ${props.active ? props.theme.accent : props.theme.controlBorder}`,
        background: props.active
          ? "color-mix(in srgb, var(--nx-accent-soft) 46%, transparent)"
          : "color-mix(in srgb, var(--nx-bg-control) 54%, transparent)",
        color: props.theme.textPrimary,
        padding: props.showDetails ? "6px 8px" : "5px 7px",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto", gap: 6, alignItems: "center" }}>
        <span style={{ color: props.theme.accent, fontSize: 12, fontWeight: 900, lineHeight: 1 }}>{marker}</span>
        <span style={{ color: props.theme.textSecondary, fontSize: 9, fontWeight: 800, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {props.item.markerLabel}
        </span>
        <span style={{ color: props.theme.textSecondary, fontSize: 9, whiteSpace: "nowrap" }}>
          {displayTime || props.item.scenarioLabel}
        </span>
      </div>
      <div
        style={{
          marginTop: 3,
          fontSize: 11,
          fontWeight: 800,
          lineHeight: 1.15,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: props.showDetails ? "normal" : "nowrap",
          display: props.showDetails ? "-webkit-box" : undefined,
          WebkitLineClamp: props.showDetails ? 2 : undefined,
          WebkitBoxOrient: props.showDetails ? "vertical" : undefined,
        }}
      >
        {props.item.headline}
      </div>
      {props.showDetails ? (
        <div style={{ marginTop: 4, color: props.theme.textSecondary, fontSize: 10, lineHeight: 1.25, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {props.item.cause} → {props.item.impact}
        </div>
      ) : null}
    </button>
  );
}

function modeButtonStyle(theme: ReturnType<typeof useSceneHudTheme>): React.CSSProperties {
  return {
    borderRadius: 8,
    border: `1px solid ${theme.controlBorder}`,
    background: theme.controlBackground,
    color: theme.textSecondary,
    padding: "4px 8px",
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    cursor: "pointer",
  };
}

function ContextRow(props: {
  label: string;
  value: string;
  theme: ReturnType<typeof useSceneHudTheme>;
}): React.ReactElement {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
      <span style={{ color: props.theme.textSecondary, fontSize: 11 }}>{props.label}</span>
      <span
        style={{
          color: props.theme.textPrimary,
          fontSize: 11,
          fontWeight: 800,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.value}
      </span>
    </div>
  );
}

export default ExecutiveBottomWorkspaceOverlay;

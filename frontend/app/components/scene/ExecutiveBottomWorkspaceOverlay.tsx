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
import type { SpatialTimelineActiveSummary } from "../../lib/scene/timeline/spatialTimeIntelligenceTypes";
import type {
  ExecutiveScenarioCompletionSummary,
  ExecutiveScenarioPlaybackState,
  ScenarioPlaybackSpeed,
} from "../../lib/scene/scenario/executiveScenarioPlaybackTypes";
import type {
  ExecutiveScenarioComparisonDashboardRow,
  ExecutiveScenarioUniverseState,
  ScenarioComparisonMode,
  ScenarioUniverseLayoutMode,
} from "../../lib/scene/scenario/executiveMultiScenarioUniverseTypes";
import type { ExecutiveWarRoomHudModel } from "../../lib/scene/warroom/executiveWarRoomTypes";
import type { ExecutiveAdvisorHudModel } from "../../lib/scene/advisor/executiveAdvisorTypes";
import type { ExecutiveIntelligenceHudModel } from "../../lib/scene/integration/executiveIntelligenceTypes";
import {
  logTimelineExpand,
  resolveTimelineCompression,
} from "../../lib/timeline/timelineCompressionRuntime";
import { useHydratedTimelineDisplayTime } from "../../lib/time/useHydratedTimelineDisplayTime";
import { SceneHudOverlayRoot } from "./SceneHudOverlayRoot";

export type ExecutiveBottomWorkspaceOverlayProps = {
  timeline: ExecutiveTimelineHudModel;
  spatialSummary?: SpatialTimelineActiveSummary | null;
  onEventSelect?: (eventId: string, item: TimelineStoryItem) => void;
  onEventHover?: (eventId: string | null, item: TimelineStoryItem | null) => void;
  onEventFocusMode?: (eventId: string, item: TimelineStoryItem) => void;
  playback?: ExecutiveScenarioPlaybackState | null;
  playbackCompletion?: ExecutiveScenarioCompletionSummary | null;
  onPlaybackPlay?: () => void;
  onPlaybackPause?: () => void;
  onPlaybackRestart?: () => void;
  onPlaybackPrevious?: () => void;
  onPlaybackNext?: () => void;
  onPlaybackSpeedChange?: (speed: ScenarioPlaybackSpeed) => void;
  scenarioUniverse?: ExecutiveScenarioUniverseState | null;
  comparisonDashboard?: readonly ExecutiveScenarioComparisonDashboardRow[];
  onScenarioLayerSelect?: (scenarioId: string) => void;
  onScenarioLayerVisibility?: (scenarioId: string, visible: boolean) => void;
  onScenarioLayerIsolate?: (scenarioId: string) => void;
  onComparisonLayoutMode?: (mode: ScenarioUniverseLayoutMode) => void;
  onComparisonMode?: (mode: ScenarioComparisonMode) => void;
  warRoomHud?: ExecutiveWarRoomHudModel | null;
  advisorHud?: ExecutiveAdvisorHudModel | null;
  commandCenterHud?: ExecutiveIntelligenceHudModel | null;
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
            {props.scenarioUniverse?.comparisonActive ? (
              <ScenarioComparisonControlStrip
                universe={props.scenarioUniverse}
                dashboard={props.comparisonDashboard ?? []}
                theme={theme}
                compact={compact}
                onScenarioSelect={props.onScenarioLayerSelect}
                onScenarioVisibility={props.onScenarioLayerVisibility}
                onScenarioIsolate={props.onScenarioLayerIsolate}
                onLayoutMode={props.onComparisonLayoutMode}
                onComparisonMode={props.onComparisonMode}
              />
            ) : null}
            {props.commandCenterHud && state.heightMode !== "collapsed" ? (
              <ExecutiveCommandCenterReadinessStrip hud={props.commandCenterHud} theme={theme} compact={compact} />
            ) : null}
            {props.advisorHud && state.heightMode !== "collapsed" ? (
              <ExecutiveAdvisorFeedStrip hud={props.advisorHud} theme={theme} compact={compact} />
            ) : null}
            {props.warRoomHud && state.heightMode !== "collapsed" ? (
              <WarRoomEventFeedStrip hud={props.warRoomHud} theme={theme} compact={compact} />
            ) : null}
            {props.playback?.sequence ? (
              <PlaybackControlStrip
                playback={props.playback}
                completion={props.playbackCompletion ?? props.playback.completionSummary}
                theme={theme}
                compact={compact}
                onPlay={props.onPlaybackPlay}
                onPause={props.onPlaybackPause}
                onRestart={props.onPlaybackRestart}
                onPrevious={props.onPlaybackPrevious}
                onNext={props.onPlaybackNext}
                onSpeedChange={props.onPlaybackSpeedChange}
              />
            ) : null}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ color: theme.label, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Decision Story
                </span>
                {activeEvent ? (
                  <span style={{ color: theme.textSecondary, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeEventTime ? `[${activeEventTime}] ` : ""}
                    {state.heightMode === "collapsed"
                      ? storySummary
                      : props.spatialSummary?.summary ?? activeEvent.headline}
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
                        props.onEventSelect?.(event.id, event);
                      }}
                      onHover={(hovered) => {
                        props.onEventHover?.(hovered ? event.id : null, hovered ? event : null);
                      }}
                      onDoubleClick={() => {
                        const next = selectBottomWorkspaceTimelineEvent(event.id);
                        setState({ ...next });
                        props.onEventFocusMode?.(event.id, event);
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
                Active Event
              </div>
              <ContextRow
                label="Time"
                value={props.spatialSummary?.timestampLabel ?? activeEventTime ?? "Recent"}
                theme={theme}
              />
              <ContextRow
                label="Object"
                value={props.spatialSummary?.affectedObjectLabel ?? "System-wide"}
                theme={theme}
              />
              <ContextRow
                label="Severity"
                value={props.spatialSummary?.severity ?? activeEvent?.eventSeverity ?? "watch"}
                theme={theme}
              />
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
  onHover?: (hovered: boolean) => void;
  onDoubleClick?: () => void;
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
      onDoubleClick={props.onDoubleClick}
      onMouseEnter={() => props.onHover?.(true)}
      onMouseLeave={() => props.onHover?.(false)}
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

function ExecutiveCommandCenterReadinessStrip(props: {
  hud: ExecutiveIntelligenceHudModel;
  theme: ReturnType<typeof useSceneHudTheme>;
  compact: boolean;
}): React.ReactElement {
  return (
    <div
      data-nx="executive-command-center-readiness"
      style={{
        display: "grid",
        gap: 4,
        padding: "2px 0 4px",
        borderBottom: `1px solid ${props.theme.controlBorder}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
        <div style={{ color: props.theme.label, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Cognitive Command Center
        </div>
        <div style={{ color: props.hud.mvpReady ? props.theme.accent : props.theme.textSecondary, fontSize: 10, whiteSpace: "nowrap", fontWeight: 700 }}>
          {props.hud.mvpReady ? "MVP Ready" : `Readiness ${Math.round(props.hud.readinessScore * 100)}%`}
        </div>
      </div>
      <div style={{ color: props.theme.textPrimary, fontSize: 11, fontWeight: 700 }}>
        {props.hud.headline}
      </div>
      {!props.compact ? (
        <div style={{ color: props.theme.textSecondary, fontSize: 10 }}>
          {props.hud.firstImpressionSummary}
        </div>
      ) : null}
      <div style={{ color: props.theme.textSecondary, fontSize: 10 }}>
        {props.hud.orientationSummary || props.hud.demoStepTitle || "Orient to risks, scenarios, recommendations, and timeline."}
      </div>
      {props.hud.topValidationGap && !props.hud.acceptancePassed ? (
        <div style={{ color: props.theme.textSecondary, fontSize: 10, fontStyle: "italic" }}>
          Gap: {props.hud.topValidationGap}
        </div>
      ) : null}
    </div>
  );
}

function ExecutiveAdvisorFeedStrip(props: {
  hud: ExecutiveAdvisorHudModel;
  theme: ReturnType<typeof useSceneHudTheme>;
  compact: boolean;
}): React.ReactElement {
  return (
    <div
      data-nx="executive-advisor-feed"
      style={{
        display: "grid",
        gap: 4,
        padding: "2px 0 4px",
        borderBottom: `1px solid ${props.theme.controlBorder}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
        <div style={{ color: props.theme.label, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Executive Advisor
        </div>
        <div style={{ color: props.theme.textSecondary, fontSize: 10, whiteSpace: "nowrap" }}>
          Confidence {Math.round(props.hud.calibratedConfidence * 100)}%
        </div>
      </div>
      {props.hud.brief.proactiveInsight ? (
        <div style={{ color: props.theme.textPrimary, fontSize: 11, fontWeight: 700 }}>
          {props.hud.brief.proactiveInsight}
        </div>
      ) : (
        <div style={{ color: props.theme.textSecondary, fontSize: 11 }}>{props.hud.brief.headline}</div>
      )}
      {props.hud.topQuestion ? (
        <div style={{ color: props.theme.textSecondary, fontSize: 10, fontStyle: "italic" }}>
          Q: {props.hud.topQuestion.question}
        </div>
      ) : null}
      {props.hud.feed.slice(0, props.compact ? 2 : 3).map((entry) => (
        <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
          <span style={{ color: props.theme.textPrimary, fontSize: 10, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {entry.title}
          </span>
          <span style={{ color: props.theme.textSecondary, fontSize: 10, whiteSpace: "nowrap" }}>
            {entry.kind}
          </span>
        </div>
      ))}
      {props.hud.topRecommendation ? (
        <div style={{ color: props.theme.textSecondary, fontSize: 10 }}>
          Recommended: {props.hud.topRecommendation.title}
        </div>
      ) : null}
    </div>
  );
}

function WarRoomEventFeedStrip(props: {
  hud: ExecutiveWarRoomHudModel;
  theme: ReturnType<typeof useSceneHudTheme>;
  compact: boolean;
}): React.ReactElement {
  return (
    <div
      data-nx="war-room-event-feed"
      style={{
        display: "grid",
        gap: 4,
        padding: "2px 0 4px",
        borderBottom: `1px solid ${props.theme.controlBorder}`,
      }}
    >
      <div style={{ color: props.theme.label, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Active Event Feed
      </div>
      {props.hud.eventFeed.slice(0, props.compact ? 2 : 4).map((event) => (
        <div key={event.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
          <span style={{ color: props.theme.textPrimary, fontSize: 11, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {event.title}
          </span>
          <span style={{ color: props.theme.textSecondary, fontSize: 10, whiteSpace: "nowrap" }}>
            {event.kind} · {Math.round(event.priorityScore * 100)}
          </span>
        </div>
      ))}
      {props.hud.bestScenarioTitle ? (
        <div style={{ color: props.theme.textSecondary, fontSize: 10 }}>
          Recommended: {props.hud.bestScenarioTitle}
          {props.hud.tradeoffSummary ? ` — ${props.hud.tradeoffSummary}` : ""}
        </div>
      ) : null}
    </div>
  );
}

function ScenarioComparisonControlStrip(props: {
  universe: ExecutiveScenarioUniverseState;
  dashboard: readonly ExecutiveScenarioComparisonDashboardRow[];
  theme: ReturnType<typeof useSceneHudTheme>;
  compact: boolean;
  onScenarioSelect?: (scenarioId: string) => void;
  onScenarioVisibility?: (scenarioId: string, visible: boolean) => void;
  onScenarioIsolate?: (scenarioId: string) => void;
  onLayoutMode?: (mode: ScenarioUniverseLayoutMode) => void;
  onComparisonMode?: (mode: ScenarioComparisonMode) => void;
}): React.ReactElement {
  const layoutModes: ScenarioUniverseLayoutMode[] = ["overlay", "split", "ghost"];
  const comparisonModes: ScenarioComparisonMode[] = ["single", "dual", "triple"];
  const recommendation = props.universe.recommendation;

  return (
    <div
      data-nx="scenario-comparison-controls"
      style={{
        display: "grid",
        gap: 6,
        padding: "4px 0 2px",
        borderBottom: `1px solid ${props.theme.controlBorder}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: props.theme.label, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Multi-Scenario Comparison
          </div>
          <div style={{ color: props.theme.textSecondary, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {recommendation
              ? `Recommended: ${recommendation.recommendedTitle}`
              : props.universe.comparisonSummary}
          </div>
        </div>
        <div style={{ color: props.theme.textSecondary, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
          {props.universe.layers.length - 1} futures · {props.universe.comparisonMode}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
        {props.dashboard.map((row) => {
          const layer = props.universe.layers.find((entry) => entry.metadata.id === row.scenarioId);
          const color = layer?.colorToken ?? props.theme.accent;
          return (
            <button
              key={row.scenarioId}
              type="button"
              title={row.title}
              aria-label={`Select ${row.title}`}
              onClick={() => props.onScenarioSelect?.(row.scenarioId)}
              onDoubleClick={() => props.onScenarioIsolate?.(row.scenarioId)}
              style={{
                ...playbackButtonStyle(props.theme, row.active),
                width: "auto",
                padding: "0 8px",
                fontSize: 10,
                borderColor: row.active ? color : props.theme.buttonBorder,
                opacity: row.visible ? 1 : 0.45,
              }}
            >
              {row.rank ? `#${row.rank} ` : ""}
              {row.title}
            </button>
          );
        })}
      </div>

      {!props.compact ? (
        <div style={{ display: "grid", gap: 4 }}>
          {props.dashboard
            .filter((row) => row.scenarioId !== props.universe.baselineScenarioId)
            .slice(0, 3)
            .map((row) => (
              <div key={`metrics-${row.scenarioId}`} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={{ color: props.theme.textSecondary, fontSize: 10, fontWeight: 700 }}>{row.title}</span>
                <span style={{ color: props.theme.textSecondary, fontSize: 10 }}>Risk {Math.round(row.riskScore * 100)}%</span>
                <span style={{ color: props.theme.textSecondary, fontSize: 10 }}>Score {Math.round(row.overallScore * 100)}</span>
                <span style={{ color: props.theme.textSecondary, fontSize: 10 }}>Cost {row.costImpact}</span>
                <span style={{ color: props.theme.textSecondary, fontSize: 10 }}>Opportunity {row.opportunityImpact}</span>
              </div>
            ))}
        </div>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
        {layoutModes.map((mode) => (
          <button
            key={mode}
            type="button"
            aria-label={`${mode} layout`}
            onClick={() => props.onLayoutMode?.(mode)}
            style={{
              ...playbackButtonStyle(props.theme, props.universe.layoutMode === mode),
              width: "auto",
              padding: "0 8px",
              fontSize: 10,
              textTransform: "uppercase",
            }}
          >
            {mode}
          </button>
        ))}
        {comparisonModes.map((mode) => (
          <button
            key={mode}
            type="button"
            aria-label={`${mode} comparison`}
            onClick={() => props.onComparisonMode?.(mode)}
            style={{
              ...playbackButtonStyle(props.theme, props.universe.comparisonMode === mode),
              width: "auto",
              padding: "0 8px",
              fontSize: 10,
              textTransform: "uppercase",
            }}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}

function playbackButtonStyle(theme: ReturnType<typeof useSceneHudTheme>, active = false): React.CSSProperties {
  return {
    width: 30,
    height: 28,
    borderRadius: 8,
    border: `1px solid ${active ? theme.accent : theme.buttonBorder}`,
    background: active ? "color-mix(in srgb, var(--nx-accent-soft) 40%, transparent)" : theme.buttonBackground,
    color: theme.buttonText,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 800,
  };
}

function PlaybackControlStrip(props: {
  playback: ExecutiveScenarioPlaybackState;
  completion: ExecutiveScenarioCompletionSummary | null | undefined;
  theme: ReturnType<typeof useSceneHudTheme>;
  compact: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onRestart?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSpeedChange?: (speed: ScenarioPlaybackSpeed) => void;
}): React.ReactElement {
  const sequence = props.playback.sequence;
  const view = props.playback.propagationView;
  const isPlaying = props.playback.status === "playing";
  const isCompleted = props.playback.status === "completed";
  const speeds: ScenarioPlaybackSpeed[] = ["slow", "normal", "fast"];

  return (
    <div
      data-nx="scenario-playback-controls"
      style={{
        display: "grid",
        gap: 6,
        padding: "4px 0 2px",
        borderBottom: `1px solid ${props.theme.controlBorder}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: props.theme.label, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {sequence?.scenarioName ?? "Scenario Playback"}
          </div>
          <div style={{ color: props.theme.textSecondary, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {isCompleted
              ? props.completion?.impactSummary ?? "Playback completed"
              : view?.stepTitle ?? "Ready to play operational scenario"}
          </div>
        </div>
        <div style={{ color: props.theme.textSecondary, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
          {view?.progressLabel ?? `0 / ${sequence?.steps.length ?? 0}`} · {view?.completionPercent ?? 0}%
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
        <button type="button" aria-label="Restart scenario" title="Restart" onClick={props.onRestart} style={playbackButtonStyle(props.theme)}>
          ↺
        </button>
        <button type="button" aria-label="Previous step" title="Previous" onClick={props.onPrevious} style={playbackButtonStyle(props.theme)}>
          ◀
        </button>
        {isPlaying ? (
          <button type="button" aria-label="Pause scenario" title="Pause" onClick={props.onPause} style={playbackButtonStyle(props.theme, true)}>
            ⏸
          </button>
        ) : (
          <button type="button" aria-label="Play scenario" title="Play" onClick={props.onPlay} style={playbackButtonStyle(props.theme, true)}>
            ▶
          </button>
        )}
        <button type="button" aria-label="Next step" title="Next" onClick={props.onNext} style={playbackButtonStyle(props.theme)}>
          ▶|
        </button>
        {speeds.map((speed) => (
          <button
            key={speed}
            type="button"
            aria-label={`${speed} speed`}
            title={`${speed} speed`}
            onClick={() => props.onSpeedChange?.(speed)}
            style={{
              ...playbackButtonStyle(props.theme, props.playback.speed === speed),
              width: "auto",
              padding: "0 8px",
              fontSize: 10,
              textTransform: "uppercase",
            }}
          >
            {speed === "normal" ? "1x" : speed === "slow" ? "0.5x" : "2x"}
          </button>
        ))}
      </div>
    </div>
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

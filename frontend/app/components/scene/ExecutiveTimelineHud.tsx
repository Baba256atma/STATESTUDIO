"use client";

import React from "react";

import {
  EXECUTIVE_TIMELINE_CONTROLS,
  type ExecutiveTimelineHudModel,
  type TimelineEvent,
} from "../../lib/scene/executiveTimelineHudTypes";
import {
  nexoraHudSectionLabelStyle,
  nexoraHudShellStyle,
  type NexoraHudThemeMode,
} from "../../lib/scene/nexoraHudTheme";
import { resolveSceneThemeTokens, sceneHudControlButtonStyle } from "../../lib/theme/sceneThemeTokens";
import type { SceneThemeTokens } from "../../lib/theme/sceneThemeTypes";
import { useSceneHudTheme, useSceneThemeOptional } from "../../lib/theme/useSceneTheme";
import { useViewportWidthListener } from "../../lib/dom/useDomListener";
import { resolveExecutiveWorkspaceBreakpoint } from "../../lib/ui/executiveWorkspaceLayout";
import type { PanelSizeMode } from "../../lib/ui/workspaceLayoutTypes";
import {
  logExecutiveTimelineEventFocused,
  logExecutiveTimelineMounted,
  logExecutiveTimelineRendered,
  logExecutiveTimelineReplayRequested,
  logExecutiveTimelineStateUpdated,
} from "../../lib/ui/executiveTimelineHudInstrumentation";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveTimelineHudProps = ExecutiveTimelineHudModel & {
  themeMode?: NexoraHudThemeMode;
  panelSizeMode?: PanelSizeMode;
  expanded?: boolean;
};

const sectionLabelStyle = (theme: ReturnType<typeof useSceneHudTheme>): React.CSSProperties =>
  nexoraHudSectionLabelStyle(theme);

function nodeColor(status: TimelineEvent["status"], tokens: SceneThemeTokens): string {
  if (status === "completed") return tokens.timeline;
  if (status === "active") return tokens.timelineMarker;
  return tokens.textSecondary;
}

function connectorColor(status: TimelineEvent["status"], tokens: SceneThemeTokens): string {
  if (status === "completed") return tokens.timelineConnector;
  return tokens.timelineTrack;
}

export function ExecutiveTimelineHud(props: ExecutiveTimelineHudProps): React.ReactElement {
  const mountedRef = React.useRef(false);
  const sceneTheme = useSceneThemeOptional();
  const hudTheme = useSceneHudTheme(props.themeMode ?? "night");
  const tokens = sceneTheme?.tokens ?? resolveSceneThemeTokens(props.themeMode ?? "night");
  const lastSignatureRef = React.useRef<string | null>(null);
  const [focusedEventId, setFocusedEventId] = React.useState<string | null>(
    props.focusedEventId ?? props.events.find((event) => event.status === "active")?.id ?? null
  );
  const [viewportWidth, setViewportWidth] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  const breakpoint = resolveExecutiveWorkspaceBreakpoint(viewportWidth);
  const panelSizeMode = props.panelSizeMode ?? "normal";
  const useExpandedLayout = props.expanded === true || panelSizeMode === "expanded";
  const compact = !useExpandedLayout && (breakpoint === "mobile" || breakpoint === "tablet");
  const events = props.events.length ? props.events : [];
  const signature = React.useMemo(
    () => events.map((event) => `${event.id}:${event.status}`).join("|"),
    [events]
  );

  React.useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logExecutiveTimelineMounted();
  }, []);

  useViewportWidthListener(setViewportWidth, "ExecutiveTimelineHud");

  React.useEffect(() => {
    setFocusedEventId(props.focusedEventId ?? props.events.find((event) => event.status === "active")?.id ?? null);
  }, [props.focusedEventId, props.events]);

  React.useEffect(() => {
    if (lastSignatureRef.current === signature) return;
    lastSignatureRef.current = signature;
    logExecutiveTimelineRendered({ eventCount: events.length, signature });
    logExecutiveTimelineStateUpdated({ signature, eventCount: events.length });
  }, [events.length, signature]);

  const focusedEvent = events.find((event) => event.id === focusedEventId) ?? events.find((e) => e.status === "active") ?? null;

  const handleFocusEvent = React.useCallback((event: TimelineEvent) => {
    setFocusedEventId(event.id);
    logExecutiveTimelineEventFocused({ eventId: event.id, title: event.title });
  }, []);

  const handleReplayPlaceholder = React.useCallback(() => {
    logExecutiveTimelineReplayRequested();
  }, []);

  return (
    <div
      data-nx="executive-timeline-hud"
      data-hud="timeline"
      data-nx-theme={hudTheme.mode}
      style={nexoraHudShellStyle(hudTheme, {
        width: useExpandedLayout
          ? compact
            ? "min(94vw, 760px)"
            : "min(92vw, 920px)"
          : compact
            ? "min(92vw, 640px)"
            : "min(88vw, 760px)",
        maxWidth: useExpandedLayout ? (compact ? "94vw" : 920) : compact ? "92vw" : 760,
        color: nx.textSoft,
        fontSize: 11,
        lineHeight: 1.45,
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
          padding: "8px 12px",
          borderBottom: `1px solid ${nx.borderSoft}`,
        }}
      >
        <span style={sectionLabelStyle(hudTheme)}>Executive Timeline</span>
        {focusedEvent ? (
          <span style={{ color: nx.muted, fontSize: 10, fontWeight: 600 }}>
            {focusedEvent.title}
            {focusedEvent.timestamp ? ` · ${focusedEvent.timestamp}` : ""}
          </span>
        ) : null}
      </header>

      <div style={{ padding: "10px 12px 8px" }}>
        <div
          data-nx-section="timeline-track"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            overflowX: compact ? "auto" : "hidden",
            paddingBottom: compact ? 4 : 0,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              <button
                type="button"
                title={`${event.title}${event.timestamp ? ` · ${event.timestamp}` : ""} · ${event.status}`}
                aria-label={`${event.title}, ${event.status}`}
                aria-pressed={focusedEventId === event.id}
                onClick={() => handleFocusEvent(event)}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  minWidth: compact ? 72 : 88,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "2px 4px",
                }}
              >
                <span
                  style={{
                    width: event.status === "active" ? 12 : 9,
                    height: event.status === "active" ? 12 : 9,
                    borderRadius: "50%",
                    background: nodeColor(event.status, tokens),
                    boxShadow:
                      event.status === "active"
                        ? `0 0 0 3px color-mix(in srgb, ${tokens.timelineMarker} 22%, transparent)`
                        : undefined,
                  }}
                />
                <span
                  style={{
                    color: focusedEventId === event.id ? nx.text : nx.muted,
                    fontSize: compact ? 9 : 10,
                    fontWeight: focusedEventId === event.id ? 700 : 600,
                    textAlign: "center",
                    lineHeight: 1.2,
                    maxWidth: compact ? 72 : 92,
                  }}
                >
                  {event.title}
                </span>
                {event.timestamp && !compact ? (
                  <span style={{ color: nx.lowMuted, fontSize: 9 }}>{event.timestamp}</span>
                ) : null}
              </button>
              {index < events.length - 1 ? (
                <span
                  aria-hidden
                  style={{
                    flex: compact ? "0 0 28px" : "1 1 24px",
                    minWidth: 16,
                    maxWidth: compact ? 36 : 56,
                    height: 1,
                    background: connectorColor(event.status, tokens),
                    marginTop: -18,
                  }}
                />
              ) : null}
            </React.Fragment>
          ))}
        </div>

        {focusedEvent ? (
          <div
            data-nx-section="event-detail"
            style={{
              marginTop: 8,
              borderRadius: 9,
              border: `1px solid ${nx.borderSoft}`,
              background: "color-mix(in srgb, var(--nx-bg-control) 52%, transparent)",
              padding: "7px 9px",
              fontSize: 11,
              color: nx.textSoft,
              lineHeight: 1.4,
            }}
          >
            <strong style={{ color: nx.text }}>{focusedEvent.title}</strong>
            <span style={{ color: nx.lowMuted }}> · {focusedEvent.status}</span>
            {focusedEvent.timestamp ? (
              <span style={{ color: nx.lowMuted }}> · {focusedEvent.timestamp}</span>
            ) : null}
          </div>
        ) : null}

        <div
          data-nx-section="timeline-controls"
          style={{
            marginTop: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          {EXECUTIVE_TIMELINE_CONTROLS.map((control) => (
            <button
              key={control.id}
              type="button"
              disabled={control.id !== "replay"}
              title={
                control.id === "replay"
                  ? "Replay — reserved for E2:11"
                  : `${control.label} — reserved for E2:11`
              }
              onClick={control.id === "replay" ? handleReplayPlaceholder : undefined}
              style={{
                ...sceneHudControlButtonStyle(tokens),
                ...(control.id === "replay"
                  ? { cursor: "pointer", opacity: 0.88, color: hudTheme.textPrimary }
                  : { opacity: 0.72, cursor: "not-allowed" }),
              }}
            >
              {control.label}
            </button>
          ))}
        </div>
        {/* E2:11 Timeline replay controls */}
        {/* D3 Live operational timeline */}
        {/* D4 Strategic decision timeline */}
        {/* Simulation history */}
        {/* Scenario comparison history */}
        {/* Executive audit trail */}
      </div>
    </div>
  );
}

export default ExecutiveTimelineHud;

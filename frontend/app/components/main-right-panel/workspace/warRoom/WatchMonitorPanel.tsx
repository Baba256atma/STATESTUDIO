"use client";

import React from "react";

import type {
  WarRoomDecisionHealthSignal,
  WarRoomEscalationIndicator,
  WarRoomMonitorAlert,
  WarRoomMonitoringSurface,
  WarRoomWatchItem,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomMonitoringContract.ts";
import {
  WAR_ROOM_MONITORING_VISUAL_SECTION_LABELS,
  WAR_ROOM_MONITORING_VISUAL_SECTION_ORDER,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomMonitoringContract.ts";
import {
  resolveWarRoomEscalationAccent,
  resolveWarRoomMonitorSeverityAccent,
  warRoomCardDetailStyle,
  warRoomMonitoringItemRowStyle,
  warRoomMonitoringPanelShellStyle,
  warRoomMonitoringSectionShellStyle,
  warRoomActionPlanMetaLabelStyle,
  warRoomActionPlanMetaValueStyle,
  warRoomSectionLabelStyle,
  warRoomVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomVisualContract.ts";

function WatchItemRow(props: Readonly<{ item: WarRoomWatchItem }>): React.ReactElement {
  const { item } = props;
  return (
    <article
      data-nx="war-room-watch-item"
      data-war-room-monitor-category={item.category}
      data-war-room-monitor-severity={item.severity}
      style={warRoomMonitoringItemRowStyle(resolveWarRoomMonitorSeverityAccent(item.severity))}
    >
      <div style={warRoomActionPlanMetaLabelStyle()}>{item.label}</div>
      <div style={warRoomActionPlanMetaValueStyle()}>{item.summary}</div>
    </article>
  );
}

function AlertRow(props: Readonly<{ alert: WarRoomMonitorAlert }>): React.ReactElement {
  const { alert } = props;
  return (
    <article
      data-nx="war-room-monitor-alert"
      data-war-room-monitor-category={alert.category}
      data-war-room-monitor-severity={alert.severity}
      style={warRoomMonitoringItemRowStyle(resolveWarRoomMonitorSeverityAccent(alert.severity))}
    >
      <div style={warRoomActionPlanMetaLabelStyle()}>{alert.title}</div>
      <div style={warRoomActionPlanMetaValueStyle()}>{alert.detail}</div>
    </article>
  );
}

function DecisionHealthRow(
  props: Readonly<{ signal: WarRoomDecisionHealthSignal }>
): React.ReactElement {
  const { signal } = props;
  return (
    <article
      data-nx="war-room-decision-health"
      data-war-room-health-status={signal.status}
      style={warRoomMonitoringItemRowStyle(resolveWarRoomMonitorSeverityAccent(signal.status))}
    >
      <div style={warRoomActionPlanMetaLabelStyle()}>{signal.label}</div>
      <div style={warRoomActionPlanMetaValueStyle()}>{signal.detail}</div>
    </article>
  );
}

function EscalationRow(
  props: Readonly<{ indicator: WarRoomEscalationIndicator }>
): React.ReactElement {
  const { indicator } = props;
  return (
    <article
      data-nx="war-room-escalation-indicator"
      data-war-room-escalation-level={indicator.level}
      style={warRoomMonitoringItemRowStyle(resolveWarRoomEscalationAccent(indicator.level))}
    >
      <div style={warRoomActionPlanMetaLabelStyle()}>{indicator.label}</div>
      <div style={warRoomActionPlanMetaValueStyle()}>{indicator.reason}</div>
    </article>
  );
}

export type WatchMonitorPanelProps = Readonly<{
  monitoring: WarRoomMonitoringSurface;
  phase: "loading" | "ready" | "empty";
}>;

export function WatchMonitorPanel(props: WatchMonitorPanelProps): React.ReactElement {
  const loading = props.phase === "loading";
  const totalSignals =
    props.monitoring.watchList.length +
    props.monitoring.alerts.length +
    props.monitoring.decisionHealth.length +
    props.monitoring.escalationIndicators.length;

  const sections = Object.freeze({
    watch_list: props.monitoring.watchList,
    alerts: props.monitoring.alerts,
    decision_health: props.monitoring.decisionHealth,
    escalation_indicators: props.monitoring.escalationIndicators,
  });

  return (
    <section
      data-nx="war-room-monitoring-panel"
      data-war-room-dashboard-context={props.monitoring.dashboardContext}
      data-war-room-monitoring="true"
      aria-label="War Room watch and monitor"
      style={warRoomMonitoringPanelShellStyle()}
    >
      <div style={warRoomSectionLabelStyle()}>Watch & Monitor Panel</div>
      <p style={warRoomCardDetailStyle()}>{props.monitoring.purpose}</p>

      {loading ? (
        <p style={warRoomCardDetailStyle()}>Loading watch & monitor layer…</p>
      ) : totalSignals === 0 ? (
        <p style={warRoomCardDetailStyle()}>
          Select an object or accept a scenario handoff to populate watch list, alerts, decision
          health, and escalation indicators.
        </p>
      ) : (
        WAR_ROOM_MONITORING_VISUAL_SECTION_ORDER.map((sectionId) => {
          const items = sections[sectionId];
          if (items.length === 0) return null;

          return (
            <div
              key={sectionId}
              data-war-room-monitoring-section={sectionId}
              style={warRoomMonitoringSectionShellStyle()}
            >
              <div style={warRoomSectionLabelStyle()}>
                {WAR_ROOM_MONITORING_VISUAL_SECTION_LABELS[sectionId]}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: warRoomVisualSpacing.rowGap,
                }}
              >
                {sectionId === "watch_list" &&
                  (items as readonly WarRoomWatchItem[]).map((item) => (
                    <WatchItemRow key={item.id} item={item} />
                  ))}
                {sectionId === "alerts" &&
                  (items as readonly WarRoomMonitorAlert[]).map((alert) => (
                    <AlertRow key={alert.id} alert={alert} />
                  ))}
                {sectionId === "decision_health" &&
                  (items as readonly WarRoomDecisionHealthSignal[]).map((signal) => (
                    <DecisionHealthRow key={signal.id} signal={signal} />
                  ))}
                {sectionId === "escalation_indicators" &&
                  (items as readonly WarRoomEscalationIndicator[]).map((indicator) => (
                    <EscalationRow key={indicator.id} indicator={indicator} />
                  ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}

export default WatchMonitorPanel;

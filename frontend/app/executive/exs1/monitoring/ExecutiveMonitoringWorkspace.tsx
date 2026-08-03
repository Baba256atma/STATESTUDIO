"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { ExecutiveAlertCard } from "./ExecutiveAlertCard";
import { ExecutiveHealthCard } from "./ExecutiveHealthCard";
import { ExecutiveKPICard } from "./ExecutiveKPICard";
import { ExecutiveMonitoringFilterBar } from "./ExecutiveMonitoringFilterBar";
import { ExecutiveMonitoringToolbar } from "./ExecutiveMonitoringToolbar";
import { HEALTH_COLOR } from "./ExecutiveMonitoringConfig";
import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly onOpenNotes: () => void;
};

/**
 * ExecutiveMonitoringWorkspace — floating Health / KPI / Alerts / Attention.
 */
export function ExecutiveMonitoringWorkspace({ onOpenNotes }: Props) {
  const {
    isActive,
    kpis,
    alerts,
    attentionObjects,
    visibleObjectHealth,
    panelCollapsed,
    panelWidth,
    setPanelCollapsed,
    setPanelWidth,
    summary,
  } = useExecutiveMonitoring();

  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragRef.current = { startX: event.clientX, startWidth: panelWidth };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [panelWidth],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const delta = event.clientX - dragRef.current.startX;
      setPanelWidth(
        Math.min(440, Math.max(270, dragRef.current.startWidth + delta)),
      );
    },
    [setPanelWidth],
  );

  if (!isActive) return null;

  return (
    <aside
      data-testid="executive-monitoring-workspace"
      aria-label="Executive Monitoring Workspace"
      style={{
        position: "absolute",
        top: "3.5rem",
        left: "1rem",
        width: panelCollapsed ? "2.75rem" : panelWidth,
        maxHeight: "calc(100% - 5rem)",
        zIndex: 8,
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.55rem",
        border: "1px solid rgba(3, 152, 85, 0.45)",
        background: "rgba(10, 14, 20, 0.92)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        overflow: "hidden",
        transition: "width 250ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.4rem",
          padding: "0.55rem 0.65rem",
          borderBottom: `1px solid ${cockpit.border}`,
        }}
      >
        {!panelCollapsed ? (
          <strong
            data-testid="executive-monitoring-workspace-title"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Monitoring Workspace
          </strong>
        ) : (
          <span style={{ color: "#039855", fontSize: "0.7rem" }}>Mo</span>
        )}
        <button
          type="button"
          data-testid="executive-monitoring-workspace-collapse"
          aria-expanded={!panelCollapsed}
          onClick={() => setPanelCollapsed(!panelCollapsed)}
          style={{
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            borderRadius: "0.3rem",
            width: "1.6rem",
            height: "1.6rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {panelCollapsed ? "›" : "‹"}
        </button>
      </div>

      {!panelCollapsed ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            padding: "0.65rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
          }}
        >
          <ExecutiveHealthCard />
          <ExecutiveMonitoringToolbar onNotes={onOpenNotes} />
          <ExecutiveMonitoringFilterBar />

          <section>
            <p style={labelStyle}>KPI Overview</p>
            <div
              style={{
                marginTop: "0.35rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              {kpis.map((kpi) => (
                <ExecutiveKPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </section>

          <section>
            <p style={labelStyle}>Alerts</p>
            <div
              style={{
                marginTop: "0.35rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              {alerts.map((alert) => (
                <ExecutiveAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>

          <section>
            <p style={labelStyle}>Attention Areas</p>
            <div
              data-testid="monitoring-attention-areas"
              style={{
                marginTop: "0.35rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              {attentionObjects.map((item) => (
                <div
                  key={item.objectId}
                  data-testid={`monitoring-attention-${item.objectId}`}
                  style={{
                    padding: "0.4rem 0.5rem",
                    borderRadius: "0.4rem",
                    border: `1px solid ${HEALTH_COLOR[item.health]}55`,
                    color: HEALTH_COLOR[item.health],
                    fontSize: "0.7rem",
                  }}
                >
                  Needs Attention · {item.objectId} · {item.health}
                  {item.alert ? ` · ${item.alert}` : ""}
                </div>
              ))}
            </div>
          </section>

          <section>
            <p style={labelStyle}>Monitoring Summary</p>
            <p
              data-testid="monitoring-summary"
              style={{
                margin: "0.3rem 0 0",
                fontSize: "0.74rem",
                color: cockpit.textSoft,
                lineHeight: 1.4,
              }}
            >
              {summary}
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                fontSize: "0.66rem",
                color: cockpit.muted,
              }}
            >
              Showing {visibleObjectHealth.length} monitored objects
            </p>
          </section>
        </div>
      ) : null}

      {!panelCollapsed ? (
        <div
          role="separator"
          aria-orientation="vertical"
          data-testid="executive-monitoring-workspace-resize"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "4px",
            height: "100%",
            cursor: "col-resize",
          }}
        />
      ) : null}
    </aside>
  );
}

const labelStyle = {
  margin: 0,
  fontSize: "0.56rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: cockpit.lowMuted,
};

"use client";

import { HEALTH_COLOR } from "./ExecutiveMonitoringConfig";
import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ExecutiveMonitoringSnapshot — Expected vs Actual comparison surface.
 */
export function ExecutiveMonitoringSnapshot() {
  const { isActive, compareOpen, setCompareOpen, kpis } =
    useExecutiveMonitoring();

  if (!isActive || !compareOpen) return null;

  return (
    <div
      data-testid="executive-monitoring-snapshot"
      style={{
        position: "absolute",
        left: "50%",
        bottom: "1rem",
        transform: "translateX(-50%)",
        width: "min(34rem, calc(100% - 2rem))",
        zIndex: 9,
        borderRadius: "0.55rem",
        border: "1px solid rgba(3, 152, 85, 0.45)",
        background: "rgba(10, 14, 20, 0.94)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.55rem 0.75rem",
          borderBottom: `1px solid ${cockpit.border}`,
        }}
      >
        <strong
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Expected ↓ Actual
        </strong>
        <button
          type="button"
          data-testid="monitoring-compare-close"
          onClick={() => setCompareOpen(false)}
          style={{
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            borderRadius: "0.3rem",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "0.7rem",
          }}
        >
          Close
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.5rem",
          padding: "0.7rem",
        }}
      >
        {kpis.map((kpi) => {
          const color = HEALTH_COLOR[kpi.health];
          return (
            <div
              key={kpi.id}
              data-testid={`monitoring-compare-${kpi.id}`}
              style={{
                padding: "0.5rem",
                borderRadius: "0.4rem",
                border: `1px solid ${color}44`,
                background: `${color}10`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color,
                }}
              >
                {kpi.name}
              </p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "0.66rem",
                  color: cockpit.muted,
                }}
              >
                Expected · {kpi.expected}
              </p>
              <p
                style={{
                  margin: "0.15rem 0 0",
                  fontSize: "0.66rem",
                  color: cockpit.textSoft,
                }}
              >
                Actual · {kpi.actual}
              </p>
              <p
                style={{
                  margin: "0.15rem 0 0",
                  fontSize: "0.66rem",
                  color,
                }}
              >
                Variance · {kpi.variance}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

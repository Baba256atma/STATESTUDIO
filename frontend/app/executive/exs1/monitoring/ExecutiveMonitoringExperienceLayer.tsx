"use client";

import { ExecutiveMonitoringOverlay } from "./ExecutiveMonitoringOverlay";
import { ExecutiveMonitoringSnapshot } from "./ExecutiveMonitoringSnapshot";
import { ExecutiveMonitoringWorkspace } from "./ExecutiveMonitoringWorkspace";
import { HEALTH_COLOR } from "./ExecutiveMonitoringConfig";
import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";
import { EXS1_OBJECTS } from "../mock/exs1Mock";

type Props = {
  readonly onOpenNotes: () => void;
};

/**
 * ExecutiveMonitoringExperienceLayer — Stage chrome for Monitoring mode only.
 */
export function ExecutiveMonitoringExperienceLayer({ onOpenNotes }: Props) {
  const { isActive, healthByObjectId, filter, visibleObjectHealth } =
    useExecutiveMonitoring();
  if (!isActive) return null;

  const visibleIds = new Set(visibleObjectHealth.map((o) => o.objectId));

  return (
    <div
      data-testid="executive-monitoring-experience-layer"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 7,
        pointerEvents: "none",
      }}
    >
      <ExecutiveMonitoringOverlay />
      {EXS1_OBJECTS.map((object) => {
        const health = healthByObjectId.get(object.id);
        if (!health) return null;
        if (filter !== "All" && !visibleIds.has(object.id)) return null;
        const color = HEALTH_COLOR[health.health];
        const critical = health.health === "Critical";
        const warning = health.health === "Warning";
        const excellent =
          health.health === "Excellent" || health.health === "Healthy";

        return (
          <div
            key={object.id}
            data-testid={`monitoring-object-ring-${object.id}`}
            data-health={health.health}
            data-attention={health.needsAttention ? "true" : "false"}
            style={{
              position: "absolute",
              left: `${object.x}%`,
              top: `${object.y}%`,
              transform: "translate(-50%, -50%)",
              width: "7.4rem",
              height: "7.4rem",
              borderRadius: "50%",
              border: `2px solid ${color}`,
              boxShadow: critical
                ? `0 0 24px ${color}66, 0 0 48px ${color}33`
                : warning
                  ? `0 0 18px ${color}55`
                  : excellent
                    ? `0 0 16px ${color}44`
                    : "none",
              opacity: 0.9,
              transition:
                "box-shadow 250ms ease, border-color 250ms ease, opacity 250ms ease",
              animation: critical
                ? "monitoring-object-pulse 1.6s ease-in-out infinite"
                : warning
                  ? "monitoring-object-pulse 2.2s ease-in-out infinite"
                  : "none",
              pointerEvents: "none",
              zIndex: 4,
            }}
          >
            {health.needsAttention ? (
              <span
                style={{
                  position: "absolute",
                  top: "-0.35rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color,
                  background: "rgba(10,14,20,0.88)",
                  border: `1px solid ${color}`,
                  borderRadius: "999px",
                  padding: "0.1rem 0.35rem",
                  whiteSpace: "nowrap",
                }}
              >
                Needs Attention
              </span>
            ) : null}
          </div>
        );
      })}
      <div style={{ pointerEvents: "auto" }}>
        <ExecutiveMonitoringWorkspace onOpenNotes={onOpenNotes} />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <ExecutiveMonitoringSnapshot />
      </div>
      <style>{`
        @keyframes monitoring-object-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(1.04); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

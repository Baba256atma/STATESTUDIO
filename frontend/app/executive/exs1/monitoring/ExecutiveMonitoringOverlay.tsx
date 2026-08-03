"use client";

import { HEALTH_COLOR } from "./ExecutiveMonitoringConfig";
import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";

/**
 * ExecutiveMonitoringOverlay — health atmosphere, alert pulse, warning borders.
 */
export function ExecutiveMonitoringOverlay() {
  const { isActive, executiveHealth, alerts, attentionObjects } =
    useExecutiveMonitoring();
  if (!isActive) return null;

  const accent = HEALTH_COLOR[executiveHealth];
  const critical = alerts.some((a) => a.severity === "Critical");

  return (
    <div
      data-testid="executive-monitoring-overlay"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background: `radial-gradient(52% 48% at 50% 45%, ${accent}22 0%, transparent 72%)`,
        transition: "background 250ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0.85rem",
          borderRadius: "0.85rem",
          border: `1px solid ${accent}55`,
          boxShadow: critical
            ? `inset 0 0 48px ${HEALTH_COLOR.Critical}18, 0 0 28px ${accent}20`
            : `inset 0 0 28px ${accent}12`,
          transition: "border-color 250ms ease, box-shadow 250ms ease",
          animation: critical ? "monitoring-pulse 1.8s ease-in-out infinite" : "none",
        }}
      />
      <div
        data-testid="executive-monitoring-overlay-label"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1.1rem",
          padding: "0.35rem 0.55rem",
          borderRadius: "999px",
          border: `1px solid ${accent}66`,
          background: "rgba(10,14,20,0.75)",
          color: accent,
          fontSize: "0.62rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Health · {executiveHealth} · {attentionObjects.length} attention
      </div>
      <style>{`
        @keyframes monitoring-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.72; }
        }
      `}</style>
    </div>
  );
}

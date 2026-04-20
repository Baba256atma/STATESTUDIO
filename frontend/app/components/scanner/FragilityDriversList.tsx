"use client";

import React from "react";
import type { FragilityDriver } from "../../types/fragilityScanner";

function severityColor(severity: string): string {
  const value = String(severity ?? "").trim().toLowerCase();
  if (value === "critical") return "#f87171";
  if (value === "high") return "#fb923c";
  if (value === "medium") return "#fde68a";
  return "#93c5fd";
}

type FragilityDriversListProps = {
  drivers: FragilityDriver[];
};

export function FragilityDriversList({
  drivers,
}: FragilityDriversListProps): React.ReactElement {
  const hasDrivers = drivers.length > 0;

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <h3 style={{ margin: 0, color: "#e2e8f0", fontSize: 13, fontWeight: 800 }}>Top Drivers</h3>
      {hasDrivers ? drivers.map((driver) => {
        const color = severityColor(driver.severity);
        return (
          <article
            key={driver.id}
            style={{
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(2,6,23,0.45)",
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>{driver.label}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#94a3b8", fontSize: 11 }}>{driver.score.toFixed(2)}</span>
                <span
                  style={{
                    color,
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    borderRadius: 999,
                    padding: "3px 8px",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {driver.severity}
                </span>
              </div>
            </div>
            {driver.dimension ? (
              <div style={{ color: "#94a3b8", fontSize: 11 }}>
                Dimension: {driver.dimension}
              </div>
            ) : null}
            {driver.evidence_text ? (
              <div style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.45 }}>{driver.evidence_text}</div>
            ) : null}
          </article>
        );
      }) : (
        <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>
          No driver breakdown was returned for this scan.
        </div>
      )}
    </section>
  );
}

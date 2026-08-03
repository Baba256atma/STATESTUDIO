"use client";

import type { MonitoringFilter } from "./ExecutiveMonitoringConfig";
import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";
import { cockpit } from "../shell/executiveCockpitTheme";

const FILTERS: readonly MonitoringFilter[] = [
  "All",
  "Healthy",
  "Warning",
  "Critical",
  "Alerts",
];

/**
 * ExecutiveMonitoringFilterBar — visual filtering only.
 */
export function ExecutiveMonitoringFilterBar() {
  const { filter, setFilter } = useExecutiveMonitoring();

  return (
    <div
      data-testid="executive-monitoring-filter-bar"
      style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}
    >
      {FILTERS.map((item) => {
        const active = filter === item;
        return (
          <button
            key={item}
            type="button"
            data-testid={`monitoring-filter-${item.toLowerCase()}`}
            onClick={() => setFilter(item)}
            style={{
              padding: "0.25rem 0.45rem",
              borderRadius: "999px",
              border: active
                ? "1px solid #039855"
                : `1px solid ${cockpit.border}`,
              background: active ? "rgba(3,152,85,0.16)" : "transparent",
              color: active ? "#039855" : cockpit.muted,
              fontSize: "0.58rem",
              letterSpacing: "0.04em",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 250ms ease, border-color 250ms ease",
            }}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

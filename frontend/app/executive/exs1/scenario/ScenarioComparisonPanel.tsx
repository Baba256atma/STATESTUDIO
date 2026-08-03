"use client";

import type { CSSProperties, ReactNode } from "react";
import { useScenarioExperience } from "./hooks/useScenarioExperience";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ScenarioComparisonPanel — mock Cost / Risk / ROI / Time / Confidence columns.
 */
export function ScenarioComparisonPanel() {
  const {
    showComparison,
    setShowComparison,
    scenarios,
    compareIds,
    currentScenarioId,
  } = useScenarioExperience();

  if (!showComparison) return null;

  const rows =
    compareIds.length >= 2
      ? scenarios.filter((s) => compareIds.includes(s.id))
      : scenarios.slice(0, 3);

  return (
    <div
      data-testid="scenario-comparison-panel"
      style={{
        position: "absolute",
        left: "50%",
        bottom: "1rem",
        transform: "translateX(-50%)",
        width: "min(36rem, calc(100% - 2rem))",
        zIndex: 9,
        borderRadius: "0.55rem",
        border: `1px solid ${cockpit.borderStrong}`,
        background: "rgba(10, 14, 20, 0.92)",
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
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: cockpit.text,
          }}
        >
          Scenario Comparison
        </strong>
        <button
          type="button"
          data-testid="scenario-comparison-close"
          onClick={() => setShowComparison(false)}
          style={closeBtn}
        >
          ×
        </button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.72rem",
          }}
        >
          <thead>
            <tr>
              <Th>Metric</Th>
              {rows.map((s) => (
                <Th key={s.id} color={s.color}>
                  {s.name}
                  {s.id === currentScenarioId ? " · Selected" : ""}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            <MetricRow label="Cost" values={rows.map((s) => s.cost)} />
            <MetricRow label="Risk" values={rows.map((s) => s.risk)} />
            <MetricRow label="ROI" values={rows.map((s) => s.roi)} />
            <MetricRow label="Time" values={rows.map((s) => s.durationLabel)} />
            <MetricRow
              label="Confidence"
              values={rows.map((s) => `${s.confidence}%`)}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  color,
}: {
  readonly children: ReactNode;
  readonly color?: string;
}) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "0.45rem 0.65rem",
        color: color ?? cockpit.lowMuted,
        fontWeight: 550,
        borderBottom: `1px solid ${cockpit.border}`,
      }}
    >
      {children}
    </th>
  );
}

function MetricRow({
  label,
  values,
}: {
  readonly label: string;
  readonly values: readonly string[];
}) {
  return (
    <tr>
      <td
        style={{
          padding: "0.4rem 0.65rem",
          color: cockpit.muted,
          borderBottom: `1px solid ${cockpit.border}`,
        }}
      >
        {label}
      </td>
      {values.map((value, index) => (
        <td
          key={`${label}-${index}`}
          style={{
            padding: "0.4rem 0.65rem",
            color: cockpit.textSoft,
            borderBottom: `1px solid ${cockpit.border}`,
          }}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}

const closeBtn: CSSProperties = {
  border: `1px solid ${cockpit.border}`,
  background: "transparent",
  color: cockpit.muted,
  borderRadius: "0.3rem",
  width: "1.6rem",
  height: "1.6rem",
  cursor: "pointer",
  fontFamily: "inherit",
};

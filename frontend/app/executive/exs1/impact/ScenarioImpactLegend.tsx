import {
  IMPACT_LEVEL_COLOR,
  IMPACT_STATUS_COLOR,
  type ImpactLevel,
  type ImpactStatus,
} from "./ScenarioImpactConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

const STATUSES: readonly ImpactStatus[] = [
  "Improved",
  "Affected",
  "Critical",
  "Neutral",
];
const LEVELS: readonly ImpactLevel[] = ["Low", "Medium", "High", "Critical"];

/**
 * ScenarioImpactLegend — color key for impact badges/levels.
 */
export function ScenarioImpactLegend() {
  return (
    <div
      data-testid="scenario-impact-legend"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        padding: "0.5rem 0.55rem",
        borderRadius: "0.4rem",
        border: `1px solid ${cockpit.border}`,
        background: "rgba(10, 14, 20, 0.72)",
      }}
    >
      <span
        style={{
          fontSize: "0.56rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Impact Legend
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
        {STATUSES.map((status) => (
          <LegendChip
            key={status}
            label={status}
            color={IMPACT_STATUS_COLOR[status]}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
        {LEVELS.map((level) => (
          <LegendChip
            key={level}
            label={level}
            color={IMPACT_LEVEL_COLOR[level]}
          />
        ))}
      </div>
    </div>
  );
}

function LegendChip({
  label,
  color,
}: {
  readonly label: string;
  readonly color: string;
}) {
  return (
    <span
      style={{
        fontSize: "0.52rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}66`,
        borderRadius: "999px",
        padding: "0.12rem 0.35rem",
        background: `${color}14`,
      }}
    >
      {label}
    </span>
  );
}

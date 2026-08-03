import {
  IMPACT_LEVEL_COLOR,
  IMPACT_STATUS_COLOR,
  type ImpactLevel,
  type ImpactStatus,
} from "./ScenarioImpactConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly status?: ImpactStatus;
  readonly level?: ImpactLevel;
  readonly label?: string;
  readonly compact?: boolean;
};

/**
 * ScenarioImpactBadge — Affected / Improved / Critical / Neutral + level.
 */
export function ScenarioImpactBadge({
  status,
  level,
  label,
  compact = false,
}: Props) {
  const color = status
    ? IMPACT_STATUS_COLOR[status]
    : level
      ? IMPACT_LEVEL_COLOR[level]
      : cockpit.accent;
  const text = label ?? status ?? level ?? "Impact";

  return (
    <span
      data-testid="scenario-impact-badge"
      data-status={status ?? ""}
      data-level={level ?? ""}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: compact ? "0.1rem 0.32rem" : "0.14rem 0.4rem",
        borderRadius: "999px",
        border: `1px solid ${color}`,
        background: `${color}22`,
        color,
        fontSize: compact ? "0.5rem" : "0.56rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        transition: cockpit.transition,
      }}
    >
      {text}
    </span>
  );
}

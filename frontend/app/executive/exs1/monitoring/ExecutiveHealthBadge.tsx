import {
  HEALTH_COLOR,
  type ExecutiveHealthState,
} from "./ExecutiveMonitoringConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly health: ExecutiveHealthState;
  readonly compact?: boolean;
};

/**
 * ExecutiveHealthBadge — Excellent / Healthy / Warning / Critical.
 */
export function ExecutiveHealthBadge({ health, compact = false }: Props) {
  const color = HEALTH_COLOR[health];

  return (
    <span
      data-testid="executive-health-badge"
      data-health={health}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: compact ? "0.1rem 0.32rem" : "0.14rem 0.42rem",
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
      {health}
    </span>
  );
}

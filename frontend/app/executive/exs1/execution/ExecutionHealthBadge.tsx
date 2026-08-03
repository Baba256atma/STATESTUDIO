import {
  TASK_HEALTH_COLOR,
  TASK_STATUS_COLOR,
  type TaskHealth,
  type TaskStatus,
} from "./ExecutionConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly health?: TaskHealth;
  readonly status?: TaskStatus;
  readonly label?: string;
  readonly compact?: boolean;
};

/**
 * ExecutionHealthBadge — Healthy / Warning / Blocked / Completed (+ status).
 */
export function ExecutionHealthBadge({
  health,
  status,
  label,
  compact = false,
}: Props) {
  const text = label ?? health ?? status ?? "Task";
  const color = health
    ? TASK_HEALTH_COLOR[health]
    : status
      ? TASK_STATUS_COLOR[status]
      : cockpit.accent;

  return (
    <span
      data-testid="execution-health-badge"
      data-health={health ?? ""}
      data-status={status ?? ""}
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
      {text}
    </span>
  );
}

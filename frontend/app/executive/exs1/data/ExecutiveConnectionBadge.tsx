import {
  CONNECTION_STATUS_COLOR,
  DATA_HEALTH_COLOR,
  type ConnectionStatus,
  type DataHealth,
} from "./ExecutiveDataConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly status?: ConnectionStatus;
  readonly health?: DataHealth;
  readonly compact?: boolean;
};

export function ExecutiveConnectionBadge({
  status,
  health,
  compact = false,
}: Props) {
  const label = status ?? health ?? "Data";
  const color = status
    ? CONNECTION_STATUS_COLOR[status]
    : health
      ? DATA_HEALTH_COLOR[health]
      : cockpit.accent;

  return (
    <span
      data-testid="executive-connection-badge"
      data-status={status ?? ""}
      data-health={health ?? ""}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: compact ? "0.1rem 0.32rem" : "0.14rem 0.42rem",
        borderRadius: cockpit.radius.pill,
        border: `1px solid ${color}`,
        background: `${color}22`,
        color,
        fontSize: compact ? "0.5rem" : "0.56rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

import {
  DECISION_STATUS_COLOR,
  type DecisionStatus,
} from "./ExecutiveDecisionConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly status?: DecisionStatus;
  readonly label?: string;
  readonly locked?: boolean;
  readonly compact?: boolean;
};

/**
 * ExecutiveDecisionBadge — Draft / Approved / Rejected / Review / Locked.
 */
export function ExecutiveDecisionBadge({
  status,
  label,
  locked = false,
  compact = false,
}: Props) {
  const statusLabel =
    status === "Under Review" ? "Review" : status;
  const text = locked ? "Locked" : label ?? statusLabel ?? "Decision";
  const color = locked
    ? "#12B76A"
    : status
      ? DECISION_STATUS_COLOR[status]
      : cockpit.accent;

  return (
    <span
      data-testid="executive-decision-badge"
      data-status={status ?? ""}
      data-locked={locked ? "true" : "false"}
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

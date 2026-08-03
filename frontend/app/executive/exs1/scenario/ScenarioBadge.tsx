import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly label: string;
  readonly color: string;
  readonly selected?: boolean;
  readonly compact?: boolean;
};

/**
 * ScenarioBadge — Selected / compare / scenario labels on Stage.
 */
export function ScenarioBadge({
  label,
  color,
  selected = false,
  compact = false,
}: Props) {
  return (
    <span
      data-testid="scenario-badge"
      data-label={label}
      data-selected={selected ? "true" : "false"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: compact ? "0.1rem 0.32rem" : "0.14rem 0.42rem",
        borderRadius: "999px",
        border: `1px solid ${color}`,
        background: selected ? `${color}33` : `${color}18`,
        color,
        fontSize: compact ? "0.5rem" : "0.56rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        transition: cockpit.transition,
      }}
    >
      {label}
    </span>
  );
}

import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly label: string;
  readonly accent: string;
  readonly compact?: boolean;
};

/**
 * ExecutiveModeBadge — scenario / focus / health labels on Stage.
 */
export function ExecutiveModeBadge({
  label,
  accent,
  compact = false,
}: Props) {
  return (
    <span
      data-testid="executive-mode-badge"
      data-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: compact ? "0.12rem 0.35rem" : "0.18rem 0.45rem",
        borderRadius: "999px",
        border: `1px solid ${accent}`,
        background: `${accent}22`,
        color: accent,
        fontSize: compact ? "0.5rem" : "0.58rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        lineHeight: 1.2,
        transition: cockpit.transition,
      }}
    >
      {label}
    </span>
  );
}

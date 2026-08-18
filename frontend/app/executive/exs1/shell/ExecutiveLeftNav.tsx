import type { CSSProperties } from "react";
import type { ExecutiveNavId } from "./executiveCockpitTypes";
import { EXECUTIVE_NAV_ITEMS } from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";

const NAV_SHORT: Record<ExecutiveNavId, string> = {
  Home: "Hm",
  Model: "Md",
  Objects: "Ob",
  Data: "Dt",
  Knowledge: "Kn",
  Intelligence: "In",
  Simulations: "Sm",
  Journal: "Jn",
  Search: "Sr",
  Settings: "St",
};

const PRIMARY_NAV: readonly ExecutiveNavId[] = Object.freeze([
  "Home",
  "Data",
  "Journal",
]);

const SECONDARY_NAV: readonly ExecutiveNavId[] = Object.freeze(
  EXECUTIVE_NAV_ITEMS.filter((id) => !PRIMARY_NAV.includes(id)),
);

type Props = {
  readonly active: ExecutiveNavId;
  readonly onSelect: (id: ExecutiveNavId) => void;
  /** UX:1 — primary destinations visible; secondary behind More. */
  readonly compact?: boolean;
};

/**
 * Executive Left Navigation — collapsed icon rail.
 * Never expands. Fixed width.
 */
export function ExecutiveLeftNav({
  active,
  onSelect,
  compact = false,
}: Props) {
  const items = compact ? PRIMARY_NAV : EXECUTIVE_NAV_ITEMS;
  const secondaryOpen = compact && SECONDARY_NAV.includes(active);

  return (
    <nav
      data-testid="executive-left-nav"
      data-exs1-compat="exs1-left-rail"
      data-ux1-nav={compact ? "compact" : "full"}
      aria-label="Executive Navigation"
      style={{
        width: cockpit.navWidth,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: compact ? "0.28rem" : "0.4rem",
        padding: compact ? "0.55rem 0.35rem" : "0.75rem 0.4rem",
        background: compact
          ? cockpit.charcoal
          : `linear-gradient(180deg, ${cockpit.charcoal} 0%, ${cockpit.navy} 100%)`,
        borderRight: `1px solid ${cockpit.border}`,
        zIndex: 12,
      }}
    >
      {items.map((id) => (
        <NavButton
          key={id}
          id={id}
          active={active}
          compact={compact}
          onSelect={onSelect}
        />
      ))}

      {compact ? (
        <details
          data-testid="executive-nav-more"
          open={secondaryOpen || undefined}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.28rem",
          }}
        >
          <summary
            aria-label="More navigation"
            title="More"
            style={{
              ...navButtonStyle(false, compact),
              listStyle: "none",
              width: compact ? "2.2rem" : "2.55rem",
              height: compact ? "2.2rem" : "2.55rem",
            }}
          >
            <span style={{ fontSize: "0.78rem", letterSpacing: "0.08em" }}>
              ···
            </span>
          </summary>
          {SECONDARY_NAV.map((id) => (
            <NavButton
              key={id}
              id={id}
              active={active}
              compact={compact}
              onSelect={onSelect}
            />
          ))}
        </details>
      ) : null}
    </nav>
  );
}

function NavButton({
  id,
  active,
  compact,
  onSelect,
}: {
  readonly id: ExecutiveNavId;
  readonly active: ExecutiveNavId;
  readonly compact: boolean;
  readonly onSelect: (id: ExecutiveNavId) => void;
}) {
  const isActive = id === active;
  return (
    <button
      type="button"
      data-testid={`executive-nav-${id.toLowerCase()}`}
      aria-label={id}
      aria-current={isActive ? "page" : undefined}
      title={id}
      onClick={() => onSelect(id)}
      style={navButtonStyle(isActive, compact)}
    >
      <span
        style={{
          fontSize: compact ? "0.62rem" : "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        {NAV_SHORT[id]}
      </span>
      {compact ? null : (
        <span
          style={{
            fontSize: "0.48rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          {id.slice(0, 4)}
        </span>
      )}
    </button>
  );
}

function navButtonStyle(isActive: boolean, compact: boolean): CSSProperties {
  return {
    width: compact ? "2.2rem" : "2.55rem",
    height: compact ? "2.2rem" : "2.55rem",
    borderRadius: "0.45rem",
    border: isActive
      ? `1px solid ${cockpit.borderStrong}`
      : "1px solid transparent",
    background: isActive
      ? `linear-gradient(135deg, ${cockpit.accentSoft}, ${cockpit.graphite})`
      : "transparent",
    color: isActive ? cockpit.accent : cockpit.muted,
    boxShadow: isActive && !compact ? `0 0 16px ${cockpit.accentGlow}` : "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.15rem",
    transition: cockpit.transition,
    fontFamily: "inherit",
  };
}

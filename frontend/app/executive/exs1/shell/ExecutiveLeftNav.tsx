import type { ExecutiveNavId } from "./executiveCockpitTypes";
import { EXECUTIVE_NAV_ITEMS } from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";

const NAV_SHORT: Record<ExecutiveNavId, string> = {
  Home: "Hm",
  Model: "Md",
  Objects: "Ob",
  Data: "Dt",
  Journal: "Jn",
  Search: "Sr",
  Settings: "St",
};

type Props = {
  readonly active: ExecutiveNavId;
  readonly onSelect: (id: ExecutiveNavId) => void;
};

/**
 * Executive Left Navigation — collapsed icon rail.
 * Never expands. Fixed width.
 */
export function ExecutiveLeftNav({ active, onSelect }: Props) {
  return (
    <nav
      data-testid="executive-left-nav"
      data-exs1-compat="exs1-left-rail"
      aria-label="Executive Navigation"
      style={{
        width: cockpit.navWidth,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.75rem 0.4rem",
        background: `linear-gradient(180deg, ${cockpit.charcoal} 0%, ${cockpit.navy} 100%)`,
        borderRight: `1px solid ${cockpit.border}`,
        zIndex: 12,
      }}
    >
      {EXECUTIVE_NAV_ITEMS.map((id) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            data-testid={`executive-nav-${id.toLowerCase()}`}
            aria-label={id}
            aria-current={isActive ? "page" : undefined}
            title={id}
            onClick={() => onSelect(id)}
            style={{
              width: "2.55rem",
              height: "2.55rem",
              borderRadius: "0.45rem",
              border: isActive
                ? `1px solid ${cockpit.borderStrong}`
                : "1px solid transparent",
              background: isActive
                ? `linear-gradient(135deg, ${cockpit.accentSoft}, ${cockpit.graphite})`
                : "transparent",
              color: isActive ? cockpit.accent : cockpit.muted,
              boxShadow: isActive ? `0 0 16px ${cockpit.accentGlow}` : "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.15rem",
              transition: cockpit.transition,
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {NAV_SHORT[id]}
            </span>
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
          </button>
        );
      })}
    </nav>
  );
}

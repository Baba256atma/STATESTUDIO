import type { ReactNode } from "react";
import {
  EXECUTIVE_TIMELINE_LENSES,
  type ExecutiveTimelineLens,
} from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";

export type ExecutiveTimelinePack = {
  readonly id: string;
  readonly title: string;
  readonly risk: "warning" | "risk" | "success";
};

type Props = {
  readonly lens: ExecutiveTimelineLens;
  readonly lensHighlighted?: boolean;
  readonly packs: readonly ExecutiveTimelinePack[];
  readonly selectedPackId: string | null;
  readonly packHighlighted?: boolean;
  readonly onSelectLens: (lens: ExecutiveTimelineLens) => void;
  readonly onSelectPack: (packId: string) => void;
  readonly futureMarkerLabel?: string;
  readonly packStripExtra?: ReactNode;
};

const RISK_COLOR = {
  warning: cockpit.warning,
  risk: cockpit.risk,
  success: cockpit.success,
} as const;

/**
 * Executive Timeline Dock — below Stage only.
 * Changes time; never changes workspace.
 */
export function ExecutiveTimelineDock({
  lens,
  lensHighlighted = false,
  packs,
  selectedPackId,
  packHighlighted = false,
  onSelectLens,
  onSelectPack,
  futureMarkerLabel = "Now →",
}: Props) {
  return (
    <footer
      data-testid="executive-timeline-dock"
      data-exs1-compat="exs1-bottom-strip"
      aria-label="Executive Timeline Dock"
      style={{
        height: cockpit.timelineHeight,
        flexShrink: 0,
        display: "flex",
        alignItems: "stretch",
        gap: "0.95rem",
        padding: "0.6rem 1rem",
        background: `linear-gradient(180deg, ${cockpit.graphite} 0%, ${cockpit.charcoal} 100%)`,
        borderTop: `1px solid ${cockpit.border}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        transition: `opacity ${cockpit.timelineMs} ${cockpit.motion.easing}, border-color ${cockpit.timelineMs} ${cockpit.motion.easing}`,
      }}
    >
      <section
        data-testid="executive-replay"
        data-exs1-compat="exs1-replay"
        aria-label="Replay unavailable"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0.2rem",
          minWidth: "4.5rem",
          opacity: 0.45,
        }}
      >
        <p style={labelStyle}>Replay</p>
        <span
          style={{
            fontSize: "0.68rem",
            color: cockpit.lowMuted,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Future
        </span>
      </section>

      <section
        data-testid="executive-timeline"
        data-exs1-compat="exs1-timeline"
        data-highlighted={lensHighlighted ? "true" : "false"}
        aria-label="Timeline"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          minWidth: "12rem",
          flex: "0.9 1 12rem",
          padding: "0.1rem 0.3rem",
          borderRadius: "0.4rem",
          border: lensHighlighted
            ? `1px solid ${cockpit.borderStrong}`
            : "1px solid transparent",
          background: lensHighlighted ? cockpit.accentSoft : "transparent",
          transition: cockpit.transition,
        }}
      >
        <p style={labelStyle}>Timeline</p>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {EXECUTIVE_TIMELINE_LENSES.map((item) => {
            const active = item === lens;
            return (
              <button
                key={item}
                type="button"
                data-testid={`executive-timeline-${item}`}
                data-exs1-compat={
                  item === "year" ? undefined : `exs1-timeline-${item}`
                }
                aria-pressed={active}
                onClick={() => onSelectLens(item)}
                style={{
                  flex: 1,
                  padding: "0.38rem 0.25rem",
                  borderRadius: cockpit.radius.sm,
                  border: active
                    ? `1px solid ${cockpit.borderStrong}`
                    : `1px solid ${cockpit.border}`,
                  background: active ? cockpit.accentSoft : "transparent",
                  color: active ? cockpit.accent : cockpit.muted,
                  fontSize: "0.64rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: active ? 600 : 450,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: cockpit.transition,
                  boxShadow: active ? cockpit.elevation.focus : "none",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      <section
        data-testid="executive-pack-strip"
        data-exs1-compat="exs1-pack-strip"
        aria-label="Pack Strip"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          minWidth: "10rem",
          flex: "1.2 1 10rem",
        }}
      >
        <p style={labelStyle}>Pack Strip</p>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {packs.map((pack) => {
            const selected = selectedPackId === pack.id;
            const highlighted = packHighlighted || selected;
            return (
              <button
                key={pack.id}
                type="button"
                data-testid={`executive-pack-${pack.id}`}
                data-exs1-compat={`exs1-pack-${pack.id}`}
                data-highlighted={highlighted ? "true" : "false"}
                aria-pressed={selected}
                onClick={() => onSelectPack(pack.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.42rem 0.7rem",
                  borderRadius: cockpit.radius.md,
                  border: highlighted
                    ? `1px solid ${RISK_COLOR[pack.risk]}`
                    : `1px solid ${cockpit.border}`,
                  background: highlighted
                    ? `${RISK_COLOR[pack.risk]}14`
                    : "linear-gradient(165deg, rgba(26,31,42,0.9), rgba(15,19,28,0.95))",
                  color: cockpit.text,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: cockpit.transition,
                  boxShadow: highlighted
                    ? `0 0 18px ${RISK_COLOR[pack.risk]}28, ${cockpit.elevation.raised}`
                    : cockpit.elevation.raised,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "0.45rem",
                    height: "0.45rem",
                    borderRadius: cockpit.radius.pill,
                    background: RISK_COLOR[pack.risk],
                    boxShadow: `0 0 8px ${RISK_COLOR[pack.risk]}`,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  {pack.title}
                </span>
                <span
                  style={{
                    marginLeft: "0.15rem",
                    fontSize: "0.5rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: RISK_COLOR[pack.risk],
                    opacity: 0.9,
                  }}
                >
                  Case
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        data-testid="executive-future-marker"
        aria-label="Future position marker"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0.2rem",
          minWidth: "4.5rem",
          marginLeft: "auto",
        }}
      >
        <p style={labelStyle}>Position</p>
        <span
          style={{
            fontSize: "0.72rem",
            color: cockpit.accent,
            letterSpacing: "0.04em",
          }}
        >
          {futureMarkerLabel}
        </span>
      </section>
    </footer>
  );
}

const labelStyle = {
  margin: 0,
  fontSize: cockpit.type.status.size,
  letterSpacing: cockpit.type.status.tracking,
  textTransform: "uppercase" as const,
  color: cockpit.lowMuted,
  fontWeight: cockpit.type.status.weight,
};

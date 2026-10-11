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
  readonly timeLabel?: string;
  readonly placeable?: boolean;
  readonly sourceId?: string | null;
  readonly factType?: string;
  readonly projectionKey?: string;
  readonly group?: "chronological" | "unplaced";
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
  /** UX:1 — collapse Timeline / Pack Strip until the manager needs them. */
  readonly defaultCollapsed?: boolean;
  readonly emptyLabel?: string;
  readonly periodNote?: string | null;
  readonly historySubjectId?: string | null;
  readonly historySource?: "canonical-projection";
  readonly chronologicalCount?: number;
  readonly unplacedCount?: number;
};

const RISK_COLOR = {
  warning: cockpit.warning,
  risk: cockpit.risk,
  success: cockpit.success,
} as const;

type BodyProps = {
  readonly lens: ExecutiveTimelineLens;
  readonly lensHighlighted: boolean;
  readonly packs: readonly ExecutiveTimelinePack[];
  readonly selectedPackId: string | null;
  readonly packHighlighted: boolean;
  readonly onSelectLens: (lens: ExecutiveTimelineLens) => void;
  readonly onSelectPack: (packId: string) => void;
  readonly futureMarkerLabel: string;
  readonly compactLabels?: boolean;
  readonly emptyLabel?: string;
  readonly periodNote?: string | null;
};

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
  defaultCollapsed = false,
  emptyLabel = "No supported history yet",
  periodNote = null,
  historySubjectId = null,
  historySource,
  chronologicalCount,
  unplacedCount,
}: Props) {
  const selectedPack = packs.find((pack) => pack.id === selectedPackId);
  const collapsedLabel = selectedPack
    ? `${lens} · ${selectedPack.title}`
    : lens;

  return (
    <footer
      data-testid="executive-timeline-dock"
      data-exs1-compat="exs1-bottom-strip"
      data-timeline-collapsed={defaultCollapsed ? "true" : "false"}
      data-history-source={historySource}
      data-historical-subject={historySubjectId ?? ""}
      data-historical-chronological-count={
        chronologicalCount == null ? undefined : String(chronologicalCount)
      }
      data-historical-unplaced-count={unplacedCount == null ? undefined : String(unplacedCount)}
      aria-label="Executive Timeline Dock"
      style={{
        height: defaultCollapsed ? "auto" : cockpit.timelineHeight,
        minHeight: defaultCollapsed
          ? cockpit.timelineCollapsedHeight
          : cockpit.timelineHeight,
        flexShrink: 0,
        display: "flex",
        alignItems: "stretch",
        gap: "0.95rem",
        padding: defaultCollapsed ? "0.2rem 0.75rem" : "0.6rem 1rem",
        background: defaultCollapsed
          ? cockpit.charcoal
          : `linear-gradient(180deg, ${cockpit.graphite} 0%, ${cockpit.charcoal} 100%)`,
        borderTop: `1px solid ${cockpit.border}`,
        boxShadow: defaultCollapsed
          ? "none"
          : "inset 0 1px 0 rgba(255,255,255,0.02)",
        transition: `opacity ${cockpit.timelineMs} ${cockpit.motion.easing}, border-color ${cockpit.timelineMs} ${cockpit.motion.easing}`,
      }}
    >
      {defaultCollapsed ? (
        <details
          data-testid="executive-timeline-disclosure"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <summary
            style={{
              listStyle: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              minHeight: "1.45rem",
              fontFamily: "inherit",
              color: cockpit.muted,
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: cockpit.lowMuted }}>Period</span>
            <span style={{ color: cockpit.accent }}>{collapsedLabel}</span>
          </summary>
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: "0.95rem",
              padding: "0.45rem 0 0.35rem",
            }}
          >
            <TimelineDockBody
              lens={lens}
              lensHighlighted={lensHighlighted}
              packs={packs}
              selectedPackId={selectedPackId}
              packHighlighted={packHighlighted}
              onSelectLens={onSelectLens}
              onSelectPack={onSelectPack}
              futureMarkerLabel={futureMarkerLabel}
              compactLabels
              emptyLabel={emptyLabel}
              periodNote={periodNote}
            />
          </div>
        </details>
      ) : (
        <TimelineDockBody
          lens={lens}
          lensHighlighted={lensHighlighted}
          packs={packs}
          selectedPackId={selectedPackId}
          packHighlighted={packHighlighted}
          onSelectLens={onSelectLens}
          onSelectPack={onSelectPack}
          futureMarkerLabel={futureMarkerLabel}
          emptyLabel={emptyLabel}
          periodNote={periodNote}
        />
      )}
    </footer>
  );
}

function TimelineDockBody({
  lens,
  lensHighlighted,
  packs,
  selectedPackId,
  packHighlighted,
  onSelectLens,
  onSelectPack,
  futureMarkerLabel,
  compactLabels = false,
  emptyLabel = "No supported history yet",
  periodNote = null,
}: BodyProps) {
  return (
    <>
      <section
        data-testid="executive-replay"
        data-exs1-compat="exs1-replay"
        aria-label="Replay unavailable"
        style={{
          display: compactLabels ? "none" : "flex",
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
        <p style={labelStyle}>{compactLabels ? "Period" : "Timeline"}</p>
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
        <p style={labelStyle}>{compactLabels ? "Recent" : "Pack Strip"}</p>
        {periodNote ? (
          <p
            data-testid="executive-timeline-period-note"
            style={{ margin: 0, fontSize: "0.68rem", color: cockpit.muted }}
          >
            {periodNote}
          </p>
        ) : null}
        {packs.length === 0 && !periodNote ? (
          <p
            data-testid="executive-timeline-empty"
            style={{ margin: 0, fontSize: "0.72rem", color: cockpit.muted }}
          >
            {emptyLabel}
          </p>
        ) : null}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {packs.map((pack, index) => {
            const selected = selectedPackId === pack.id;
            const highlighted = packHighlighted || selected;
            const showUnplaced =
              pack.group === "unplaced" && packs[index - 1]?.group !== "unplaced";
            return (
              <span key={pack.id} style={{ display: "contents" }}>
                {showUnplaced ? (
                  <span
                    data-testid="executive-timeline-unplaced"
                    style={{
                      alignSelf: "center",
                      fontSize: "0.58rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: cockpit.lowMuted,
                    }}
                  >
                    Time unknown
                  </span>
                ) : null}
              <button
                type="button"
                data-testid={`executive-pack-${pack.id}`}
                data-exs1-compat={`exs1-pack-${pack.id}`}
                data-highlighted={highlighted ? "true" : "false"}
                data-source-id={pack.sourceId ?? ""}
                data-fact-type={pack.factType ?? ""}
                data-placeable={pack.placeable === true ? "true" : pack.placeable === false ? "false" : undefined}
                data-projection-key={pack.projectionKey ?? ""}
                data-historical-group={pack.group ?? ""}
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
                {pack.timeLabel ? (
                  <span
                    style={{
                      fontSize: "0.62rem",
                      color: cockpit.muted,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {pack.timeLabel}
                  </span>
                ) : null}
                {compactLabels ? null : (
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
                )}
              </button>
              </span>
            );
          })}
        </div>
      </section>

      <section
        data-testid="executive-future-marker"
        aria-label="Future position marker"
        style={{
          display: compactLabels ? "none" : "flex",
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
    </>
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

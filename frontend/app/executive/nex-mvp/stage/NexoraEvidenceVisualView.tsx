"use client";

import { cockpit } from "@/app/executive/exs1/shell/executiveCockpitTheme";
import type { NexoraVisualView } from "@/app/lib/director/nexoraVisualIntelligence.ts";

export function NexoraEvidenceVisualView({
  view,
  reducedMotion,
  onDismiss,
}: Readonly<{
  readonly view: NexoraVisualView;
  readonly reducedMotion: boolean;
  readonly onDismiss: () => void;
}>) {
  const points = view.series.flatMap((series, seriesIndex) =>
    series.points.map((point, pointIndex) => ({
      key: `${series.id}-${point.periodLabel}`,
      label:
        view.purpose === "COMPARE" && series.points.length === 1
          ? series.displayLabel
          : point.periodLabel,
      value: point.value,
      seriesIndex,
      pointIndex,
    })),
  );
  const max = Math.max(...points.map((point) => point.value), 1);
  const min = Math.min(...points.map((point) => point.value), 0);
  const span = Math.max(max - min, max * 0.08, 1);

  return (
    <aside
      data-testid="nexora-evidence-visual-view"
      data-visual-purpose={view.purpose}
      data-visual-representation={view.representation}
      data-visual-example={view.provenance.example ? "true" : "false"}
      data-visual-object="false"
      aria-label={view.description}
      style={{
        pointerEvents: "auto",
        position: "absolute",
        right: "1.25rem",
        bottom: "1.35rem",
        width: "min(420px, calc(100% - 2.5rem))",
        maxHeight: "46%",
        padding: "0.9rem 1rem 0.85rem",
        borderRadius: "0.85rem",
        background: cockpit.panel,
        border: `1px solid ${cockpit.border}`,
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.35)",
        color: cockpit.text,
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: cockpit.muted,
            }}
          >
            Evidence view
          </p>
          <h2
            style={{
              margin: "0.2rem 0 0",
              fontSize: "0.92rem",
              fontWeight: 600,
            }}
          >
            {view.title}
          </h2>
        </div>
        <button
          type="button"
          data-testid="nexora-evidence-visual-dismiss"
          onClick={onDismiss}
          style={{
            background: "transparent",
            border: `1px solid ${cockpit.border}`,
            color: cockpit.muted,
            borderRadius: "999px",
            padding: "0.2rem 0.7rem",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </header>
      <svg
        role="img"
        aria-label={view.description}
        viewBox="0 0 360 140"
        width="100%"
        height={140}
        style={{ flex: "0 0 auto" }}
      >
        {view.representation === "TREND_LINE" ? (
          <TrendLine points={points} min={min} span={span} reducedMotion={reducedMotion} />
        ) : (
          <ComparisonBars points={points} max={max} />
        )}
      </svg>
      <p style={{ margin: 0, fontSize: "0.72rem", color: cockpit.muted, lineHeight: 1.45 }}>
        {view.provenance.example ? "Example source · " : ""}
        {view.provenance.fieldLabels.join(", ")} · {view.provenance.periodLabel}.
        Color here is presentation, not a business status.
      </p>
    </aside>
  );
}

function TrendLine({
  points,
  min,
  span,
  reducedMotion,
}: {
  readonly points: readonly { readonly label: string; readonly value: number }[];
  readonly min: number;
  readonly span: number;
  readonly reducedMotion: boolean;
}) {
  const coords = points.map((point, index) => {
    const x = 28 + (index * 304) / Math.max(points.length - 1, 1);
    const y = 118 - ((point.value - min) / span) * 92;
    return { x, y, label: point.label, value: point.value };
  });
  const path = coords.map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x} ${coord.y}`).join(" ");
  return (
    <g>
      <path d={path} fill="none" stroke={cockpit.accent} strokeWidth={2} />
      {coords.map((coord) => (
        <g key={`${coord.label}-${coord.value}`}>
          <circle cx={coord.x} cy={coord.y} r={reducedMotion ? 3.5 : 3.5} fill={cockpit.accent} />
          <text x={coord.x} y={132} textAnchor="middle" fill={cockpit.muted} fontSize="10">
            {coord.label}
          </text>
          <text x={coord.x} y={coord.y - 8} textAnchor="middle" fill={cockpit.textSoft} fontSize="10">
            {coord.value}
          </text>
        </g>
      ))}
    </g>
  );
}

function ComparisonBars({
  points,
  max,
}: {
  readonly points: readonly { readonly label: string; readonly value: number; readonly key: string }[];
  readonly max: number;
}) {
  const width = Math.min(48, 280 / Math.max(points.length, 1));
  return (
    <g>
      {points.map((point, index) => {
        const height = (point.value / max) * 92;
        const x = 40 + index * (width + 36);
        const y = 118 - height;
        return (
          <g key={point.key}>
            <rect x={x} y={y} width={width} height={height} fill={cockpit.accentSoft} stroke={cockpit.accent} />
            <text x={x + width / 2} y={132} textAnchor="middle" fill={cockpit.muted} fontSize="9">
              {point.label.length > 18 ? point.label.slice(0, 16) : point.label}
            </text>
            <text x={x + width / 2} y={y - 6} textAnchor="middle" fill={cockpit.textSoft} fontSize="10">
              {point.value}
            </text>
          </g>
        );
      })}
    </g>
  );
}

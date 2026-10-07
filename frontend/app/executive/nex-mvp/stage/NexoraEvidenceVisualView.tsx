"use client";

import { cockpit } from "@/app/executive/exs1/shell/executiveCockpitTheme";
import type { NexoraVisualView } from "@/app/lib/director/nexoraVisualIntelligence.ts";
import type { StageProdOverlayStyle } from "@/app/lib/stage-prod/stageProdOverlayPlacement.ts";

function shortPeriodLabel(label: string): string {
  const match = label.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return label.length > 12 ? label.slice(0, 12) : label;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[Number(match[2]) - 1] ?? label;
}

function subjectLabel(id: string): string {
  return id.replace(/^obj-/, "").replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function NexoraEvidenceVisualView({
  view,
  reducedMotion,
  onDismiss,
  inspection,
  overlayPlacement,
}: Readonly<{
  readonly view: NexoraVisualView;
  readonly reducedMotion: boolean;
  readonly onDismiss?: () => void;
  readonly inspection?: Readonly<{
    readonly canonicalObjectIds: readonly string[];
    readonly sourceIds: readonly string[];
    readonly evidenceStates: readonly string[];
  }>;
  readonly overlayPlacement?: StageProdOverlayStyle;
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
  const observationCount = points.length;
  const metric = view.provenance.fieldLabels.join(", ") || view.series[0]?.fieldLabel || "Metric";
  const source = view.provenance.sourceLabel || view.series[0]?.sourceLabel || "Unknown source";
  const status = view.provenance.example ? "Example" : "Accepted";
  const subject =
    inspection?.canonicalObjectIds.map(subjectLabel).join(", ") ||
    view.series.map((series) => series.displayLabel).join(", ") ||
    "Current subject";

  return (
    <aside
      data-testid="nexora-evidence-visual-view"
      data-visual-purpose={view.purpose}
      data-visual-representation={view.representation}
      data-visual-example={view.provenance.example ? "true" : "false"}
      data-visual-object="false"
      data-visual-motion="static"
      data-visual-reduced-motion={reducedMotion ? "true" : "false"}
      data-visual-observation-count={String(observationCount)}
      data-visual-source-label={source}
      data-visual-metric={metric}
      data-stage-overlay-slot="evidence-visual"
      aria-label={view.description}
      style={{
        pointerEvents: "auto",
        position: "absolute",
        padding: "0.9rem 1rem 0.85rem",
        borderRadius: "0.85rem",
        background: cockpit.panel,
        border: `1px solid ${cockpit.border}`,
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.35)",
        color: cockpit.text,
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
        overflow: "auto",
        zIndex: 4,
        ...(overlayPlacement ?? {
          left: "1.25rem",
          bottom: "1.35rem",
          width: "min(420px, calc(100% - 2.5rem))",
          maxHeight: "46%",
        }),
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
            {subject} · {view.representation === "COMPARISON_BARS" ? "Bar chart" : "Over time"}
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
        {onDismiss ? <button
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
        </button> : null}
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
        {metric} · {observationCount} observations · {status}.
        Color here is presentation, not a business status.
      </p>
      {inspection ? (
        <details
          data-testid="nexora-stage-visual-inspection"
          data-stage-visual-inspection-writes="false"
          style={{ color: cockpit.muted, fontSize: "0.66rem" }}
        >
          <summary style={{ cursor: "pointer" }}>Show evidence</summary>
          <div data-stage-visual-inspection-source-label={source}>
            Source: {source}
          </div>
          <div data-stage-visual-inspection-status={status}>
            Status: {status}
          </div>
          <div data-stage-visual-inspection-subject={subject}>
            Subject: {subject}
          </div>
          <div data-stage-visual-inspection-metric={metric}>
            Metric: {metric}
          </div>
          <div data-stage-visual-inspection-observations={String(observationCount)}>
            Observations: {observationCount}
          </div>
          <div data-stage-visual-inspection-object-ids={inspection.canonicalObjectIds.join("|") || "none"}>
            Objects: {inspection.canonicalObjectIds.join(", ") || "none"}
          </div>
          <div data-stage-visual-inspection-source-ids={inspection.sourceIds.join("|") || "none"}>
            Sources: {inspection.sourceIds.join(", ") || "none"}
          </div>
          <div data-stage-visual-inspection-evidence={inspection.evidenceStates.join("|") || "none"}>
            Evidence: {inspection.evidenceStates.join(", ") || "none"}
          </div>
        </details>
      ) : null}
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
    <g data-visual-family="TREND_LINE" data-visual-animated="false">
      <path d={path} fill="none" stroke={cockpit.accent} strokeWidth={2} />
      {coords.map((coord) => (
        <g
          key={`${coord.label}-${coord.value}`}
          data-visual-point="true"
          data-visual-period={coord.label}
          data-visual-value={String(coord.value)}
        >
          <circle cx={coord.x} cy={coord.y} r={reducedMotion ? 3.5 : 3.5} fill={cockpit.accent} />
          <text x={coord.x} y={132} textAnchor="middle" fill={cockpit.muted} fontSize="10">
            {shortPeriodLabel(coord.label)}
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
  const slot = 304 / Math.max(points.length, 1);
  const width = Math.min(28, slot * 0.62);
  return (
    <g data-visual-family="COMPARISON_BARS" data-visual-animated="false">
      {points.map((point, index) => {
        const height = (point.value / max) * 92;
        const x = 28 + index * slot + (slot - width) / 2;
        const y = 118 - height;
        return (
          <g
            key={point.key}
            data-visual-point="true"
            data-visual-period={point.label}
            data-visual-value={String(point.value)}
          >
            <rect x={x} y={y} width={width} height={height} fill={cockpit.accentSoft} stroke={cockpit.accent} />
            <text x={x + width / 2} y={132} textAnchor="middle" fill={cockpit.muted} fontSize="9">
              {shortPeriodLabel(point.label)}
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

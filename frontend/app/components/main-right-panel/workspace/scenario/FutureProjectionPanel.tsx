"use client";

import React from "react";

import type {
  ProjectionCurvePoint,
  ProjectionImpactSummary,
  ProjectionTrend,
  ProjectionTrendDirection,
  ScenarioProjectionSurface,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioProjectionContract.ts";
import {
  scenarioCardDetailStyle,
  scenarioCardHeadlineStyle,
  scenarioProjectionCurveShellStyle,
  scenarioProjectionImpactCardStyle,
  scenarioProjectionImpactGridStyle,
  scenarioProjectionPanelShellStyle,
  scenarioProjectionTrendDeltaStyle,
  scenarioProjectionTrendRowStyle,
  scenarioSectionLabelStyle,
  scenarioVisualColors,
  scenarioVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioVisualContract.ts";

export type FutureProjectionPanelProps = Readonly<{
  projection: ScenarioProjectionSurface;
  phase: "loading" | "ready" | "empty";
}>;

function resolveTrendAccent(direction: ProjectionTrendDirection): string {
  if (direction === "up") return scenarioVisualColors.success;
  if (direction === "down") return scenarioVisualColors.critical;
  return scenarioVisualColors.accent;
}

function buildCurvePath(points: readonly ProjectionCurvePoint[]): string {
  if (points.length === 0) return "";
  const width = 160;
  const height = 40;
  const maxStep = Math.max(points.length - 1, 1);
  return points
    .map((point, index) => {
      const x = (index / maxStep) * width;
      const y = height - (point.value / 100) * height;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function ProjectionCurve(props: {
  trend: ProjectionTrend;
  loading: boolean;
}): React.ReactElement {
  const accent = resolveTrendAccent(props.trend.direction);
  const path = buildCurvePath(props.trend.curve);

  return (
    <div
      data-nx="scenario-projection-curve"
      data-projection-trend={props.trend.id}
      style={scenarioProjectionCurveShellStyle()}
      aria-label={`${props.trend.label} projection curve`}
    >
      {props.loading || !path ? (
        <div style={scenarioCardDetailStyle()}>Awaiting projection curve…</div>
      ) : (
        <svg viewBox="0 0 160 40" width="100%" height="40" role="img">
          <title>{props.trend.label}</title>
          <path
            d={path}
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {props.trend.curve.map((point) => {
            const x = (point.step / Math.max(props.trend.curve.length - 1, 1)) * 160;
            const y = 40 - (point.value / 100) * 40;
            return (
              <circle
                key={`${props.trend.id}:${point.step}`}
                cx={x}
                cy={y}
                r="2.5"
                fill={accent}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}

function TrendDeltaIndicator(props: {
  trend: ProjectionTrend;
  loading: boolean;
}): React.ReactElement {
  const glyph =
    props.trend.direction === "up" ? "▲" : props.trend.direction === "down" ? "▼" : "●";

  return (
    <div
      data-nx="scenario-trend-delta"
      data-projection-trend={props.trend.id}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: scenarioVisualSpacing.fieldGap,
        alignItems: "flex-start",
      }}
    >
      <div style={scenarioSectionLabelStyle()}>Trend Delta</div>
      <div style={scenarioProjectionTrendDeltaStyle(props.trend.direction)}>
        {props.loading ? "—" : `${glyph} ${props.trend.deltaLabel}`}
      </div>
    </div>
  );
}

function ImpactSummaryCards(props: {
  sections: readonly ProjectionImpactSummary[];
  loading: boolean;
}): React.ReactElement {
  return (
    <div
      data-nx="scenario-impact-summary-cards"
      style={scenarioProjectionImpactGridStyle()}
      aria-label="Projection impact summary cards"
    >
      {props.sections.map((section) => (
        <article
          key={section.id}
          data-projection-section={section.id}
          style={scenarioProjectionImpactCardStyle(section.direction)}
        >
          <div style={scenarioSectionLabelStyle()}>{section.label}</div>
          <div style={scenarioCardHeadlineStyle("neutral")}>
            {props.loading ? "Loading…" : section.impactLevel}
          </div>
          <p style={scenarioCardDetailStyle()}>
            {props.loading ? "Retrieving projection impact…" : section.summary}
          </p>
        </article>
      ))}
    </div>
  );
}

export function FutureProjectionPanel(props: FutureProjectionPanelProps): React.ReactElement {
  const loading = props.phase === "loading";
  const { layer, question } = props.projection;
  const hasProjection = layer.trends.length > 0;

  return (
    <section
      data-nx="scenario-future-projection-panel"
      data-scenario-dashboard-context={props.projection.dashboardContext}
      data-scenario-projection="true"
      aria-label="Future projection panel"
      style={scenarioProjectionPanelShellStyle()}
    >
      <div style={scenarioSectionLabelStyle()}>Future Projection Panel</div>
      <p style={scenarioCardDetailStyle()}>{question}</p>
      <p style={scenarioCardDetailStyle()}>
        Horizon: {loading ? "Loading…" : layer.horizon}
      </p>

      {loading || !hasProjection ? (
        <p style={scenarioCardDetailStyle()}>
          {loading
            ? "Loading future projection layer…"
            : "Generate executive scenarios to visualize possible future outcomes."}
        </p>
      ) : (
        <>
          <div
            data-nx="scenario-projection-trends"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: scenarioVisualSpacing.fieldGap,
            }}
          >
            {layer.trends.map((trend) => (
              <div
                key={trend.id}
                data-projection-trend-row={trend.id}
                style={scenarioProjectionTrendRowStyle()}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: scenarioVisualSpacing.fieldGap,
                    minWidth: 0,
                  }}
                >
                  <div style={scenarioSectionLabelStyle()}>{trend.label}</div>
                  <p style={scenarioCardDetailStyle()}>{trend.summary}</p>
                </div>
                <TrendDeltaIndicator trend={trend} loading={loading} />
                <ProjectionCurve trend={trend} loading={loading} />
              </div>
            ))}
          </div>

          <ImpactSummaryCards sections={layer.sections} loading={loading} />
        </>
      )}

      {!loading && hasProjection ? (
        <p style={scenarioCardDetailStyle()}>
          Forecast-only projection — no decision execution, timeline mutation, or War Room writes.
        </p>
      ) : null}
    </section>
  );
}

export default FutureProjectionPanel;

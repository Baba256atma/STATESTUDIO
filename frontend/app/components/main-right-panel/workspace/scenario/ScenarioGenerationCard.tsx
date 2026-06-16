"use client";

import React from "react";

import type { GeneratedScenario } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioGenerationContract.ts";
import { SCENARIO_GENERATION_METRIC_LABELS } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioGenerationContract.ts";
import {
  scenarioCardDetailStyle,
  scenarioCardHeadlineStyle,
  scenarioGenerationCardStyle,
  scenarioGenerationMetricLabelStyle,
  scenarioGenerationMetricValueStyle,
  scenarioSectionLabelStyle,
  scenarioVisualColors,
  scenarioVisualSpacing,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioVisualContract.ts";

export type ScenarioGenerationCardProps = Readonly<{
  scenario: GeneratedScenario;
  phase: "loading" | "ready" | "empty";
}>;

type MetricKey = keyof typeof SCENARIO_GENERATION_METRIC_LABELS;

const METRIC_KEYS = Object.freeze([
  "probability",
  "impact",
  "confidence",
] as const satisfies readonly MetricKey[]);

function resolveScenarioTone(
  scenario: GeneratedScenario
): "success" | "accent" | "warning" | "critical" {
  if (scenario.id === "best_case") return "success";
  if (scenario.id === "worst_case") {
    return scenario.impact.toLowerCase() === "critical" ? "critical" : "warning";
  }
  return "accent";
}

function resolveMetricAccent(metricKey: MetricKey, tone: ReturnType<typeof resolveScenarioTone>): string {
  if (metricKey === "probability") {
    return tone === "success"
      ? scenarioVisualColors.success
      : tone === "warning" || tone === "critical"
        ? scenarioVisualColors.warning
        : scenarioVisualColors.accent;
  }
  if (metricKey === "impact") {
    return tone === "critical"
      ? scenarioVisualColors.critical
      : tone === "warning"
        ? scenarioVisualColors.warning
        : scenarioVisualColors.text;
  }
  return scenarioVisualColors.textSoft;
}

export function ScenarioGenerationCard(
  props: ScenarioGenerationCardProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const tone = resolveScenarioTone(props.scenario);

  return (
    <article
      data-nx="scenario-generation-card"
      data-scenario-id={props.scenario.id}
      style={scenarioGenerationCardStyle(tone)}
    >
      <div style={scenarioSectionLabelStyle()}>{props.scenario.title}</div>
      <div style={scenarioCardHeadlineStyle(tone)}>
        {loading ? "Loading…" : props.scenario.title}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: scenarioVisualSpacing.rowGap,
        }}
      >
        {METRIC_KEYS.map((metricKey) => (
          <div
            key={metricKey}
            data-scenario-metric={metricKey}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: scenarioVisualSpacing.fieldGap,
              minWidth: 0,
            }}
          >
            <div style={scenarioGenerationMetricLabelStyle()}>
              {SCENARIO_GENERATION_METRIC_LABELS[metricKey]}
            </div>
            <div style={scenarioGenerationMetricValueStyle(resolveMetricAccent(metricKey, tone))}>
              {loading ? "—" : props.scenario[metricKey]}
            </div>
          </div>
        ))}
      </div>
      {!loading ? (
        <p style={scenarioCardDetailStyle()}>
          Read-only executive future — not executed.
        </p>
      ) : null}
    </article>
  );
}

export default ScenarioGenerationCard;

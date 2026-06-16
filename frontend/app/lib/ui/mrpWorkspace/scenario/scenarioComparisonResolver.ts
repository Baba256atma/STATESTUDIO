/**
 * MRP:4E:3 — Derive scenario comparison matrix from generated executive scenarios.
 */

import {
  COMPARISON_SCENARIO_LABELS,
  COMPARISON_SCENARIO_ORDER,
  COMPARISON_SCENARIO_SOURCE_MAP,
  COMPARISON_SECTION_LABELS,
  COMPARISON_SECTION_ORDER,
  DEFAULT_SCENARIO_COMPARISON_MATRIX,
  type ComparisonScenarioId,
  type ComparisonSectionId,
  type ScenarioComparisonColumn,
  type ScenarioComparisonInput,
  type ScenarioComparisonMatrix,
  type ScenarioComparisonRow,
} from "./scenarioComparisonContract.ts";
import type { GeneratedScenario } from "./scenarioGenerationContract.ts";

type ImpactBand = "low" | "medium" | "high" | "critical";

function findGeneratedScenario(
  scenarios: readonly GeneratedScenario[],
  sourceId: GeneratedScenario["id"]
): GeneratedScenario | null {
  return scenarios.find((row) => row.id === sourceId) ?? null;
}

function parseImpactBand(impact: string): ImpactBand {
  const normalized = impact.trim().toLowerCase();
  if (normalized.includes("critical")) return "critical";
  if (normalized.includes("high")) return "high";
  if (normalized.includes("low")) return "low";
  return "medium";
}

function resolveRiskCell(band: ImpactBand): string {
  switch (band) {
    case "low":
      return "Low";
    case "medium":
      return "Moderate";
    case "high":
      return "Elevated";
    case "critical":
      return "Critical";
  }
}

function resolveCostCell(band: ImpactBand): string {
  switch (band) {
    case "low":
      return "Low exposure";
    case "medium":
      return "Balanced";
    case "high":
      return "Elevated";
    case "critical":
      return "High exposure";
  }
}

function resolveTimelineImpactCell(band: ImpactBand): string {
  switch (band) {
    case "low":
      return "Minimal";
    case "medium":
      return "Moderate";
    case "high":
      return "Extended";
    case "critical":
      return "Severe delay";
  }
}

function resolveOperationalImpactCell(band: ImpactBand): string {
  switch (band) {
    case "low":
      return "Stable";
    case "medium":
      return "Managed stress";
    case "high":
      return "Stressed";
    case "critical":
      return "Disrupted";
  }
}

function resolveStrategicImpactCell(band: ImpactBand, probability: string): string {
  const probabilityValue = Number.parseInt(probability, 10);
  if (band === "low" && probabilityValue >= 60) return "Favorable";
  if (band === "critical" || band === "high") return "Adverse";
  if (band === "medium" && probabilityValue >= 45) return "Neutral";
  return "Constrained";
}

export function buildScenarioComparisonColumns(
  scenarios: readonly GeneratedScenario[]
): readonly ScenarioComparisonColumn[] {
  return Object.freeze(
    COMPARISON_SCENARIO_ORDER.map((comparisonId) => {
      const sourceScenarioId = COMPARISON_SCENARIO_SOURCE_MAP[comparisonId];
      const scenario =
        findGeneratedScenario(scenarios, sourceScenarioId) ??
        Object.freeze({
          id: sourceScenarioId,
          title: COMPARISON_SCENARIO_LABELS[comparisonId],
          probability: "—",
          impact: "Medium",
          confidence: "—",
        });
      return Object.freeze({
        id: comparisonId,
        label: COMPARISON_SCENARIO_LABELS[comparisonId],
        sourceScenarioId,
        title: scenario.title,
        probability: scenario.probability,
        confidence: scenario.confidence,
      });
    })
  );
}

function buildRowForSection(
  sectionId: ComparisonSectionId,
  scenarios: readonly GeneratedScenario[],
  columns: readonly ScenarioComparisonColumn[]
): ScenarioComparisonRow {
  const cells = {} as Record<ComparisonScenarioId, string>;
  for (const column of columns) {
    const scenario = findGeneratedScenario(scenarios, column.sourceScenarioId);
    const band = parseImpactBand(scenario?.impact ?? "Medium");
    switch (sectionId) {
      case "risk":
        cells[column.id] = resolveRiskCell(band);
        break;
      case "cost":
        cells[column.id] = resolveCostCell(band);
        break;
      case "timeline_impact":
        cells[column.id] = resolveTimelineImpactCell(band);
        break;
      case "operational_impact":
        cells[column.id] = resolveOperationalImpactCell(band);
        break;
      case "strategic_impact":
        cells[column.id] = resolveStrategicImpactCell(band, scenario?.probability ?? "50%");
        break;
    }
  }
  return Object.freeze({
    id: sectionId,
    label: COMPARISON_SECTION_LABELS[sectionId],
    cells: Object.freeze(cells),
  });
}

export function deriveScenarioComparisonMatrix(
  input: ScenarioComparisonInput
): ScenarioComparisonMatrix {
  if (!input.scenarios.length) {
    return DEFAULT_SCENARIO_COMPARISON_MATRIX;
  }

  const columns = buildScenarioComparisonColumns(input.scenarios);
  const rows = Object.freeze(
    COMPARISON_SECTION_ORDER.map((sectionId) =>
      buildRowForSection(sectionId, input.scenarios, columns)
    )
  );

  return Object.freeze({
    columns,
    rows,
    readOnly: true,
  });
}

export function buildScenarioComparisonSignature(matrix: ScenarioComparisonMatrix): string {
  return JSON.stringify({
    columns: matrix.columns,
    rows: matrix.rows,
  });
}

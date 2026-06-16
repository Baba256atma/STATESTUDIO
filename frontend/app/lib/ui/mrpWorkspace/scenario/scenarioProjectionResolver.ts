/**
 * MRP:4E:4 — Derive future projection layer from scenario workspace state only.
 */

import type { ComparisonScenarioId, ComparisonSectionId } from "./scenarioComparisonContract.ts";
import type { GeneratedScenario, GeneratedScenarioId } from "./scenarioGenerationContract.ts";
import {
  DEFAULT_SCENARIO_PROJECTION_LAYER,
  PROJECTION_SECTION_LABELS,
  PROJECTION_SECTION_ORDER,
  PROJECTION_TREND_LABELS,
  PROJECTION_TREND_ORDER,
  PROJECTION_TREND_SOURCE_MAP,
  type ProjectionCurvePoint,
  type ProjectionImpactSummary,
  type ProjectionSectionId,
  type ProjectionTrend,
  type ProjectionTrendDirection,
  type ProjectionTrendId,
  type ScenarioProjectionInput,
  type ScenarioProjectionLayer,
} from "./scenarioProjectionContract.ts";

type ImpactBand = "low" | "medium" | "high" | "critical";

const CURVE_STEPS = Object.freeze(["Now", "T+1", "T+2", "T+3", "Horizon"]);

function findGeneratedScenario(
  scenarios: readonly GeneratedScenario[],
  sourceId: GeneratedScenarioId
): GeneratedScenario | null {
  return scenarios.find((row) => row.id === sourceId) ?? null;
}

function parseProbability(probability: string): number {
  const parsed = Number.parseInt(probability, 10);
  return Number.isFinite(parsed) ? parsed : 50;
}

function parseImpactBand(impact: string): ImpactBand {
  const normalized = impact.trim().toLowerCase();
  if (normalized.includes("critical")) return "critical";
  if (normalized.includes("high")) return "high";
  if (normalized.includes("low")) return "low";
  return "medium";
}

function impactBandToScore(band: ImpactBand): number {
  switch (band) {
    case "low":
      return 28;
    case "medium":
      return 52;
    case "high":
      return 74;
    case "critical":
      return 92;
  }
}

function resolveTrendDirection(delta: number): ProjectionTrendDirection {
  if (delta > 3) return "up";
  if (delta < -3) return "down";
  return "stable";
}

function buildCurvePoints(baseline: number, target: number): readonly ProjectionCurvePoint[] {
  return Object.freeze(
    CURVE_STEPS.map((label, index) => {
      const ratio = index / (CURVE_STEPS.length - 1);
      const value = Math.round(baseline + (target - baseline) * ratio);
      return Object.freeze({
        step: index,
        value: Math.max(0, Math.min(100, value)),
        label,
      });
    })
  );
}

function buildTrendSummary(
  trendId: ProjectionTrendId,
  scenario: GeneratedScenario,
  direction: ProjectionTrendDirection
): string {
  const band = parseImpactBand(scenario.impact);
  if (trendId === "best_case_trend") {
    return direction === "up"
      ? `Favorable outlook with ${scenario.probability} probability and ${band} impact.`
      : `Best case remains constrained at ${scenario.probability} probability.`;
  }
  if (trendId === "worst_case_trend") {
    return direction === "down"
      ? `Adverse outlook with ${scenario.probability} probability and ${band} impact.`
      : `Worst case pressure moderated at ${scenario.probability} probability.`;
  }
  return `Baseline forecast at ${scenario.probability} probability with ${band} impact.`;
}

function buildTrend(
  trendId: ProjectionTrendId,
  scenarios: readonly GeneratedScenario[],
  baselineProbability: number
): ProjectionTrend {
  const sourceScenarioId = PROJECTION_TREND_SOURCE_MAP[trendId];
  const scenario =
    findGeneratedScenario(scenarios, sourceScenarioId) ??
    Object.freeze({
      id: sourceScenarioId,
      title: PROJECTION_TREND_LABELS[trendId],
      probability: "50%",
      impact: "Medium",
      confidence: "—",
    });
  const probability = parseProbability(scenario.probability);
  const targetScore = impactBandToScore(parseImpactBand(scenario.impact));
  const baselineScore = impactBandToScore(
    parseImpactBand(findGeneratedScenario(scenarios, "expected_case")?.impact ?? "Medium")
  );
  const delta = probability - baselineProbability;
  const direction = resolveTrendDirection(delta);
  const deltaLabel =
    delta === 0
      ? "Aligned with expected"
      : `${delta > 0 ? "+" : ""}${delta}% vs expected`;

  return Object.freeze({
    id: trendId,
    label: PROJECTION_TREND_LABELS[trendId],
    sourceScenarioId,
    direction,
    deltaLabel,
    summary: buildTrendSummary(trendId, scenario, direction),
    curve: buildCurvePoints(baselineScore, targetScore),
  });
}

function mapComparisonSectionToProjectionSection(
  sectionId: ComparisonSectionId
): ProjectionSectionId | null {
  switch (sectionId) {
    case "operational_impact":
      return "operational_impact";
    case "cost":
      return "financial_impact";
    case "risk":
      return "risk_impact";
    case "strategic_impact":
      return "strategic_impact";
    default:
      return null;
  }
}

function resolveSectionDirection(expectedCell: string, worstCell: string): ProjectionTrendDirection {
  const adverse = /critical|severe|high|adverse|disrupted|elevated/i.test(worstCell);
  const favorable = /low|stable|favorable|minimal/i.test(expectedCell);
  if (adverse && !favorable) return "down";
  if (favorable && !adverse) return "up";
  return "stable";
}

function buildSectionFromComparison(
  sectionId: ProjectionSectionId,
  input: ScenarioProjectionInput
): ProjectionImpactSummary {
  const comparisonKey =
    sectionId === "financial_impact"
      ? "cost"
      : sectionId === "risk_impact"
        ? "risk"
        : sectionId;
  const cells = input.comparisonCells?.[comparisonKey as ComparisonSectionId];
  const expectedCell = cells?.scenario_b ?? "Moderate";
  const worstCell = cells?.scenario_c ?? "Elevated";
  const direction = resolveSectionDirection(expectedCell, worstCell);

  return Object.freeze({
    id: sectionId,
    label: PROJECTION_SECTION_LABELS[sectionId],
    impactLevel: expectedCell,
    direction,
    summary: `Expected ${PROJECTION_SECTION_LABELS[sectionId].toLowerCase()} at ${expectedCell}; worst case ${worstCell}.`,
  });
}

function buildSectionFromScenarios(
  sectionId: ProjectionSectionId,
  scenarios: readonly GeneratedScenario[]
): ProjectionImpactSummary {
  const expected = findGeneratedScenario(scenarios, "expected_case");
  const worst = findGeneratedScenario(scenarios, "worst_case");
  const expectedBand = parseImpactBand(expected?.impact ?? "Medium");
  const worstBand = parseImpactBand(worst?.impact ?? "Medium");
  const direction = resolveTrendDirection(
    impactBandToScore(worstBand) - impactBandToScore(expectedBand)
  );
  const impactLevel =
    expectedBand === "low"
      ? "Low"
      : expectedBand === "high"
        ? "Elevated"
        : expectedBand === "critical"
          ? "Critical"
          : "Moderate";

  return Object.freeze({
    id: sectionId,
    label: PROJECTION_SECTION_LABELS[sectionId],
    impactLevel,
    direction,
    summary: `Projected ${PROJECTION_SECTION_LABELS[sectionId].toLowerCase()} trends from generated executive scenarios.`,
  });
}

export function deriveScenarioProjectionLayer(
  input: ScenarioProjectionInput
): ScenarioProjectionLayer {
  if (!input.scenarios.length) {
    return DEFAULT_SCENARIO_PROJECTION_LAYER;
  }

  const baselineProbability = parseProbability(
    findGeneratedScenario(input.scenarios, "expected_case")?.probability ?? "50%"
  );
  const trends = Object.freeze(
    PROJECTION_TREND_ORDER.map((trendId) =>
      buildTrend(trendId, input.scenarios, baselineProbability)
    )
  );
  const hasComparisonCells =
    input.comparisonCells && Object.keys(input.comparisonCells).length > 0;
  const sections = Object.freeze(
    PROJECTION_SECTION_ORDER.map((sectionId) =>
      hasComparisonCells
        ? buildSectionFromComparison(sectionId, input)
        : buildSectionFromScenarios(sectionId, input.scenarios)
    )
  );

  return Object.freeze({
    horizon: input.projectionHorizon.trim() || "30 days",
    trends,
    sections,
    readOnly: true,
  });
}

export function buildScenarioProjectionSignature(layer: ScenarioProjectionLayer): string {
  return JSON.stringify({
    horizon: layer.horizon,
    trends: layer.trends,
    sections: layer.sections,
  });
}

export function buildScenarioProjectionComparisonCells(
  rows: readonly {
    id: ComparisonSectionId;
    cells: Readonly<Record<ComparisonScenarioId, string>>;
  }[]
): ScenarioProjectionInput["comparisonCells"] {
  const cells: Partial<
    Record<ComparisonSectionId, Readonly<Record<ComparisonScenarioId, string>>>
  > = {};
  for (const row of rows) {
    const projectionSection = mapComparisonSectionToProjectionSection(row.id);
    if (!projectionSection) continue;
    cells[row.id] = row.cells;
  }
  return Object.freeze(cells);
}

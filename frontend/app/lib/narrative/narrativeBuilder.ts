import type { DecisionExecutionResult } from "../executive/decisionExecutionTypes";
import type { FragilityScanResponse } from "../../types/fragilityScanner";

type LooseRecord = Record<string, unknown>;

export type ExecutiveNarrative = {
  systemStateSummary: string | null;
  keyRiskStatement: string | null;
  decisionHeadline: string | null;
  topDriverLabel: string | null;
};

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function titleCaseRiskLevel(level: string | null) {
  const normalized = String(level ?? "").trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === "moderate") return "Moderate Risk";
  if (normalized === "critical") return "Critical Risk";
  if (normalized === "high") return "High Risk";
  if (normalized === "low") return "Low Risk";
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)} Risk`;
}

function toExecutiveClause(text: string | null) {
  if (!text) return null;
  return text.endsWith(".") ? text : `${text}.`;
}

function resolveTopDriverLabel(scanner: FragilityScanResponse | null | undefined) {
  const firstDriver = Array.isArray(scanner?.drivers) ? scanner?.drivers[0] : null;
  return firstDriver?.label?.trim() ? firstDriver.label.trim() : null;
}

function buildSystemStateSummary(params: {
  scanner: FragilityScanResponse | null | undefined;
  executiveSummarySurface: LooseRecord | null;
}) {
  const scanner = params.scanner ?? null;
  const executiveSummary = params.executiveSummarySurface;
  const headline = titleCaseRiskLevel(getString(scanner?.fragility_level));
  const summary =
    getString(executiveSummary?.summary) ??
    getString(scanner?.summary) ??
    null;
  const topDriver = resolveTopDriverLabel(scanner);

  if (headline && topDriver) {
    return `${headline} - ${topDriver}`;
  }
  if (headline && summary) {
    return `${headline} - ${summary}`;
  }
  return headline ?? summary;
}

function buildKeyRiskStatement(params: {
  scanner: FragilityScanResponse | null | undefined;
  scenarioResult: LooseRecord | null;
}) {
  const scanner = params.scanner ?? null;
  const scenario = params.scenarioResult;
  const scenarioSummary =
    getString(scenario?.scenario_summary) ??
    getString(scenario?.summary) ??
    null;
  if (scenarioSummary) {
    return toExecutiveClause(scenarioSummary);
  }

  const topDriver = resolveTopDriverLabel(scanner);
  const summary = getString(scanner?.summary);
  if (topDriver && summary) {
    return `${topDriver} is the main pressure point. ${toExecutiveClause(summary)}`;
  }
  if (topDriver) {
    return `${topDriver} is the main pressure point.`;
  }
  return toExecutiveClause(summary);
}

function buildDecisionHeadline(params: {
  decisionResult: DecisionExecutionResult | null | undefined;
  strategicAdvice: LooseRecord | null;
}) {
  const decision = params.decisionResult ?? null;
  const strategicAdvice = params.strategicAdvice;
  const recommendation =
    getString(decision?.recommendation?.reason) ??
    getString(decision?.advice_slice?.recommendation) ??
    getString(decision?.advice_slice?.recommendations?.[0]) ??
    getString(strategicAdvice?.recommendation) ??
    getString(asRecord(strategicAdvice?.primary_recommendation)?.action) ??
    null;
  const expectedOutcome =
    getString(decision?.recommendation?.expected_outcome) ??
    getString(decision?.advice_slice?.summary) ??
    getString(strategicAdvice?.summary) ??
    null;

  if (recommendation && expectedOutcome) {
    return `${recommendation} - ${expectedOutcome}`;
  }
  return recommendation ?? expectedOutcome;
}

export function buildExecutiveNarrative(input: {
  fragilityScanResult?: FragilityScanResponse | null;
  scenarioResult?: unknown;
  decisionResult?: DecisionExecutionResult | null;
  strategicAdvice?: unknown;
  executiveSummarySurface?: unknown;
}): ExecutiveNarrative {
  const scanner = input.fragilityScanResult ?? null;
  const scenarioResult = asRecord(input.scenarioResult);
  const strategicAdvice = asRecord(input.strategicAdvice);
  const executiveSummarySurface = asRecord(input.executiveSummarySurface);
  const topDriverLabel = resolveTopDriverLabel(scanner);

  return {
    systemStateSummary: buildSystemStateSummary({
      scanner,
      executiveSummarySurface,
    }),
    keyRiskStatement: buildKeyRiskStatement({
      scanner,
      scenarioResult,
    }),
    decisionHeadline: buildDecisionHeadline({
      decisionResult: input.decisionResult ?? null,
      strategicAdvice,
    }),
    topDriverLabel,
  };
}

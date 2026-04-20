import type { DecisionExecutionResponse } from "../api/generated";
import { postDecisionExecution } from "../api/client";
import type {
  DecisionExecutionComparisonItem,
  DecisionExecutionPayload,
  DecisionExecutionResult,
  DecisionExecutionSceneActions,
  DecisionExecutionSimulationResult,
} from "./decisionExecutionTypes";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function normalizeSimulationResult(input: unknown): DecisionExecutionSimulationResult {
  const record = asRecord(input);
  return {
    impact_score:
      typeof record?.impact_score === "number" && Number.isFinite(record.impact_score)
        ? record.impact_score
        : 0,
    risk_change:
      typeof record?.risk_change === "number" && Number.isFinite(record.risk_change)
        ? record.risk_change
        : 0,
    kpi_effects: Array.isArray(record?.kpi_effects)
      ? record.kpi_effects
          .map((entry) => {
            const item = asRecord(entry);
            const kpi = typeof item?.kpi === "string" ? item.kpi : null;
            const change = typeof item?.change === "number" && Number.isFinite(item.change) ? item.change : null;
            return kpi !== null && change !== null ? { kpi, change } : null;
          })
          .filter((entry): entry is DecisionExecutionSimulationResult["kpi_effects"][number] => Boolean(entry))
      : [],
    affected_objects: Array.isArray(record?.affected_objects)
      ? record.affected_objects.map(String).filter(Boolean)
      : [],
  };
}

function normalizeComparison(input: unknown): DecisionExecutionComparisonItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((entry) => {
      const item = asRecord(entry);
      const option = typeof item?.option === "string" ? item.option : null;
      const score = typeof item?.score === "number" && Number.isFinite(item.score) ? item.score : null;
      return option !== null && score !== null ? { option, score } : null;
    })
    .filter((entry): entry is DecisionExecutionComparisonItem => Boolean(entry));
}

function normalizeSceneActions(input: unknown): DecisionExecutionSceneActions {
  const record = asRecord(input);
  return {
    highlight: Array.isArray(record?.highlight) ? record.highlight.map(String).filter(Boolean) : [],
    dim: Array.isArray(record?.dim) ? record.dim.map(String).filter(Boolean) : [],
  };
}

function normalizeDecisionExecutionResponse(response: DecisionExecutionResponse): DecisionExecutionResult {
  return {
    ...response,
    simulation_result: normalizeSimulationResult(response.simulation_result),
    comparison: normalizeComparison(response.comparison),
    scene_actions: normalizeSceneActions(response.scene_actions),
  };
}

export async function runDecisionExecution(
  endpoint: "/decision/simulate" | "/decision/compare",
  payload: DecisionExecutionPayload
): Promise<DecisionExecutionResult> {
  const response = await postDecisionExecution(endpoint, payload);
  return normalizeDecisionExecutionResponse(response);
}

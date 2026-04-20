import type {
  AnalyzeFullResponse,
  ChatResponseOut,
  DecisionExecutionResponse,
} from "./generated";
import type { PanelSharedData } from "../panels/panelDataContract";
import { normalizeBackendSimulation } from "../simulation/normalizeBackendSimulation";

type LooseRecord = Record<string, unknown>;

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
}

function warnMismatch(scope: string, details: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[Nexora][ApiContractMismatch]", {
      scope,
      ...details,
    });
  }
}

export function mapDecisionExecutionResponseToPanelSharedData(
  response: DecisionExecutionResponse | null | undefined
): Partial<PanelSharedData> {
  if (!response) {
    warnMismatch("decision_execution", { reason: "missing_response" });
    return {};
  }

  const normalizedSimulation = normalizeBackendSimulation(response.simulation_result ?? null);
  if (!normalizedSimulation) {
    warnMismatch("decision_execution", { reason: "missing_simulation_result" });
  }

  return {
    simulation: normalizedSimulation
      ? {
          summary: normalizedSimulation.summary ?? null,
          recommendation: null,
          impacted_nodes: normalizedSimulation.impacted_nodes,
          propagation: normalizedSimulation.propagation,
          risk_delta: normalizedSimulation.risk_delta ?? null,
        }
      : null,
    compare: {
      options: Array.isArray(response.comparison) ? response.comparison : [],
      recommendation: null,
      summary: null,
    },
  };
}

export function mapChatResponseToPanelSharedData(
  response: ChatResponseOut | null | undefined
): Partial<PanelSharedData> {
  if (!response) {
    warnMismatch("chat", { reason: "missing_response" });
    return {};
  }

  const sceneJson = asRecord(response.scene_json);
  const summary = typeof response.analysis_summary === "string" ? response.analysis_summary : null;
  return {
    raw: response,
    sceneJson: sceneJson ?? null,
    dashboard: summary
      ? {
          summary,
          happened: null,
          why_it_matters: null,
          what_to_do: null,
        }
      : null,
  };
}

export function mapAnalyzeFullResponseToPanelSharedData(
  response: AnalyzeFullResponse | null | undefined
): Partial<PanelSharedData> {
  if (!response) {
    warnMismatch("analyze_full", { reason: "missing_response" });
    return {};
  }

  if (response.visual == null) {
    warnMismatch("analyze_full", {
      reason: "missing_visual",
      episode_id: response.episode_id ?? null,
    });
  }

  return {
    raw: response,
    responseData: response,
  };
}

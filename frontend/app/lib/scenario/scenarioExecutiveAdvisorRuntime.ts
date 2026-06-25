/**
 * DS-7:6 — Scenario Executive Advisor runtime.
 * Read-only deterministic explanations from existing Scenario Intelligence.
 * Does not simulate, compare, recommend execution, or mutate workspace data.
 */

import type { DecisionAction, RouterResult } from "../decision/decisionRouter.ts";
import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  getLatestWorkspaceScenarioComparison,
  getWorkspaceScenarioComparisons,
} from "./workspaceScenarioComparisonEngine.ts";
import {
  getWorkspaceScenario,
  getWorkspaceScenarios,
  type WorkspaceScenario,
} from "./workspaceScenarioContract.ts";
import { getWorkspaceScenarioInsight } from "./workspaceScenarioInsightEngine.ts";
import {
  getLatestWorkspaceScenarioSimulation,
  type WorkspaceScenarioSimulation,
} from "./workspaceScenarioSimulationEngine.ts";
import { getWorkspaceScenarioWorkspaceSummary } from "./scenarioWorkspaceIntegrationRuntime.ts";

export const WORKSPACE_SCENARIO_EXECUTIVE_ADVISOR_VERSION = "DS-7:6" as const;

export const WORKSPACE_SCENARIO_EXECUTIVE_ADVISOR_TAGS = Object.freeze([
  "[DS76_SCENARIO_EXECUTIVE_ADVISOR]",
  "[SCENARIO_ASSISTANT_READY]",
  "[SCENARIO_EXPLANATION_READY]",
  "[READ_ONLY_ASSISTANT]",
  "[DS77_READY]",
  "[DS_7_6_COMPLETE]",
] as const);

export const NEXORA_SCENARIO_ADVISOR_LOG_PREFIX = "[NexoraScenarioAdvisor]" as const;

export type ScenarioExecutiveAdvisorQuestionType =
  | "scenario_overview"
  | "insight_explanation"
  | "simulation_explanation"
  | "comparison_explanation"
  | "tradeoff_explanation"
  | "assumption_explanation"
  | "timeline_explanation"
  | "executive_questions"
  | "unsupported";

export type ScenarioExecutiveAdvisorResponseType =
  | "overview"
  | "insight"
  | "simulation"
  | "comparison"
  | "tradeoff"
  | "assumption"
  | "timeline"
  | "executive_questions"
  | "unavailable";

export type ScenarioExecutiveAdvisorResult = Readonly<{
  matched: boolean;
  assistantReply: string;
  actions: readonly DecisionAction[];
  questionType: ScenarioExecutiveAdvisorQuestionType;
  responseType: ScenarioExecutiveAdvisorResponseType;
  sourcesUsed: readonly string[];
}>;

export type ResolveScenarioExecutiveAdvisorQuestionInput = Readonly<{
  text: string;
  workspaceId?: WorkspaceId | null;
  scenarioId?: string | null;
}>;

function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeWorkspaceId(workspaceId?: WorkspaceId | null): string {
  return String(workspaceId ?? getActiveWorkspaceId() ?? "").trim();
}

function advisorAction(): readonly DecisionAction[] {
  return Object.freeze([{ type: "SCENARIO_EXECUTIVE_ADVISOR_EXPLAIN", target: "workspace" }]);
}

function emitScenarioAdvisorDiagnostic(input: {
  workspaceId: string;
  scenarioId: string | null;
  questionType: ScenarioExecutiveAdvisorQuestionType;
  responseType: ScenarioExecutiveAdvisorResponseType;
  sourcesUsed: readonly string[];
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("scenarioAdvisor", NEXORA_SCENARIO_ADVISOR_LOG_PREFIX, {
    workspaceId: input.workspaceId,
    scenarioId: input.scenarioId,
    questionType: input.questionType,
    responseType: input.responseType,
    sourcesUsed: input.sourcesUsed,
    tags: WORKSPACE_SCENARIO_EXECUTIVE_ADVISOR_TAGS,
    phase: "DS-7:6",
  });
}

export function isScenarioExecutiveAdvisorQuestion(text: string): boolean {
  const normalized = normalizeInput(text);
  if (!normalized) return false;

  const markers = [
    "scenario",
    "simulation",
    "simulated",
    "comparison",
    "compare scenario",
    "tradeoff",
    "trade-off",
    "assumption",
    "which kpi",
    "which risk",
    "which assumption",
    "what changed after",
    "explain this scenario",
    "why is scenario",
    "business trade",
    "timeline",
    "executive question",
  ];

  return markers.some((marker) => normalized.includes(marker));
}

export function classifyScenarioExecutiveAdvisorQuestion(
  text: string
): ScenarioExecutiveAdvisorQuestionType {
  const normalized = normalizeInput(text);

  if (normalized.includes("timeline")) return "timeline_explanation";
  if (normalized.includes("tradeoff") || normalized.includes("trade-off") || normalized.includes("business trade")) {
    return "tradeoff_explanation";
  }
  if (normalized.includes("assumption")) return "assumption_explanation";
  if (
    normalized.includes("compare") ||
    normalized.includes("comparison") ||
    normalized.includes("riskier") ||
    normalized.includes("scenario a") ||
    normalized.includes("scenario b")
  ) {
    return "comparison_explanation";
  }
  if (
    normalized.includes("simulation") ||
    normalized.includes("simulated") ||
    normalized.includes("which kpi") ||
    normalized.includes("what changed after")
  ) {
    return "simulation_explanation";
  }
  if (
    normalized.includes("insight") ||
    normalized.includes("why is") ||
    normalized.includes("executive summary")
  ) {
    return "insight_explanation";
  }
  if (
    normalized.includes("which tradeoff") ||
    normalized.includes("which kpi matters") ||
    normalized.includes("executive question")
  ) {
    return "executive_questions";
  }
  if (normalized.includes("explain") || normalized.includes("overview") || normalized.includes("scenario")) {
    return "scenario_overview";
  }

  return "unsupported";
}

function resolveScenarioFromText(input: {
  workspaceId: string;
  text: string;
  scenarioId?: string | null;
}): WorkspaceScenario | null {
  if (input.scenarioId?.trim()) {
    return getWorkspaceScenario(input.workspaceId, input.scenarioId);
  }

  const scenarios = getWorkspaceScenarios(input.workspaceId);
  const normalized = normalizeInput(input.text);

  const named = scenarios.find((scenario) => {
    const slug = scenario.name.toLowerCase();
    return slug.length >= 4 && normalized.includes(slug);
  });
  if (named) return named;

  const summary = getWorkspaceScenarioWorkspaceSummary(input.workspaceId);
  if (summary.activeScenarioId) {
    return getWorkspaceScenario(input.workspaceId, summary.activeScenarioId);
  }

  return scenarios[0] ?? null;
}

function resolveLatestComparisonForScenario(
  workspaceId: string,
  scenarioId: string
): ReturnType<typeof getLatestWorkspaceScenarioComparison> {
  const comparisons = getWorkspaceScenarioComparisons(workspaceId).filter(
    (comparison) => comparison.scenarioAId === scenarioId || comparison.scenarioBId === scenarioId
  );
  if (comparisons.length === 0) return null;
  return [...comparisons].sort((left, right) =>
    right.generatedAt.localeCompare(left.generatedAt)
  )[0] ?? null;
}

function formatSimulationExplanation(simulation: WorkspaceScenarioSimulation | null): string {
  if (!simulation) {
    return "Simulation data is not available for this scenario.";
  }

  const kpiLines = simulation.predictedKpiChanges
    .slice(0, 4)
    .map((change) => `${change.label}: ${change.changePercent}% projected change`);
  const riskLines = simulation.predictedRiskChanges
    .slice(0, 3)
    .map((change) => `${change.label}: ${change.changePercent}% projected change`);
  const assumptionLines = simulation.assumptions.map(
    (assumption) => `${assumption.label} (${assumption.assumptionType})`
  );

  const parts = [
    simulation.simulationSummary,
    kpiLines.length > 0 ? `KPI changes: ${kpiLines.join("; ")}.` : "KPI changes: none projected.",
    riskLines.length > 0 ? `Risk changes: ${riskLines.join("; ")}.` : "Risk changes: none projected.",
    assumptionLines.length > 0
      ? `Assumptions applied: ${assumptionLines.join(", ")}.`
      : "Assumptions: none recorded.",
    simulation.executiveQuestions.length > 0
      ? `Executive questions: ${simulation.executiveQuestions.slice(0, 2).join(" ")}`
      : null,
  ].filter(Boolean);

  return parts.join("\n");
}

function formatComparisonExplanation(input: {
  workspaceId: string;
  scenario: WorkspaceScenario;
  text: string;
}): string {
  const comparison = resolveLatestComparisonForScenario(input.workspaceId, input.scenario.scenarioId);
  if (!comparison) {
    return "Comparison data is not available for this scenario.";
  }

  const isScenarioA = comparison.scenarioAId === input.scenario.scenarioId;
  const partnerId = isScenarioA ? comparison.scenarioBId : comparison.scenarioAId;
  const partner = getWorkspaceScenario(input.workspaceId, partnerId);
  const normalized = normalizeInput(input.text);

  const riskDiffs = comparison.riskDifferences
    .slice(0, 3)
    .map(
      (difference) =>
        `${difference.label}: Scenario A ${difference.scenarioAChangePercent}% vs Scenario B ${difference.scenarioBChangePercent}%`
    );
  const tradeoffs = comparison.businessTradeoffs
    .slice(0, 2)
    .map((tradeoff) => `${tradeoff.benefit} vs ${tradeoff.cost} — ${tradeoff.observation}`);

  if (normalized.includes("riskier")) {
    const topRisk = comparison.riskDifferences[0];
    if (topRisk) {
      const riskierScenario =
        topRisk.scenarioAChangePercent > topRisk.scenarioBChangePercent
          ? getWorkspaceScenario(input.workspaceId, comparison.scenarioAId)?.name ?? "Scenario A"
          : getWorkspaceScenario(input.workspaceId, comparison.scenarioBId)?.name ?? "Scenario B";
      return `${riskierScenario} projects higher ${topRisk.label} exposure. ${comparison.comparisonSummary}`;
    }
  }

  return [
    `Comparison against ${partner?.name ?? "another scenario"}: ${comparison.comparisonSummary}`,
    comparison.decisionObservations.join(" "),
    riskDiffs.length > 0 ? `Risk differences: ${riskDiffs.join("; ")}.` : null,
    tradeoffs.length > 0 ? `Tradeoffs: ${tradeoffs.join(" ")}` : null,
    comparison.executiveQuestions.slice(0, 2).join(" "),
  ]
    .filter(Boolean)
    .join("\n");
}

function buildAdvisorReply(input: {
  workspaceId: string;
  scenario: WorkspaceScenario | null;
  questionType: ScenarioExecutiveAdvisorQuestionType;
  text: string;
}): { reply: string; responseType: ScenarioExecutiveAdvisorResponseType; sourcesUsed: string[] } {
  if (!input.scenario) {
    return {
      reply: "No workspace scenarios are available to explain.",
      responseType: "unavailable",
      sourcesUsed: ["workspaceScenarioContract"],
    };
  }

  const insight = getWorkspaceScenarioInsight(input.workspaceId, input.scenario.scenarioId);
  const simulation = getLatestWorkspaceScenarioSimulation(input.workspaceId, input.scenario.scenarioId);
  const comparison = resolveLatestComparisonForScenario(input.workspaceId, input.scenario.scenarioId);
  const summary = getWorkspaceScenarioWorkspaceSummary(input.workspaceId);

  switch (input.questionType) {
    case "timeline_explanation":
      return {
        reply:
          "Scenario Timeline is reserved for a future phase. Timeline event history is not yet available in the Assistant.",
        responseType: "timeline",
        sourcesUsed: ["workspaceScenarioContract"],
      };
    case "insight_explanation":
      return insight
        ? {
            reply: `${input.scenario.name} insight: ${insight.executiveSummary}\nReason: ${insight.insightReason}`,
            responseType: "insight",
            sourcesUsed: ["workspaceScenarioInsightEngine"],
          }
        : {
            reply: "Scenario insight is not available for this scenario.",
            responseType: "unavailable",
            sourcesUsed: ["workspaceScenarioInsightEngine"],
          };
    case "simulation_explanation":
      return {
        reply: `${input.scenario.name} simulation:\n${formatSimulationExplanation(simulation)}`,
        responseType: simulation ? "simulation" : "unavailable",
        sourcesUsed: ["workspaceScenarioSimulationEngine"],
      };
    case "comparison_explanation":
      return {
        reply: formatComparisonExplanation({
          workspaceId: input.workspaceId,
          scenario: input.scenario,
          text: input.text,
        }),
        responseType: comparison ? "comparison" : "unavailable",
        sourcesUsed: ["workspaceScenarioComparisonEngine"],
      };
    case "tradeoff_explanation":
      return comparison && comparison.businessTradeoffs.length > 0
        ? {
            reply: comparison.businessTradeoffs
              .map((tradeoff) => `${tradeoff.benefit} vs ${tradeoff.cost}: ${tradeoff.observation}`)
              .join("\n"),
            responseType: "tradeoff",
            sourcesUsed: ["workspaceScenarioComparisonEngine"],
          }
        : {
            reply: "Business tradeoff data is not available for this scenario.",
            responseType: "unavailable",
            sourcesUsed: ["workspaceScenarioComparisonEngine"],
          };
    case "assumption_explanation":
      return simulation && simulation.assumptions.length > 0
        ? {
            reply: `${input.scenario.name} assumptions:\n${simulation.assumptions
              .map(
                (assumption) =>
                  `- ${assumption.label} (${assumption.assumptionType}): ${String(assumption.value)}${assumption.unit ? assumption.unit : ""}`
              )
              .join("\n")}`,
            responseType: "assumption",
            sourcesUsed: ["workspaceScenarioSimulationEngine"],
          }
        : {
            reply: "Assumption data is not available for this scenario.",
            responseType: "unavailable",
            sourcesUsed: ["workspaceScenarioSimulationEngine"],
          };
    case "executive_questions":
      return {
        reply: [
          ...(simulation?.executiveQuestions ?? []),
          ...(comparison?.executiveQuestions ?? []),
        ].length > 0
          ? [...(simulation?.executiveQuestions ?? []), ...(comparison?.executiveQuestions ?? [])]
              .slice(0, 4)
              .map((question, index) => `${index + 1}. ${question}`)
              .join("\n")
          : "Executive questions are not available for this scenario yet.",
        responseType:
          (simulation?.executiveQuestions.length ?? 0) > 0 ||
          (comparison?.executiveQuestions.length ?? 0) > 0
            ? "executive_questions"
            : "unavailable",
        sourcesUsed: ["workspaceScenarioSimulationEngine", "workspaceScenarioComparisonEngine"],
      };
    case "scenario_overview":
    default:
      return {
        reply: [
          `${input.scenario.name} (${input.scenario.status}, ${input.scenario.scenarioType})`,
          input.scenario.description || "No description recorded.",
          insight ? `Insight: ${insight.executiveSummary}` : "Insight: unavailable.",
          simulation
            ? `Latest simulation: ${simulation.simulationStatus} — ${simulation.simulationSummary}`
            : "Latest simulation: unavailable.",
          comparison
            ? `Latest comparison: ${comparison.comparisonSummary}`
            : "Latest comparison: unavailable.",
          `Timeline status: ${summary.timelineStatus}.`,
        ].join("\n"),
        responseType: "overview",
        sourcesUsed: [
          "workspaceScenarioContract",
          "workspaceScenarioInsightEngine",
          "workspaceScenarioSimulationEngine",
          "workspaceScenarioComparisonEngine",
          "scenarioWorkspaceIntegrationRuntime",
        ],
      };
  }
}

export function resolveScenarioExecutiveAdvisorQuestion(
  input: ResolveScenarioExecutiveAdvisorQuestionInput
): ScenarioExecutiveAdvisorResult | null {
  const text = String(input.text ?? "").trim();
  if (!text || !isScenarioExecutiveAdvisorQuestion(text)) return null;

  const workspaceId = normalizeWorkspaceId(input.workspaceId);
  if (!workspaceId) return null;

  const questionType = classifyScenarioExecutiveAdvisorQuestion(text);
  const scenario = resolveScenarioFromText({
    workspaceId,
    text,
    scenarioId: input.scenarioId,
  });

  const { reply, responseType, sourcesUsed } = buildAdvisorReply({
    workspaceId,
    scenario,
    questionType,
    text,
  });

  emitScenarioAdvisorDiagnostic({
    workspaceId,
    scenarioId: scenario?.scenarioId ?? null,
    questionType,
    responseType,
    sourcesUsed,
  });

  return Object.freeze({
    matched: true,
    assistantReply: reply,
    actions: advisorAction(),
    questionType,
    responseType,
    sourcesUsed: Object.freeze(sourcesUsed),
  });
}

export function resolveScenarioExecutiveAdvisorRouterResult(
  input: ResolveScenarioExecutiveAdvisorQuestionInput
): RouterResult | null {
  const result = resolveScenarioExecutiveAdvisorQuestion(input);
  if (!result?.matched) return null;
  return Object.freeze({
    assistantReply: result.assistantReply,
    actions: [...result.actions],
  });
}

export function buildScenarioExecutiveAdvisorSummary(workspaceId?: WorkspaceId | null): string {
  const summary = getWorkspaceScenarioWorkspaceSummary(workspaceId);
  if (summary.totalScenarios === 0) {
    return "No workspace scenarios available.";
  }
  return [
    `Scenarios: ${summary.totalScenarios}`,
    `Active: ${summary.activeCount}`,
    summary.draftCount > 0 ? `Draft: ${summary.draftCount}` : null,
    summary.activeScenarioName ? `Active scenario: ${summary.activeScenarioName}` : null,
    summary.latestSimulationScenarioName
      ? `Latest simulation: ${summary.latestSimulationScenarioName}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function resetScenarioExecutiveAdvisorCacheForTests(): void {
  // Read-only runtime — no cached state to reset.
}

/**
 * MRP:11:2:7 - Assistant intelligence cards runtime.
 *
 * Pure derivation only. The Assistant remains chat-first and does not own
 * dashboard, scene, or object state.
 */

import {
  ASSISTANT_INTELLIGENCE_CARD_LIMIT,
  DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS,
  type AssistantIntelligenceCardModel,
  type AssistantIntelligenceCardsInput,
} from "./assistantIntelligenceCardsContract.ts";
import { getWorkspaceScenarioWorkspaceSummary } from "../scenario/scenarioWorkspaceIntegrationRuntime.ts";

function clean(value: string | null | undefined): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function resolveObjectName(input: AssistantIntelligenceCardsInput): string | null {
  return clean(input.selectedObjectName) ?? clean(input.selectedObjectLabel) ?? clean(input.selectedObjectId);
}

function resolveScenarioName(input: AssistantIntelligenceCardsInput): string | null {
  return clean(input.activeScenarioName) ?? clean(input.activeScenarioLabel) ?? clean(input.activeScenarioId);
}

function resolveWorkspaceLabel(input: AssistantIntelligenceCardsInput): string {
  return (
    clean(input.workspaceContextLabel) ??
    clean(input.activeWorkspaceId) ??
    clean(input.dashboardContext) ??
    clean(input.dashboardMode) ??
    "executive workspace"
  );
}

function withPrompt(
  card: AssistantIntelligenceCardModel,
  prompt: string
): AssistantIntelligenceCardModel {
  return Object.freeze({
    ...card,
    action: Object.freeze({
      ...card.action,
      prompt,
    }),
  });
}

export function buildAssistantIntelligenceCards(
  input: AssistantIntelligenceCardsInput
): readonly AssistantIntelligenceCardModel[] {
  const objectName = resolveObjectName(input);
  const workspaceScenarioSummary = clean(input.activeWorkspaceId)
    ? getWorkspaceScenarioWorkspaceSummary(input.activeWorkspaceId)
    : null;
  const scenarioName =
    resolveScenarioName(input) ?? workspaceScenarioSummary?.activeScenarioName ?? null;
  const workspaceLabel = resolveWorkspaceLabel(input);
  const hasObject = Boolean(objectName);
  const hasRisk =
    input.hasRiskSignal === true ||
    input.objectImpact === "critical" ||
    input.objectImpact === "high" ||
    clean(input.selectedObjectStatus)?.toLowerCase().includes("risk") === true ||
    clean(input.selectedObjectStatus)?.toLowerCase().includes("critical") === true;
  const riskPriority = hasRisk ? 100 : hasObject ? 72 : 42;
  const insightSummary = hasObject
    ? `${objectName} is shaping the current executive path.`
    : "Workspace signals are ready for an executive read.";
  const insightDetail = hasObject
    ? "Object context is now the strongest source for the next Assistant answer."
    : truncate(input.assistantContextSummary ?? "No object is selected, so Nexora is briefing from workspace context.", 110);
  const riskSummary = hasRisk
    ? `${objectName ?? "The workspace"} has an elevated risk signal.`
    : "No elevated object risk is in focus.";
  const recommendationSummary = hasObject
    ? `Analyze ${objectName} before committing the next action.`
    : "Start with the highest-impact workspace thread.";
  const scenarioSummary = scenarioName
    ? workspaceScenarioSummary?.latestInsightSummary
      ? `${scenarioName}: ${truncate(workspaceScenarioSummary.latestInsightSummary, 72)}`
      : `${scenarioName} is ready for comparison.`
    : input.hasScenarioConflict
      ? "Scenario conflict is visible and ready to compare."
      : workspaceScenarioSummary && workspaceScenarioSummary.totalScenarios > 0
        ? `${workspaceScenarioSummary.totalScenarios} workspace scenario(s) available.`
        : "Scenario simulation is available when a path is selected.";

  const cards: AssistantIntelligenceCardModel[] = [
    withPrompt(
      Object.freeze({
        id: "executive_insight",
        title: "Insight",
        icon: "I",
        summary: truncate(insightSummary, 82),
        detail: truncate(insightDetail, 118),
        badge: hasObject ? "Medium" : "Overview",
        badgeTone: "info",
        tone: "insight",
        priority: hasObject ? 86 : 64,
        action: DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS.explain,
      }),
      hasObject
        ? `Explain the key insight for ${objectName}, including confidence and the strongest reason.`
        : `Explain the current executive overview for ${workspaceLabel}.`
    ),
    withPrompt(
      Object.freeze({
        id: "risk_signal",
        title: "Risk",
        icon: "R",
        summary: truncate(riskSummary, 82),
        detail: hasRisk
          ? "Prioritize dependency, volatility, and downstream impact before changing course."
          : "Risk card stays quiet until a selected object or workspace signal needs attention.",
        badge: hasRisk ? "High" : "Normal",
        badgeTone: hasRisk ? "danger" : "success",
        tone: "risk",
        priority: riskPriority,
        action: hasRisk
          ? DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS.simulate
          : DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS.explain,
      }),
      hasRisk
        ? `Simulate the risk path for ${objectName ?? workspaceLabel} and explain the likely impact.`
        : `Explain the current risk posture for ${workspaceLabel}.`
    ),
    withPrompt(
      Object.freeze({
        id: "recommendation",
        title: "Recommendation",
        icon: "A",
        summary: truncate(recommendationSummary, 82),
        detail: truncate(
          input.decisionContextSummary ??
            "This keeps the next move grounded in the active object, decision, and workspace context.",
          118
        ),
        badge: hasObject ? "Ready" : "Next",
        badgeTone: "neutral",
        tone: "recommendation",
        priority: hasObject ? 78 : 58,
        action: hasObject
          ? DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS.analyze
          : DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS.openDashboard,
      }),
      hasObject
        ? `Analyze ${objectName} and recommend the next executive action.`
        : "Recommend the next executive action from the current workspace overview."
    ),
    withPrompt(
      Object.freeze({
        id: "scenario",
        title: "Scenario",
        icon: "S",
        summary: truncate(scenarioSummary, 82),
        detail: scenarioName
          ? "Ask the Assistant to explain insight, simulation, comparison, or tradeoffs from existing scenario intelligence."
          : "Scenario readiness improves once an object or authored scenario is selected.",
        badge: scenarioName || input.hasScenarioConflict ? "Ready" : "Standby",
        badgeTone: scenarioName || input.hasScenarioConflict ? "warning" : "neutral",
        tone: "scenario",
        priority: scenarioName ? 82 : input.hasScenarioConflict ? 76 : 46,
        action: scenarioName || hasObject
          ? DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS.simulate
          : DEFAULT_ASSISTANT_INTELLIGENCE_ACTIONS.openDashboard,
      }),
      scenarioName
        ? `Explain ${scenarioName} using existing scenario intelligence.`
        : "Open the scenario workspace and identify the most useful simulation path."
    ),
  ];

  return Object.freeze(
    cards
      .sort((a, b) => b.priority - a.priority)
      .slice(0, ASSISTANT_INTELLIGENCE_CARD_LIMIT)
  );
}

let lastTraceSignature: string | null = null;

export function traceAssistantIntelligenceCards(
  input: AssistantIntelligenceCardsInput,
  cards: readonly AssistantIntelligenceCardModel[]
): void {
  if (process.env.NODE_ENV === "production") return;
  const selectedObject = clean(input.selectedObjectId) ?? resolveObjectName(input) ?? null;
  const scenario = resolveScenarioName(input);
  const primaryCard = cards[0]?.id ?? null;
  const signature = JSON.stringify({
    selectedObject,
    scenario,
    cardCount: cards.length,
    primaryCard,
  });
  if (lastTraceSignature === signature) return;
  lastTraceSignature = signature;
  globalThis.console?.log?.(
    `[AssistantIntelligenceCards]\nselectedObject=${selectedObject ?? "null"}\nscenario=${
      scenario ?? "null"
    }\ncardCount=${cards.length}\nprimaryCard=${primaryCard ?? "null"}`
  );
}

export function resetAssistantIntelligenceCardsTraceForTests(): void {
  lastTraceSignature = null;
}

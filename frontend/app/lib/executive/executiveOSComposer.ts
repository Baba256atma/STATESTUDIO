"use client";

import type { CompareTradeoff } from "../compare/compareTypes";
import type { StrategicCouncilResult } from "../council/strategicCouncilTypes";
import type { EvolutionState, ScenarioMemoryRecord } from "../evolution/evolutionTypes";
import type { SystemIntelligenceAdvice, SystemIntelligenceObjectInsight, SystemIntelligencePathInsight } from "../intelligence/systemIntelligenceTypes";
import type { EvaluatedStrategy } from "../strategy-generation/strategyGenerationTypes";
import type {
  ComposeExecutiveOSInput,
  ExecutiveHistoryItem,
  ExecutiveLearningSummary,
  ExecutiveOSState,
  ExecutiveOperatingMode,
  ExecutivePriority,
  ExecutiveQueueItem,
  ExecutiveRecommendation,
  ExecutiveSignal,
  ExecutiveWorkspaceSummary,
} from "./executiveOSTypes";

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function toTitleCase(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/^obj_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function uniqueById<T extends { [key: string]: unknown }>(items: T[], key: keyof T): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = String(item[key] ?? "");
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function scorePriority(urgency: number, confidence: number): number {
  return clamp01(urgency) * 0.65 + clamp01(confidence) * 0.35;
}

function mapObjectInsightToSignal(insight: SystemIntelligenceObjectInsight): ExecutiveSignal {
  const priority = clamp01(insight.strategic_priority);
  const pressure = clamp01(insight.pressure_score);
  const leverage = clamp01(insight.leverage_score);
  const fragility = clamp01(Number(insight.fragility_score ?? 0));
  const title = toTitleCase(insight.object_id) || "Strategic object";

  if (insight.role === "leverage" || leverage >= 0.7) {
    return {
      signal_id: `signal:leverage:${insight.object_id}`,
      kind: "leverage",
      title: `${title} is a leverage point`,
      summary: insight.rationale ?? `${title} can shift multiple connected outcomes with limited intervention.`,
      target_object_id: insight.object_id,
      severity: leverage,
      confidence: priority,
    };
  }

  if (insight.role === "bottleneck" || pressure >= 0.66 || fragility >= 0.66) {
    return {
      signal_id: `signal:risk:${insight.object_id}`,
      kind: fragility >= pressure ? "fragility" : "risk",
      title: `${title} needs executive attention`,
      summary: insight.rationale ?? `${title} is carrying concentrated pressure through the current system state.`,
      target_object_id: insight.object_id,
      severity: Math.max(priority, pressure, fragility),
      confidence: Math.max(priority, fragility),
    };
  }

  return {
    signal_id: `signal:attention:${insight.object_id}`,
    kind: "attention",
    title: `${title} remains strategically relevant`,
    summary: insight.rationale ?? `${title} is active in the current decision picture and worth watching.`,
    target_object_id: insight.object_id,
    severity: priority,
    confidence: priority,
  };
}

function mapPathInsightToPriority(path: SystemIntelligencePathInsight): ExecutivePriority {
  const title =
    path.source_object_id && path.target_object_id
      ? `${toTitleCase(path.source_object_id)} to ${toTitleCase(path.target_object_id)}`
      : "Strategic path";
  return {
    priority_id: `priority:path:${path.path_id}`,
    title,
    summary: path.rationale ?? "A meaningful path is shaping current system behavior.",
    target_object_id: path.target_object_id,
    target_path_id: path.path_id,
    source: "intelligence",
    urgency: clamp01(path.significance_score),
    confidence: clamp01(path.path_strength),
  };
}

function mapAdviceToRecommendation(
  advice: SystemIntelligenceAdvice,
  scenarioId: string | null
): ExecutiveRecommendation {
  const kind =
    advice.kind === "focus"
      ? "inspect"
      : advice.kind === "mitigate"
      ? "mitigate"
      : advice.kind === "protect"
      ? "protect"
      : advice.kind === "investigate"
      ? "inspect"
      : "simulate";
  return {
    recommendation_id: `recommendation:intelligence:${advice.advice_id}`,
    kind,
    title: advice.title,
    summary: advice.body,
    target_object_id: advice.target_object_id,
    linked_scenario_id: scenarioId,
    confidence: clamp01(advice.confidence),
  };
}

function mapTradeoffToSignal(tradeoff: CompareTradeoff): ExecutiveSignal {
  return {
    signal_id: `signal:tradeoff:${tradeoff.dimension}`,
    kind: tradeoff.winner === "tie" ? "attention" : "opportunity",
    title: `${tradeoff.dimension[0].toUpperCase()}${tradeoff.dimension.slice(1)} tradeoff`,
    summary: tradeoff.explanation,
    severity: clamp01(tradeoff.confidence),
    confidence: clamp01(tradeoff.confidence),
  };
}

function mapStrategyToRecommendation(strategy: EvaluatedStrategy): ExecutiveRecommendation {
  return {
    recommendation_id: `recommendation:strategy:${strategy.strategy.strategy_id}`,
    kind: "explore_strategy",
    title: strategy.strategy.title,
    summary: strategy.strategy.rationale,
    target_object_id: strategy.strategy.actions[0]?.source_object_id ?? null,
    linked_strategy_id: strategy.strategy.strategy_id,
    confidence: clamp01(strategy.score),
  };
}

function mapScenarioMemoryToHistory(record: ScenarioMemoryRecord): ExecutiveHistoryItem {
  return {
    item_id: `history:${record.record_id}`,
    timestamp: Number(record.timestamp ?? 0),
    title: record.scenario_title ?? "Scenario run",
    summary:
      record.observed_outcome?.note ??
      record.predicted_summary?.headline ??
      "Scenario memory retained for review.",
    linked_record_id: record.record_id,
    type: record.observed_outcome && record.observed_outcome.outcome_status !== "unknown" ? "outcome" : "scenario",
  };
}

function composeLearningSummary(evolutionState: EvolutionState | null): ExecutiveLearningSummary | null {
  if (!evolutionState?.active) return null;
  const topSignal = evolutionState.learning_signals[0] ?? null;
  return {
    headline: evolutionState.summary.headline,
    summary: evolutionState.summary.explanation,
    top_signal: topSignal?.rationale ?? null,
    confidence: topSignal ? clamp01(topSignal.confidence) : null,
  };
}

function composeWorkspaceSummary(input: ComposeExecutiveOSInput): ExecutiveWorkspaceSummary | null {
  const pressureLevel = input.intelligence?.object_insights?.length
    ? Math.max(...input.intelligence.object_insights.map((item) => clamp01(item.pressure_score)))
    : null;
  const currentFocusObjectId =
    input.warRoom.state.focusTargetId ??
    input.intelligence?.summary.suggested_focus_object_id ??
    null;
  const headline =
    input.comparison?.summary.headline ??
    input.strategyGeneration?.summary.headline ??
    input.intelligence?.summary.headline ??
    (input.selectedObjectLabel ? `${input.selectedObjectLabel} is in executive focus` : "Executive operating surface ready");
  const summary =
    input.comparison?.summary.reasoning ??
    input.strategyGeneration?.summary.explanation ??
    input.intelligence?.summary.summary ??
    "Nexora is ready to help you observe, simulate, compare, and review strategic change.";

  return {
    headline,
    summary,
    active_mode: input.operatingMode,
    current_pressure_level: pressureLevel,
    current_focus_object_id: currentFocusObjectId,
    council_summary: input.strategicCouncil?.synthesis?.headline ?? null,
  };
}

function mapCouncilSignal(council: StrategicCouncilResult): ExecutiveSignal[] {
  const signals: ExecutiveSignal[] = [];
  const topDisagreement = council.disagreements[0] ?? null;
  if (topDisagreement) {
    signals.push({
      signal_id: `signal:council:${topDisagreement.dimension}`,
      kind: "attention",
      title: `Council tension: ${topDisagreement.dimension.replace(/_/g, " ")}`,
      summary: topDisagreement.summary,
      severity: clamp01(topDisagreement.tension_level),
      confidence: clamp01(council.synthesis.confidence),
    });
  }
  signals.push({
    signal_id: "signal:council:synthesis",
    kind: "opportunity",
    title: council.synthesis.headline,
    summary: council.synthesis.recommended_direction,
    severity: clamp01(council.synthesis.confidence),
    confidence: clamp01(council.synthesis.confidence),
  });
  return signals;
}

function mapCouncilRecommendations(council: StrategicCouncilResult): ExecutiveRecommendation[] {
  return council.synthesis.top_actions.slice(0, 3).map((action, index) => ({
    recommendation_id: `recommendation:council:${index}`,
    kind: "explore_strategy",
    title: action,
    summary: index === 0 ? council.synthesis.recommended_direction : council.synthesis.summary,
    confidence: clamp01(council.synthesis.confidence),
  }));
}

function composeSignals(input: ComposeExecutiveOSInput): ExecutiveSignal[] {
  const signals: ExecutiveSignal[] = [];
  const scannerDrivers = Array.isArray(input.scannerSummary?.drivers)
    ? (input.scannerSummary?.drivers as Array<Record<string, unknown>>)
    : [];
  const topScannerDriver = scannerDrivers[0] ?? null;
  if (topScannerDriver) {
    signals.push({
      signal_id: `signal:scanner:${String(topScannerDriver.id ?? topScannerDriver.object_id ?? "top")}`,
      kind: "risk",
      title: `${toTitleCase(String(topScannerDriver.label ?? topScannerDriver.id ?? "Scanner target"))} is emerging as a scanner risk`,
      summary: String(topScannerDriver.summary ?? topScannerDriver.reason ?? "Scanner pressure remains elevated around this node."),
      target_object_id: String(topScannerDriver.id ?? topScannerDriver.object_id ?? ""),
      severity: clamp01(Number(topScannerDriver.score ?? topScannerDriver.weight ?? 0.7)),
      confidence: 0.72,
    });
  }

  signals.push(...(input.intelligence?.object_insights ?? []).slice(0, 4).map(mapObjectInsightToSignal));
  signals.push(...(input.comparison?.tradeoffs ?? []).slice(0, 2).map(mapTradeoffToSignal));

  if (input.strategyGeneration?.summary) {
    signals.push({
      signal_id: "signal:strategy:summary",
      kind: "opportunity",
      title: input.strategyGeneration.summary.headline,
      summary: input.strategyGeneration.summary.explanation,
      target_object_id: input.strategyGeneration.strategies[0]?.strategy.actions[0]?.source_object_id ?? null,
      severity: clamp01(input.strategyGeneration.summary.confidence),
      confidence: clamp01(input.strategyGeneration.summary.confidence),
    });
  }

  if (input.evolutionState?.active) {
    signals.push({
      signal_id: "signal:learning:summary",
      kind: "learning",
      title: input.evolutionState.summary.headline,
      summary: input.evolutionState.summary.explanation,
      severity: clamp01(input.evolutionState.learning_signals[0]?.value ?? 0.4),
      confidence: clamp01(input.evolutionState.learning_signals[0]?.confidence ?? 0.55),
    });
  }

  if (input.strategicCouncil?.active) {
    signals.push(...mapCouncilSignal(input.strategicCouncil));
  }

  return uniqueById(signals, "signal_id").slice(0, 8);
}

function composePriorities(input: ComposeExecutiveOSInput): ExecutivePriority[] {
  const priorities: ExecutivePriority[] = [];
  priorities.push(...(input.intelligence?.object_insights ?? []).slice(0, 3).map((insight) => ({
    priority_id: `priority:object:${insight.object_id}`,
    title: `${toTitleCase(insight.object_id)} should be reviewed`,
    summary: insight.rationale ?? "This object is carrying strategic weight in the current system view.",
    target_object_id: insight.object_id,
    source: "intelligence" as const,
    urgency: clamp01(Math.max(insight.pressure_score, insight.strategic_priority)),
    confidence: clamp01(Math.max(insight.leverage_score, insight.strategic_priority)),
  })));
  priorities.push(...(input.intelligence?.path_insights ?? []).slice(0, 2).map(mapPathInsightToPriority));

  if (input.comparison?.summary) {
    priorities.push({
      priority_id: "priority:compare:summary",
      title: input.comparison.summary.headline,
      summary: input.comparison.summary.reasoning,
      source: "compare",
      urgency: clamp01(input.comparison.summary.confidence),
      confidence: clamp01(input.comparison.summary.confidence),
    });
  }

  const recommended = input.strategyGeneration?.strategies.find(
    (item) => item.strategy.strategy_id === input.strategyGeneration?.recommended_strategy_id
  ) ?? input.strategyGeneration?.strategies[0];
  if (recommended) {
    priorities.push({
      priority_id: `priority:strategy:${recommended.strategy.strategy_id}`,
      title: `Review ${recommended.strategy.title}`,
      summary: recommended.strategy.description,
      target_object_id: recommended.strategy.actions[0]?.source_object_id ?? null,
      source: "strategy",
      urgency: clamp01(recommended.expected_impact),
      confidence: clamp01(recommended.score),
    });
  }

  if (input.evolutionState?.learning_signals[0]) {
    const signal = input.evolutionState.learning_signals[0];
    priorities.push({
      priority_id: `priority:learning:${signal.signal_id}`,
      title: "Review learned pattern",
      summary: signal.rationale,
      target_object_id: signal.target_scope === "object" ? signal.target_key : null,
      source: "learning",
      urgency: clamp01(Math.abs(signal.value)),
      confidence: clamp01(signal.confidence),
    });
  }

  return uniqueById(priorities, "priority_id")
    .sort((a, b) => scorePriority(b.urgency, b.confidence) - scorePriority(a.urgency, a.confidence))
    .slice(0, 6);
}

function composeRecommendations(input: ComposeExecutiveOSInput): ExecutiveRecommendation[] {
  const recommendations: ExecutiveRecommendation[] = [];
  recommendations.push(
    ...(input.intelligence?.advice ?? []).slice(0, 3).map((advice) =>
      mapAdviceToRecommendation(advice, input.warRoom.state.activeScenarioId)
    )
  );

  if (input.comparison?.advice[0]) {
    const advice = input.comparison.advice[0];
    recommendations.push({
      recommendation_id: `recommendation:compare:${advice.advice_id}`,
      kind: "compare",
      title: advice.title,
      summary: advice.explanation,
      linked_scenario_id: input.warRoom.state.compare.scenarioAId ?? null,
      confidence: clamp01(advice.confidence),
    });
  }

  recommendations.push(...(input.strategyGeneration?.strategies ?? []).slice(0, 2).map(mapStrategyToRecommendation));

  if (input.evolutionState?.summary) {
    recommendations.push({
      recommendation_id: "recommendation:learning:review",
      kind: "review_history",
      title: "Review recent learned pattern",
      summary: input.evolutionState.summary.explanation,
      confidence: clamp01(input.evolutionState.learning_signals[0]?.confidence ?? 0.6),
    });
  }

  if (input.strategicCouncil?.active) {
    recommendations.unshift(...mapCouncilRecommendations(input.strategicCouncil));
  }

  return uniqueById(recommendations, "recommendation_id")
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);
}

function composeQueue(
  priorities: ExecutivePriority[],
  recommendations: ExecutiveRecommendation[],
  operatingMode: ExecutiveOperatingMode
): ExecutiveQueueItem[] {
  const queue: ExecutiveQueueItem[] = [];
  priorities.slice(0, 2).forEach((priority, index) => {
    queue.push({
      item_id: `queue:priority:${priority.priority_id}`,
      title: priority.title,
      item_type: priority.target_path_id ? "comparison" : "focus",
      status: operatingMode === "investigate" && index === 0 ? "in_progress" : "ready",
      linked_object_id: priority.target_object_id ?? null,
      linked_scenario_id: null,
      linked_strategy_id: null,
    });
  });
  recommendations.slice(0, 3).forEach((recommendation, index) => {
    queue.push({
      item_id: `queue:recommendation:${recommendation.recommendation_id}`,
      title: recommendation.title,
      item_type:
        recommendation.kind === "compare"
          ? "comparison"
          : recommendation.kind === "explore_strategy"
          ? "strategy"
          : recommendation.kind === "review_history"
          ? "review"
          : "scenario",
      status: operatingMode === "decide" && index === 0 ? "in_progress" : "ready",
      linked_object_id: recommendation.target_object_id ?? null,
      linked_scenario_id: recommendation.linked_scenario_id ?? null,
      linked_strategy_id: recommendation.linked_strategy_id ?? null,
    });
  });
  return queue.slice(0, 5);
}

function composeHistory(input: ComposeExecutiveOSInput): ExecutiveHistoryItem[] {
  const items: ExecutiveHistoryItem[] = [];
  items.push(...input.recentMemory.scenario_records.map(mapScenarioMemoryToHistory));
  items.push(
    ...input.recentMemory.strategy_records.map((record) => ({
      item_id: `history:${record.record_id}`,
      timestamp: Number(record.timestamp ?? 0),
      title: record.title,
      summary: record.rationale,
      linked_record_id: record.record_id,
      type: "strategy" as const,
    }))
  );
  items.push(
    ...input.recentMemory.comparison_records.map((record) => ({
      item_id: `history:${record.record_id}`,
      timestamp: Number(record.timestamp ?? 0),
      title: `Comparison ${record.scenario_a_id ?? "A"} vs ${record.scenario_b_id ?? "B"}`,
      summary: record.recommendation ?? "Comparison memory retained.",
      linked_record_id: record.record_id,
      type: "comparison" as const,
    }))
  );
  return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
}

export function composeExecutiveOSState(input: ComposeExecutiveOSInput): ExecutiveOSState {
  const signals = composeSignals(input);
  const priorities = composePriorities(input);
  const recommendations = composeRecommendations(input);
  const history = composeHistory(input);
  const learningSummary = composeLearningSummary(input.evolutionState);
  const workspaceSummary = composeWorkspaceSummary(input);

  return {
    active: input.warRoom.session.active || input.warRoom.state.activeScenarioId !== null,
    operatingMode: input.operatingMode,
    currentFocus: {
      objectId:
        input.warRoom.state.focusTargetId ??
        input.intelligence?.summary.suggested_focus_object_id ??
        null,
      pathId: priorities.find((priority) => priority.target_path_id)?.target_path_id ?? null,
      scenarioId: input.warRoom.state.activeScenarioId,
      strategyId:
        input.warRoom.state.strategyGeneration.selectedStrategyId ??
        input.strategyGeneration?.recommended_strategy_id ??
        null,
    },
    executiveSignals: signals,
    priorities,
    recommendations,
    operatingQueue: composeQueue(priorities, recommendations, input.operatingMode),
    recentHistory: history,
    learningSummary,
    workspaceSummary,
    strategicCouncil: input.strategicCouncil ?? null,
  };
}

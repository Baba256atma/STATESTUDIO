import { matchObjectsFromPrompt, tokenizeSemanticText, type SemanticObject } from "../objectSemantics";
import type { ActiveModeContext } from "../modes/productModesContract";

export type ReasoningIntent =
  | "simulate_disruption"
  | "compare_scenarios"
  | "request_executive_summary"
  | "inspect_object"
  | "scanner_enrichment"
  | "generic_analysis";

export type ReasoningPath =
  | "object_matching"
  | "simulation_path"
  | "comparison_path"
  | "executive_path"
  | "memory_path"
  | "scanner_path";

export type MatchedConcept = {
  kind: "object" | "tag" | "kpi" | "objective" | "memory_pattern" | "scanner_source";
  id: string;
  label?: string;
  score?: number;
  source?: string;
};

export type ReasoningConfidence = {
  score: number;
  band: "low" | "moderate" | "high";
  uncertainty_notes?: string[];
};

export type ReasoningContext = {
  workspace_id?: string;
  project_id: string;
  project_domain?: string;
  selected_object_id?: string | null;
  active_mode?: ActiveModeContext | null;
  memory_signals?: {
    volatile_nodes?: string[];
    recurring_patterns?: string[];
  };
  scanner_context?: {
    source_type?: string;
    source_id?: string;
    confidence?: number;
  };
};

export type ReasoningInput = {
  raw_prompt: string;
  normalized_prompt: string;
  tokens: string[];
  context: ReasoningContext;
  semantic_objects?: SemanticObject[];
  simulation_context?: {
    baseline_available?: boolean;
    active_scenario_id?: string;
  };
  strategy_context?: {
    at_risk_kpis?: string[];
    threatened_objectives?: string[];
  };
};

export type ReasoningOutput = {
  intent: ReasoningIntent;
  path: ReasoningPath;
  matched_concepts: MatchedConcept[];
  inferred_decision_input?: {
    kind: "decision" | "disruption" | "pressure_event" | "mitigation" | "parameter_change" | "scenario_action";
    target_object_ids: string[];
    topics: string[];
  };
  scenario_suggestion?: {
    mode: "single_event" | "compare" | "summary";
    reason: string;
  };
  explanation_seeds: string[];
  recommendation_seeds: string[];
  ambiguity_notes?: string[];
  confidence: ReasoningConfidence;
  references?: {
    memory?: string[];
    comparison?: string[];
  };
  trace: {
    selected_path_reason: string;
    detected_signals: string[];
  };
};

export type ReasoningProviderAdapter = {
  id: string;
  interpret: (input: ReasoningInput) => Promise<ReasoningOutput> | ReasoningOutput;
};

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function normalizePrompt(text: string): string {
  return String(text || "").trim().toLowerCase();
}

function unique(xs: string[]): string[] {
  return Array.from(new Set((xs ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
}

function inferIntent(prompt: string, mode?: ActiveModeContext | null): ReasoningIntent {
  const p = normalizePrompt(prompt);
  if (/\bcompare|vs\b|baseline|difference|delta/.test(p)) return "compare_scenarios";
  if (/\bsummary|executive|brief|board|manager/.test(p) || mode?.mode_id === "executive") {
    return "request_executive_summary";
  }
  if (/\bscan|scanner|ingest|enrich|import/.test(p) || mode?.mode_id === "scanner") {
    return "scanner_enrichment";
  }
  if (/\bfocus|inspect|detail|object/.test(p)) return "inspect_object";
  if (/\bdelay|drop|spike|increase|disrupt|failure|risk|pressure/.test(p)) return "simulate_disruption";
  return "generic_analysis";
}

function choosePath(params: {
  intent: ReasoningIntent;
  hasObjects: boolean;
  hasMemory: boolean;
  hasComparison: boolean;
}): { path: ReasoningPath; reason: string } {
  if (params.intent === "scanner_enrichment") {
    return { path: "scanner_path", reason: "Prompt signals scanner/import/enrichment workflow." };
  }
  if (params.intent === "compare_scenarios" || params.hasComparison) {
    return { path: "comparison_path", reason: "Prompt or context indicates baseline/comparison interpretation." };
  }
  if (params.intent === "request_executive_summary") {
    return { path: "executive_path", reason: "Prompt requests high-level executive interpretation." };
  }
  if (params.intent === "inspect_object") {
    return { path: "object_matching", reason: "Prompt asks for object-level inspection/detail." };
  }
  if (params.hasMemory) {
    return { path: "memory_path", reason: "Historical/memory signals available for interpretation." };
  }
  if (params.hasObjects) {
    return { path: "simulation_path", reason: "Matched objects available for simulation-oriented reasoning." };
  }
  return { path: "object_matching", reason: "Fallback to semantic object matching path." };
}

function confidenceFromSignals(params: {
  matchedObjectCount: number;
  ambiguityCount: number;
  mode?: ActiveModeContext | null;
}): ReasoningConfidence {
  const modeBoost = params.mode?.mode_id === "analyst" ? 0.06 : params.mode?.mode_id === "executive" ? -0.02 : 0;
  const score = clamp01(0.42 + params.matchedObjectCount * 0.11 - params.ambiguityCount * 0.12 + modeBoost);
  const band: ReasoningConfidence["band"] = score >= 0.76 ? "high" : score >= 0.48 ? "moderate" : "low";
  return {
    score,
    band,
    uncertainty_notes:
      params.ambiguityCount > 0
        ? ["Prompt ambiguity detected; interpretation uses best-effort semantic matching."]
        : undefined,
  };
}

export function createReasoningInput(params: {
  prompt: string;
  context: ReasoningContext;
  semanticObjects?: SemanticObject[];
  simulationContext?: ReasoningInput["simulation_context"];
  strategyContext?: ReasoningInput["strategy_context"];
}): ReasoningInput {
  const normalized = normalizePrompt(params.prompt);
  return {
    raw_prompt: params.prompt,
    normalized_prompt: normalized,
    tokens: tokenizeSemanticText(normalized),
    context: params.context,
    semantic_objects: params.semanticObjects,
    simulation_context: params.simulationContext,
    strategy_context: params.strategyContext,
  };
}

export function buildReasoningOutput(input: ReasoningInput): ReasoningOutput {
  const objects = Array.isArray(input.semantic_objects) ? input.semantic_objects : [];
  const matchedObjects = matchObjectsFromPrompt(input.raw_prompt, objects, 5);
  const matchedObjectIds = matchedObjects.map((m) => m.id);

  const matchedConcepts: MatchedConcept[] = [
    ...matchedObjects.map((m) => ({
      kind: "object" as const,
      id: m.id,
      score: m.score,
      source: "semantic_match",
    })),
    ...(input.strategy_context?.at_risk_kpis ?? []).slice(0, 2).map((kpiId) => ({
      kind: "kpi" as const,
      id: kpiId,
      source: "strategy_context",
    })),
    ...(input.context.memory_signals?.volatile_nodes ?? []).slice(0, 2).map((node) => ({
      kind: "memory_pattern" as const,
      id: node,
      source: "memory_context",
    })),
  ];

  const intent = inferIntent(input.raw_prompt, input.context.active_mode);
  const hasComparison = !!input.simulation_context?.baseline_available;
  const hasMemory =
    (input.context.memory_signals?.volatile_nodes?.length ?? 0) > 0 ||
    (input.context.memory_signals?.recurring_patterns?.length ?? 0) > 0;
  const { path, reason } = choosePath({
    intent,
    hasObjects: matchedObjectIds.length > 0,
    hasMemory,
    hasComparison,
  });

  const ambiguityNotes: string[] = [];
  if (matchedObjectIds.length === 0) ambiguityNotes.push("No high-confidence object match found.");
  if (input.tokens.length <= 1) ambiguityNotes.push("Prompt is short; intent interpretation may be broad.");

  const confidence = confidenceFromSignals({
    matchedObjectCount: matchedObjectIds.length,
    ambiguityCount: ambiguityNotes.length,
    mode: input.context.active_mode,
  });

  const inferredKind: NonNullable<ReasoningOutput["inferred_decision_input"]>["kind"] =
    intent === "simulate_disruption"
      ? "disruption"
      : intent === "compare_scenarios"
      ? "scenario_action"
      : intent === "scanner_enrichment"
      ? "parameter_change"
      : "decision";

  const affectedKpis = input.strategy_context?.at_risk_kpis ?? [];

  return {
    intent,
    path,
    matched_concepts: matchedConcepts,
    inferred_decision_input: {
      kind: inferredKind,
      target_object_ids: matchedObjectIds,
      topics: unique(input.tokens).slice(0, 6),
    },
    scenario_suggestion:
      path === "comparison_path"
        ? { mode: "compare", reason: "Baseline/comparison context is available or requested." }
        : path === "executive_path"
        ? { mode: "summary", reason: "Mode/prompt emphasizes executive-level output." }
        : { mode: "single_event", reason: "Default single-event simulation path selected." },
    explanation_seeds: unique([
      ...(matchedObjectIds.length ? [`Matched ${matchedObjectIds.length} relevant project entities.`] : []),
      ...(affectedKpis.length ? [`KPI exposure detected in ${affectedKpis.slice(0, 2).join(" and ")}.`] : []),
      hasMemory ? "Historical volatility signals are available for cross-check." : "Limited historical memory signals available.",
    ]),
    recommendation_seeds: unique([
      "Prioritize the most exposed dependency chain before secondary effects spread.",
      ...(affectedKpis.length ? ["Track KPI/objective drift while testing mitigation alternatives."] : []),
      ...(path === "comparison_path" ? ["Compare baseline and impacted scenarios before committing action."] : []),
    ]),
    ambiguity_notes: ambiguityNotes.length ? ambiguityNotes : undefined,
    confidence,
    references: {
      memory: unique([
        ...(input.context.memory_signals?.volatile_nodes ?? []),
        ...(input.context.memory_signals?.recurring_patterns ?? []),
      ]).slice(0, 4),
      comparison: input.simulation_context?.baseline_available ? ["baseline_available"] : undefined,
    },
    trace: {
      selected_path_reason: reason,
      detected_signals: unique([
        `intent:${intent}`,
        `path:${path}`,
        ...(matchedObjectIds.length ? ["semantic_matches"] : []),
        ...(hasMemory ? ["memory_signals"] : []),
        ...(hasComparison ? ["comparison_context"] : []),
      ]),
    },
  };
}

export async function runReasoning(
  input: ReasoningInput,
  adapter?: ReasoningProviderAdapter
): Promise<ReasoningOutput> {
  if (!adapter) return buildReasoningOutput(input);
  const result = await adapter.interpret(input);
  return result;
}

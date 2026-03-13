import type { ActiveModeContext } from "../modes/productModesContract";
import type { ReasoningOutput } from "./aiReasoningContract";
import type { SimulationResult } from "../decision/simulationContract";
import type { ScenarioComparisonResult } from "../decision/scenarioComparisonReplayContract";
import type { ProjectStrategyLayer } from "../strategy/strategyKpiContract";

export type AgentSpecialization =
  | "risk"
  | "strategy"
  | "simulation"
  | "explainability"
  | "memory"
  | "scanner"
  | "kpi"
  | "recommendation";

export type NexoraAgent = {
  id: string;
  label: string;
  specialization: AgentSpecialization;
  role: string;
  input_requirements: string[];
  output_type: string;
  reasoning_scope: string;
  confidence_weight?: number;
  priority?: number;
};

export type AgentContext = {
  workspace_id?: string;
  project_id: string;
  project_domain?: string;
  prompt?: string;
  selected_object_id?: string | null;
  mode_context?: ActiveModeContext | null;
  matched_object_ids?: string[];
  semantic_signals?: {
    tags?: string[];
    dependencies?: string[];
  };
  reasoning?: ReasoningOutput | null;
  simulation?: SimulationResult | null;
  comparison?: ScenarioComparisonResult | null;
  strategy?: ProjectStrategyLayer | null;
  memory?: {
    volatile_nodes?: string[];
    recurring_patterns?: string[];
  } | null;
  scanner?: {
    source_type?: string;
    confidence?: number;
    unresolved_items?: string[];
  } | null;
  exploration?: {
    fragile_object_ids?: string[];
    highest_severity?: number;
    mitigation_ideas?: string[];
  } | null;
};

export type AgentOutput = {
  findings: string[];
  matched_objects?: string[];
  scenario_suggestions?: string[];
  recommendation_fragments?: string[];
  confidence?: number;
  explanation_notes?: string[];
  references?: string[];
};

export type AgentContribution = {
  agent_id: string;
  specialization: AgentSpecialization;
  priority: number;
  confidence: number;
  output: AgentOutput;
};

export type AgentConflict = {
  topic: string;
  agent_ids: string[];
  description: string;
  severity: "low" | "moderate" | "high";
};

export type AgentConsensus = {
  agreement_topics: string[];
  disagreement_topics: string[];
  unresolved_ambiguities: string[];
  merged_confidence: number;
};

export type AgentOrchestrationPlan = {
  mode: "single_path" | "multi_agent";
  selected_agents: string[];
  reason: string;
};

export type MultiAgentResult = {
  plan: AgentOrchestrationPlan;
  contributions: AgentContribution[];
  merged: {
    findings: string[];
    matched_objects: string[];
    scenario_suggestions: string[];
    recommendations: string[];
    explanation_notes: string[];
  };
  conflicts: AgentConflict[];
  consensus: AgentConsensus;
  trace: {
    invoked_count: number;
    agent_order: string[];
  };
};

const DEFAULT_AGENTS: NexoraAgent[] = [
  {
    id: "risk_agent",
    label: "Risk Agent",
    specialization: "risk",
    role: "Fragility and exposure interpreter",
    input_requirements: ["simulation", "semantic_signals"],
    output_type: "risk_findings",
    reasoning_scope: "propagation_risk",
    confidence_weight: 0.18,
    priority: 1,
  },
  {
    id: "simulation_agent",
    label: "Simulation Agent",
    specialization: "simulation",
    role: "Scenario execution interpreter",
    input_requirements: ["simulation", "comparison"],
    output_type: "scenario_path",
    reasoning_scope: "impact_progression",
    confidence_weight: 0.16,
    priority: 1,
  },
  {
    id: "kpi_agent",
    label: "KPI Agent",
    specialization: "kpi",
    role: "KPI/objective impact interpreter",
    input_requirements: ["strategy"],
    output_type: "kpi_findings",
    reasoning_scope: "goal_impact",
    confidence_weight: 0.14,
    priority: 2,
  },
  {
    id: "strategy_agent",
    label: "Strategy Agent",
    specialization: "strategy",
    role: "Strategic objective interpreter",
    input_requirements: ["strategy", "reasoning"],
    output_type: "strategy_findings",
    reasoning_scope: "objective_alignment",
    confidence_weight: 0.12,
    priority: 2,
  },
  {
    id: "memory_agent",
    label: "Memory Agent",
    specialization: "memory",
    role: "Historical volatility and pattern interpreter",
    input_requirements: ["memory"],
    output_type: "memory_findings",
    reasoning_scope: "pattern_reuse",
    confidence_weight: 0.1,
    priority: 3,
  },
  {
    id: "scanner_agent",
    label: "Scanner Agent",
    specialization: "scanner",
    role: "Source-structure quality interpreter",
    input_requirements: ["scanner"],
    output_type: "scanner_findings",
    reasoning_scope: "ingestion_quality",
    confidence_weight: 0.08,
    priority: 3,
  },
  {
    id: "explainability_agent",
    label: "Explainability Agent",
    specialization: "explainability",
    role: "Executive explanation composer",
    input_requirements: ["reasoning", "simulation", "strategy"],
    output_type: "executive_notes",
    reasoning_scope: "driver_summary",
    confidence_weight: 0.12,
    priority: 4,
  },
  {
    id: "recommendation_agent",
    label: "Recommendation Agent",
    specialization: "recommendation",
    role: "Action recommendation composer",
    input_requirements: ["risk", "strategy", "memory"],
    output_type: "recommendations",
    reasoning_scope: "mitigation_actions",
    confidence_weight: 0.1,
    priority: 4,
  },
];

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function uniq(xs: string[]): string[] {
  return Array.from(new Set((xs ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
}

function selectAgents(ctx: AgentContext, catalog: NexoraAgent[]): AgentOrchestrationPlan {
  const modeId = String(ctx.mode_context?.mode_id ?? "").toLowerCase();
  const selected = new Set<string>(["risk_agent", "simulation_agent", "recommendation_agent"]);

  if (ctx.strategy || modeId === "manager" || modeId === "executive") {
    selected.add("kpi_agent");
    selected.add("strategy_agent");
    selected.add("explainability_agent");
  }
  if (ctx.memory && ((ctx.memory.volatile_nodes?.length ?? 0) > 0 || (ctx.memory.recurring_patterns?.length ?? 0) > 0)) {
    selected.add("memory_agent");
  }
  if (ctx.scanner || modeId === "scanner") {
    selected.add("scanner_agent");
  }
  if (modeId === "analyst") {
    selected.add("explainability_agent");
    selected.add("memory_agent");
  }

  const ordered = catalog
    .filter((a) => selected.has(a.id))
    .sort((a, b) => Number(a.priority ?? 99) - Number(b.priority ?? 99))
    .map((a) => a.id);
  return {
    mode: ordered.length <= 1 ? "single_path" : "multi_agent",
    selected_agents: ordered,
    reason:
      ordered.length <= 1
        ? "Minimal single-agent path selected by available context."
        : "Multi-agent path selected based on mode, strategy, memory, and scanner signals.",
  };
}

function runAgent(agent: NexoraAgent, ctx: AgentContext): AgentContribution {
  const matched = uniq(ctx.matched_object_ids ?? []);
  const riskSummary = ctx.simulation?.risk?.summary ?? "";
  const timeline = ctx.simulation?.timeline?.map((s) => s.summary) ?? [];
  const atRiskKpis = ctx.strategy?.impact_summary?.at_risk_kpis ?? [];
  const threatenedObjectives = ctx.strategy?.impact_summary?.threatened_objectives ?? [];
  const volatileNodes = ctx.memory?.volatile_nodes ?? [];
  const recurringPatterns = ctx.memory?.recurring_patterns ?? [];
  const explorationFragile = ctx.exploration?.fragile_object_ids ?? [];
  const scannerUnresolved = ctx.scanner?.unresolved_items ?? [];

  let findings: string[] = [];
  let scenarios: string[] = [];
  let recommendations: string[] = [];
  let notes: string[] = [];
  let references: string[] = [];
  let confidence = 0.58;

  switch (agent.specialization) {
    case "risk":
      findings = uniq([
        riskSummary || "Risk exposure inferred from affected dependency chain.",
        explorationFragile.length
          ? `Autonomous exploration flagged ${explorationFragile.length} fragile nodes.`
          : "No autonomous fragility hotspots were flagged yet.",
      ]);
      recommendations = ["Contain highest-risk dependency before secondary spread accelerates."];
      references = explorationFragile.slice(0, 4);
      confidence = clamp01(0.56 + (ctx.simulation ? 0.16 : 0) + (explorationFragile.length ? 0.08 : 0));
      break;
    case "simulation":
      findings = uniq([
        ctx.simulation?.impact?.summary || "Simulation path not yet available; using inferred scenario path.",
      ]);
      scenarios = uniq([
        ...(ctx.comparison?.baselineReady?.baselineAvailable ? ["Run baseline-vs-impact comparison"] : []),
        "Evaluate mitigation-on scenario against current impact path.",
      ]);
      notes = timeline.slice(0, 3);
      confidence = clamp01(0.54 + (ctx.simulation ? 0.22 : 0) + (ctx.comparison ? 0.06 : 0));
      break;
    case "kpi":
      findings = uniq([
        atRiskKpis.length
          ? `KPI exposure detected: ${atRiskKpis.slice(0, 3).join(", ")}.`
          : "KPI layer available but no high-confidence KPI exposure identified.",
      ]);
      recommendations = atRiskKpis.length
        ? ["Prioritize mitigations that reduce the most exposed KPI first."]
        : ["Track KPI drift while running mitigation alternatives."];
      confidence = clamp01(0.5 + Math.min(atRiskKpis.length, 3) * 0.1);
      break;
    case "strategy":
      findings = uniq([
        threatenedObjectives.length
          ? `Strategic objectives under pressure: ${threatenedObjectives.slice(0, 2).join(", ")}.`
          : "No objective-level threat was explicitly identified.",
      ]);
      recommendations = ["Align mitigation ordering with objective criticality and dependency centrality."];
      confidence = clamp01(0.5 + Math.min(threatenedObjectives.length, 3) * 0.1);
      break;
    case "memory":
      findings = uniq([
        volatileNodes.length ? `Memory volatility signals: ${volatileNodes.slice(0, 3).join(", ")}.` : "No strong volatility memory signals.",
        recurringPatterns.length ? `Recurring patterns detected: ${recurringPatterns.slice(0, 2).join(", ")}.` : "No recurring pattern overlap found.",
      ]);
      recommendations = ["Re-test known high-volatility nodes under mitigation-on scenarios."];
      references = uniq([...volatileNodes, ...recurringPatterns]).slice(0, 5);
      confidence = clamp01(0.46 + (volatileNodes.length ? 0.16 : 0) + (recurringPatterns.length ? 0.12 : 0));
      break;
    case "scanner":
      findings = uniq([
        ctx.scanner?.source_type
          ? `Scanner source active: ${ctx.scanner.source_type}.`
          : "No scanner source metadata attached to this context.",
        scannerUnresolved.length
          ? `Scanner unresolved items: ${scannerUnresolved.slice(0, 2).join("; ")}.`
          : "Scanner extraction quality appears stable.",
      ]);
      recommendations = scannerUnresolved.length
        ? ["Review unresolved scanner items before final mitigation decisions."]
        : ["Proceed with simulation passes on the scanned dependency graph."];
      confidence = clamp01(0.44 + (ctx.scanner ? 0.2 : 0) + (scannerUnresolved.length ? 0.08 : 0));
      break;
    case "explainability":
      findings = uniq([
        "This scenario changes risk through dependency propagation rather than isolated node failure.",
        matched.length ? `Primary affected nodes: ${matched.slice(0, 3).join(", ")}.` : "Primary affected nodes remain ambiguous.",
      ]);
      notes = ["Merged from multi-agent evidence; review agent conflicts when confidence is moderate."];
      confidence = clamp01(0.48 + (ctx.reasoning ? 0.16 : 0) + (ctx.simulation ? 0.12 : 0));
      break;
    case "recommendation":
      recommendations = uniq([
        "Protect the most central dependency chain before downstream spread.",
        "Run mitigation-on comparison and monitor KPI/objective drift.",
        ...(ctx.exploration?.mitigation_ideas ?? []).slice(0, 2),
      ]);
      findings = ["Action options generated from risk, strategy, memory, and simulation signals."];
      confidence = clamp01(0.5 + (ctx.simulation ? 0.1 : 0) + (ctx.strategy ? 0.08 : 0) + (ctx.memory ? 0.06 : 0));
      break;
  }

  return {
    agent_id: agent.id,
    specialization: agent.specialization,
    priority: Number(agent.priority ?? 99),
    confidence,
    output: {
      findings,
      matched_objects: matched.slice(0, 6),
      scenario_suggestions: scenarios,
      recommendation_fragments: recommendations,
      confidence,
      explanation_notes: notes,
      references,
    },
  };
}

function buildConflicts(contributions: AgentContribution[]): AgentConflict[] {
  const conflicts: AgentConflict[] = [];
  const recAgents = contributions.filter((c) => (c.output.recommendation_fragments?.length ?? 0) > 0);
  if (recAgents.length >= 2) {
    const uniqueRecommendations = uniq(recAgents.flatMap((c) => c.output.recommendation_fragments ?? []));
    if (uniqueRecommendations.length >= 4) {
      conflicts.push({
        topic: "recommendation_priority",
        agent_ids: recAgents.map((c) => c.agent_id),
        description: "Agents produced multiple competing recommendation fragments; priority ordering is partially unresolved.",
        severity: "moderate",
      });
    }
  }
  return conflicts;
}

export function orchestrateMultiAgentDecision(params: {
  context: AgentContext;
  availableAgents?: NexoraAgent[];
}): MultiAgentResult {
  const catalog = Array.isArray(params.availableAgents) && params.availableAgents.length ? params.availableAgents : DEFAULT_AGENTS;
  const plan = selectAgents(params.context, catalog);
  const selectedAgents = catalog.filter((a) => plan.selected_agents.includes(a.id));
  const contributions = selectedAgents.map((agent) => runAgent(agent, params.context));
  const conflicts = buildConflicts(contributions);

  const weightedConfidenceDenom = contributions.reduce(
    (sum, c) => sum + (catalog.find((a) => a.id === c.agent_id)?.confidence_weight ?? 0.1),
    0
  );
  const weightedConfidenceNumerator = contributions.reduce((sum, c) => {
    const w = catalog.find((a) => a.id === c.agent_id)?.confidence_weight ?? 0.1;
    return sum + c.confidence * w;
  }, 0);
  const mergedConfidence = clamp01(
    weightedConfidenceDenom > 0 ? weightedConfidenceNumerator / weightedConfidenceDenom : 0.5
  );

  return {
    plan,
    contributions,
    merged: {
      findings: uniq(contributions.flatMap((c) => c.output.findings ?? [])).slice(0, 12),
      matched_objects: uniq(contributions.flatMap((c) => c.output.matched_objects ?? [])).slice(0, 8),
      scenario_suggestions: uniq(contributions.flatMap((c) => c.output.scenario_suggestions ?? [])).slice(0, 6),
      recommendations: uniq(contributions.flatMap((c) => c.output.recommendation_fragments ?? [])).slice(0, 8),
      explanation_notes: uniq(contributions.flatMap((c) => c.output.explanation_notes ?? [])).slice(0, 8),
    },
    conflicts,
    consensus: {
      agreement_topics: uniq(
        contributions
          .filter((c) => (c.output.findings?.length ?? 0) > 0)
          .map((c) => `${c.specialization}_insight`)
      ),
      disagreement_topics: uniq(conflicts.map((c) => c.topic)),
      unresolved_ambiguities: uniq(conflicts.map((c) => c.description)),
      merged_confidence: mergedConfidence,
    },
    trace: {
      invoked_count: contributions.length,
      agent_order: contributions.map((c) => c.agent_id),
    },
  };
}

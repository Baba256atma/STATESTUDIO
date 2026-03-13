import type { SceneJson, SceneObject, SemanticObjectMeta } from "../sceneTypes";
import type { ActiveModeContext } from "../modes/productModesContract";
import {
  buildSimulationResult,
  createSimulationInputFromPrompt,
  type SimulationInput,
  type SimulationRelation,
  type SimulationResult,
} from "../decision/simulationContract";

export type ExplorationStrategy =
  | "object_perturbation"
  | "dependency_disruption"
  | "resource_pressure"
  | "delay_introduction"
  | "risk_amplification"
  | "pattern_stress_test";

export type ScenarioCandidate = {
  id: string;
  strategy: ExplorationStrategy;
  title: string;
  prompt_seed: string;
  target_object_ids: string[];
  topics: string[];
  magnitude: number;
  rationale: string;
};

export type PropagationPattern = {
  id: string;
  type: "cascade" | "bottleneck" | "critical_dependency" | "kpi_sensitive";
  affected_object_ids: string[];
  severity: number;
  explanation: string;
};

export type FragilitySignal = {
  id: string;
  category: "propagation" | "dependency" | "capacity" | "kpi_exposure";
  severity: number;
  object_ids: string[];
  explanation: string;
  mitigation_hint: string;
};

export type ScenarioEvaluation = {
  candidate: ScenarioCandidate;
  simulation: SimulationResult;
  propagation_patterns: PropagationPattern[];
  fragility_signals: FragilitySignal[];
  mitigation_ideas: string[];
};

export type ScenarioExplorationResult = {
  project_id: string;
  generated_at: number;
  strategies_used: ExplorationStrategy[];
  candidates: ScenarioCandidate[];
  evaluations: ScenarioEvaluation[];
  summary: {
    explored_count: number;
    highest_severity: number;
    fragile_object_ids: string[];
    top_mitigation_ideas: string[];
  };
  limits: {
    max_scenarios: number;
    time_budget_ms: number;
    importance_threshold: number;
  };
};

export type AutonomousScenarioExplorerInput = {
  projectId: string;
  sceneJson: SceneJson | null;
  semanticObjectMeta?: Record<string, SemanticObjectMeta | Record<string, unknown>>;
  modeContext?: ActiveModeContext | null;
  strategyContext?: {
    at_risk_kpis?: string[];
    threatened_objectives?: string[];
  };
  maxScenarios?: number;
  timeBudgetMs?: number;
  importanceThreshold?: number;
};

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function uniq(xs: string[]): string[] {
  return Array.from(new Set((xs ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
}

function norm(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function objectTerms(obj: SceneObject, meta?: Record<string, SemanticObjectMeta | Record<string, unknown>>): string {
  const id = String(obj?.id ?? "").trim();
  const m: any = meta?.[id] ?? obj?.semantic ?? {};
  const tags = Array.isArray((obj as any)?.tags) ? (obj as any).tags : [];
  const semanticTags = Array.isArray(m?.tags) ? m.tags : [];
  return [
    id,
    obj?.label,
    (obj as any)?.name,
    obj?.type,
    (obj as any)?.role,
    (obj as any)?.category,
    (obj as any)?.risk_kind,
    m?.role,
    m?.category,
    m?.domain,
    m?.risk_kind,
    ...tags,
    ...semanticTags,
  ]
    .map(norm)
    .filter(Boolean)
    .join(" ");
}

function rankObjectsByImportance(
  objects: SceneObject[],
  meta?: Record<string, SemanticObjectMeta | Record<string, unknown>>
): Array<{ id: string; score: number; terms: string }> {
  return objects
    .map((obj) => {
      const id = String(obj?.id ?? "").trim();
      if (!id) return null;
      const terms = objectTerms(obj, meta);
      let score = Number.isFinite(Number((obj as any)?.emphasis)) ? Number((obj as any).emphasis) : 0.35;
      if (/core|primary|critical|anchor|hub/.test(terms)) score += 0.24;
      if (/risk|pressure|fragil|delay|threat/.test(terms)) score += 0.22;
      if (/flow|delivery|dependency|order|inventory|cash|service|uptime/.test(terms)) score += 0.18;
      return { id, score: clamp01(score), terms };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score) as Array<{ id: string; score: number; terms: string }>;
}

function buildCandidates(params: {
  rankedObjects: Array<{ id: string; score: number; terms: string }>;
  maxScenarios: number;
  threshold: number;
}): ScenarioCandidate[] {
  const top = params.rankedObjects.filter((o) => o.score >= params.threshold).slice(0, Math.max(3, params.maxScenarios));
  if (!top.length) return [];

  const strategies: ExplorationStrategy[] = [
    "object_perturbation",
    "dependency_disruption",
    "resource_pressure",
    "delay_introduction",
    "risk_amplification",
    "pattern_stress_test",
  ];

  const out: ScenarioCandidate[] = [];
  top.forEach((obj, i) => {
    const strategy = strategies[i % strategies.length];
    const seedText =
      strategy === "delay_introduction"
        ? `${obj.id} delay introduced`
        : strategy === "resource_pressure"
        ? `${obj.id} resource pressure`
        : strategy === "risk_amplification"
        ? `${obj.id} risk amplification`
        : strategy === "dependency_disruption"
        ? `${obj.id} dependency disruption`
        : strategy === "pattern_stress_test"
        ? `${obj.id} stress test`
        : `${obj.id} perturbation`;

    out.push({
      id: `auto_${strategy}_${obj.id}`,
      strategy,
      title: `Auto scenario: ${strategy.replace(/_/g, " ")} on ${obj.id}`,
      prompt_seed: seedText,
      target_object_ids: [obj.id],
      topics: uniq(seedText.split(/\s+/g).map((t) => norm(t))).slice(0, 5),
      magnitude: clamp01(0.45 + obj.score * 0.4),
      rationale: `Prioritized by semantic/importance score (${obj.score.toFixed(2)}).`,
    });
  });

  return out.slice(0, params.maxScenarios);
}

function detectPatterns(sim: SimulationResult, strategyKpis?: string[]): PropagationPattern[] {
  const downstream = sim?.impact?.downstreamObjectIds ?? [];
  const direct = sim?.impact?.directlyAffectedObjectIds ?? [];
  const all = uniq([...direct, ...downstream]);
  const patterns: PropagationPattern[] = [];

  if (downstream.length >= 2) {
    patterns.push({
      id: `pattern_cascade_${sim.scenario.id}`,
      type: "cascade",
      affected_object_ids: all,
      severity: clamp01(0.5 + downstream.length * 0.08),
      explanation: "Downstream propagation indicates a cascade tendency.",
    });
  }

  const inboundCounts = new Map<string, number>();
  (sim?.propagation ?? []).forEach((p) => {
    const to = String(p?.toObjectId ?? "");
    if (!to) return;
    inboundCounts.set(to, (inboundCounts.get(to) ?? 0) + 1);
  });
  const bottlenecks = Array.from(inboundCounts.entries())
    .filter(([, c]) => c >= 2)
    .map(([id]) => id);
  if (bottlenecks.length) {
    patterns.push({
      id: `pattern_bottleneck_${sim.scenario.id}`,
      type: "bottleneck",
      affected_object_ids: bottlenecks,
      severity: clamp01(0.55 + bottlenecks.length * 0.1),
      explanation: "Multiple propagation paths converge on a small set of nodes.",
    });
  }

  if (Array.isArray(strategyKpis) && strategyKpis.length > 0 && all.length > 0) {
    patterns.push({
      id: `pattern_kpi_${sim.scenario.id}`,
      type: "kpi_sensitive",
      affected_object_ids: all.slice(0, 4),
      severity: clamp01(0.45 + strategyKpis.length * 0.08),
      explanation: `Affected chain overlaps with strategy/KPI exposure (${strategyKpis.slice(0, 2).join(", ")}).`,
    });
  }

  return patterns;
}

function toFragilitySignals(patterns: PropagationPattern[]): FragilitySignal[] {
  return patterns.map((p, i) => ({
    id: `fragility_${p.id}_${i}`,
    category:
      p.type === "cascade"
        ? "propagation"
        : p.type === "bottleneck"
        ? "dependency"
        : p.type === "kpi_sensitive"
        ? "kpi_exposure"
        : "capacity",
    severity: clamp01(p.severity),
    object_ids: p.affected_object_ids,
    explanation: p.explanation,
    mitigation_hint:
      p.type === "bottleneck"
        ? "Create fallback paths for converging dependencies."
        : p.type === "cascade"
        ? "Contain the initial shock before downstream spread accelerates."
        : "Monitor KPI-sensitive nodes and apply mitigation early.",
  }));
}

export function runAutonomousScenarioExploration(input: AutonomousScenarioExplorerInput): ScenarioExplorationResult | null {
  const started = Date.now();
  const scene = input.sceneJson;
  const objects: SceneObject[] = Array.isArray(scene?.scene?.objects) ? scene!.scene.objects! : [];
  if (!objects.length) return null;

  const maxScenarios = Math.max(1, Math.min(8, Number(input.maxScenarios ?? 4)));
  const timeBudgetMs = Math.max(40, Math.min(1000, Number(input.timeBudgetMs ?? 180)));
  const importanceThreshold = clamp01(Number(input.importanceThreshold ?? 0.4));

  const ranked = rankObjectsByImportance(objects, input.semanticObjectMeta);
  const candidates = buildCandidates({ rankedObjects: ranked, maxScenarios, threshold: importanceThreshold });
  const relations: SimulationRelation[] = Array.isArray((scene as any)?.scene?.relations)
    ? ((scene as any).scene.relations as SimulationRelation[])
    : [];

  const evaluations: ScenarioEvaluation[] = [];
  for (const candidate of candidates) {
    if (Date.now() - started > timeBudgetMs) break;

    const simInput: SimulationInput = createSimulationInputFromPrompt({
      text: candidate.prompt_seed,
      matchedObjectIds: candidate.target_object_ids,
      topics: candidate.topics,
      kind: candidate.strategy === "risk_amplification" ? "pressure_event" : "disruption",
      magnitude: candidate.magnitude,
      metadata: {
        source: "autonomous_scenario_explorer",
        strategy: candidate.strategy,
      },
    });

    const timelineSteps = [
      `Immediate: stress appears around ${candidate.target_object_ids[0] ?? "core node"}.`,
      "Near-term: connected dependencies begin to absorb pressure.",
      "Downstream: secondary effects become visible across adjacent nodes.",
    ];

    const simulation = buildSimulationResult({
      projectId: input.projectId,
      scenarioName: candidate.title,
      input: simInput,
      objects,
      relations,
      riskSummary: `Autonomous exploration detected pressure propagation from ${candidate.target_object_ids[0] ?? "target node"}.`,
      timelineSteps,
      recommendation: "Protect the most exposed dependency chain and pre-position mitigation capacity.",
      confidence: clamp01(0.58 + candidate.magnitude * 0.28),
      affectedDimensions: ["dependency_stability", "operational_pressure"],
    });

    const patterns = detectPatterns(simulation, input.strategyContext?.at_risk_kpis);
    const fragilitySignals = toFragilitySignals(patterns);
    const mitigationIdeas = uniq([
      ...fragilitySignals.map((s) => s.mitigation_hint),
      "Run mitigation-on scenario to compare baseline fragility reduction.",
    ]).slice(0, 4);

    evaluations.push({
      candidate,
      simulation,
      propagation_patterns: patterns,
      fragility_signals: fragilitySignals,
      mitigation_ideas: mitigationIdeas,
    });
  }

  const allSignals = evaluations.flatMap((e) => e.fragility_signals);
  const fragileObjectIds = uniq(allSignals.flatMap((s) => s.object_ids));
  const highestSeverity = allSignals.reduce((max, s) => Math.max(max, Number(s.severity ?? 0)), 0);

  return {
    project_id: input.projectId,
    generated_at: Date.now(),
    strategies_used: uniq(evaluations.map((e) => e.candidate.strategy)) as ExplorationStrategy[],
    candidates,
    evaluations,
    summary: {
      explored_count: evaluations.length,
      highest_severity: clamp01(highestSeverity),
      fragile_object_ids: fragileObjectIds,
      top_mitigation_ideas: uniq(evaluations.flatMap((e) => e.mitigation_ideas)).slice(0, 5),
    },
    limits: {
      max_scenarios: maxScenarios,
      time_budget_ms: timeBudgetMs,
      importance_threshold: importanceThreshold,
    },
  };
}

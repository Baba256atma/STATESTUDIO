import type { SceneObject, SemanticObjectMeta } from "../sceneTypes";
import type { ScenarioComparisonResult } from "../decision/scenarioComparisonReplayContract";
import type { SimulationResult } from "../decision/simulationContract";

export type StrategicObjective = {
  id: string;
  label: string;
  description?: string;
  category?: string;
  target_direction?: "increase" | "decrease" | "stabilize";
  priority?: "high" | "medium" | "low";
  related_kpi_ids?: string[];
  related_object_ids?: string[];
  semantic_tags?: string[];
};

export type KpiDefinition = {
  id: string;
  label: string;
  description?: string;
  category?: string;
  directionality: "higher_is_better" | "lower_is_better" | "neutral";
  baseline?: number;
  target?: number;
  current_value?: number;
  unit?: string;
  related_objective_ids?: string[];
  related_object_ids?: string[];
  semantic_tags?: string[];
};

export type KpiImpact = {
  kpi_id: string;
  impact_direction: "positive" | "negative" | "mixed" | "neutral";
  impact_strength: "low" | "medium" | "high";
  explanation: string;
  contributing_objects: string[];
  related_objectives: string[];
};

export type ObjectiveImpact = {
  objective_id: string;
  impact_direction: "positive" | "negative" | "mixed" | "neutral";
  impact_strength: "low" | "medium" | "high";
  explanation: string;
  contributing_kpis: string[];
  contributing_objects: string[];
};

export type KpiComparisonDelta = {
  kpi_id: string;
  baseline?: KpiImpact | null;
  current: KpiImpact;
  change: "new" | "improved" | "worsened" | "unchanged";
};

export type KpiImpactSummary = {
  summary: string;
  at_risk_kpis: string[];
  improved_kpis: string[];
  threatened_objectives: string[];
  improved_objectives: string[];
  comparison_notes?: string[];
};

export type ProjectStrategyLayer = {
  objectives: StrategicObjective[];
  kpis: KpiDefinition[];
  kpi_impacts?: KpiImpact[];
  objective_impacts?: ObjectiveImpact[];
  impact_summary?: KpiImpactSummary;
};

const KPI_CATALOG: Array<{
  kpi: KpiDefinition;
  objectiveIds: string[];
  terms: string[];
}> = [
  {
    kpi: {
      id: "kpi_flow_reliability",
      label: "Flow Reliability",
      description: "Stability of core operational flow across dependencies.",
      category: "operations",
      directionality: "higher_is_better",
      semantic_tags: ["flow", "delivery", "continuity", "coordination"],
    },
    objectiveIds: ["obj_continuity", "obj_fragility_reduction"],
    terms: ["flow", "delivery", "supply", "service", "throughput", "fulfillment", "operations"],
  },
  {
    kpi: {
      id: "kpi_dependency_resilience",
      label: "Dependency Resilience",
      description: "Ability of dependency chains to absorb disruptions.",
      category: "resilience",
      directionality: "higher_is_better",
      semantic_tags: ["dependency", "resilience", "network", "stability"],
    },
    objectiveIds: ["obj_continuity", "obj_fragility_reduction"],
    terms: ["dependency", "supplier", "upstream", "downstream", "chain", "critical path"],
  },
  {
    kpi: {
      id: "kpi_exposure_pressure",
      label: "Exposure Pressure",
      description: "Pressure and fragility concentration across critical nodes.",
      category: "risk",
      directionality: "lower_is_better",
      semantic_tags: ["risk", "pressure", "exposure", "fragility", "vulnerability"],
    },
    objectiveIds: ["obj_fragility_reduction"],
    terms: ["risk", "pressure", "exposure", "fragility", "vulnerability", "delay", "failure"],
  },
  {
    kpi: {
      id: "kpi_financial_stability",
      label: "Financial Stability",
      description: "Stability of cost, liquidity, and margin-sensitive outcomes.",
      category: "financial",
      directionality: "higher_is_better",
      semantic_tags: ["cash", "margin", "liquidity", "cost", "price"],
    },
    objectiveIds: ["obj_value_protection"],
    terms: ["cash", "margin", "liquidity", "cost", "price", "revenue", "budget", "debt"],
  },
  {
    kpi: {
      id: "kpi_outcome_confidence",
      label: "Outcome Confidence",
      description: "Confidence in end-user or stakeholder outcomes.",
      category: "outcome",
      directionality: "higher_is_better",
      semantic_tags: ["customer", "trust", "satisfaction", "uptime", "quality"],
    },
    objectiveIds: ["obj_trust_and_service"],
    terms: ["customer", "satisfaction", "trust", "service", "quality", "uptime", "experience"],
  },
];

const OBJECTIVES: StrategicObjective[] = [
  {
    id: "obj_continuity",
    label: "Protect Critical Continuity",
    description: "Maintain continuity in core dependency and delivery chains.",
    category: "stability",
    target_direction: "increase",
    priority: "high",
    related_kpi_ids: ["kpi_flow_reliability", "kpi_dependency_resilience"],
    semantic_tags: ["continuity", "dependency", "service"],
  },
  {
    id: "obj_fragility_reduction",
    label: "Reduce System Fragility",
    description: "Lower concentration of pressure across risk-bearing nodes.",
    category: "risk",
    target_direction: "decrease",
    priority: "high",
    related_kpi_ids: ["kpi_exposure_pressure", "kpi_dependency_resilience"],
    semantic_tags: ["risk", "pressure", "fragility"],
  },
  {
    id: "obj_value_protection",
    label: "Protect Value Stability",
    description: "Preserve financial stability under changing scenario conditions.",
    category: "financial",
    target_direction: "increase",
    priority: "medium",
    related_kpi_ids: ["kpi_financial_stability"],
    semantic_tags: ["cash", "margin", "liquidity"],
  },
  {
    id: "obj_trust_and_service",
    label: "Sustain Service and Trust",
    description: "Protect service quality, reliability, and stakeholder trust.",
    category: "outcome",
    target_direction: "increase",
    priority: "medium",
    related_kpi_ids: ["kpi_outcome_confidence", "kpi_flow_reliability"],
    semantic_tags: ["customer", "service", "quality", "uptime"],
  },
];

function norm(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function uniq(xs: string[]): string[] {
  return Array.from(new Set((xs ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
}

function tokenize(value: unknown): string[] {
  return norm(value)
    .split(/[^a-z0-9]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

function scoreBand(v: number): "low" | "medium" | "high" {
  if (v >= 0.66) return "high";
  if (v >= 0.33) return "medium";
  return "low";
}

function oppositeDirection(direction: "positive" | "negative" | "mixed" | "neutral") {
  if (direction === "positive") return "negative";
  if (direction === "negative") return "positive";
  return direction;
}

function objectTokens(obj: SceneObject): string[] {
  return uniq([
    ...tokenize(obj?.id),
    ...tokenize(obj?.label),
    ...tokenize((obj as any)?.name),
    ...tokenize((obj as any)?.type),
    ...tokenize((obj as any)?.semantic?.display_label),
    ...tokenize((obj as any)?.semantic?.canonical_name),
    ...tokenize((obj as any)?.semantic?.category),
    ...tokenize((obj as any)?.semantic?.role),
    ...tokenize((obj as any)?.semantic?.domain),
    ...((Array.isArray((obj as any)?.tags) ? (obj as any).tags : []).flatMap(tokenize)),
    ...((Array.isArray((obj as any)?.semantic?.tags) ? (obj as any).semantic.tags : []).flatMap(tokenize)),
    ...((Array.isArray((obj as any)?.keywords) ? (obj as any).keywords : []).flatMap(tokenize)),
    ...((Array.isArray((obj as any)?.semantic?.keywords) ? (obj as any).semantic.keywords : []).flatMap(tokenize)),
    ...((Array.isArray((obj as any)?.related_terms) ? (obj as any).related_terms : []).flatMap(tokenize)),
    ...((Array.isArray((obj as any)?.semantic?.related_terms)
      ? (obj as any).semantic.related_terms
      : []).flatMap(tokenize)),
  ]);
}

function collectKpiLinks(objects: SceneObject[]): Record<string, string[]> {
  const byKpi: Record<string, string[]> = {};
  KPI_CATALOG.forEach((entry) => {
    byKpi[entry.kpi.id] = [];
  });

  objects.forEach((obj) => {
    const id = String(obj?.id ?? "").trim();
    if (!id) return;
    const terms = objectTokens(obj);
    KPI_CATALOG.forEach((entry) => {
      if (entry.terms.some((t) => terms.includes(norm(t)))) {
        byKpi[entry.kpi.id].push(id);
      }
    });
  });

  Object.keys(byKpi).forEach((kpiId) => {
    byKpi[kpiId] = uniq(byKpi[kpiId]);
  });
  return byKpi;
}

function inferDefaultDomain(
  objects: SceneObject[],
  semanticObjectMeta?: Record<string, SemanticObjectMeta | Record<string, unknown>>,
  fallbackDomain?: string
): string | undefined {
  if (fallbackDomain) return String(fallbackDomain).trim() || undefined;
  const domains = uniq([
    ...objects.map((o: any) => norm(o?.semantic?.domain ?? o?.domain)).filter(Boolean),
    ...Object.values(semanticObjectMeta ?? {})
      .map((m: any) => norm(m?.domain))
      .filter(Boolean),
  ]);
  return domains[0] || undefined;
}

export function inferProjectStrategyLayer(params: {
  objects: SceneObject[];
  semanticObjectMeta?: Record<string, SemanticObjectMeta | Record<string, unknown>>;
  domain?: string;
}): ProjectStrategyLayer {
  const objects = Array.isArray(params.objects) ? params.objects : [];
  const byKpi = collectKpiLinks(objects);
  const domain = inferDefaultDomain(objects, params.semanticObjectMeta, params.domain);

  const kpis: KpiDefinition[] = KPI_CATALOG.map((entry) => {
    const relatedObjectIds = byKpi[entry.kpi.id] ?? [];
    return {
      ...entry.kpi,
      related_objective_ids: entry.objectiveIds,
      related_object_ids: relatedObjectIds,
      category: domain ? `${entry.kpi.category}:${domain}` : entry.kpi.category,
    };
  });

  const objectives: StrategicObjective[] = OBJECTIVES.map((obj) => {
    const relatedObjectIds = uniq(
      (obj.related_kpi_ids ?? []).flatMap((kpiId) => byKpi[kpiId] ?? [])
    );
    return {
      ...obj,
      related_object_ids: relatedObjectIds,
    };
  });

  return {
    objectives,
    kpis,
  };
}

function directionFromInput(simulation: SimulationResult): "positive" | "negative" | "mixed" | "neutral" {
  const kind = norm(simulation?.scenario?.inputs?.[0]?.kind);
  if (kind === "mitigation") return "positive";
  if (kind === "parameter_change") return "mixed";
  if (kind === "decision") return "mixed";
  if (kind === "scenario_action") return "mixed";
  return "negative";
}

function describeKpiImpact(
  kpi: KpiDefinition,
  direction: "positive" | "negative" | "mixed" | "neutral",
  contributingObjects: string[]
): string {
  const shortList = contributingObjects.slice(0, 3);
  const joined = shortList.length ? shortList.join(", ") : "connected nodes";
  if (direction === "negative") {
    return `${kpi.label} is under pressure due to impacts around ${joined}.`;
  }
  if (direction === "positive") {
    return `${kpi.label} improves as mitigation stabilizes ${joined}.`;
  }
  if (direction === "mixed") {
    return `${kpi.label} shows mixed signals across ${joined}.`;
  }
  return `${kpi.label} impact is limited in the current scenario.`;
}

export function buildKpiImpactsFromSimulation(params: {
  simulation: SimulationResult;
  strategy: ProjectStrategyLayer;
  objects: SceneObject[];
}): KpiImpact[] {
  const affected = uniq([
    ...(params.simulation?.impact?.directlyAffectedObjectIds ?? []),
    ...(params.simulation?.impact?.downstreamObjectIds ?? []),
    ...(params.simulation?.matchedObjectIds ?? []),
  ]);

  if (!affected.length) return [];

  const objectIdSet = new Set(params.objects.map((o) => String(o?.id ?? "").trim()).filter(Boolean));
  const impactDirection = directionFromInput(params.simulation);
  const impacts: KpiImpact[] = [];

  params.strategy.kpis.forEach((kpi) => {
    const related = uniq((kpi.related_object_ids ?? []).filter((id) => objectIdSet.has(id)));
    const contributing = related.filter((id) => affected.includes(id));
    if (!contributing.length) return;
    const ratio = related.length ? Math.min(1, contributing.length / related.length) : 0.34;
    impacts.push({
      kpi_id: kpi.id,
      impact_direction: impactDirection,
      impact_strength: scoreBand(ratio),
      explanation: describeKpiImpact(kpi, impactDirection, contributing),
      contributing_objects: contributing,
      related_objectives: uniq(kpi.related_objective_ids ?? []),
    });
  });

  return impacts;
}

export function buildObjectiveImpactsFromKpiImpacts(params: {
  strategy: ProjectStrategyLayer;
  kpiImpacts: KpiImpact[];
}): ObjectiveImpact[] {
  const impactsByKpi = new Map(params.kpiImpacts.map((i) => [i.kpi_id, i]));

  return params.strategy.objectives
    .map((objective) => {
      const relevant = (objective.related_kpi_ids ?? [])
        .map((kpiId) => impactsByKpi.get(kpiId))
        .filter(Boolean) as KpiImpact[];
      if (!relevant.length) return null;
      const positives = relevant.filter((i) => i.impact_direction === "positive").length;
      const negatives = relevant.filter((i) => i.impact_direction === "negative").length;
      const direction: ObjectiveImpact["impact_direction"] =
        positives > 0 && negatives > 0
          ? "mixed"
          : negatives > 0
          ? "negative"
          : positives > 0
          ? "positive"
          : "neutral";
      const highCount = relevant.filter((i) => i.impact_strength === "high").length;
      const strength: ObjectiveImpact["impact_strength"] =
        highCount > 0 ? "high" : relevant.some((i) => i.impact_strength === "medium") ? "medium" : "low";
      const contributingObjects = uniq(relevant.flatMap((i) => i.contributing_objects));
      return {
        objective_id: objective.id,
        impact_direction: direction,
        impact_strength: strength,
        explanation:
          direction === "negative"
            ? `${objective.label} is currently threatened by connected KPI pressure.`
            : direction === "positive"
            ? `${objective.label} benefits from current mitigation-aligned effects.`
            : `${objective.label} has mixed strategic signals in this scenario.`,
        contributing_kpis: uniq(relevant.map((i) => i.kpi_id)),
        contributing_objects: contributingObjects,
      };
    })
    .filter(Boolean) as ObjectiveImpact[];
}

export function summarizeKpiAndObjectiveImpacts(params: {
  strategy: ProjectStrategyLayer;
  kpiImpacts: KpiImpact[];
  objectiveImpacts: ObjectiveImpact[];
}): KpiImpactSummary {
  const atRiskKpis = params.kpiImpacts
    .filter((i) => i.impact_direction === "negative" || i.impact_direction === "mixed")
    .map((i) => i.kpi_id);
  const improvedKpis = params.kpiImpacts.filter((i) => i.impact_direction === "positive").map((i) => i.kpi_id);

  const threatenedObjectives = params.objectiveImpacts
    .filter((i) => i.impact_direction === "negative" || i.impact_direction === "mixed")
    .map((i) => i.objective_id);
  const improvedObjectives = params.objectiveImpacts
    .filter((i) => i.impact_direction === "positive")
    .map((i) => i.objective_id);

  const riskyLabels = atRiskKpis
    .map((id) => params.strategy.kpis.find((k) => k.id === id)?.label)
    .filter(Boolean)
    .slice(0, 2) as string[];

  const summary = riskyLabels.length
    ? `Strategic KPI pressure is concentrated in ${riskyLabels.join(" and ")}.`
    : "Strategic KPI exposure is currently limited and localized.";

  return {
    summary,
    at_risk_kpis: uniq(atRiskKpis),
    improved_kpis: uniq(improvedKpis),
    threatened_objectives: uniq(threatenedObjectives),
    improved_objectives: uniq(improvedObjectives),
  };
}

export function compareKpiImpacts(params: {
  comparison: ScenarioComparisonResult | null;
  currentKpiImpacts: KpiImpact[];
  baselineKpiImpacts?: KpiImpact[];
}): { deltas: KpiComparisonDelta[]; notes: string[] } {
  const baselineMap = new Map((params.baselineKpiImpacts ?? []).map((k) => [k.kpi_id, k]));
  const deltas: KpiComparisonDelta[] = params.currentKpiImpacts.map((current) => {
    const baseline = baselineMap.get(current.kpi_id) ?? null;
    if (!baseline) {
      return { kpi_id: current.kpi_id, baseline: null, current, change: "new" };
    }
    const currentScore = current.impact_direction === "negative" ? -1 : current.impact_direction === "positive" ? 1 : 0;
    const baselineScore = baseline.impact_direction === "negative" ? -1 : baseline.impact_direction === "positive" ? 1 : 0;
    const currentWeight = current.impact_strength === "high" ? 1 : current.impact_strength === "medium" ? 0.5 : 0.2;
    const baselineWeight = baseline.impact_strength === "high" ? 1 : baseline.impact_strength === "medium" ? 0.5 : 0.2;
    const delta = currentScore * currentWeight - baselineScore * baselineWeight;
    return {
      kpi_id: current.kpi_id,
      baseline,
      current,
      change: delta > 0.15 ? "improved" : delta < -0.15 ? "worsened" : "unchanged",
    };
  });

  const worsened = deltas.filter((d) => d.change === "worsened").length;
  const improved = deltas.filter((d) => d.change === "improved").length;
  const notes: string[] = [];

  if (params.comparison && params.comparison.baselineReady.comparable) {
    if (worsened > improved) notes.push("Current scenario worsens KPI exposure versus baseline.");
    else if (improved > worsened) notes.push("Current scenario improves KPI exposure versus baseline.");
    else notes.push("KPI impact profile is broadly similar to baseline.");
  } else {
    notes.push("KPI comparison baseline is not available; showing current-scenario KPI impacts only.");
  }

  return { deltas, notes };
}

export function buildStrategyKpiContext(params: {
  simulation: SimulationResult;
  comparison: ScenarioComparisonResult | null;
  objects: SceneObject[];
  semanticObjectMeta?: Record<string, SemanticObjectMeta | Record<string, unknown>>;
  domain?: string;
  baselineKpiImpacts?: KpiImpact[];
}): {
  strategy: ProjectStrategyLayer;
  kpi_impacts: KpiImpact[];
  objective_impacts: ObjectiveImpact[];
  summary: KpiImpactSummary;
  comparison: { deltas: KpiComparisonDelta[]; notes: string[] };
} {
  const strategy = inferProjectStrategyLayer({
    objects: params.objects,
    semanticObjectMeta: params.semanticObjectMeta,
    domain: params.domain,
  });
  const kpiImpacts = buildKpiImpactsFromSimulation({
    simulation: params.simulation,
    strategy,
    objects: params.objects,
  });
  const objectiveImpacts = buildObjectiveImpactsFromKpiImpacts({ strategy, kpiImpacts });
  const summary = summarizeKpiAndObjectiveImpacts({ strategy, kpiImpacts, objectiveImpacts });
  const comparison = compareKpiImpacts({
    comparison: params.comparison,
    currentKpiImpacts: kpiImpacts,
    baselineKpiImpacts: params.baselineKpiImpacts,
  });

  return {
    strategy: {
      ...strategy,
      kpi_impacts: kpiImpacts,
      objective_impacts: objectiveImpacts,
      impact_summary: {
        ...summary,
        comparison_notes: comparison.notes,
      },
    },
    kpi_impacts: kpiImpacts,
    objective_impacts: objectiveImpacts,
    summary,
    comparison,
  };
}

export function buildStrategyAwareExecutiveNotes(params: {
  strategy: ProjectStrategyLayer;
  summary: KpiImpactSummary;
}): string[] {
  const notes: string[] = [params.summary.summary];

  const topThreatObjectiveId = params.summary.threatened_objectives[0];
  if (topThreatObjectiveId) {
    const objective = params.strategy.objectives.find((o) => o.id === topThreatObjectiveId);
    if (objective) notes.push(`${objective.label} is currently the most exposed strategic objective.`);
  }

  const topRiskKpiId = params.summary.at_risk_kpis[0];
  if (topRiskKpiId) {
    const kpi = params.strategy.kpis.find((k) => k.id === topRiskKpiId);
    if (kpi) notes.push(`Highest KPI exposure is ${kpi.label}.`);
  }

  return uniq(notes);
}

export function compareObjectiveDirection(
  baseline: ObjectiveImpact | null | undefined,
  current: ObjectiveImpact
): "improved" | "worsened" | "unchanged" {
  if (!baseline) return "unchanged";
  const toScore = (impact: ObjectiveImpact): number => {
    const directionScore =
      impact.impact_direction === "positive" ? 1 : impact.impact_direction === "negative" ? -1 : 0;
    const strengthWeight = impact.impact_strength === "high" ? 1 : impact.impact_strength === "medium" ? 0.5 : 0.2;
    return directionScore * strengthWeight;
  };
  const delta = toScore(current) - toScore(baseline);
  if (delta > 0.2) return "improved";
  if (delta < -0.2) return "worsened";
  return "unchanged";
}

export function reverseKpiImpactDirection(
  impact: KpiImpact
): KpiImpact {
  return {
    ...impact,
    impact_direction: oppositeDirection(impact.impact_direction),
  };
}

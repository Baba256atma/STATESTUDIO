import type { SimulationResult } from "./simulationContract";
import type { ScenarioComparisonResult } from "./scenarioComparisonReplayContract";

export type ConfidenceLevel = "low" | "moderate" | "high";

export type DriverExplanation = {
  object_id: string;
  role?: string;
  category?: string;
  explanation: string;
  importance: number; // 0..1
  propagation_chain?: string[];
};

export type ImpactExplanation = {
  affected_objects: string[];
  propagation_summary: string;
  impact_level: "low" | "medium" | "high";
  immediate_effect: string;
  downstream_effect: string;
  expected_direction: string;
  explanation: string;
};

export type Recommendation = {
  action: string;
  rationale: string;
  expected_effect: string;
  priority: "P1" | "P2" | "P3";
};

export type ExecutiveInsight = {
  summary: string;
  drivers: DriverExplanation[];
  impact: ImpactExplanation;
  recommendation: Recommendation[];
  confidence: {
    level: ConfidenceLevel;
    score?: number;
    uncertainty_notes?: string[];
  };
  affected_system_areas: string[];
  scenario_interpretation?: string;
  comparison_insights?: string[];
  explanation_notes?: string[];
};

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function toConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 0.78) return "high";
  if (score >= 0.48) return "moderate";
  return "low";
}

function uniq(xs: string[]): string[] {
  return Array.from(new Set((xs ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
}

export function buildExecutiveInsightFromSimulation(params: {
  simulation: SimulationResult;
  comparison?: ScenarioComparisonResult | null;
  semanticMetaById?: Record<string, { role?: string; category?: string; domain?: string }>;
}): ExecutiveInsight {
  const sim = params.simulation;
  const comparison = params.comparison ?? null;
  const semantic = params.semanticMetaById ?? {};
  const score = clamp01(Number(sim?.confidence ?? sim?.advice?.confidence ?? 0.72));
  const confidenceLevel = toConfidenceLevel(score);

  const keyIds = uniq([
    ...(sim?.impact?.directlyAffectedObjectIds ?? []),
    ...(sim?.matchedObjectIds ?? []),
  ]).slice(0, 4);

  const drivers: DriverExplanation[] = keyIds.map((id, idx) => {
    const meta = semantic[id] ?? {};
    const chain = sim?.propagation
      ?.filter((p) => p.fromObjectId === id || p.toObjectId === id)
      .slice(0, 3)
      .map((p) => `${p.fromObjectId} -> ${p.toObjectId}`);
    return {
      object_id: id,
      role: typeof meta.role === "string" ? meta.role : undefined,
      category: typeof meta.category === "string" ? meta.category : undefined,
      explanation:
        idx === 0
          ? "Primary driver of immediate scenario impact."
          : "Contributing driver within the propagation chain.",
      importance: clamp01(0.9 - idx * 0.18),
      propagation_chain: chain && chain.length ? chain : undefined,
    };
  });

  const affected = uniq([
    ...(sim?.impact?.directlyAffectedObjectIds ?? []),
    ...(sim?.impact?.downstreamObjectIds ?? []),
  ]);
  const impactCount = affected.length;
  const impactLevel: ImpactExplanation["impact_level"] =
    impactCount >= 6 ? "high" : impactCount >= 3 ? "medium" : "low";

  const timeline = sim?.timeline ?? [];
  const immediate = String(timeline[0]?.summary ?? "Immediate impact detected in core nodes.");
  const downstream = String(
    timeline[2]?.summary ?? timeline[1]?.summary ?? "Downstream effects may propagate to connected dependencies."
  );

  const impact: ImpactExplanation = {
    affected_objects: affected,
    propagation_summary: sim?.impact?.summary ?? "Propagation pattern identified across connected nodes.",
    impact_level: impactLevel,
    immediate_effect: immediate,
    downstream_effect: downstream,
    expected_direction:
      impactLevel === "high"
        ? "Without mitigation, exposure is likely to intensify."
        : "Impact appears manageable with timely mitigation.",
    explanation:
      sim?.risk?.summary ??
      "Risk exposure changed due to propagation from directly affected nodes into dependent areas.",
  };

  const recommendation: Recommendation[] = [
    {
      action: sim?.advice?.recommendation ?? "Stabilize exposed dependencies and monitor propagation.",
      rationale: sim?.risk?.summary ?? "Risk profile indicates elevated dependency pressure.",
      expected_effect: "Reduces downstream spread and improves system stability.",
      priority: impactLevel === "high" ? "P1" : "P2",
    },
  ];

  const comparisonInsights: string[] = [];
  if (comparison) {
    comparisonInsights.push(comparison.summary);
    if (comparison.delta.impactDelta.diff < 0) {
      comparisonInsights.push("Current scenario reduces affected surface versus baseline.");
    } else if (comparison.delta.impactDelta.diff > 0) {
      comparisonInsights.push("Current scenario expands affected surface versus baseline.");
    } else {
      comparisonInsights.push("Affected surface is broadly similar to baseline.");
    }
  }

  return {
    summary:
      impactLevel === "high"
        ? "System risk is elevated with active downstream propagation across critical dependencies."
        : "System impact is contained but requires monitoring across connected dependencies.",
    drivers,
    impact,
    recommendation,
    confidence: {
      level: confidenceLevel,
      score,
      uncertainty_notes:
        sim?.impact?.uncertainty ? [sim.impact.uncertainty] : confidenceLevel === "low" ? ["Limited relation data increases uncertainty."] : [],
    },
    affected_system_areas: uniq(sim?.risk?.affectedDimensions ?? []),
    scenario_interpretation: String(sim?.scenario?.name ?? "Scenario interpretation available."),
    comparison_insights: comparisonInsights.length ? comparisonInsights : undefined,
    explanation_notes: [
      "Derived from simulation propagation and timeline outputs.",
      "Recommendations are scenario-aware and intended for executive prioritization.",
    ],
  };
}

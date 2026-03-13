import type { SceneObject } from "../sceneTypes";

export type SimulationInputKind =
  | "decision"
  | "disruption"
  | "pressure_event"
  | "mitigation"
  | "parameter_change"
  | "scenario_action";

export type SimulationInput = {
  id: string;
  kind: SimulationInputKind;
  text: string;
  targetObjectIds: string[];
  topics: string[];
  magnitude?: number; // 0..1
  metadata?: Record<string, unknown>;
};

export type SimulationScenario = {
  id: string;
  name: string;
  mode: "single_event" | "multi_event";
  baselineScenarioId?: string | null;
  inputs: SimulationInput[];
  assumptions?: string[];
  mitigations?: string[];
  metadata?: Record<string, unknown>;
};

export type PropagationStep = {
  step: number;
  fromObjectId: string;
  toObjectId: string;
  influence: "direct" | "downstream" | "mitigation";
  weight?: number;
  rationale?: string;
};

export type TimelineStep = {
  phase: "immediate" | "near_term" | "downstream" | "mitigation";
  summary: string;
  affectedObjectIds?: string[];
};

export type DecisionImpactSummary = {
  summary: string;
  directlyAffectedObjectIds: string[];
  downstreamObjectIds: string[];
  confidence?: number;
  uncertainty?: string;
};

export type ScenarioComparisonReadyShape = {
  baseline: {
    scenarioId?: string | null;
    summary?: string;
  };
  current: {
    scenarioId: string;
    summary: string;
    affectedObjectCount: number;
  };
  comparable: boolean;
};

export type SimulationResult = {
  scenario: SimulationScenario;
  matchedObjectIds: string[];
  propagation: PropagationStep[];
  timeline: TimelineStep[];
  impact: DecisionImpactSummary;
  risk: {
    summary: string;
    affectedDimensions?: string[];
  };
  advice: {
    recommendation: string;
    confidence?: number;
  };
  confidence?: number;
  comparisonReady: ScenarioComparisonReadyShape;
};

export type SimulationRelation = {
  from: string;
  to: string;
  type?: string;
  weight?: number;
};

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function normalizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function unique(xs: string[]): string[] {
  return Array.from(new Set(xs.filter(Boolean)));
}

function getObjectDependencies(obj: any): string[] {
  const semanticDeps = Array.isArray(obj?.semantic?.dependencies) ? obj.semantic.dependencies : [];
  const rootDeps = Array.isArray(obj?.dependencies) ? obj.dependencies : [];
  return unique([...semanticDeps, ...rootDeps].map((x: any) => String(x)));
}

export function createSimulationInputFromPrompt(params: {
  text: string;
  matchedObjectIds: string[];
  topics: string[];
  kind?: SimulationInputKind;
  magnitude?: number;
  metadata?: Record<string, unknown>;
}): SimulationInput {
  const text = normalizeText(params.text);
  const key = text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "event";
  return {
    id: `sim_input_${key}`,
    kind: params.kind ?? "decision",
    text,
    targetObjectIds: unique((params.matchedObjectIds ?? []).map(String)),
    topics: unique((params.topics ?? []).map((t) => String(t).toLowerCase())),
    magnitude: params.magnitude !== undefined ? clamp01(Number(params.magnitude)) : undefined,
    metadata: params.metadata,
  };
}

export function buildSimulationResult(params: {
  projectId: string;
  scenarioName?: string;
  baselineScenarioId?: string | null;
  input: SimulationInput;
  objects: SceneObject[];
  relations?: SimulationRelation[];
  riskSummary: string;
  timelineSteps: string[];
  recommendation: string;
  confidence?: number;
  affectedDimensions?: string[];
}): SimulationResult {
  const input = params.input;
  const confidence = params.confidence !== undefined ? clamp01(Number(params.confidence)) : 0.72;
  const direct = unique((input.targetObjectIds ?? []).map(String));
  const relationList = Array.isArray(params.relations) ? params.relations : [];

  const propagation: PropagationStep[] = [];
  const downstream: string[] = [];
  relationList.forEach((r) => {
    const from = String(r?.from ?? "");
    const to = String(r?.to ?? "");
    if (!from || !to) return;
    if (!direct.includes(from)) return;
    downstream.push(to);
    propagation.push({
      step: 1,
      fromObjectId: from,
      toObjectId: to,
      influence: "downstream",
      weight: typeof r?.weight === "number" ? clamp01(r.weight) : undefined,
      rationale: `Relation propagation via ${r?.type ?? "dependency"}.`,
    });
  });

  if (propagation.length === 0) {
    // Fallback: semantic dependencies for best-effort propagation.
    params.objects.forEach((obj: any) => {
      const objId = String(obj?.id ?? "");
      if (!objId || !direct.includes(objId)) return;
      getObjectDependencies(obj).forEach((depId) => {
        downstream.push(depId);
        propagation.push({
          step: 1,
          fromObjectId: objId,
          toObjectId: depId,
          influence: "downstream",
          rationale: "Semantic dependency propagation.",
        });
      });
    });
  }

  const uniqDownstream = unique(downstream).filter((id) => !direct.includes(id));
  const allAffected = unique([...direct, ...uniqDownstream]);
  const timeline: TimelineStep[] = [
    {
      phase: "immediate",
      summary: params.timelineSteps[0] ?? "Immediate impact detected on directly affected objects.",
      affectedObjectIds: direct,
    },
    {
      phase: "near_term",
      summary: params.timelineSteps[1] ?? "Near-term propagation across connected dependencies.",
      affectedObjectIds: allAffected,
    },
    {
      phase: "downstream",
      summary: params.timelineSteps[2] ?? "Downstream consequences may appear in secondary nodes.",
      affectedObjectIds: uniqDownstream,
    },
  ];

  const scenarioId = `scenario_${params.projectId}_${Date.now()}`;
  const scenario: SimulationScenario = {
    id: scenarioId,
    name: params.scenarioName ?? `Scenario: ${input.text}`,
    mode: "single_event",
    baselineScenarioId: params.baselineScenarioId ?? null,
    inputs: [input],
  };

  return {
    scenario,
    matchedObjectIds: direct,
    propagation,
    timeline,
    impact: {
      summary:
        direct.length > 1
          ? `${direct.length} core nodes are directly affected; ${uniqDownstream.length} downstream nodes are exposed.`
          : `${direct.length} core node is directly affected; ${uniqDownstream.length} downstream nodes are exposed.`,
      directlyAffectedObjectIds: direct,
      downstreamObjectIds: uniqDownstream,
      confidence,
      uncertainty:
        propagation.length === 0
          ? "Propagation inferred with limited relation data."
          : undefined,
    },
    risk: {
      summary: params.riskSummary,
      affectedDimensions: params.affectedDimensions,
    },
    advice: {
      recommendation: params.recommendation,
      confidence,
    },
    confidence,
    comparisonReady: {
      baseline: {
        scenarioId: params.baselineScenarioId ?? null,
      },
      current: {
        scenarioId,
        summary: params.riskSummary,
        affectedObjectCount: allAffected.length,
      },
      comparable: true,
    },
  };
}
